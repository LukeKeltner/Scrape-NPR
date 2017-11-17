var express = require('express');
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var db = require("../models");

var router = express.Router();

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nprScrapeTest",
{
	useMongoClient: true
});

router.get("/", function(req, res)
{
	console.log("---------------------------------------------")

	db.Article.find({}).populate("comment").then(function(articles)
	{
		console.log(articles[0])

		var comments = articles[0].comment

		console.log(comments)
		var data = 
		{
			article: articles,
			comment: comments
		}

		res.render("index", data);
		
	}).catch(function(err)
	{
		res.json(err)
	})
})

router.get("/scrape", function(req, res)
{
	request("https://www.npr.org/", function(err, request, html)
	{
		if(err){throw err}

		var $ = cheerio.load(html)

		$("article.has-image").each(function(i, element)
		{
			var title = $(element).find("div").find("h1").text()
			var info = $(element).find("p.teaser").text()
			var img = $(element).find("img").attr("src")
			var link = $(element).find("div.imagewrap").find("a").attr("href")
			
			var article = 
			{
				title: title,
				info: info,
				img: img,
				link: link
			}

			db.Article.create(article).then(function(result)
			{
				console.log("Article Added!")

			}).catch(function(err)
			{
				res.json(err)
			})
		})
	})

	res.end()
})

router.post("/addcomment", function(req, res)
{
	console.log(req.body.id)
	console.log(req.body.message)

	var comment = 
	{
		message: req.body.message,
		article: req.body.id
	}

	db.Comment.create(comment).then(function(dbComment)
	{
		db.Article.findOneAndUpdate({"_id": req.body.id}, {$push:{"comment": dbComment._id}}, function(err, done)
		{
			if(err){throw err}
			res.send(done)
		})
	})
})

router.delete("/deletecomment/:id", function(req, res)
{
	var id = req.params.id

	db.Comment.find({"_id": id}, function(err, found)
	{
		if(err){throw err}
		var articleid = found[0].article

		db.Article.findOne({"_id": articleid}, function(err, found2)
		{	
			if(err){throw err}
			var comments = found2.comment
			console.log(comments)
			for (var i=0; i<comments.length; i++)
			{
				if (id == comments[i])
				{
					console.log("DELETE COMMENT "+i)
					comments.splice(i, 1);
					break;
				}
			}

			db.Article.findOneAndUpdate({"_id": articleid}, {$set:{"comment": comments}}, function(err, done)
			{
				if(err){throw err}
				res.send(done)
			})
		})
	})
})

module.exports = router;