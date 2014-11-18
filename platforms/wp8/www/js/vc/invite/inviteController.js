define(["app","js/vc/invite/inviteView"], function(app, view) {
	var bindings = [
		{
			element: "#shareMe",
			event: "click",
			handler: shareMe
		}
	];
	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	function shareMe() {
		var text='Hello World!';
		
	}
	return {
		init: init
	};
});