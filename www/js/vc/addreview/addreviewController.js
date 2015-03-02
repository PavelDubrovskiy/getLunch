define(["app", "js/vc/addreview/addreviewView", "js/utilities/forms", "js/utilities/dynamicarea", "js/m/user"], function(app, view, forms, DynamicArea,User) {
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
			element: '.submitReview',
			event: 'click',
			handler: submitReview
		},
	];
	
	// Инициализация страницы
	function init(query) {
		lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		app.GAPage('/restaurant/'+lunch.Name+'/'+lunch.id+'/review/');
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
	function submitReview() {
		var formInput = app.f7.formToJSON('#reviewForm');
		formInput.code=user.code;
		formInput.id=lunch.id;
		if(formInput.message!=''){
			$.ajax({
				type: "POST",
				async: false,
				url: app.config.source+"/api/addReview/",
				data: formInput,
				success: function(msg){
					forms.showMessage('Рецензия успешно добавлена', 'success');
					$('.p_addreview_back').click();
				}
			});
		}
	}
	return {
		init: init
	};
});