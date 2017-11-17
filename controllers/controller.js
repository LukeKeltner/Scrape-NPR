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
	db.Article.find().then(function(articles)
	{
		var data = 
		{
			article: articles
		}

		console.log(articles)
		res.render("updatearticles", data);
		
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

	res.render("index")
})

module.exports = router;