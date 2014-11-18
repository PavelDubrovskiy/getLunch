define(["app","js/vc/authorization/authorizationView", "js/m/user", "js/utilities/forms"], function(app, view, User, forms) {
	var user = new User();
	var formFilled = false;
	var $ = Framework7.$;
	var bindings = [
		{
			element: 'input',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: '.p_authorization_submit',
			event: 'click',
			handler: loginUser
		}
	];

	function init(query) {
		view.render({
			bindings: bindings
		});
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
						user.setValues(JSON.parse(msg));
						ymaps.ready(function () {
							app.mainView.loadPage('main.html');
						});
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