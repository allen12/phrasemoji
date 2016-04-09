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
