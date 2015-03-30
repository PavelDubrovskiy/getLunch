define(["js/utilities/common"], function( utilities ) {
	var $ = Framework7.$;
	function render(params) {
		console.log(params.menu);
		var html='',
			templateMenu = $('#lunchMenu').html();
		var compiledTemplateMenu = Template7.compile(templateMenu);
		html=compiledTemplateMenu(params.menu);
		$('#menuPage').html(html);
		var user=JSON.parse(localStorage.getItem('User'));
		
		$('.checkinBtn').on('click', function(e) {
			localStorage.setItem('soughtUrl', 'checkin.html');
		});
		
		if(user){
			$('.checkinBtn').attr('href','checkin.html');
		}else{
			$('.checkinBtn').attr('href','authorization.html');
		}
		utilities.bindEvents(params.bindings);
	}

	return {
		render: render
	};
});