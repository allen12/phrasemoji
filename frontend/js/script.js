$("#create_room").click(function() {
	var $this = $(this);
	if (!$this.attr("disabled")) {
		$this.text("waiting...");
	
		$.getJSON("/request_room.json", function(data) {
			if (data.id) {
				$this.text("ready!");
				$this.attr("disabled", true);
				$("#room_id").val("http://phrasemoji.com/" + data.id);
				$("#room_group").css({ display: "table" });
			}
		});
	}
});

$("#go").click(function() {
	window.location.href = $("#room_id").val();
});

$("#btn-back").click(function() {
	$("textarea.emoji-input").val($("textarea.emoji-input").val().slice(0, -1));
	$("div.emoji-input").children().last().remove();
});

$("#sub_btn").click(function() {
	$(this).text("waiting on other players...");

	var x = setInterval(function() { 
		$.get("/get_results.json", function(data) {
			if (data.finished) {
				clearInterval(x);
				$("#init_phrase").text('"' + data.phrase + '"');
				$("#emoj_phrase").html(EmojiPicker.prototype.unicodeToImage(data.emoji));
				$("#guess_phrase").text(data.text);
			}
		});
	}, 2000);
});
