define(["app","js/vc/profile/profileView"], function(app, view) {
	var bindings = [
		// Управление избранным
		{
			element: '.p_profile_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		}
	];

	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}
	
	return {
		init: init
	};
});