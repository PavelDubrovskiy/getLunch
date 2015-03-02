define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		console.log(params.menu);
		var html='',
			templateMenu = $('#lunchMenu').html();
		var compiledTemplateMenu = Template7.compile(templateMenu);
		html=compiledTemplateMenu(params.menu);
		$('#menuPage').html(html);
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});