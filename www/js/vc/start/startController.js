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
	
	try{
		var PushNoti = PushNotification.init({
		    android: {
		        senderID: "718172509486"
		    },
		    ios: {
		        alert: "true",
		        badge: "true",
		        sound: "true"
		    }
		});
		PushNoti.on('registration',function(data){
			var post='';
			console.log(JSON.stringify(data));
			localStorage.setItem('pushRegistrationId',data.registrationId);
			if( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
				post='code='+data.registrationId;
				post+='&platform=android';
			}else {
				post='&code='+data.registrationId;
				post+='&platform=ios';
			}
			console.log(app.config.source+"/api/pull/"+" POST:"+post);
			$.ajax({
				type: "POST",
				url: app.config.source+"/api/pull/",
				data: post,
				success: function(msg){}
			});
		});
		PushNoti.on('notification', function(data) {
	    	console.log("notification event");
	        console.log(JSON.stringify(data));
	        PushNoti.finish(function () {
	            console.log('finish successfully called');
	        });
	    });
		PushNoti.on('error', function(e) {
	        console.log("push error");
	        console.log(e);
	    });
	}catch(e){console.log(e);}	
	
	function init(){
		app.tryConnection(function(){
			app.GAPage('/start/');
			
			var countEnter=localStorage.getItem('countEnter');
			countEnter++;
			localStorage.setItem('countEnter', countEnter);
			
			if(localStorage.getItem('lunchesArray')!==null){
				var lunchesArray=JSON.parse(localStorage.getItem('lunchesArray'));
				for(key in lunchesArray){
					localStorage.removeItem('lunch'+lunchesArray[key]);
				}
				localStorage.removeItem('lunchesArray');
			}
			$('.b_logo').transitionEnd( function(){
				app.mainView.loadPage('main.html');
			});
			var user=JSON.parse(localStorage.getItem('User'));
			if(user){}
			else{
				$('.app_exit span').text('Вход');
				$('.app_exit i').removeClass('icon-exit').addClass('icon-enter');
				$('.app_profile').hide();
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
		var CurrentUser=JSON.parse(localStorage.getItem('User'));
		if(CurrentUser){
			localStorage.clear();
			document.location.href='index.html';
		}else{
			app.mainView.loadPage('authorization.html');
		}
	}
	
	return {
		init: init
	};
});