define(["app", "js/vc/addappreview/addappreviewView", "js/utilities/forms", "js/utilities/dynamicarea", "js/m/user"], function(app, view, forms, DynamicArea,User) {
	var $ = Framework7.$;
	var user = new User();
	var lunch = {};
	var bindings = [
		{
			element: '.b_review_block textarea',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: '.submitappReview',
			event: 'click',
			handler: submitappReview
		},
	];
	
	// Инициализация страницы
	function init(query) {
		app.GAPage('/restaurant/appreview/');
		var textarea = new DynamicArea({
			selector: '.b_review_block textarea',
			afterInit: function(e) {
				setTimeout( function() {
					e.element.focus();
				}, 400);
			}
		});		
		view.render({
			bindings: bindings,
			lunch:lunch
		});
	}
	function submitappReview() {
		var formInput = app.f7.formToJSON('#appreviewForm');
		var Iuser=JSON.parse(localStorage.getItem('User'));
		if(Iuser) formInput.code=Iuser.code;
		if(formInput.message!=''){
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/addappReview/",
				data: formInput,
				success: function(msg){
					forms.showMessage('Спасибо за ваш отзыв!', 'success');
					$('.p_addreview_back').click();
				}
			});
		}
	}
	return {
		init: init
	};
});