define(["app","js/vc/registration/registrationView", "js/m/user", "js/utilities/forms"], function(app, view, User, forms) {
	var user = new User();
	var formFilled = false;
	
	var bindings = [
		{
			element: 'input',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: 'input',
			event: 'input',
			handler: checkForm
		},
		{
			element: '.b_upic_input',
			event: 'change',
			handler: forms.uPicLoad
		},
		{
			element: '.b_upic_input',
			event: 'focus',
			handler: forms.triggerClick
		},
		{
			element: '.p_registration_submit',
			event: 'click',
			handler: saveUser
		}
	];

	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	
	function saveUser() {
		if( formFilled === true ){
			var formInput = app.f7.formToJSON('#registrationForm'),
				validateResult
			;
			
			user.setValues( formInput );
			validateResult = user.validate(["name", "email", "password"]);
			
			if( validateResult.isValid === true ){
				forms.hideMessage();
				app.f7.alert("Регистрация прошла бы успешно, если бы здесь был обработчик формы, сораняющий ваши данные хоть куда-нибудь!");
			
				ymaps.ready(function () {
					app.mainView.loadPage('main.html');
				});
			}else{
				forms.showMessage(validateResult.message);
			}
		}else{
			forms.showMessage("Пожалуйста, заполните все поля");
		}
	}
	
	function checkForm() {
		formFilled = forms.isFormFilled('#registrationForm');
		
		if( formFilled === true ){
			forms.enableElement('.p_registration_submit');
		}else{
			forms.disableElement('.p_registration_submit');
		}
	}

	return {
		init: init
	};
});