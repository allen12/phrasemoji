$("#btn-back").click(function() {
	$("textarea.emoji-input").val($("textarea.emoji-input").val().slice(0, -1));
	$("div.emoji-input").children().last().remove();
});
