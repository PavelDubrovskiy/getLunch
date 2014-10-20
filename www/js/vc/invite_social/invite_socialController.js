define(["app","js/vc/invite_social/invite_socialView", "js/utilities/indexnavigation"], function(app, view, IndexNavigation) {
	var $ = Framework7.$;
	var invitePersonTemplate = Template7.compile( $("#t_invite_person").html() );
	var nav = null;
	
	var bindings = [
		{
			element: ".b_invite_contacts input",
			event: "change",
			handler: personToggle
		},
		{
			element: ".b_invite_sel_list",
			event: "click",
			handler: personUncheck,
			delegateTo: ".b_invite_sel_item"
		}
	];

	function init(query) {
		nav = new IndexNavigation({
			selector: ".b_invite_contacts"
		});
		
		view.render({
			query: query,
			bindings: bindings
		});
	}
	
	function personToggle(e) {
		var $item = $(this).parents(".item-checkbox");
		
		if( e.target.checked === true ) {
			$(".b_invite_sel_list").append(
				invitePersonTemplate({
					id: $item.data('id'),
					firstName: $item.find(".b_invite_firstName").text(),
					lastName: $item.find(".b_invite_lastName").text()
				})
			);
		}else{
			$("#" + $item.data('id')).remove();
		}
		
		checkSelectedContent();
	}
	
	function personUncheck() {
		$("[data-id=" + $(this).attr('id') + "]").find("input").prop("checked", false);
		$(this).remove();
		
		checkSelectedContent();
	}
	
	function checkSelectedContent() {
		var $list = $(".b_invite_sel_list"),
			$items = $list.find(".b_invite_sel_item");
			
		if( $items.length > 0 ) {
			$list.addClass("st_hascontent");
		}else{
			$list.removeClass("st_hascontent");
		}
	}
	
	return {
		init: init
	};
});