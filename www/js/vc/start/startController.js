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
			console.log('geo success from start');
			try{
				app.latitude=position.coords.latitude;
				app.longitude=position.coords.longitude;
			}catch(e){}
		}, 
		function(){console.log('geo fail from start');}, 
		{timeout: 9000, enableHighAccuracy: true}
	);
	function init(){
		app.tryConnection(function(){
			app.GAPage('start');
			if(localStorage.getItem('lunchesArray')!==null){
				var lunchesArray=JSON.parse(localStorage.getItem('lunchesArray'));
				for(key in lunchesArray){
					localStorage.removeItem('lunch'+lunchesArray[key]);
				}
				localStorage.removeItem('lunchesArray');
			}
			if(user.id!=''){
				$('.p_start_buttons').hide();
				$('.b_logo').transitionEnd( function(){
					app.mainView.loadPage('main.html');
				});
			}
		});
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