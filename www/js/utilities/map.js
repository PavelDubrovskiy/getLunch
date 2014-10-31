define(function() {
	var $ = Framework7.$;
	
	function Map(values) {
		values = values || {};
		
		// Шаблон балуна
		this.balloonLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_balloon">' +
				'<a href="$[properties.link]" data-id="$[properties.id]" class="b_map_balloon_link">' + 
					'$[properties.name]' + 
					'<i class="icon icon-arrow-small-forward"></i>' +
				'</a>' +
				'<span class="b_map_balloon_arrow"></span>' +
			'</div>', {
				build: function () {
                    this.constructor.superclass.build.call(this);
					
                    this._$element = $(this.getParentElement()).find('.b_map_balloon');
					this._$element.find('.b_map_balloon_link').on('click', function(){
						localStorage.setItem('currentId',$(this).data('id'));
					});
				}
			}
		);
	
		// Шаблон метки пользователя
		this.umarkLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_umark"></div>'
		);
		
		// Опции карты
		this.mapId = values['mapId'] || 'myMap';
		this.initCoords = values['initCoords'] || [55.76, 37.64];
		this.initZoom = values['initZoom'] || 15;
		this.duration = values['duration'] || 300;
		this.offset = values['offset'] || false;
		
		// Коллекция меток
		this.marks = new ymaps.GeoObjectCollection();
		
		// Метка пользователя
		this.umark = null;
		
		// Карта
		this.initMap();
	}
	
	// Инициализация карты
	Map.prototype.initMap = function() {
		// Создание карты
		this.map = new ymaps.Map(this.mapId, {
			center: this.initCoords,
			zoom: this.initZoom,
			controls: []
		},
		{
			minZoom: 3
		});
		this.projection = this.map.options.get('projection');
		
		// Предотвращение двойного клика по карте
		this.map.behaviors.disable("dblClickZoom");
		
		// Автопозиционирование карты при открытии балуна
		this.map.geoObjects.events.add('balloonopen', this.autoPan.bind(this) );
	};
	
	// Создание метки по заданным координатам
	// и добавление её в массив меток
	Map.prototype.createMark = function(coord, values) {
		var mark = new ymaps.Placemark(coord, {
				link: values.link || "card.html",
				name: values.name || "Кафе",
				inactive: values.inactive || false,
				id: values.id || 0
			},{
				iconLayout: 'default#image',
				iconImageHref: !values.inactive ? 'i/svg/geotag.svg' : 'i/svg/geotag_inactive.svg',
				iconImageSize: [26, 40],
				iconImageOffset: [-13, -36],
				
				balloonShadow: false,
				balloonLayout: this.balloonLayout,
				balloonCloseButton: false,
				hideIconOnBalloonOpen: false,
				openBalloonOnClick: values.name ? true : false,
				balloonPanelMaxMapArea: 0
			}
		);
		
		this.marks.add(mark);
		this.map.geoObjects.add(this.marks);
		
		if(!values.name) {
			mark.events.add('click', this.autoPan.bind(this));
		}
		
		return mark;
	};
	
	// Изменение режима отображения метки
	Map.prototype.changeMarkState = function(mark, active) {
		if(!active || active === "inactive") {
			mark.options.set('iconImageHref', 'i/svg/geotag_inactive.svg');
		}else{
			mark.options.set('iconImageHref', 'i/svg/geotag.svg');
		}
	};
	
	// Удаление метки с карты и из массива меток
	Map.prototype.removeMark = function(mark) {
		this.marks.remove(mark);
	};
	
	// Увеличение масштаба
	Map.prototype.zoomIn = function() {
		this.map.setZoom( this.map.getZoom() + 1, { duration: 0, checkZoomRange: true });
	};
	
	// Уменьшение масштаба
	Map.prototype.zoomOut = function() {
		this.map.setZoom( this.map.getZoom() - 1, { duration: 0, checkZoomRange: true });		
	};
	
	// Задать позицию метки пользователя
	// Параметр panTo (Boolean) задаёт, будет ли осуществлёно автопозиционирование карты
	Map.prototype.setUserPosition = function(coord, panTo) {
		if( this.umark === null ) {
			this.umark = new ymaps.Placemark(coord, {
				},{
					iconLayout: this.umarkLayout,
					iconShape: {
						type: 'Circle',
						coordinates: [0, 0],
						radius: 25
					}
				}
			);
			this.map.geoObjects.add( this.umark );
			this.umark.events.add('click', this.autoPanUmark.bind(this));
		}else{
			this.umark.geometry.setCoordinates(coord);
		}
		
		if( panTo === true ){
			this.umark.events.fire('click');
		}
	};
	
	// Вычисление смещения в географических координатах
	Map.prototype.getOffset = function( coords ) {
		var zoom = this.map.getZoom();
		var pxCoords = this.projection.toGlobalPixels(
			coords,
			zoom
		);
		
		pxCoords[0] = pxCoords[0] - this.offset.left;
		pxCoords[1] = pxCoords[1] - this.offset.top;
		
		return this.projection.fromGlobalPixels(
			pxCoords,
			zoom
		);
	};
	
	// Автопозиционирование карты
	Map.prototype.autoPan = function(e) {
		var coords = e.get('target').geometry.getCoordinates();
		
		this.map.panTo( this.offset ? this.getOffset( coords ) : coords, {
			checkZoomRange: true,
			duration: this.duration,
			delay: 0,
			flying: false
		});
	};
	
	// Автопозиционирование карты на точке пользователя
	Map.prototype.autoPanUmark = function(e) {
		this.autoPan(e);
		this.map.balloon.close();
	};
	
	// Автопозиционирование карты для показа всех добавленных точек
	Map.prototype.autoBounds = function(duration) {
		this.map.setBounds( this.marks.getBounds(), {zoomMargin: [48, 21, 8, 21], checkZoomRange: true, duration: (duration || 0) });
	};
	
	// Автопозиционирование карты для показа всех добавленных точек и пользователя
	Map.prototype.autoBoundsUser = function(duration) {
		this.map.setBounds( this.map.geoObjects.getBounds(), {zoomMargin: [28, 21, 8, 21], checkZoomRange: true, duration: (duration || 0) });
	};
	
	// Геолокация
	Map.prototype.geolocation = function (values) {
		this.setUserPosition([values.latitude, values.longitude], values.panTo);
	}
	
	return Map;
});