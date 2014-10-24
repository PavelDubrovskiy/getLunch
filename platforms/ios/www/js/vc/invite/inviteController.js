define(["app","js/vc/invite/inviteView"], function(app, view) {
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