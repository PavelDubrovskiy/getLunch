define(["app"], function(app) {
	var $ = Framework7.$;
	
	function Gallery(values) {
		values = values || {};
				
		this.wrapper = $( values.wrapper );
		this.items = this.wrapper.find( values.items );
		this.length = this.items.length;
		this.zoom = values.zoom || true;
		this.minZoom = values.minZoom || 1;
		this.maxZoom = values.maxZoom || 3;
		
		
		this.photos = [];
		for( i = 0; i < this.items.length; i++ ) {
			this.photos.push($(this.items[i]).attr('href'));
		}
		
		this.photoBrowser = app.f7.photoBrowser({
			zoom: this.zoom,
			minZoom: this.minZoom,
			maxZoom: this.maxZoom,
			photos: this.photos,
			onOpen: (function(pb) {
				$(".photo-browser-current").text( pb.openIndex + 1 );
				$(".photo-browser-total").text( this.length );
			}).bind(this),
			toolbar: false,
			exposition: false,
			
			navbarTemplate: '<div class="navbar navbar-photobrowser">' +
								'<div class="navbar-inner">' +
									'<div class="left sliding"></div>' +
									'<div class="center sliding"><span class="photo-browser-current"></span><span class="photo-browser-of">/</span><span class="photo-browser-total"></span></div>' +
									'<div class="right"><a href="#" class="link icon-only close-popup photo-browser-close-link" data-popup=".photo-browser-popup"><i class="icon icon-cross"></i></a></div>' +
								'</div>' +
							'</div>'
		});
		
		this.wrapper.on("click", this.items, this.open.bind(this));
	}
	
	Gallery.prototype.open = function(e) {
		this.photoBrowser.open( $(e.target).parent().index() );
		return false;
	};
	
	return Gallery;
});