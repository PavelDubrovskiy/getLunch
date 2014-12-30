define(function() {
	var $ = Framework7.$;
		
	// ***** //
	// Карта //
	// ***** //
	function Map(values) {
		values = values || {};
		
		var _this = this;
		
		// Опции карты
		this.mapId = values['mapId'] || 'myMap';
		this.initCoords = values['initCoords'] || [55.76, 37.64];
		this.initZoom = values['initZoom'] || 15;
		this.duration = values['duration'] || 300;
		this.offset = values['offset'] || false;
		this.pointBoundsRange = values['pointBoundsRange'] || [0.002, 0.002];
		this.openBalloon = values['openBalloon'] || false;
		this.src = {
			active: 'i/svg/geotag.svg',
			inactive: 'i/svg/geotag_inactive.svg'
		}
		
		this.clusterBreakpoints = values['clusterBreakpoints'] || [99, 999];
		
		// Отступы от краёв карты и при автопозиционировании
		this.autoPanOffset = values['autoPanOffset'] || [0, 20, 5, 20];
		
		// Шаблон балуна
		this.balloonLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_balloon">' +
				/*'<i class="icon icon-cross b_map_balloon_close"></i>' +*/
				'<a href="card.html" data-id="{{ properties.id|raw }}" class="b_map_balloon_link_wrap">' + 
					'{{ properties.name|raw }}' +
					'<i class="icon icon-arrow-small-forward"></i>' +
				'</a>' +
				'<span class="b_map_balloon_arrow"></span>' +
			'</div>', {
				build: function () {
					this.constructor.superclass.build.call(this);
					
					this._$element = $(this.getParentElement()).find('.b_map_balloon');
					this._$element.find('.b_map_balloon_link_wrap').on('click', function(){
						localStorage.setItem('currentId',$(this).data('id'));
					});
					
					/*this._$element.find('.b_map_balloon_close')
						.on('click', $.proxy(this.onCloseClick, this));*/
				},
				
				clear: function () {
					/*this._$element.find('.b_map_balloon_close')
						.off('click');*/

					this.constructor.superclass.clear.call(this);
				},
				
				onCloseClick: function (e) {
					e.preventDefault();
					this.events.fire('userclose');
				},
				
				getPosition: function () {
					var offset = this._$element.offset();
					var offsetParent = this._$element.parent().offset();
					
					return {
						left: offset.left - offsetParent.left,
						top: offset.top - offsetParent.top
					};
				},
				
				getShape: function () {
					if(!this._isElement(this._$element)) {
						return this.constructor.superclass.getShape.call(this);
					}

					var position = this.getPosition();
					
					return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
						[position.left - _this.autoPanOffset[3], position.top - _this.autoPanOffset[0]], [
							position.left + this._$element[0].offsetWidth + _this.autoPanOffset[1],
							position.top + this._$element[0].offsetHeight + this._$element.find('.b_map_balloon_arrow')[0].offsetHeight + _this.autoPanOffset[2]
						]
					]));
				},
				
				_isElement: function (element) {
					return element && element[0] && element.find('.b_map_balloon_arrow')[0];
				}
			}
		);
		
		// Шаблон балуна кластера
		this.clusterBalloonLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_balloon">' +
				/*'<i class="icon icon-cross b_map_balloon_close"></i>' +*/
				'<div class="b_map_balloon_cnt">' +
					'<div class="b_map_balloon_wrap">' +
						'{% for geoObject in properties.geoObjects %}' +
							'<a class="b_map_balloon_link" href="card.html" data-id="{{geoObject.properties.id|raw }}">' +
								'<div class="b_map_balloon_link_tx">{{ geoObject.properties.name|raw }}</div>' +
								'<i class="icon icon-arrow-small-forward"></i>' +
							'</a>' +
						'{% endfor %}' +
					'</div>' +
				'</div>' +
				'<span class="b_map_balloon_arrow"></span>' +
			'</div>', {
				build: function () {
					var length = this.getData().object.properties.geoObjects.length;
					this.constructor.superclass.build.call(this);
					this._$element = $(this.getParentElement()).find('.b_map_balloon');	
					this._$element.find('.b_map_balloon_link').on('click', function(){
						localStorage.setItem('currentId',$(this).data('id'));
					});
					
					if(length > 1 && length <= _this.clusterBreakpoints[0]) {
						this._$element.addClass('m_normal');
					}
					if(length > _this.clusterBreakpoints[0] && length <= _this.clusterBreakpoints[1]) {
						this._$element.addClass('m_big');
					}
					if(length > _this.clusterBreakpoints[1]) {
						this._$element.addClass('m_huge');
					}
					
					/*this._$element.find('.b_map_balloon_close')
						.on('click', $.proxy(this.onCloseClick, this));*/
				},
				
				clear: function () {
					/*this._$element.find('.b_map_balloon_close')
						.off('click');*/

					this.constructor.superclass.clear.call(this);
				},
				
				onCloseClick: function (e) {
					e.preventDefault();
					this.events.fire('userclose');
				},
				
				getPosition: function () {
					var offset = this._$element.offset();
					var offsetParent = this._$element.parent().offset();
					
					return {
						left: offset.left - offsetParent.left,
						top: offset.top - offsetParent.top
					};
				},
				
				getShape: function () {
					if(!this._isElement(this._$element)) {
						return this.constructor.superclass.getShape.call(this);					
					}
					
					var position = this.getPosition();
					
					return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
						[position.left - _this.autoPanOffset[3], position.top - _this.autoPanOffset[0]],
						[position.left + this._$element[0].offsetWidth + _this.autoPanOffset[1],
						 position.top + this._$element[0].offsetHeight + this._$element.find('.b_map_balloon_arrow')[0].offsetHeight + _this.autoPanOffset[2]]
					]));
				},
				
				_isElement: function (element) {
					return element && element[0] && element.find('.b_map_balloon_arrow')[0];
				}
			}
		);
		
		// Шаблон контента метки кластера
		this.clusterIconContentLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_cluster">' +		
			'{{ properties.geoObjects.length }}' +
			'</div>', {
				build: function () {
					var length = this.getData().properties.geoObjects.length;
					this.constructor.superclass.build.call(this);
					this._$element = $(this.getParentElement()).find('.b_map_cluster');
					
					if(length > _this.clusterBreakpoints[0] && length <= _this.clusterBreakpoints[1]) {
						this._$element.addClass('m_big');
					}
					if(length > _this.clusterBreakpoints[1]) {
						this._$element.addClass('m_huge');
					}
				}
			}
		);

		// Шаблон метки пользователя
		this.umarkLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="b_map_umark"></div>'
		);
		
		this.objectManager = new ymaps.ObjectManager({
			clusterize: true,
			gridSize: 64,
			
			clusterIcons: [
				{
					href: this.src.active,
					size: [39, 60],
					offset: [-19.5, -54]
				},
				{
					href: this.src.active,
					size: [52, 80],
					offset: [-26, -72]
				},
				{
					href: this.src.active,
					size: [58, 90],
					offset: [-29.25, -81]
				}
			],
			clusterNumbers: [this.clusterBreakpoints[0], this.clusterBreakpoints[1]],
			clusterDisableClickZoom: true,
			clusterOpenBalloonOnClick: this.openBalloon,
			clusterHideIconOnBalloonOpen: false,
			clusterBalloonPanelMaxMapArea: 0,
			clusterIconContentLayout: this.clusterIconContentLayout,
			clusterBalloonLayout: this.clusterBalloonLayout,
			
			geoObjectIconLayout: 'default#image',
			geoObjectIconImageHref: this.src.active,
			geoObjectIconImageSize: [26, 40],
			geoObjectIconImageOffset: [-13, -36],
			
			geoObjectBalloonLayout: this.balloonLayout,
			geoObjectOpenBalloonOnClick: this.openBalloon,
			geoObjectHideIconOnBalloonOpen: false,
			geoObjectBalloonPanelMaxMapArea: 0
		});
		
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
			controls: [],
			behaviors: ["default"]
		},
		{
			minZoom: 3
		});
		
		this.projection = this.map.options.get('projection');
		
		// Подключаем менеджер объектов к карте
		this.map.geoObjects.add(this.objectManager);
		
		// Предотвращение двойного клика по карте
		this.map.behaviors.disable("dblClickZoom");
		
		// Обработчик изменения границ видимой области карты
		this.mapBoundsChangeHandler = this.map.events.group().add('boundschange', function(){
		});
		
		// Закрытие балуна
		this.objectManager.objects.events.add('click', function(e){
			e.originalEvent.currentTarget.balloon.close();
		});
		this.objectManager.clusters.events.add('click', function(e){
			e.originalEvent.currentTarget.balloon.close();
		});
	};

	// Навешивание обработчика событий  на изменение границ карты
	Map.prototype.boundsChange = function(handler) {
		this.mapBoundsChangeHandler.removeAll();
		this.mapBoundsChangeHandler = this.map.events.group().add('boundschange', handler, this);
	};

	// Создание меток из JSON и добавление их на карту
	Map.prototype.createMarks = function(marks) {
		this.objectManager.add({
			type: 'FeatureCollection',
			features: marks
		});
	};

	// Удаление меток по JSON
	Map.prototype.removeMarks = function(marks) {
		this.objectManager.remove({
			type: 'FeatureCollection',
			features: marks
		});
	};

	// Удаление всех меток
	Map.prototype.removeAllMarks = function() {
		this.objectManager.removeAll();
	};

	// Удаление метки с карты и из массива меток
	Map.prototype.removeMark = function(mark) {
		this.objectManager.remove(mark);
	};

	// Увеличение масштаба
	Map.prototype.zoomIn = function() {
		this.map.setZoom( this.map.getZoom() + 1, { duration: this.duration, checkZoomRange: true });
	};

	// Уменьшение масштаба
	Map.prototype.zoomOut = function() {
		this.map.setZoom( this.map.getZoom() - 1, { duration: this.duration, checkZoomRange: true });
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
			this.umark.events.add('click', this.autoPanUmark, this);
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

	// Позиционирование карты на заданные координаты
	Map.prototype.panTo = function(coords) {
		this.map.panTo( this.offset ? this.getOffset(coords) : coords, {
				checkZoomRange: true,
				duration: this.duration,
				delay: 0,
				flying: false
			}
		);
	};

	// Автопозиционирование карты
	Map.prototype.autoPan = function(e) {
		var object = this.objectManager.clusters.getById(e.get('objectId')) || this.objectManager.objects.getById(e.get('objectId'));
		var objectCoords = object ? object.geometry.coordinates : false;
		var coords = objectCoords ? objectCoords : e.get('target').geometry.getCoordinates();
		
		this.map.panTo(this.offset ? this.getOffset(coords) : coords, {
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

	// Установить границы карты
	Map.prototype.setBounds = function(bounds, duration) {
		var myBounds;
		if(typeof bounds[0] === 'object') {
			myBounds = bounds;
		}else{
			myBounds = [
				[bounds[0]*1 - this.pointBoundsRange[0], bounds[1]*1 - this.pointBoundsRange[1]],
				[bounds[0]*1 + this.pointBoundsRange[0], bounds[1]*1 + this.pointBoundsRange[1]]
			];
		}
		this.map.setBounds(myBounds, {
			zoomMargin: this.autoPanOffset,
			checkZoomRange: true,
			duration: (duration || 0)
		});
	};

	// Геолокация
	Map.prototype.geolocation = function (values) {
		this.setUserPosition([values.latitude, values.longitude], values.panTo);
	};
	
	return Map;
});