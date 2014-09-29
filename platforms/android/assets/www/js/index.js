var myMark;
var myCompasRowsCount=0;
function onSuccessHeading(heading) {
	if(jQuery.isNumeric(heading.magneticHeading)){
	    var deg=Math.abs(360-heading.magneticHeading);
	   	$('#compasRow').rotate(deg);
	    $('#headingInfo').text(heading.magneticHeading);
	    for(i=0;i<=myCompasRowsCount;i++){
	    	var degrees=deg*1+$('#compasRow'+i).attr('deg')*1;
	    	$('#compasRow'+i).rotate(degrees);
	    }
    }
};
function onErrorHeading(error) {
    alert('CompassError: ' + error.code);
};
var options = {
    frequency: 500
};
var onSuccessPosition = function(position){
	$.ajax({
		type: "POST",
		url: "http://test03.one-touch.ru/api/getLunchByCoords/",
		data: "longitude="+position.coords.longitude+"&latitude="+position.coords.latitude,
		success: function(msg){
			clearMap();
			setPoints(jQuery.parseJSON(msg));
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
			$('#coordsInfo').html(text);
		}
	});
};
function onErrorPosition(error) {

}
var watchID = navigator.geolocation.watchPosition(onSuccessPosition, onErrorPosition, {timeout: 5000, enableHighAccuracy: true});
$(document).ready(function(){
	//alert('ddddd');
});
function clearMap(){
	map.geoObjects.each(function(geoObject){
		map.geoObjects.remove(geoObject);
	});
	$('#lunchList table tbody').html('');
}
function setPoints(data){
	data.forEach(function(element, index, array){
		console.log(element);
		mark = new ymaps.Placemark([element.latitude,element.longitude], {
				balloonContent: '<h4>'+element.name+'</h4><br>'+element.address,
			},{
	            iconLayout: 'default#image',
	            iconImageHref: 'i/baloon.png',
	            iconImageSize: [52,74],
	            iconImageOffset: [-26, -37]
	        }
		);
		map.geoObjects.add(mark);
		//$('#lunchList ul').append('<li style="border-bottom: 1px solid #999999"><h4>'+element.name+'</h4>'+element.address+'<br><b>'+Math.round(element.metr)+' метров</b></li>');
		text='<tr>'+
			'<td><h4><a href="card.html?id='+element.id+'">'+element.name+'</a></h4>'+element.address+'<br><b>'+Math.round(element.metr)+' метров</b></td>'+
			'<td><img id="compasRow'+index+'" deg="'+element.deg+'" src="i/row.svg" style="width:50px;height:50px;">'+element.deg+'</td>'+
		'<tr>';
		myCompasRowsCount=index;
		$('#lunchList table tbody').append(text);
	});
}
function tryCoords(){
	clearMap();
	navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition);
}
function tryCompass(){
	navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	//onSuccessHeading({'magneticHeading':0});
}
setInterval(tryCompass, 100);