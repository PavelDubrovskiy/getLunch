define(["app", "js/vc/main/mainView", "js/utilities/forms", "js/utilities/map", "js/m/user", "js/utilities/api"], function(app, view, forms, Map, User, Api) {
	var map = null;
	var user = new User();
	var api = new Api();
	var $ = Framework7.$;
	var sought=[];
	if(localStorage.getItem('sought')!==null){
		sought=localStorage.getItem('sought').split('!__;__!');
	}
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
			event: 'search change',
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
		},
		{
			element: '#soughtList',
			event: 'click',
			handler: soughtClick,
			delegateTo: '.item-inner_sought'
		}
	];
	
	// Разрешаем открывать меню
	app.f7.allowPanelOpen = true;

	// Инициализация страницы
	function init(query) {
		$(document).on('pageBeforeRemove', function (e) {
			app.firstEnter=true;
		});
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
		var itemList={};
		
		setTimeout( function(){
			getNearestLunces();
		}, 400);
		window.clearInterval(app.interval);
		var mainSetMePosInterval=window.setInterval(function(){
			getNearestLunces();
		},5000);
		// Изменение состояния метки (если вторым параметром передано true, 1, "active" — метка становится активной, если false, 0, "inactive" или параметр не передан — неактивной)
		//map.changeMarkState( map.marks.get(0), "inactive");
	}
	
	// Геолокация
	function geolocation() {
		app.firstEnter=true;
		if(app.latitude==0 && app.longitude==0){
			app.watchID = navigator.geolocation.watchPosition(function(position){
					try{
						app.latitude=position.coords.latitude;
						app.longitude=position.coords.longitude;
						getNearestLunces();
						map.setUserPosition([app.latitude, app.longitude], true);
					}catch(e){}
				}, 
				function(){}, 
				{timeout: 10000, enableHighAccuracy: true}
			);
		}else{
			getNearestLunces();
			map.setUserPosition([app.latitude, app.longitude], true);
		}
	}
	
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}
	
	function soughtClick() {
		$('.p_main_search_input').val($(this).text());
		searchHandler();
	}
	// Поиск
	function searchHandler() {
		if($('.p_main_search_input').val()!=''){
			var values={source:app.config.source, map:map, address:$('.p_main_search_input').val()};
			var msg=api.getLunchByAddress(values);
			if(typeof msg !== 'undefined'){
				sought.forEach(function(element, index, array){
					if(element==$('.p_main_search_input').val()){
						sought.splice(index,1);
					}
				});
				sought.unshift($('.p_main_search_input').val());
				localStorage.setItem('sought',sought.join('!__;__!'));
				map.marks.removeAll();				
				var valuesItem={lunchList:msg.list,map:map};
				view.attachLunches(valuesItem);
				$('.b_cards_item').click(function(){localStorage.setItem('currentId',$(this).data('id'));});
				app.firstEnter=false;
				map.autoBounds();
				setTimeout(view.closeSearchClick, 700);
				
			}
		}
	}
	// Получение адресов вокруг моей позиции 
	function getNearestLunces(){
		if(app.latitude!=0 && app.longitude!=0){
			var values={latitude:app.latitude, longitude:app.longitude,panTo:app.firstEnter, source:app.config.source, map:map};
			map.geolocation(values);
			var lunchList=api.getLunchByCoords(values);
			var mainLunchesList=JSON.parse(localStorage.getItem('mainLunchesList'));
			var isChangeInList=false;
			lunchList.forEach(function(element, index, array){
				if(mainLunchesList!==null && element.id*1!==mainLunchesList[index].id*1){
					isChangeInList=true;
				}
			});
			if(mainLunchesList===null || isChangeInList==true){
				localStorage.setItem('mainLunchesList',JSON.stringify(lunchList));
			}
			if(typeof lunchList !== 'undefined'){
				if(isChangeInList==true || app.firstEnter==true){
					map.marks.removeAll();
					var valuesItem={lunchList:lunchList,map:map};
					view.attachLunches(valuesItem);
					$('.b_cards_item').click(function(){localStorage.setItem('currentId',$(this).data('id'));});
					app.firstEnter=false;
				}
			}
		}
	}
	// Выход из приложения
	function appExit() {
		window.close();
	}

	return {
		init: init
	};
});