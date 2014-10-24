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
			}
		});
		return lunchList;
	}
	Api.prototype.getLunchByAddress = function(values) {
		var values = values || {};
		var lunchList={};
		$.ajax({
			type: "POST",
			async: false,
			url: values.source+"/api/getLunchByAddress/",
			data: "q="+values.address+"&app=true",
			success: function(msg){
				lunchList=JSON.parse(msg);
			}
		});
		return lunchList;
	}
	Api.prototype.getLunch = function(values) {
		var values = values || {};
		var lunch={};
		$.ajax({
			type: "POST",
			async: false,
			url: values.source+"/api/getLunch/",
			data: "id="+values.id+"&app=true",
			success: function(msg){
				lunch=JSON.parse(msg);
			}
		});
		return lunch;
	}
	return Api;
});