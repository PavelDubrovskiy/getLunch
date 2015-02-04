define(["app","js/vc/start/startView"], function(app,view) {	
	var bindings = [
		{
			element: '#externalSiteOneTouch',
			event: 'click',
			handler: externalSiteLoadOneTouch
		}
	];
	function init(query) {
		view.render({
			bindings: bindings
		});
	}
	
	return {
		init: init
	};
	function externalSiteLoadOneTouch(){
		if( navigator.app ){
		    navigator.app.loadUrl('http://one-touch.ru', {openExternal:true});
		}else{
		    window.open('http://one-touch.ru', "_system" );
		}
	}
});