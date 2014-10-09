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
		{timeout: 10000, enableHighAccuracy: true}
	);
	
	function init() {
		if(user.id!=''){
			$('.p_start_buttons').hide();
			setTimeout( function(){ app.mainView.loadPage('main.html'); }, 1300);
		}
		view.render({
			bindings: bindings
		});
	}
	
	function loginFacebook (){
		app.LoginFB.auth(false);
	}
	
	function loginVK (){
		app.f7.alert("Логинимся через ВКонтакте!");
	}
	
	function exitToStart(){
		localStorage.clear();
		alert('exit');
		document.location.href='index.html';
	}
	
	return {
		init: init
	};
});