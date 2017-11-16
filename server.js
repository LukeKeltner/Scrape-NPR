var express = require("express");
var exphbs = require("express-handlebars");
var routes = require("./controllers/controller.js");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var db = require("./models");

var PORT = 3000;
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

/*app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");*/

app.engine("html", exphbs({ defaultLayout: "main.html" }));
app.set("view engine", "html");

/*app.get("/", function(err, result){})*/

app.use("/", routes);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});