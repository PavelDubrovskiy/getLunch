define(["app", "js/vc/main/mainView", "js/utilities/forms", "js/utilities/map", "js/m/user", "js/utilities/api"], function(app, view, forms, Map, User, Api) {
	var map = null;
	var user = new User();
	var api = new Api();
	var $ = Framework7.$;
	var sought=[];
	var searchInput='';
	var userPosition=true;
	var minZoom = 13;
	
	var search = app.f7.searchbar('.address-search', {
		searchList: '.list-block-search',
		searchIn: '.item-title'
	});
	
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
			element: '.p_main_search_input',
			event: 'search change',
			handler: searchHandler
		},
		{
			element: '.searchbar-clear',
			event: 'click',
			handler: clearHandler
		},
		// Управление избранным
		{
			element: '.p_main_favourite_toggle',
			event: 'click',
			handler: toggleFavouriteState
		},
		{
			element: '#soughtList',
			event: 'click',
			handler: soughtClick,
			delegateTo: '.item-inner_sought'
		},
		{
			element: '#submitFilter',
			event: 'click',
			handler: submitFilter
		},
		
		//GoogleAnalitics
		{
			element: '#searchMainPopupIcon',
			event: 'click',
			handler: function(){app.GAEvent('search', 'click', 'start')}
		},
		{
			element: '#filterMainPopupIcon',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'start')}
		},
		{
			element: '#filterCancelButton',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'cancel', '1')}
		},
		{
			element: '#filterSendButton',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'send', '1')}
		},
		{
			element: '#filterLunchfromInput',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'time_begin')}
		},
		{
			element: '#filterLunchtoInput',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'time_end')}
		},
		{
			element: '#filterPricefromInput',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'price_from')}
		},
		{
			element: '#filterPricetoInput',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'price_to')}
		},
		{
			element: '#filterVegetarianCheckbox',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'vegetarian')}
		},
		{
			element: '#filterWiFiCheckbox',  
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'wifi')}
		},
		{
			element: '#filterParkingCheckbox',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'parking')}
		},
		{
			element: '#filterTerracaCheckbox',
			event: 'click',
			handler: function(){app.GAEvent('filter', 'click', 'terraca')}
		}
	];
	
	// Разрешаем открывать меню
	app.f7.allowPanelOpen = true;

	// Инициализация страницы
	function init(query) {
		localStorage.setItem('soughtUrl', 'main.html');
		app.GAPage('/main/');
		var filter=JSON.parse(localStorage.getItem('filter'));
		/*$(document).on('pageBeforeRemove', function (e) {
			app.firstEnter=true;
		});*/
		initMap();
		view.render({
			bindings: bindings,
			user: user,
			filter:filter
		});
	}
	
	// Вешаем инициализацию карты на окончание анимации страницы
	//app.f7.onPageAfterAnimation('main', initMap);
	
	// Инициализация карты
	function initMap() {
		var mapFullscreen = false;
		
		// Создание карты
		map = new Map({
			mapId: 'mainMap',
			openBalloon: true,
			initZoom: 18
		});
		
		// Добавление подписки на события управления картой
		bindings.push(
			{
				element: '.b_map_btn.m_zoomin',
				event: 'click',
				handler: map.zoomIn.bind(map)
			},
			{
				element: '.b_map_btn.m_zoomin',
				event: 'click',
				handler: function(){app.GAEvent('map', 'click', 'plus')}
			},
			{
				element: '.b_map_btn.m_zoomout',
				event: 'click',
				handler: map.zoomOut.bind(map)
			},
			{
				element: '.b_map_btn.m_zoomout',
				event: 'click',
				handler: function(){app.GAEvent('map', 'click', 'minus')}
			},
			{
				element: '.b_map_btn.m_geolocation',
				event: 'click',
				handler: geolocation
			},
			{
				element: '.b_map_btn.m_geolocation',
				event: 'click',
				handler: function(){app.GAEvent('map', 'click', 'arrow')}
			},
			{
				element: '.b_map_btn.m_findme',
				event: 'click',
				handler: findMe
			}
		);
		
		map.map.events.add('dblclick', function(e){
			if(!mapFullscreen){
				view.expandMap(e);
				mapFullscreen = true;
			}else{
				view.reduceMap(e);
				mapFullscreen = false;
			}
		});
		
		if(mapFullscreen){
			view.expandMap(map);
		}
		
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		map.objectManager.events.add('mouseenter', app.disablePanel);
		map.objectManager.events.add('mouseleave', app.enablePanel);
		
		var itemList={};
		
		getLunchBySquareCoords(219);
		map.boundsChange(function() {
			userPosition = false;
			getLunchBySquareCoords(222);
		});
		geolocation();
		//setTimeout(getNearestLunches, 400);
		//setTimeout(getLunchBySquareCoords, 400);
		
		//window.clearInterval(app.interval);
		//var mainSetMePosInterval=window.setInterval(getNearestLunches, 5000);
		//var mainSetMePosInterval=window.setInterval(getLunchBySquareCoords, 5000);
		
		// Изменение состояния метки (если вторым параметром передано true, 1, "active" — метка становится активной, если false, 0, "inactive" или параметр не передан — неактивной)
		//map.changeMarkState( map.marks.get(0), "inactive");
	}
	
	// Геолокация
	function geolocation() {
		app.firstEnter=true;
		searchInput='';
		if(app.latitude==0 && app.longitude==0){
			app.watchID = navigator.geolocation.watchPosition(function(position){
					console.log('geo success from main');
					try{
						console.log(position.coords.latitude+'!='+app.latitude+' && '+app.longitude+'!='+position.coords.longitude);
						if(position.coords.latitude!=app.latitude && app.longitude!=position.coords.longitude){
							app.latitude=position.coords.latitude;
							app.longitude=position.coords.longitude;
							//getNearestLunches();
							getLunchBySquareCoords(249);
							if(userPosition==true && app.latitude!=0) map.setUserPosition([app.latitude, app.longitude], true);
						}
					}catch(e){console.log(e);}
				}, 
				function(){
					console.log('geo fail from main');
					getLunchBySquareCoords(256);
				}, 
				{timeout: 9000, enableHighAccuracy: true}
			);
		}else{
			//getNearestLunches();
			getLunchBySquareCoords(262);
			map.setUserPosition([app.latitude, app.longitude], true);
			if(map.map.getZoom() < minZoom) {
				map.map.setZoom(minZoom+1);
			}
		}
	}
	
	// Найти меня
	function findMe() {
		app.GAEvent('map', 'click', 'target');
		map.setUserPosition([app.latitude, app.longitude], true);
		if(map.map.getZoom() < minZoom) {
			map.map.setZoom(minZoom+1);
		}
	}
	
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState( this );
	}
	
	function soughtClick() {
		$('.p_main_search_input').val($(this).text());
		search.container.addClass('searchbar-not-empty');
		searchHandler();
	}
	// Поиск
	function searchHandler(){
		if($('.p_main_search_input').val()!=''){
			searchInput=$('.p_main_search_input').val();
			app.GAEvent('search', 'handler', searchInput);
			var filter=JSON.parse(localStorage.getItem('filter'));
			var values={source:app.config.source, map:map, address:searchInput, filter:filter, latitude:app.latitude, longitude:app.longitude};
			var msg=api.getLunchByAddress(values);
			if(typeof msg !== 'undefined'){
				sought.forEach(function(element, index, array){
					if(element==searchInput){
						sought.splice(index,1);
					}
				});
				sought.unshift(searchInput);
				localStorage.setItem('sought',sought.join('!__;__!'));
				console.log(msg);
				if(msg.list.length!=0){
					var valuesItem={lunchList:msg.list,map:map};
					view.attachLunches(valuesItem);
					
					$('.b_cards_item').off('click').on('click', setCurrent);
					
					app.firstEnter=false;
					map.setBounds([msg.coords.coordsTL, msg.coords.coordsBR]);
				}
				$(".p_main_search_close").click();
			}
		}
	}
	function clearHandler(){
		searchInput='';
	}
	// Получение адресов по крайним точкам карты
	function getLunchBySquareCoords(line){
		//console.log('line: '+line);
		if(searchInput==''){
			if(map.map.getZoom()>minZoom){
				var filter=JSON.parse(localStorage.getItem('filter'));
				var coords=map.map.getBounds();
				var latitude=(coords[0][0]+coords[1][0])/2;
				var longitude=(coords[0][1]+coords[1][1])/2;
				if(app.latitude==0 && app.longitude==0){
					app.latitude=latitude;
					app.longitude=longitude;
				}
				var values={
					coords: coords,
					latitude: app.latitude,
					longitude: app.longitude,
					panTo: app.firstEnter,
					source: app.config.source,
					map:map,
					filter:filter
				};
				
				//map.geolocation(values);
				
				var lunchList=api.getLunchBySquareCoords(values);
				if(app.firstMainTimeout!=0) window.clearTimeout(app.firstMainTimeout);
				app.firstMainTimeout=window.setTimeout(function(){onBoundsChange()},3000);
				var mainLunchesList=JSON.parse(localStorage.getItem('mainLunchesList'));
				var isChangeInList=false;
				var clearList=[];
				
				lunchList.forEach(function(element, index, array){
					if(mainLunchesList!==null && mainLunchesList[index]!==undefined){
						if(element.id*1!==mainLunchesList[index].id*1){
							isChangeInList=true;
						}
					}else{
						isChangeInList=true;
					}
					//lunchList[index].metr=222;//SQRT(POW((longitude*COS('.$coord[1].')-'.$coord[0].'*COS('.$coord[1].')),2)+POW((latitude-'.$coord[1].'),2))*10000*11.12 AS metr
				});
				
				if(mainLunchesList!==null){
					mainLunchesList.forEach(function(element, index, array){
						if(lunchList[index]===undefined){
							clearList.push(mainLunchesList[index]);
						}
					});
				}
				
				if(mainLunchesList===null || isChangeInList==true){
					localStorage.setItem('mainLunchesList',JSON.stringify(lunchList));
				}
				
				if(typeof lunchList !== 'undefined'){
					if(isChangeInList==true || app.firstEnter==true){
						var valuesItem={lunchList:lunchList,map:map};
						map.removeMarks(clearList);
						//localStorage.removeItem('mainLunchesList');
						view.attachLunches(valuesItem);
						
						$('.b_cards_item').off('click').on('click', setCurrent);
						
						app.firstEnter=false;
						app.useFilter=false;
					}
				}
			}else{
				map.removeAllMarks();
				localStorage.removeItem('mainLunchesList');
			}
		}
	}
	function getNearestLunches(){
		//console.log(map.map.getBounds());
		if(app.latitude!=0 && app.longitude!=0 && searchInput==''){
			var filter=JSON.parse(localStorage.getItem('filter'));
			var values={
				latitude: app.latitude,
				longitude: app.longitude,
				panTo: app.firstEnter,
				source: app.config.source,
				map:map,
				filter:filter
			};

			map.geolocation(values);
			
			var lunchList=api.getLunchByCoords(values);
			var mainLunchesList=JSON.parse(localStorage.getItem('mainLunchesList'));
			var isChangeInList=false;
			
			lunchList.forEach(function(element, index, array){
				if(mainLunchesList!==null && mainLunchesList[index]!==undefined){
					if(element.id*1!==mainLunchesList[index].id*1){
						isChangeInList=true;
					}
				}else{
					isChangeInList=true;
				}
			});
			
			if(mainLunchesList===null || isChangeInList==true){
				localStorage.setItem('mainLunchesList',JSON.stringify(lunchList));
			}
			
			if(typeof lunchList !== 'undefined'){
				if(isChangeInList==true || app.firstEnter==true){
					var valuesItem={lunchList:lunchList,map:map};
					view.attachLunches(valuesItem);
					
					$('.b_cards_item').off('click').on('click', setCurrent);
					
					app.firstEnter=false;
					app.useFilter=false;
				}
			}
		}
	}
	
	// Сохраняем выбранное кафе в LocalStorage
	function setCurrent() {
		localStorage.setItem('currentId',$(this).data('id'));
	}
	
	// Фильтр
	function submitFilter() {
		var formInput = app.f7.formToJSON('#filterForm');
		localStorage.setItem('filter',JSON.stringify(formInput));
		if($('.p_main_search_input').val()!=''){
			searchHandler();
		}
	}
	
	//Проверка на пустые значения
	function onBoundsChange(){
		//if(app.firstMainLoad){
			var x=0;
			$('#mainCardsList li').each(function(){
				x++;
			});
			if(x==0){
				$('.b_map_btn.m_zoomout').click();
			}else{
				app.firstMainLoad=false;
			}
		//}
	}
	return {
		init: init
	};
});