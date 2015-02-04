define(["app","js/vc/registration/registrationView", "js/m/user", "js/utilities/forms"], function(app, view, User, forms) {
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
			formInput.uploadName=$('.b_upic_input').val();
			if( validateResult.isValid === true ){
				forms.hideMessage();
				$.ajax({
					type: "POST",
					async: false,
					url: app.config.source+"/api/registration/",
					data: formInput,
					success: function(msg){
						if(msg!='error'){
							user.setValues(JSON.parse(msg));
							ymaps.ready(function () {
								app.mainView.loadPage('main.html');
							});
						}else{
							forms.showMessage('Такой пользователь уже существует', "error");
						}
					}
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