define(["app", "js/vc/card/cardView", "js/utilities/forms", "js/utilities/map", "js/utilities/gallery"], function(app, view, forms, Map, Gallery) {
	var $$ = Framework7.$;
	
	var map = null;
	var gallery = null;
	var interval = null;
	var bindings = [
		// Управление избранным
		{
			element: '.p_card_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		},
		
		// Предотвращение открытия меню при свайпе галереи
		{
			element: '.b_gallery',
			event: 'touchstart',
			handler: app.disablePanel
		},
		{
			element: '.b_gallery',
			event: 'touchend',
			handler: app.enablePanel
		}
	];
	
	// Инициализация страницы
	function init(query) {
		// Создание карты
		map = new Map({ mapId: 'cardMap', initZoom: 17, offset: {top: 13, left: 0} });
		gallery = new Gallery({wrapper: '.b_gallery', items: 'a'});
		
		initMap();
		
		view.render({
			bindings: bindings
		});
		
		// Крутим компас
		/*var i = 0;		
		if( !interval ) {
			(function animloop(){
				i++;
				view.setCompassState(i, i + " м");
				$$.requestAnimationFrame(animloop);
			})();
		}*/
	}
	
	// Инициализация карты
	function initMap() {
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		// Создание метки и центрирование карты на ней
		map.map.setCenter(
			map.getOffset( // Получаем координаты со сдвигом, заданным при инициализации карты
				map.createMark([55.7585, 37.64], 'card.html').geometry.getCoordinates()
			)
		);
	}
			
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState(this);
	}

	return {
		init: init
	};
});