// Compass by Pavel
//var watchID= navigator.compass.watchHeading(onSuccessHeading, onErrorHeading,options);
function onSuccessHeading(heading) {
    //alert('Heading: ' + heading.magneticHeading);
    var now=Math.abs(360-heading.magneticHeading);
   	$('#compasRow').css({'-webkit-transform':'rotate('+now+'deg)','-moz-transform':'rotate('+now+'deg)','-ms-transform':'rotate('+now+'deg)','-o-transform':'rotate('+now+'deg)','transform':'rotate('+now+'deg)'});
    $('#heading').text(heading.magneticHeading);
};
function onErrorHeading(error) {
    alert('CompassError: ' + error.code);
};
var options = {
    frequency: 500
};



// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccessPosition = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onErrorPosition(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function tryAll(){
	navigator.compass.getCurrentHeading(onSuccessHeading, onErrorHeading);
	//navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition);
}

$(document).ready(function(){
	//alert('ddddd');
});
setInterval(tryAll, 100);