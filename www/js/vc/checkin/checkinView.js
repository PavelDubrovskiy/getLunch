define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		$('#checkinLunchName').html("Я ем в " + params.lunch.name);
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});