define(function() {
	var $ = Framework7.$;
	
	function DynamicArea(values) {
		values = values || {};
		
		this.selector = values['selector'] || '.b_dynamic_area';
		this.minFontSize = values['minFontSize'] || 14;
		this.precision = values['precision'] || 0.1;
		this.afterInit = values['afterInit'] || function(){};
		
		this.element = $(this.selector);
		this.maxFontSize = this.fontSize = parseInt(this.element.css('font-size'));
		this.counter = 0;
		
		this.element.on('input', this.autoResize.bind(this));
		
		this.afterInit(this);
	}
	
	DynamicArea.prototype.autoResize = function(e, recursive) {
		if(e.target.scrollHeight !== e.target.offsetHeight) {
			if(this.fontSize > this.minFontSize){
				this.fontSize *= (1-this.precision);
				this.setFontSize(this.fontSize);
				if(recursive) {
					this.counter++;
				}
				if(this.counter > 9) {
					this.counter = 0;
					return;
				}
				this.autoResize(e, true);
			}
		}else{
			if(this.fontSize < this.maxFontSize){
				this.fontSize /= (1-this.precision);
				this.setFontSize(this.fontSize);
				this.autoResize(e, true);
			}
		}
	};
	
	DynamicArea.prototype.setFontSize = function(size) {
		this.element.css({
			'font-size': size + "px",
			'line-height': size + 2 + "px"
		});		
	};
	
	return DynamicArea;
});