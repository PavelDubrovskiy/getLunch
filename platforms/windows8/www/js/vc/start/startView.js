define(["js/utilities/common"], function( utilities ) {
	var 	$ = Framework7.$,
			$body = $("body")
	;

	function render(params) {
		utilities.bindEvents(params.bindings);
		loadedHandler();
	}
	
	function loadedHandler(){
		$body.addClass("st_loaded");
	}

	return {
		render: render
	};
});