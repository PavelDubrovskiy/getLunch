define(["app", "js/vc/card/cardView", "js/utilities/forms", "js/utilities/map", "js/utilities/gallery", "js/utilities/api"], function(app, view, forms, Map, Gallery, Api) {
	var $ = Framework7.$;
	var api = new Api();
	var map = null;
	var gallery = null;
	var interval = null;
	var lunch = null;
	var externalSite = null;
	var mapFullscreen = false;
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
		},{
			element: '#externalSite',
			event: 'click',
			handler: externalSiteLoad
		},{
			element: '#callSomeone',
			event: 'click',
			handler: callSomeone
		}
	];
	document.addEventListener("backbutton", onBackButtonFire, false); 
	function onBackButtonFire(){
		app.mainView.loadPage('main.html');
	}
	// Инициализация страницы
	function init(query) {
		localStorage.setItem('soughtUrl', 'card.html');
		
		var values={latitude:app.latitude, longitude:app.longitude, source:app.config.source, id:localStorage.getItem("currentId")};
		
		if(localStorage.getItem('lunch'+localStorage.getItem("currentId"))===null){
			lunch=api.getLunch(values);
			localStorage.setItem('lunch'+localStorage.getItem("currentId"),JSON.stringify(lunch));
		}else{
			lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		}
		if(localStorage.getItem('lunchesArray')===null){
			var lunchesArray=[localStorage.getItem("currentId")];
		}else{
			var lunchesArray=JSON.parse(localStorage.getItem('lunchesArray'));
			lunchesArray.push(localStorage.getItem("currentId"));
		}
		app.GAPage('/restaurant/'+lunch.name+'/'+lunch.id+'/');
		localStorage.setItem('lunchesArray',JSON.stringify(lunchesArray));
		lunch.metres=getDistance();		
		lunch.mainSource=app.config.source;
		externalSite=lunch.site;
		$('.m_card_reducemap').css('visibility','hidden');
		view.render({
			bindings: bindings,
			card:lunch
		});
		
		map = new Map({
			mapId: 'cardMap',
			initZoom: 17, offset: {top: 13, left: 0},
			autoPanOffset: [20, 0, 0, 40]
		});
		//map.map.events.add('click', function(e){
		$('#cardMap').click(function(){
			controlReduceMap();
		});
		if(mapFullscreen){
			view.expandMap(map);
		}
		
		initMap();
		
		gallery = new Gallery({wrapper: '.b_gallery', items: 'a'});
		//window.clearInterval(app.intervalCompass);
		//app.intervalCompass=window.setInterval(tryCompass, 100);
	}
	
	// Получение расстояния между пользователем и кафе
	function getDistance() {
		return Math.round(Math.sqrt(Math.pow(lunch.longitude*Math.cos(app.latitude)-app.longitude*Math.cos(app.latitude),2)+Math.pow(lunch.latitude-app.latitude,2))*10000*11.12);
	}
	
	// Инициализация карты
	function initMap() {
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		map.objectManager.events.add('mouseenter', app.disablePanel);
		map.objectManager.events.add('mouseleave', app.enablePanel);
		
		map.createMarks([{
			type: 'Feature',
			id: lunch.id,
			properties: {
				name: lunch.name,
				inactive: (lunch.inactive === 'st_inactive' ? true : false),
				id: lunch.id
			},
			geometry: {
				type: 'Point',
				coordinates: [lunch.latitude, lunch.longitude]
			},
			options: {
				iconImageHref: lunch.inactive === 'st_inactive' ? 'i/svg/geotag_inactive.svg' :'i/svg/geotag.svg'
			}
		}]);

		if(lunch.longitude>app.longitude){
			map.setBounds([
				[lunch.latitude, app.longitude],
				[app.latitude, lunch.longitude]
			]);
		}else{
			map.setBounds([
				[lunch.latitude, lunch.longitude],
				[app.latitude, app.longitude]
			]);
		}
		map.setUserPosition([app.latitude, app.longitude]);

		createWay('masstransit');
		
		//Управление картой		
		$('.b_map_btn.m_card_zoomin').click(function(){map.zoomIn()});
		$('.b_map_btn.m_card_zoomout').click(function(){map.zoomOut()});
		$('.b_map_btn.m_card_geolocation').click(function(){findMe();});
		$('.m_card_masstransit').click(function(){
			$('.m_card_auto').removeClass('st_checked');
			$('.m_card_masstransit').addClass('st_checked');
			$('.m_card_navigator').addClass('st_hidden');
			createWay('masstransit');			
		});
		$('.m_card_auto').click(function(){
			$('.m_card_masstransit').removeClass('st_checked');
			$('.m_card_auto').addClass('st_checked');
			$('.m_card_navigator').removeClass('st_hidden');
			createWay('auto');			
		});
		$('.m_card_navigator').click(function(){
			try{
				if( device.platform == 'android' || device.platform == 'Android'){
					navigator.startApp.set({
							"action":"ru.yandex.yandexnavi.action.BUILD_ROUTE_ON_MAP"
						}, {
							'lat_from':app.latitude,
							'lon_from':app.longitude,
							'lat_to':lunch.latitude,
							'lon_to':lunch.longitude
						}
					).start();
				}else{
					navigator.startApp.set("yandexnavi://build_route_on_map?lat_from="+app.latitude+"&lon_from="+app.longitude+"&lat_to="+lunch.latitude+"&lon_to="+lunch.longitude+"").start();
				}
			}catch(e){console.log(e);}
			
		});
		$('.m_card_reducemap').click(function(){
			controlReduceMap();
		});
		
	}
			
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState(this);
	}
	function tryCompass(){
		//navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	}
	function externalSiteLoad(){
		console.log('externalSiteLoad ('+externalSite+');');
		app.GAEvent('restaurant_link', 'click', lunch.name+' - '+lunch.id);
		if(externalSite!==null && externalSite!=''){
			if( navigator.app ){
			    navigator.app.loadUrl('http://'+externalSite.replace('http://',''), {openExternal:true});
			}else{
			    window.open('http://'+externalSite.replace('http://',''), "_system" );
			}			
		}
	}
	function callSomeone(){
		try{
			navigator.startApp.start([["action", "CALL"], ["tel:"+lunch.phone]]);
		}catch(e){console.log(e);}
	}
	function findMe() {
		app.GAEvent('map', 'click', 'target');
		map.setUserPosition([app.latitude, app.longitude], true);
	}
	function createWay(routingMode){
		var routingMode=routingMode;
		if(app.cardMultiRoute!='') map.map.geoObjects.remove(app.cardMultiRoute);
		app.cardMultiRoute = new ymaps.multiRouter.MultiRoute({
	        referencePoints: [
	            [app.latitude, app.longitude],
	            [lunch.latitude, lunch.longitude]
	        ],
	        params: {
	            routingMode: routingMode
	        }
	    }, {
	        boundsAutoApply: true,
	    });
		map.map.geoObjects.add(app.cardMultiRoute);
	}
	function controlReduceMap(){
		if(!mapFullscreen){
			$('.navbar').hide();
			$('#lunchPage').css('padding-top','0');
			view.expandMap(map);
			mapFullscreen = true;
			$('.b_compass').css('top','8px');
			$('.m_card_auto').removeClass('st_hidden');
			$('.m_card_masstransit').removeClass('st_hidden');
			$('.b_map_btn.m_card_zoomin').removeClass('st_hidden');
			$('.b_map_btn.m_card_zoomout').removeClass('st_hidden');
			$('.b_map_btn.m_card_geolocation').removeClass('st_hidden');
			$('.m_card_reducemap').removeClass('st_hidden');
			if($('.m_card_auto').hasClass('st_checked')){
				$('.m_card_navigator').removeClass('st_hidden');
				createWay('auto');
			}else{
				createWay('masstransit');
			}			
		}else{
			$('#lunchPage').css('padding-top','44px');
			$('.navbar').show();
			view.reduceMap(map);
			mapFullscreen = false;
			$('.b_compass').css('top','47px');
			$('.m_card_auto').addClass('st_hidden');
			$('.m_card_masstransit').addClass('st_hidden');
			$('.b_map_btn.m_card_zoomin').addClass('st_hidden');
			$('.b_map_btn.m_card_zoomout').addClass('st_hidden');
			$('.b_map_btn.m_card_geolocation').addClass('st_hidden');
			$('.m_card_navigator').addClass('st_hidden');
			$('.m_card_reducemap').addClass('st_hidden');
			if(lunch.longitude>app.longitude){
				map.setBounds([
					[lunch.latitude, app.longitude],
					[app.latitude, lunch.longitude]
				]);
			}else{
				map.setBounds([
					[lunch.latitude, lunch.longitude],
					[app.latitude, app.longitude]
				]);
			}
		}
	}
	return {
		init: init
	};
});