var express = require('express');
var cheerio = require("cheerio");
var request = require("request");

var router = express.Router();

router.get("/", function(req, res)
{
	res.render("index");
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
			var img = $(element).find("img").attr("src")
			var info = $(element).find("p.teaser").text()
			var link = $(element).find("div.imagewrap").find("a").attr("href")
			console.log(link)
		})
	})
})

module.exports = router;