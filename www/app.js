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
		swipePanel: 'left',
		/*pushState: true,*/
		
		sortable: false,
		swipeBackPageBoxShadow: false
	});
	
	f7.allowPanelOpen = false;
	
	var mainView = f7.addView('.view-main', {
		dynamicNavbar: true
	});
	var config={
		source:'http://getlunch.ru'
	};
	var LoginFB = {
	    wwwref: false,
	    plugin_perms: "publish_actions,email,user_friends,offline_access",
	    
	    auth: function (force) {
	        if (!window.localStorage.getItem("plugin_fb_token") || force || window.localStorage.getItem("plugin_fb_perms")!=LoginFB.plugin_perms) {
	            var authURL="https://www.facebook.com/dialog/oauth?client_id=281560105368956&scope="+this.plugin_perms+"&redirect_uri=http://getlunch.ru/api/fbauth/&response_type=token";
	            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
	            this.wwwref.addEventListener('loadstop', this.auth_event_url);
	        }
	    },
	    auth_event_url: function (event) {
	        var tmp=(event.url).split("#");
	        if(tmp[0]=='http://getlunch.ru/api/fbauth/?' || tmp[0]=='https://getlunch.ru/api/fbauth/?'){
	            LoginFB.wwwref.close();
	            var tmp=url_parser.get_args(tmp[1]);
	            $.ajax({
					type: "POST",
					async: false,
					url: config.source+"/api/fbauth/",
					data: {token:tmp['access_token'],provider:'fb'},
					success: function(msg){
						console.log(msg);
						/*if(msg!='error'){
							user.setValues(JSON.parse(msg));
							ymaps.ready(function () {
								app.mainView.loadPage('main.html');
							});
						}else{
							forms.showMessage('Неправильно введены логин или пароль', "error");
						}*/
					}
				});
	            //window.localStorage.setItem("plugin_fb_token", tmp['access_token']);
	            //window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
	            //window.localStorage.setItem("plugin_fb_perms", LoginFB.plugin_perms);
	        }
	    }
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
		},
		LoginFB:LoginFB
	};
});

// Расширение прототипа Function для упрощения передачи контекста в события	
Function.prototype.bind = function (scope) {
	var fn = this;
	return function () {
		return fn.apply(scope, arguments);
	};
};

var url_parser={
	get_args: function (s) {
	    var tmp=new Array();
	    s=(s.toString()).split('&');
	    for (var i in s) {
	        i=s[i].split("=");
	        tmp[(i[0])]=i[1];
	    }
	    return tmp;
	},
	get_args_cookie: function (s) {
	    var tmp=new Array();
	    s=(s.toString()).split('; ');
	    for (var i in s) {
	        i=s[i].split("=");
	        tmp[(i[0])]=i[1];
	    }
	    return tmp;		
	}
};