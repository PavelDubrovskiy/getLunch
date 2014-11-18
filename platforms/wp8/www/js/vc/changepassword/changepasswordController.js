define(["app","js/vc/changepassword/changepasswordView", "js/utilities/forms", "js/m/user"], function(app, view, forms, User) {
	var $ = Framework7.$;
	var user = new User();
	var bindings = [
		{
			element: 'input',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: '.p_changepassword_submit',
			event: 'click',
			handler: changePassword
		}
	];

	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	
	function changePassword() {
		var formInput = app.f7.formToJSON('#changepasswordForm');
		if(formInput.oldpass!='' && formInput.newpass!=''){
			formInput.code=user.code;
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/savePassword/",
				data: formInput,
				success: function(msg){
					if(msg=='error'){
						app.f7.alert("Проверьте данные");
					}else{
						app.f7.alert("Пароль изменён успешно", function() {
							app.mainView.goBack();
						});
					}
				}
			});
		}else{
			app.f7.alert("Вы не ввели пароль");
		}
	}

	return {
		init: init
	};
});