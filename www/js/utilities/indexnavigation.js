define(function() {
	var $ = Framework7.$;
	
	function IndexNavigation(values) {
		values = values || {};
		
		this.selector = values['selector'] || '.b_index-navigation';		
		this.list = $(this.selector);
		
		this.list.on('touchmove', this.onTouchMove.bind(this));
	}
	
	IndexNavigation.prototype.onTouchMove = function(e) {
		console.log(e);
	};
	
	return IndexNavigation;
});