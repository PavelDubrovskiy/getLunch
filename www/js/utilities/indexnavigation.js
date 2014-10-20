define(function() {
	var $ = Framework7.$;
	
	function IndexNavigation(values) {
		var panel = $(document.createElement('div'));
		var alphabet = '';
		var i = 0;
		
		values = values || {};
		
		this.container = $(values['container'] || '.b_index-nav');
		this.sections = this.container.find(values['sections'] || '.list-group-title');
		
		panel.addClass('b_index-nav_panel');
		this.container.append(panel);
		
		for(i = 0; i < this.sections.length; i++) {
			$(this.sections[i]).attr('id', 'indexNavSection_' + i);
			alphabet += '<span class="b_index-nav_link" data-id="indexNavSection_' + i + '">' + $(this.sections[i]).text() + '</span>';
		}
		
		panel.append(alphabet);
		
		//this.sections.on('touchmove', this.onTouchMove.bind(this));
	}
	
	IndexNavigation.prototype.onTouchMove = function(e) {
		console.log(e);
	};
	
	return IndexNavigation;
});