define(["app", "js/utilities/common"], function( app, utilities ) {
	var $ = Framework7.$;
	function render(params) {
		$('.p_card_header span').text(params.card.name);
		var html='',
			template = $('#lunchCard').html(),
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		var compiledTemplate = Template7.compile(template);
		
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
		
		$('.b_underground').each( function() {
			var $this = $(this)
				$prev = $this.prev();
			
			if($this.text() === $prev.text()) {
				$prev.addClass('m_connect').text('');
			}
		});
		
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