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
		}
	];
	
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
		
		map = new Map({ mapId: 'cardMap', initZoom: 17, offset: {top: 13, left: 0} });
		
		initMap({latitude:lunch.latitude,longitude:lunch.longitude});
		
		gallery = new Gallery({wrapper: '.b_gallery', items: 'a'});
		window.clearInterval(app.intervalCompass);
		app.intervalCompass=window.setInterval(tryCompass, 100);
	}
	
	// Получение расстояния между пользователем и кафе
	function getDistance() {
		return Math.round(Math.sqrt(Math.pow(lunch.longitude*Math.cos(app.latitude)-app.longitude*Math.cos(app.latitude),2)+Math.pow(lunch.latitude-app.latitude,2))*10000*11.12);
	}
	
	// Инициализация карты
	function initMap(values) {
		// Предотвращение открытия меню по свайпу при перетаскивании карты
		map.map.events.add('mouseenter', app.disablePanel);
		map.map.events.add('mouseleave', app.enablePanel);
		
		// Если расстояние от пользователя до кафе меньше 700 метров, показываем карту так, чтобы вместить точку пользователя и точку кафе, иначе показываем только кафе
		if( lunch.metres < 700 ) {
			map.createMark([values.latitude, values.longitude], 'card.html');
			map.setUserPosition([app.latitude, app.longitude]);
			map.autoBoundsUser();
		}else{
			map.map.setCenter(
				map.getOffset( // Получаем координаты со сдвигом, заданным при инициализации карты
					map.createMark([values.latitude, values.longitude], 'card.html').geometry.getCoordinates()
				)
			);
			map.setUserPosition([app.latitude, app.longitude]);
		}		
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
	return {
		init: init
	};
});