define(["app","js/vc/filter/filterView"], function(app, view) {
	var $ = Framework7.$;
	var $days = $('.b_menu_pagination .b_btn');
	var currentDayIndex = getCurrentDay();
	var bindings = [
	];

	function init(query) {
		initMenu();
		
		view.render({
			bindings: bindings
		});
	}
	
	function initMenu() {
		var imagesSlider = [];
		// Создаём слайдер дней и устанавливаем на текущий день
		var daysSlider = app.f7.slider('.p_menu_days', {
			initialSlide: currentDayIndex,
			onSlideChangeEnd: setActiveDay
		});
		setActiveDay({activeSlideIndex: currentDayIndex});
	
		// Создаём слайдеры изображений
		for( var i = 0; i < 5; i++ ){
			imagesSlider.push(app.f7.slider('.p_menu_images-'+(i+1), {
				pagination:'.slider-pagination-'+(i+1),
				paginationHide: false
			}));
		}
	}
	
	
	// Получаем текущий день из текущей даты
	function getCurrentDay() {
		var date = new Date(),
			res
		;
		
		switch( date.getDay() ){
			case 2:
				res = 1;
				break;
			case 3:
				res = 2;
				break;
			case 4:
				res = 3;
				break;
			case 5:
				res = 4;
				break;
			case 0:
			case 1:
			case 6:
			default:
				res = 0;
		}
		
		return res;
	}
	
	// Устанавливаем активный день
	function setActiveDay(slider) {
		$days.removeClass("st_active").eq(slider.activeSlideIndex).addClass("st_active");
	}
	
	return {
		init: init
	};
});