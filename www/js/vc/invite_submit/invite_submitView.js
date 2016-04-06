define(["js/utilities/common"], function(utilities) {
	var $ = Framework7.$;
	
	function render(params) {
		utilities.bindEvents(params.bindings);
	}
	
	return {
		render: render
	};
});