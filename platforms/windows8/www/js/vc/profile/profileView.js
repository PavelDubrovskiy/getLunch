define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		$('.header-wide_profile').text(params.user.name);
		var html='',
			templateProfile = $('#profileCard').html(),
			date=new Date();
		var compiledTemplateProfile = Template7.compile(templateProfile);
		html=compiledTemplateProfile(params);
		$('#profilePage').html(html);
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render,
		toggleFavouriteState: utilities.toggleFavouriteState
	};
});