define(["app","js/vc/profile/profileView","js/m/user"], function(app, view, User) {
	var $ = Framework7.$;
	var user = new User();
	var bindings = [
		// Управление избранным
		{
			element: '.p_profile_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		}
	];

	function init(query) {
		$.ajax({
			type: "POST",
			async: false,
			url: app.config.source+"/api/getCheckins/",
			data: 'code='+user.code,
			success: function(msg){
				if(msg!='error'){
					checkins=JSON.parse(msg);
				}else{
					checkins='';
				}
			}
		});
		view.render({
			bindings: bindings,
			user:user,
			checkins:checkins
		});
		$('.b_cards_item').click(function(){localStorage.setItem('currentId',$(this).data('id'));});
	}
	
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}
	
	return {
		init: init
	};
});