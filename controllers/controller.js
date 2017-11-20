var express = require('express');
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var sentiment = require('sentiment');
var db = require("../models");

var router = express.Router();

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nprScrapeTest",
{
	useMongoClient: true
});

router.get("/", function(req, res)
{

	db.Article.find({}).sort("-_id").populate("comment").then(function(articles)
	{
		if(articles.length !== 0)
		{
			var articlesGrabbed = articles
			console.log(articlesGrabbed[0])

			for (var i=0; i<articlesGrabbed.length; i++)
			{

				for (var j=0; j<articlesGrabbed[i].comment.length; j++)
				{
					console.log(i)
					articlesGrabbed[i].comment[j].sentiment = sentiment(articlesGrabbed[i].comment[j].message).score
					articlesGrabbed[i].comment[j].test = "Hey there!"
				}
			}
			articlesGrabbed[0].testfield = "Hey whats up!?";

			console.log(articlesGrabbed[0])

			console.log("HI!")

			var data = 
			{
				article: articlesGrabbed,
			}

			var obj = 
			{
				name: "Luke"
			}

			console.log(obj.name)

			obj.sex = true;

			console.log(obj)

			res.render("index", data);
		}

		else
		{
			res.render("index");
		}
		
	}).catch(function(err)
	{
		res.json(err)
	})
})

router.get("/scrape", function(req, res)
{
	var newArticles = 0;

	request("https://www.npr.org/", function(err, request, html)
	{
		if(err){throw err}

		var $ = cheerio.load(html)
		var articleArray = []

		var newPotentialArticles = ""+$("article.has-image").length

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

			articleArray.push(article)
		});

		db.Article.collection.insert(articleArray).then(function(result)
		{
			var data = 
			{
				error: 0,
				newPotentialArticles: newPotentialArticles
			}

			res.send(data)

		}).catch(function(err)
		{
			var data = 
			{
				error: err,
				newPotentialArticles: newPotentialArticles
			}

			res.send(data)
		})
	})
})

router.post("/addcomment", function(req, res)
{
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
			for (var i=0; i<comments.length; i++)
			{
				if (id == comments[i])
				{
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