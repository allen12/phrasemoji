$("#create_room").click(function() {
	var $this = $(this);
	$this.text("waiting...");

	$.getJSON("/request_room.json", function(data) {
		if (data.id) {
			$this.text("ready!");
			$("#room_id").val("http://transloj.me/" + data.id + ".html");
			$("#room_group").css({ display: "table" });
		}
	});
});

$("#go").click(function() {
	window.location.href = $("#room_id").val();
});

$("#btn-back").click(function() {
$("div.emoji-input").children().last().remove();
});
