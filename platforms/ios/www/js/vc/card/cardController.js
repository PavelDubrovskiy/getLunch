define(["app", "js/vc/card/cardView", "js/utilities/forms", "js/utilities/map", "js/utilities/gallery", "js/utilities/api"], function(app, view, forms, Map, Gallery, Api) {
	var $ = Framework7.$;
	var api = new Api();
	var map = null;
	var gallery = null;
	var interval = null;
	var lunch = null;
	var externalSite = null;
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
		var values={latitude:app.latitude, longitude:app.longitude, source:app.config.source, id:localStorage.getItem("currentId")};
		
		if(localStorage.getItem('lunch'+localStorage.getItem("currentId"))===null){
			lunch=api.getLunch(values);
			localStorage.setItem('lunch'+localStorage.getItem("currentId"),JSON.stringify(lunch));
		}else{
			lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		}
		lunch.metres=getDistance();		
		lunch.mainSource=app.config.source;
		externalSite=lunch.site;
		view.render({
			bindings: bindings,
			card:lunch
		});
		
		map = new Map({
			mapId: 'cardMap',
			initZoom: 17, offset: {top: 13, left: 0},
			autoPanOffset: [20, 0, 0, 40]
		});
		
		map.map.events.add('click', function(e){
			if(!app.mapFullscreen){
				view.expandMap(e);
				app.mapFullscreen = true;
			}else{
				view.reduceMap(e);
				app.mapFullscreen = false;
			}
		});
		
		if(app.mapFullscreen){
			view.expandMap(map);
		}
		
		initMap(lunch);
		
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
		
		// Если расстояние от пользователя до кафе меньше 700 метров, показываем карту так, чтобы вместить точку пользователя и точку кафе, иначе показываем только кафе
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
		/*console.log('lunch.latitude='+lunch.latitude+' lunch.longitude='+lunch.longitude);
		console.log('app.latitude='+app.latitude+' app.longitude='+app.longitude);*/
		
		//if( lunch.metres < 450 ) {
			//map.autoBoundsUser();
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
		/*}else{
			map.map.setCenter(
				map.getOffset(
					[lunch.latitude, lunch.longitude]
				)
			);
			map.setUserPosition([app.latitude, app.longitude]);
		}*/		
	}
			
	// Функция управления избранным
	function toggleFavouriteState() {
		view.toggleFavouriteState(this);
	}
	function tryCompass(){
		//navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	}
	function externalSiteLoad(){
		if(externalSite!==null && externalSite!=''){
			navigator.app.loadUrl('http://'+externalSite, {openExternal:true});
		}
	}
	function callSomeone(){
		/*var msg = Ext.Msg.confirm('Please Confirm','Are you sure you want to make a phone call?',
		function(r){*/
			//if (r == 'yes'){
				if (Ext.is.Android){
					console.log('document.location.href = tel:'+lunch.phone+';');
					document.location.href = 'tel:'+lunch.phone;
				} else { // we assume the device is running iOS
					console.log('window.plugins.phoneDialer.dial('+lunch.phone+');');
					window.plugins.phoneDialer.dial(lunch.phone);
				}
			//}
		//});
	}
	return {
		init: init
	};
});