define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		var html='',
			templateEditprofile = $('#editprofileCard').html(),
			date=new Date();
		var compiledTemplateEditprofile = Template7.compile(templateEditprofile);
		html=compiledTemplateEditprofile(params.user);
		$('#editprofilePage').html(html);
		utilities.bindEvents(params.bindings);
	}
	return {
		render: render
	};
});