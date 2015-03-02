define( function() {
	var $ = Framework7.$;

	// Замена содержимого элемента прелоадером
	function setPreloader(selector) {
		$(selector).html('<span class="preloader"></span>');
	}
	
	// Навешивание обработчиков событий на элементы
	function bindEvents(bindings) {
		for (var i in bindings) {
			if( !bindings[i].delegateTo ) {
				$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
			}else{
				$(bindings[i].element).on(bindings[i].event, bindings[i].delegateTo, bindings[i].handler);
			}
		}
	}
		
	// Функция управления избранным
	function toggleFavouriteState( clicked ) {
		var $clicked = $(clicked),
			$icon = $clicked.children()
		;
		$clicked.parent().prev().toggleClass("st_favourite");
		if( $icon.hasClass("icon-star") === true ) {
			$icon
				.removeClass("icon-star")
				.addClass("icon-star-filled");
		}else{
			$icon
				.removeClass("icon-star-filled")
				.addClass("icon-star");
		}
	}
	
	// Установка угла компаса
	function setCompassState( angle, tx ) {
		$(".b_compass_arr").transform('rotate('+angle+'deg)');		
		$(".b_compass_tx").text( tx );
	}
	
	// Увеличение размера карты
	function expandMap(e) {
		var $map = $(".b_map");
		$map.addClass("st_fullscreen");
		e.originalEvent ? e.originalEvent.map.container.fitToViewport(true) : e.map.container.fitToViewport(true);
	}
	
	// Уменьшение размера карты
	function reduceMap(e) {
		var $map = $(".b_map");
		$map.removeClass("st_fullscreen");
		e.originalEvent ? e.originalEvent.map.container.fitToViewport(true) : e.map.container.fitToViewport(true);
	}
	
	return {
		setPreloader: setPreloader,
		bindEvents: bindEvents,
		expandMap: expandMap,
		reduceMap: reduceMap,
		toggleFavouriteState: toggleFavouriteState,
		setCompassState: setCompassState
	};	
});