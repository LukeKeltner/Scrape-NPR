console.log("Hello world!")

$('#scrape').on("click", function(event)
{
	$.ajax(
	{
		url: '/scrape',
		type: 'GET'
	}).then(function(result)
	{
		console.log("done!")
		location.reload();
	})
})