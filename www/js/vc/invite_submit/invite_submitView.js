define(["js/utilities/common"], function(utilities) {
	var $ = Framework7.$;
	
	function render(params) {
		setDatetimeBounds();
		utilities.bindEvents(params.bindings);
	}
	
	function setDatetimeBounds() {
		var date = new Date();
		var dateLocal = date.toISOString().slice(0, -1);
		var $input = $("#inviteDatetime");
		var $wrap = $input.parent();
				
		$input
			.val(dateLocal)
			.attr('min', dateLocal);
			
		$wrap.append('<span>' + dateLocal + '</span>')
			
		$input.on("change", function() {
			console.log( $input.val() );
		});
			
		console.log( $input.val(), dateLocal );
	}
	
	return {
		render: render
	};
});