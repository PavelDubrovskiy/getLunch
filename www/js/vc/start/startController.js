define(["app", "js/vc/start/startView"], function(app, view) {
	var bindings = [
		{
			element: '.p_start_facebook-login',
			event: 'click',
			handler: loginFacebook
		},{
			element: '.p_start_vk-login',
			event: 'click',
			handler: loginVK
		}
	];

	function init() {
		view.render({
			bindings: bindings
		});
	}
	
	function loginFacebook (){
		app.f7.alert("Логинимся через Фейсбук!");
	}
	
	function loginVK (){
		app.f7.alert("Логинимся через ВКонтакте!");
	}

	return {
		init: init
	};
});