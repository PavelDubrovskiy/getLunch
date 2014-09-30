define(["app", "js/utilities/common"], function( app, utilities ) {
	var $$ = Framework7.$;
	var $cnt = $$(".page-content");
	var $map = $$(".b_map");
	var fullscreen = false;

	function render(params) {
		utilities.bindEvents(params.bindings);
		
		$$(".page-main").on("pageBeforeAnimation", function() {
			if( checkSearchOpened() === true ) {
				app.mainView.hideNavbar();
			}else{
				app.mainView.showNavbar();
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
		app.mainView.hideNavbar();
		$$(".p_main_search_input").focus();
	}
	
	// Скрыть поиск
	function closeSearch() {
		app.mainView.showNavbar();
	}
	
	// Проверить, открыт ли поиск
	function checkSearchOpened() {
		if( $$(".searchbar-popup.modal-in").length ) {
			return true;
		}
		return false;
	}
	
	// Триггер нажатия на кнопку скрытия поиска
	function closeSearchClick() {
		$$(".p_main_search_close").click();
	}
	
	// Удалить оверлей попапа
	function removePopupOverlay() {
		$$(".popup-overlay").remove();
	}

	return {
		render: render,
		toggleMapSize: toggleMapSize,
		openSearch: openSearch,
		closeSearch: closeSearch,
		closeSearchClick: closeSearchClick,
		removePopupOverlay: removePopupOverlay,
		toggleFavouriteState: utilities.toggleFavouriteState
	};
});