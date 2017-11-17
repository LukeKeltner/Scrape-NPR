var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
{
	title:
	{
		type: String,
		require: "Title is required"
	},

	info:
	{
		type: String,
		require: "Info is required"
	},

	img:
	{
		type: String,
		require: "Img is required"
	},

	link:
	{
		type: String,
		require: "Link is required"
	},

	comment:
	[{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;