define(["app","js/vc/filter/filterView", "js/utilities/forms"], function(app, view, forms) {
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