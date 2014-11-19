define(["app", "js/vc/checkin/checkinView", "js/utilities/forms", "js/utilities/dynamicarea","js/m/user"], function(app, view, forms, DynamicArea, User) {
	var $ = Framework7.$;
	var user = new User();
	var lunch ={};
	var bindings = [
		{
			element: '.b_review_block textarea',
			event: 'focus',
			handler: forms.resetInput
		},
		{
			element: '.submitCheckin',
			event: 'click',
			handler: submitCheckin
		},
	];
	
	// Инициализация страницы
	function init(query) {
		lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
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
	function submitCheckin() {
		var formInput = app.f7.formToJSON('#checkinForm');
		formInput.code=user.code;
		formInput.id=lunch.id;
		if(formInput.message!=''){
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/checkin/",
				data: formInput,
				success: function(msg){
					forms.showMessage('Вы едите в ' + lunch.name, 'success');
					$('.p_checkin_back').click();
				}
			});
		}
	}
	return {
		init: init
	};
});