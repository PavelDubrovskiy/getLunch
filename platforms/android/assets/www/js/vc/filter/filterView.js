define(["js/utilities/common"], function( utilities ) {
	function render(params) {
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});