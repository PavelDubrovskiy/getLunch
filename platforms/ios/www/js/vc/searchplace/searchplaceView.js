define(["app", "js/utilities/common"], function( app, utilities ) {
	var $ = Framework7.$;

	function render(params) {
		utilities.bindEvents(params.bindings);
		$(".p_searchplace_header").html('<span>' + params.header + '</span>');
	}

	return {
		render: render,
		toggleFavouriteState: utilities.toggleFavouriteState
	};
});