define(["app","js/vc/authorization/authorizationView", "js/m/user", "js/utilities/forms"], function(app, view, User, forms) {
	var user = new User();
	var formFilled = false;
	var $ = Framework7.$;
	var bindings = [
		{
			element: '.p_start_facebook-login',
			event: 'click',
			handler: loginFacebook
		},
		{
			element: '.p_start_vk-login',
			event: 'click',
			handler: loginVK
		},
		{
			element: 'input',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: '.p_authorization_submit',
			event: 'click',
			handler: loginUser
		},
		{
			element: '.registrationBtn',
			event: 'click',
			handler: registrationBtn
		}
	];

	function init(query) {
		view.render({
			bindings: bindings,
			app:app
		});
	}
	
	function loginFacebook (){
		app.LoginFB.auth(false);
	}
	
	function loginVK (){
		app.LoginVK.auth(false);
	}
	
	function registrationBtn(){
		
	}
	
	function loginUser() {
		var formInput = app.f7.formToJSON('#authorizationForm'),
			validateResult
		;
		user.setValues( formInput );
		validateResult = user.validate(["name", "password"]);
		
		if( validateResult.isValid === true ){
			forms.hideMessage();
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/login/",
				data: formInput,
				success: function(msg){
					if(msg!='error'){
						app.LoginUser();
						user.setValues(JSON.parse(msg));
						//app.mainView.loadPage('main.html');
						
						$(document).once('pageAfterAnimation', function() {
							app.mainView.history.splice(app.mainView.history.length-1, 1);
							$('.view-main .page-on-left, .view-main .navbar-on-left').remove();
						});							
						
						app.mainView.loadPage(localStorage.getItem('soughtUrl') || app.mainView.history[app.mainView.history.length-1]);
					}else{
						forms.showMessage('Неправильно введены логин или пароль', "error");
					}
				}
			});
		}else{
			forms.showMessage(validateResult.message, "error");
		}
	}

	return {
		init: init
	};
});