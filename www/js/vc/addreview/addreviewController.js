define(["app", "js/vc/addreview/addreviewView", "js/utilities/forms", "js/utilities/dynamicarea"], function(app, view, forms, DynamicArea) {
	var $ = Framework7.$;

	var bindings = [
		{
			element: 'b_review_block textarea',
			event: 'focus',
			handler: forms.resetInput
		}
	];
	
	// Инициализация страницы
	function init(query) {
		var textarea = new DynamicArea({
			selector: '.b_review_block textarea',
			afterInit: function(e) {
				setTimeout( function() {
					e.element.focus();
				}, 400);
			}
		});
		
		view.render({
			bindings: bindings
		});
	}
	
	return {
		init: init
	};
});