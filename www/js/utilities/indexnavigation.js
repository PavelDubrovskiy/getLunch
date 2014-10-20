define(function() {
	var $ = Framework7.$;
	
	function IndexNavigation(values) {
		values = values || {};
		
		this.container = $(values['container'] || '.b_index-nav');
		this.sections = this.container.find(values['sections'] || '.list-group-title');
		
		var panel = $(document.createElement('div'));
		panel.addClass('b_index-nav_panel');
		this.container.append(panel);
		
		this.sections.each(function() {
			console.log(panel);
			panel.append($(this).text());
		});
		
		console.log(this.container);
		
		//this.sections.on('touchmove', this.onTouchMove.bind(this));
	}
	
	IndexNavigation.prototype.onTouchMove = function(e) {
		console.log(e);
	};
	
	return IndexNavigation;
});