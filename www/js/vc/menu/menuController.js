define(["app","js/vc/menu/menuView"], function(app, view) {
	var $ = Framework7.$;
	var currentDayIndex = getCurrentDay();
	var daysSlider = null;
	var $days = null;
	var bindings = [
	];

	function init(query) {
		lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		app.GAPage('/restaurant/'+lunch.name+'/'+lunch.id+'/menu/');
		view.render({
			bindings: bindings,
			menu:lunch.menu
		});
		initMenu();
	}
	
	function initMenu() {
		var imagesSlider = [];
		
		$days = $('.b_menu_pagination .b_btn');
		
		// Создаём слайдер дней и устанавливаем на текущий день
		daysSlider = app.f7.swiper('.p_menu_days', {
			initialSlide: currentDayIndex,
			onSlideChangeStart: setActiveDay
		});
		setActiveDay({activeIndex: currentDayIndex});
	
		// Создаём слайдеры изображений
		for( var i = 0; i < 5; i++ ){
			imagesSlider.push(app.f7.swiper('.p_menu_images-'+(i+1), {
				pagination:'.swiper-pagination-'+(i+1),
				paginationHide: false
			}));
		}
		
		// Вешаем клик на дни недели
		$days.on("click", daysClickHandler);
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
		$days.removeClass("st_active").eq(slider.activeIndex).addClass("st_active");
	}
	
	// Переход на нужный день по тапу
	function daysClickHandler() {
		daysSlider.slideTo( $(this).index(), 400 );
	}
	
	return {
		init: init
	};
});