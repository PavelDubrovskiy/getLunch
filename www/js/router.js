define(function() {
	var $ = Framework7.$;

	/**
	 * Init router, that handle page events
	 */
    function init() {
		$(document).on('pageBeforeInit', function (e) {
			var page = e.detail.page;
			if(!$(page.container).hasClass('smart-select-page')) {
				load(page.name, page.query);
			}
		});
    }

	/**
	 * Load (or reload) controller from js code (another controller) - call it's init function
	 * @param controllerName
	 * @param query
	 */
	function load(controllerName, query) {
		require(['js/vc/'+ controllerName + '/' + controllerName + 'Controller'], function(controller) {
			controller.init(query);
		});
	}

	return {
        init: init,
		load: load
    };
});