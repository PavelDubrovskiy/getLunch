define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		var placeholder = 'Я планирую обедать в заведении: ' + params.lunch.name;
		var $textarea = $('#checkinText');
		
		$textarea.attr('placeholder', placeholder).val(placeholder);
		
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});