define(["app", "js/vc/card/cardView", "js/utilities/forms", "js/utilities/map", "js/utilities/gallery", "js/utilities/api"], function(app, view, forms, Map, Gallery, Api) {
	var $ = Framework7.$;
	var api = new Api();
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
		var values={latitude:app.latitude, longitude:app.longitude, source:app.config.source, id:localStorage.getItem("currentId")};
		lunch=api.getLunch(values);
		lunch.mainSource=app.config.source;
		view.render({
			bindings: bindings,
			card:lunch
		});
		map = new Map({ mapId: 'cardMap', initZoom: 17, offset: {top: 13, left: 0} });
		
		initMap({latitude:lunch.latitude,longitude:lunch.longitude});
		map.setUserPosition([app.latitude, app.longitude], true);
		
		gallery = new Gallery({wrapper: '.b_gallery', items: 'a'});
		window.clearInterval(app.intervalCompass);
		app.intervalCompass=window.setInterval(tryCompass, 100);
	}
	
	// Инициализация карты
	function initMap(values) {
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		// Создание метки и центрирование карты на ней
		map.map.setCenter(
			map.getOffset( // Получаем координаты со сдвигом, заданным при инициализации карты
				map.createMark([values.latitude, values.longitude], 'card.html').geometry.getCoordinates()
			)
		);
	}
			
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState(this);
	}
	function tryCompass(){
		//navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	}
	return {
		init: init
	};
});