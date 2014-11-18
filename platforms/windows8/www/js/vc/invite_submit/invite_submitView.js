define(["js/utilities/common", "moment"], function(utilities, moment) {
	var $ = Framework7.$;
	
	function render(params) {
		setDatetimeBounds();
		utilities.bindEvents(params.bindings);
	}
	
	function setDatetimeBounds() {
		var date = new Date();
		var dateLocal = moment().format().slice(0,-6);
		var $input = $("#inviteDatetime");
		var $wrap = $input.parent();
				
		$input
			.val(dateLocal)
			.attr('min', dateLocal);
	}
	
	return {
		render: render
	};
});