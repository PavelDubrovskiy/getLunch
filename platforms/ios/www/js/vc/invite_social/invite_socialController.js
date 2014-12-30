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
	/*document.addEventListener("backbutton", onBackButtonFire, false); 
	function onBackButtonFire(){
		app.mainView.loadPage('card.html');
	}*/
	function init(query) {
		invite.checkSelectedContent();
		var contacts;
		switch(query.q) {
			case "message":
				getMessageList();
				break;
			case "mail":
				$(".p_invite_social_header").text("Почта");
				break;
			case "facebook":
				$(".p_invite_social_header").text("Фейсбук");
				break;
		}
		
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
	function getMessageList(){
		try{
			var options = new ContactFindOptions();
			options.filter = "";
			var filter = ["displayName", "addresses", "name", "phoneNumbers", "emails", "urls", "categories", "photos"];
			navigator.contacts.find(filter, 
				function(contacts) {
					console.log(contacts);
				    for (var i = 0; i < contacts.length; i++) {
				        
				    }
				}
			, null, options);
		}catch(e){
			
		}		
	}
	
	return {
		init: init
	};
});