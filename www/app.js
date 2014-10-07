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
	var config={
		source:'http://getlunch.ru'
	};
	return {
		f7: f7,
		mainView: mainView,
		router: Router,
		config:config,
		latitude:0,
		longitude:0,
		interval:0,
		intervalCompass:0,
		firstEnter:true,
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

 // Load the SDK asynchronously
  window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '281560105368956',
	    cookie     : true,  // enable cookies to allow the server to access 
	                        // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.1' // use version 2.1
	  });
  };
 (function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) return;
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));