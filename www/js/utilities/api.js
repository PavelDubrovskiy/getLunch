define(function() {
	var $ = Framework7.$;
	function Api(values) {
		values = values || {};		
	}
	Api.prototype.getLunchByCoords = function(values) {
		var values = values || {};
		var lunchList={};
		$.ajax({
			type: "POST",
			async: false,
			url: values.source+"/api/getLunchByCoords/",
			data: "longitude="+values.longitude+"&latitude="+values.latitude+"&app=true",
			success: function(msg){
				lunchList=JSON.parse(msg);
				
				/*setPoints(jQuery.parseJSON(msg));
				
				map.panTo([position.coords.latitude, position.coords.longitude],{delay: 1000});
				myMark = new ymaps.Placemark([position.coords.latitude,position.coords.longitude], {},{
			            iconLayout: 'default#image',
			            iconImageHref: 'i/myloc.png',
			            iconImageSize: [97,97],
			            iconImageOffset: [-48, -48]
				});
				map.geoObjects.add(myMark);
			    text= 'Latitude: '          + position.coords.latitude          + '<br>' +
			          'Longitude: '         + position.coords.longitude         + '<br>';
				$('#coordsInfo').html(text);*/
			}
		});
		return lunchList;
	}
	return Api;
});