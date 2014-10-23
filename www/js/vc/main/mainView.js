define(["app", "js/utilities/common"], function( app, utilities ) {
	var $ = Framework7.$;
	var $cnt = $(".page-content");
	var $map = $(".b_map");
	var fullscreen = false;

	function render(params) {
		utilities.bindEvents(params.bindings);
		
		$(".page-main").on("pageBeforeAnimation", function() {
			if( checkSearchOpened() === true ) {
				app.mainView.hideNavbar();
			}
		});
	}
	
	// Переключение размера карты
	function toggleMapSize( e ) {
		fullscreen = !fullscreen;		
		$cnt.scrollTop(0);
		
		if( fullscreen === true ){
			$cnt.toggleClass("st_map_fullscreen");
			e.originalEvent.map.container.fitToViewport(true);
			$cnt.toggleClass("st_cards_list_hidden");
		}else{
			$cnt.toggleClass("st_cards_list_hidden");
			setTimeout( function(){
				$cnt.toggleClass("st_map_fullscreen");
				e.originalEvent.map.container.fitToViewport(true);				
			}, 400);
		}
	}
	
	// Показать поиск
	function openSearch() {
		var sought=[];
		if(localStorage.getItem('sought')!==null){
			sought=localStorage.getItem('sought').split('!__;__!');
		}
		var html='',
			template = $('#soughtItem').html();
		var soughtTemplate = Template7.compile(template);
		sought.forEach(function(element, index, array){
			html+=soughtTemplate(element);
		});
		$('#soughtList').html(html);
		app.mainView.hideNavbar();
		$(".p_main_search_input").focus();
	}
	
	// Скрыть поиск
	function closeSearch() {
		app.mainView.showNavbar();
	}
	
	// Проверить, открыт ли поиск
	function checkSearchOpened() {
		if( $(".searchbar-popup.modal-in").length ) {
			return true;
		}
		return false;
	}
	
	// Триггер нажатия на кнопку скрытия поиска
	function closeSearchClick() {
		$(".p_main_search_close").click();
	}
	
	// Удалить оверлей попапа
	function removePopupOverlay() {
		$(".popup-overlay").remove();
	}
	function attachLunches(values){
		var html='',
			template = $('#lunchItem').html(),
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		var compiledTemplate = Template7.compile(template);
		
		values.lunchList.forEach(function(element, index, array){
			values.map.createMark([element.latitude*1,element.longitude*1], 'card.html', element.name);
			element.metr=Math.round(element.metr);
			element.inactive='';
			element.inactiveText='';
			if(element.lunchfrom>fer){
				element.inactive='st_inactive';
				element.inactiveText='Время ланча не началось';
			}else if(fer>element.lunchto){
				element.inactive='st_inactive';
				element.inactiveText='Закончилось время ланча';
			}
			html+=compiledTemplate(element);
		});
		$('#mainCardsList').html(html);
	}
	function attachSearch(values){
		var html='',
			template = $('#lunchItem').html(),
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		var compiledTemplate = Template7.compile(template);
		
		values.lunchList.forEach(function(element, index, array){
			values.map.createMark([element.latitude*1,element.longitude*1], 'card.html', element.name);
			element.metr=Math.round(element.metr);
			element.inactive='';
			element.inactiveText='';
			if(element.lunchfrom>fer){
				element.inactive='st_inactive';
				element.inactiveText='Время ланча не началось';
			}else if(fer>element.lunchto){
				element.inactive='st_inactive';
				element.inactiveText='Закончилось время ланча';
			}
			html+=compiledTemplate(element);
		});
		$('#mainCardsList').html(html);
	}
	return {
		render: render,
		toggleMapSize: toggleMapSize,
		openSearch: openSearch,
		closeSearch: closeSearch,
		closeSearchClick: closeSearchClick,
		removePopupOverlay: removePopupOverlay,
		toggleFavouriteState: utilities.toggleFavouriteState,
		attachLunches: attachLunches
	};
});