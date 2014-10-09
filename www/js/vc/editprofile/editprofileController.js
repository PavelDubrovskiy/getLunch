define(["app","js/vc/editprofile/editprofileView"], function(app, view) {
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