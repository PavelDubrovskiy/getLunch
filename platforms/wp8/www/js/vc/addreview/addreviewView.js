define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		$('#reviewLunchName').html(params.lunch.name);
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});