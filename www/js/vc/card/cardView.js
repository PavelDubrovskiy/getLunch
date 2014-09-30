define(["app", "js/utilities/common"], function( app, utilities ) {
	function render(params) {
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render,
		toggleFavouriteState: utilities.toggleFavouriteState,
		setCompassState: utilities.setCompassState
	};
});