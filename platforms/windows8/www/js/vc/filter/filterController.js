define(["app","js/vc/filter/filterView"], function(app, view) {
	var bindings = [
	];

	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	
	return {
		init: init
	};
});