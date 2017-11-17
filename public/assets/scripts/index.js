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

		setTimeout(function()
		{
			window.location.reload()
		}, 1000)
	})
})

$(".add").on("click", function(event)
{
	var id = $(this).attr("id")
	var message = $(this).parent().parent().find("#comment").val()

	var data = 
	{
		id: id,
		message: message
	}

	$.ajax(
	{
		url: "/addcomment",
		type: "POST",
		data: data
	}).then(function(result)
	{
		setTimeout(function()
		{
			window.location.reload()
		}, 1000)		
	})
})

$(".delete").on("click", function(event)
{
	var id = $(this).attr("id")
	console.log(id)

	$.ajax(
	{
		url: "/deletecomment/"+id,
		type: "DELETE",
	}).then(function(result)
	{
		console.log(result)
		setTimeout(function()
		{
			window.location.reload()
		}, 1000)
	})
})