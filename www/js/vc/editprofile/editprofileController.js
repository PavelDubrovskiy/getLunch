define(["app","js/vc/editprofile/editprofileView", "js/utilities/forms","js/m/user"], function(app, view, forms, User) {
	var $ = Framework7.$;
	var user = new User();
	var bindings = [
		{
			element: '.b_upic_input',
			event: 'change',
			handler: forms.uPicLoad
		},{
			element: '.item-link-exit',
			event: 'click',
			handler: exitToStart
		},{
			element: '.f_update',
			event: 'click',
			handler: saveProfile
		},{
			element: '.p_edit_facebook-login',
			event: 'click',
			handler: loginFacebook
		},{
			element: '.p_edit_vkontakte-login',
			event: 'click',
			handler: loginVkontakte
		}
	];

	function init(query) {
		view.render({
			bindings: bindings,
			user:user
		});
	}
	
	return {
		init: init
	};
	function exitToStart(){
		localStorage.clear();
		alert('exit');
		document.location.href='index.html';
	}
	function loginFacebook (){
		if($(this).hasClass('st_checked')){
			$(this).removeClass('st_checked');
			app.LogoutFB();
		}else{
			app.LoginFB.auth(false);
		}
	}
	
	function loginVkontakte (){
		if($(this).hasClass('st_checked')){
			$(this).removeClass('st_checked');
			app.LogoutVK();
		}else{
			app.LoginVK.auth(false);
		}
	}
	function saveProfile() {
		var formInput = app.f7.formToJSON('#profileForm'),
			validateResult
		;
		formInput.uploadName=$('.b_upic_input').val();
		formInput.code=user.code;
		console.log(formInput);
		user.setValues( formInput );
		validateResult = user.validate(["name"]);
		
		if( validateResult.isValid === true ){
			forms.hideMessage();
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/saveProfile/",
				data: formInput,
				success: function(msg){
					user.setValues(JSON.parse(msg));
					forms.showMessage('Данные успешно сохранены', 'success');
				}
			});
		}else{
			forms.showMessage(validateResult.message);
		}
	}
});