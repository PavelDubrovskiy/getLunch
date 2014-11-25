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
		window.plugins.socialsharing.share(text, 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.one-touch.ru');
	}
	return {
		init: init
	};
});