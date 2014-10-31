define(["app","js/vc/invite_submit/invite_submitView","js/utilities/invite"], function(app, view, invite) {
	var bindings = [
		{
			element: ".p_invite_submit_list",
			event: "click",
			handler: invite.personUncheck,
			delegateTo: ".b_invite_sel_item"
		}
	];

	function init(query) {		
		invite.fillSelectedContent();
		
		view.render({
			bindings: bindings
		});
	}
	
	return {
		init: init
	};
});