/*require.config({
paths: {
		handlebars: "lib/handlebars",
		text: "lib/text",
		hbs: "lib/hbs"
	},
	shim: {
		handlebars: {
			exports: "Handlebars"
		}
	}
});*/

define('app', ['js/router'], function(Router) {
	Router.init();
	var f7 = new Framework7({
		modalTitle: ' ',
		animateNavBackIcon: true,
		swipePanel: 'left'
	});
	
	f7.allowPanelOpen = false;
	
	var mainView = f7.addView('.view-main', {
		dynamicNavbar: true
	});
	
	return {
		f7: f7,
		mainView: mainView,
		router: Router,
		
		enablePanel: function() {
			f7.allowPanelOpen = true;
		},
		disablePanel: function() {
			f7.allowPanelOpen = false;
		}
	};
});

// Расширение прототипа Function для упрощения передачи контекста в события	
Function.prototype.bind = function (scope) {
	var fn = this;
	return function () {
		return fn.apply(scope, arguments);
	};
};