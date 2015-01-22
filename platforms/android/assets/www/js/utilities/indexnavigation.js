define(function() {
	var $ = Framework7.$;
	
	function IndexNavigation(values) {
		var alphabet = '';
		var i;
		
		values = values || {};
		
		this.container = $(values['container'] || '.b_index-nav');
		this.scrollContainer = this.container.parents(values['scrollContainer'] || '.page-content');
		this.sections = this.container.find(values['sections'] || '.list-group-title');
		
		this.panel = $(document.createElement('div'));
		this.panel.addClass('b_index-nav_panel');
		this.container.append(this.panel);
		this.panelOffset = this.panel.offset().top - 44;
		
		for(i = 0; i < this.sections.length; i++) {
			$(this.sections[i]).attr('id', 'indexNavSection_' + i);
			alphabet += '<span class="b_index-nav_link" data-id="indexNavSection_' + i + '">' + $(this.sections[i]).text() + '</span>';
		}
		
		this.panel.append(alphabet);
		
		this.panel.on('touchmove', this.touchMove.bind(this));
		this.scrollContainer.on('scroll', this.fixPanelPosition.bind(this));
	}
	
	IndexNavigation.prototype.touchMove = function(e) {
		e.stopPropagation();
		var target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);
		if($(target).hasClass('b_index-nav_link')) {
			this.scrollContainer.scrollTop($('#'+$(target).data('id')).offset().top + this.scrollContainer.scrollTop());
		}		
	};
	
	IndexNavigation.prototype.fixPanelPosition = function(e) {
		var scroll = e.target.scrollTop;
		e.stopPropagation();		
		if(scroll > this.panelOffset) {
			this.panel.transform('translate3d(0,'+ (scroll - this.panelOffset) +'px,0)');
		}else{
			this.panel.transform('translate3d(0,0,0)');
		}
	};
	
	return IndexNavigation;
});