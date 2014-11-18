define(["app", "js/vc/searchplace/searchplaceView", "js/utilities/forms", "js/utilities/map"], function(app, view, forms, Map) {
	var map = null;	
	var bindings = [
		// Управление избранным
		{
			element: '.p_searchplace_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		}
	];
	
	// Инициализация страницы
	function init(query) {
		// Создание карты
		map = new Map({ mapId: 'searchplaceMap', offset: {top: 30, left: 0} });
		var header = (query && query.q) ? query.q : '';
		app.mainView.showNavbar();
		
		initMap();
		
		view.render({
			bindings: bindings,
			header: header
		});
	}
	
	// Инициализация карты
	function initMap() {
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		map.createMark([55.76, 37.64], 'card.html', 'Итальянский ресторанчик Ля ПестоТестоСиесто');
		map.createMark([55.757, 37.637], 'card.html', 'Шоколадница', true);
		map.createMark([55.759, 37.635], 'card.html', 'Тай-Чай');
		map.createMark([55.756, 37.638], 'card.html', 'Цурцум Кафе');
		
		map.autoBounds();
		
		map.map.events.add("balloonopen", function(){ forms.hideMessage(); });
		
		setTimeout( function(){
			forms.showMessage("Найдено 4 заведения", "smallgray");
		}, 400);
	}
			
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}

	return {
		init: init
	};
});