define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	
	function render(params) {
		utilities.bindEvents(params.bindings);
		switch(params.query.q) {
			case "facebook":
				$(".p_invite_social_header").text("Фейсбук");
				break;
			case "vk":
				$(".p_invite_social_header").text("ВКонтакте");
				break;
		}
	}
	
	return {
		render: render
	};
});