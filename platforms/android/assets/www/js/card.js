var myMark;
var id=param['id'];
var myCompasRowsCount=0;
var myPos, lunchPos, degrees;
function onSuccessHeading(heading) {
	if(jQuery.isNumeric(heading.magneticHeading)){
		var deg=Math.abs(360-heading.magneticHeading);
		$('#compasRow').rotate(deg);
	    if(degrees){
	   		$('#compasRowCard').rotate(deg*1+degrees*1);
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
	if(myMark)map.geoObjects.remove(myMark);
	myPos={
		latitude:position.coords.latitude,
		longitude:position.coords.longitude
	};
	map.panTo([position.coords.latitude, position.coords.longitude],{delay: 1000});
	myMark = new ymaps.Placemark([position.coords.latitude,position.coords.longitude], {},{
            iconLayout: 'default#image',
            iconImageHref: 'i/myloc.png',
            iconImageSize: [97,97],
            iconImageOffset: [-48, -48]
	});
	map.geoObjects.add(myMark);
	var metres=Math.round(Math.sqrt(Math.pow(lunchPos.longitude*Math.cos(myPos.latitude)-myPos.longitude*Math.cos(myPos.latitude),2)+Math.pow(lunchPos.latitude-myPos.latitude,2))*10000*11.12);
	$('#metres').text(metres);
	if(lunchPos.longitude>=myPos.longitude && lunchPos.latitude>=myPos.latitude){
		degrees=90+(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
	}else if(lunchPos.longitude<myPos.longitude && lunchPos.latitude>=myPos.latitude){
		degrees=90-(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
	}else if(lunchPos.longitude>=myPos.longitude && lunchPos.latitude<myPos.latitude){
		degrees=180-(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
	}else if(lunchPos.longitude<myPos.longitude && lunchPos.latitude<=myPos.latitude){
		degrees=180+(Math.acos(((myPos.latitude-lunchPos.latitude)*10000*11.12)/metres))*180/Math.PI;
	}
};
function onErrorPosition(error) {
	
}
var watchID = navigator.geolocation.watchPosition(onSuccessPosition, onErrorPosition, {timeout: 5000, enableHighAccuracy: true});

$(document).ready(function(){
	$.ajax({
		type: "POST",
		url: "http://test03.one-touch.ru/api/getLunch/",
		data: "id="+id,
		success: function(msg){
			setPage(jQuery.parseJSON(msg));
		}
	});
	function tryCoords(){
		clearMap();
		navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition);
	}
});
function setPage(data){
	//console.log(data);
	$('#name').text(data.name);
	$('#address').text(data.address);
	$('#time').html(data.lunchfrom+' &mdash; '+data.lunchto);
	$('#site').html('<a href="'+data.site+'">'+data.site+'</a>');
	$('#comment').html(data.comment);
	$('#buttonFriends').attr('href','friends.html?id='+data.id);
	lunchPos={
		latitude:data.latitude,
		longitude:data.longitude
	};
	mark = new ymaps.Placemark([data.latitude,data.longitude], {
			balloonContent: '<h4>'+data.name+'</h4><br>'+data.address,
		},{
            iconLayout: 'default#image',
            iconImageHref: 'i/baloon.png',
            iconImageSize: [52,74],
            iconImageOffset: [-26, -37]
        }
	);
	map.geoObjects.add(mark);
	data.menu.prices.forEach(function(element, index, array){
		text='<tr>'+
			'<td><b>'+element.name+'</b> <i>'+element.price+' р.</i><br>'+element.description+'</td>'+
		'<tr>';
		$('#menuList table tbody').append(text);
	});
	//'<td><img id="compasRowCard" deg="'+element.deg+'" src="i/row.svg" style="width:50px;height:50px;">'+element.deg+''+Math.round(element.metr)+' метров</td>'+
}
function tryCompass(){
	navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	//onSuccessHeading({'magneticHeading':0});
}
setInterval(tryCompass, 100);