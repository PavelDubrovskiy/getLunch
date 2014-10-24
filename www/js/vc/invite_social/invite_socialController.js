define(["app","js/vc/invite_social/invite_socialView","js/utilities/invite", "js/utilities/forms"], function(app, view, invite, forms) {
	var $ = Framework7.$;

	var bindings = [
		{
			element: ".b_invite_contacts input",
			event: "change",
			handler: invite.personToggle
		},
		{
			element: ".p_invite_social_list",
			event: "click",
			handler: invite.personUncheck,
			delegateTo: ".b_invite_sel_item"
		},{
			element: ".p_invite_social_forward",
			event: "click",
			handler: forward
		}
	];

	function init(query) {
		invite.checkSelectedContent();
	
		view.render({
			query: query,
			bindings: bindings
		});
	}
	
	function forward() {
		if($(this).hasClass("st_disabled")) {
			forms.showMessage("Вы не выбрали ни одного человека","error",true);
		}else{
			app.mainView.loadPage('invite_submit.html');
		}
	}
	
	return {
		init: init
	};
});