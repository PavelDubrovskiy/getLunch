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
		app.GAPage('/registration/');
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
							app.LoginUser();
							user.setValues(JSON.parse(msg));
							//app.mainView.loadPage('main.html');
							
							$(document).once('pageAfterAnimation', function() {
								app.mainView.history.splice(app.mainView.history.length-3, 2);								
								$('.view-main .page-on-left, .view-main .navbar-on-left').remove();
							});							
							
							app.mainView.loadPage(localStorage.getItem('soughtUrl') || app.mainView.history[app.mainView.history.length-2]);
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