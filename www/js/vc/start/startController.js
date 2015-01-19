define(["app", "js/vc/start/startView", "js/m/user", "js/utilities/fb"], function(app, view, User, fb) {
	var user = new User();
	var $ = Framework7.$;

	var bindings = [
		{
			element: '.p_start_facebook-login',
			event: 'click',
			handler: loginFacebook
		},{
			element: '.p_start_vk-login',
			event: 'click',
			handler: loginVK
		},{
			element: '.app_exit',
			event: 'click',
			handler: exitToStart
		}
	];
	
	app.watchID = navigator.geolocation.watchPosition(function(position){
			try{
				app.latitude=position.coords.latitude;
				app.longitude=position.coords.longitude;
			}catch(e){}
		}, 
		function(){}, 
		{timeout: 10000, enableHighAccuracy: false}
	);
	function init() {
		app.tryConnection();
		if(user.id!=''){
			$('.p_start_buttons').hide();
			$('.b_logo').transitionEnd( function(){
				app.mainView.loadPage('main.html');
			});
		}
		view.render({
			bindings: bindings
		});
	}
	
	function loginFacebook (){
		app.LoginFB.auth(false);
	}
	
	function loginVK (){
		app.LoginVK.auth(false);
	}
	
	function exitToStart(){
		localStorage.clear();
		document.location.href='index.html';
		/*try{
			navigator.app.exitApp();
		}catch(e){
			
		}*/
	}
	
	return {
		init: init
	};
});