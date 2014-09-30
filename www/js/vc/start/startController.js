define(["app", "js/vc/start/startView", "js/m/user"], function(app, view, User) {
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

	function init() {
		if(user.id!=''){
			$('.p_start_buttons').hide();
			setTimeout( function(){ app.mainView.loadPage('main.html'); }, 1300);
		}
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
	
	function exitToStart(){
		localStorage.removeItem('User');
		document.location.href='index.html';
	}
	
	return {
		init: init
	};
});