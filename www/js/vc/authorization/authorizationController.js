define(["app","js/vc/authorization/authorizationView", "js/m/user", "js/utilities/forms"], function(app, view, User, forms) {
	var user = new User();
	var formFilled = false;
	
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
			//app.f7.alert("Авторизация прошла бы успешно, если бы здесь был обработчик формы, сораняющий ваши данные хоть куда-нибудь!");
			
			ymaps.ready(function () {
				app.mainView.loadPage('main.html');
			});
		}else{
			forms.showMessage(validateResult.message, "error");
		}
	}

	return {
		init: init
	};
});