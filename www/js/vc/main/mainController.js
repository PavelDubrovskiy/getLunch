define(["app", "js/vc/main/mainView", "js/utilities/forms", "js/utilities/map", "js/m/user", "js/utilities/api"], function(app, view, forms, Map, User, Api) {
	var map = null;
	var user = new User();
	var api = new Api();
	var $ = Framework7.$;
	var bindings = [	
		// Функция переустановки значения инпута, чтобы решить баг с курсором всегда в начале поля ввода
		{
			element: 'input',
			event: 'focus',
			handler: forms.resetInput
		},
		
		// Управление поиском
		{
			element: '.p_main_search_open',
			event: 'click',
			handler: view.openSearch
		},
		{
			element: '.p_main_search_close',
			event: 'click',
			handler: view.closeSearch
		},
		{
			element: '.popup',
			event: 'open',
			handler: view.removePopupOverlay
		},
		{
			element: '.p_main_search_input',
			event: 'search',
			handler: searchHandler
		},
		
		// Управление избранным
		{
			element: '.p_main_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		},
		
		// Выход из приложения
		{
			element: '.app_exit',
			event: 'click',
			handler: appExit
		}
	];
	// Разрешаем открывать меню
	app.f7.allowPanelOpen = true;

	// Инициализация страницы
	function init(query) {
		initMap();
		
		view.render({
			bindings: bindings,
			user: user
		});
	}
	
	// Вешаем инициализацию карты на окончание анимации страницы
	//app.f7.onPageAfterAnimation('main', initMap);
	
	// Инициализация карты
	function initMap() {
		// Создание карты
		map = new Map({ mapId: 'mainMap' });
		
		// Добавление подписки на события управления картой
		bindings.push(
			{
				element: '.b_map_btn.m_zoomin',
				event: 'click',
				handler: map.zoomIn.bind(map)
			},
			{
				element: '.b_map_btn.m_zoomout',
				event: 'click',
				handler: map.zoomOut.bind(map)
			},
			{
				element: '.b_map_btn.m_geolocation',
				event: 'click',
				handler: geolocation
			}
		);
		
		map.map.events.add('click', view.toggleMapSize );
		
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		// Создание меток
		/*
		map.createMark([55.76, 37.64], 'card.html', 'Итальянский ресторанчик Ля ПестоТестоСиесто');
		map.createMark([55.757, 37.637], 'card.html', 'Шоколадница', true); // true — неактивная метка
		map.createMark([55.759, 37.635], 'card.html', 'Тай-Чай');
		map.createMark([55.756, 37.638], 'card.html', 'Цурцум Кафе');
		*/
		var itemList={};
		if(app.latitude!=0 && app.longitude!=0){
			var values={latitude:app.latitude, longitude:app.longitude,panTo:app.firstEnter, source:app.config.source, map:map};
			map.geolocation(values);
			if(app.firstEnter==true){
				lunchList=api.getLunchByCoords(values);
				if(typeof lunchList !== 'undefined'){
					var valuesItem={lunchList:lunchList,map:map};
					view.attachLunches(valuesItem);
					$('.b_cards_item').click(function(){localStorage.setItem('currentId',$(this).data('id'));});
					app.firstEnter=false;
				}
			}
			
		}
		
		window.clearInterval(app.interval);
		window.setInterval(function(){
			if(app.latitude!=0 && app.longitude!=0){
				var values={latitude:app.latitude, longitude:app.longitude,panTo:app.firstEnter, source:app.config.source, map:map};
				map.geolocation(values);
				if(app.firstEnter==true){
					lunchList=api.getLunchByCoords(values);
					if(typeof lunchList !== 'undefined'){
						var valuesItem={lunchList:lunchList,map:map};
						view.attachLunches(valuesItem);
						$('.b_cards_item').click(function(){localStorage.setItem('currentId',$(this).data('id'));});
						app.firstEnter=false;
					}
				}
			}
		},1000);
		// Изменение состояния метки (если вторым параметром передано true, 1, "active" — метка становится активной, если false, 0, "inactive" или параметр не передан — неактивной)
		//map.changeMarkState( map.marks.get(0), "inactive");
	}
	
	// Геолокация
	function geolocation() {	
		//app.f7.alert("Мы бы определили ваше местоположение, но у нас пока не написана функция, которая это делает");
		
		// Перемещаем карту к найденной точке
		map.setUserPosition([app.latitude, app.longitude], true);
	}
	
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}
	
	// Поиск
	function searchHandler() {
		app.mainView.loadPage('searchplace.html?q=' + this.value);
		setTimeout(view.closeSearchClick, 700);
	}
	
	// Выход из приложения
	function appExit() {
		window.close();
	}

	return {
		init: init
	};
});