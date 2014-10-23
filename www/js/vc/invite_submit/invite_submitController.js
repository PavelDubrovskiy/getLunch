define(["app","js/vc/invite_submit/invite_submitView","js/vc/invite_social/invite_socialController"], function(app, view, socialController) {
	var $ = Framework7.$;
	
	var bindings = [
	];

	function init(query) {
		fillSelectList();
		
		view.render({
			bindings: bindings
		});
	}
	
	function fillSelectList() {
		console.time("1");
		$(".b_invite_contacts").find(".item-inner").each(function() {
			var $input = $(this).find("input");
			
			if($input.prop('checked') === true) {
				console.log(true);
			}
		});
		console.timeEnd("1");
		
		//socialController.invitePersonTemplate
		//$(".b_invite_contacts").length
	}
	
	return {
		init: init
	};
});