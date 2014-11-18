define(function() {
	var $ = Framework7.$;
	function Api(values) {
		values = values || {};		
	}
	Api.prototype.getLunchByCoords = function(values) {
		var values = values || {};
		var lunchList={};
		var data = values.filter;
		if(data===null)data={};
		data.longitude=values.longitude;
		data.latitude=values.latitude;
		data.app=true;
		$.ajax({
			type: "POST",
			async: false,
			url: values.source+"/api/getLunchByCoords/",
			data: data,
			success: function(msg){
				lunchList=JSON.parse(msg);
			}
		});
		return lunchList;
	}
	Api.prototype.getLunchByAddress = function(values) {
		var values = values || {};
		var lunchList={};
		var data = values.filter;
		if(data===null)data={};
		data.q=values.address;
		data.app=true;
		$.ajax({
			type: "POST",
			async: false,
			url: values.source+"/api/getLunchByAddress/",
			data: data,
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