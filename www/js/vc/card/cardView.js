define(["app", "js/utilities/common"], function( app, utilities ) {
	var $ = Framework7.$;
	function render(params) {
		$('.p_card_header').text(params.card.name);
		var html='',
			template = $('#lunchCard').html(),
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		var compiledTemplate = Template7.compile(template);
		params.card.metres=Math.round(Math.sqrt(Math.pow(params.card.longitude*Math.cos(app.latitude)-app.longitude*Math.cos(app.latitude),2)+Math.pow(params.card.latitude-app.latitude,2))*10000*11.12);
		/*if(params.card.longitude>=app.longitude && params.card.latitude>=app.latitude){
			params.card.degrees=Math.round(90+(Math.acos(((app.latitude-params.card.latitude)*10000*11.12)/params.card.metres))*180/Math.PI);
		}else if(lunchPos.longitude<myPos.longitude && lunchPos.latitude>=myPos.latitude){
			degrees=90-(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
		}else if(lunchPos.longitude>=myPos.longitude && lunchPos.latitude<myPos.latitude){
			degrees=180-(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
		}else if(lunchPos.longitude<myPos.longitude && lunchPos.latitude<=myPos.latitude){
			degrees=180+(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
		}*/
		html=compiledTemplate(params.card);
		$('#lunchPage').html(html);
		utilities.bindEvents(params.bindings);
		
		// Крутим компас
		/*var i = 0;		
		if( !interval ) {
			(function animloop(){
				i++;
				view.setCompassState(i, i + " м");
				$.requestAnimationFrame(animloop);
			})();
		}*/
	}

	return {
		render: render,
		toggleFavouriteState: utilities.toggleFavouriteState,
		setCompassState: utilities.setCompassState
	};
});