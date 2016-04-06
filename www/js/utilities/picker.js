define(["app"], function(app) {
	var today = new Date();
	var months = ('января февраля марта апреля мая июня июля августа сентября октября ноября декабря').split(' ');
	
	var daysInMonth = (function(day) {
		var here = new Date();
		here.setDate(33);
		return 33 - here.getDate();
	})();

	var date = today.getDate();
	var month = today.getMonth();
	var year = today.getFullYear();
	
	function addZero(n) {
		if(n < 10) {
			return '0' + n;
		}else {
			return n;
		}
	}
	
	function timeToArray(str) {
		return str.split(':');
	}
	
	function createDateTimePicker(input, container, options) {
		options = options || {};
		
		var minTime = timeToArray(options.minTime || '12:00');
		var maxTime = timeToArray(options.maxTime || '16:00');
		var initTime = timeToArray(options.initTime || '13:00');
		var isSideHour = (initTime[0] === minTime[0] || initTime[0] === maxTime[0]);
		
		var days = ( function() {
			var arr = [];
			var currentDate;
			var currentMonth;
			
			var daysCount = options.daysCount || 14;
			
			arr.push('Сегодня');
			
			for(var i = 1; i < daysCount; i++) {
				currentDate = date + i;
				currentMonth = month;
				
				if(currentDate > daysInMonth) {
					currentDate -= daysInMonth;
					currentMonth = (month === 11) ? 0 : month+1;
				}
				
				arr.push(currentDate + ' ' + months[currentMonth]);
			}
			
			return arr;
		})();
		
		var getMinutes = function(hours) {
			var arr = [];
			var step = options.minuteStep || 1;
			var start = 0, end = 59;
			
			if(hours === minTime[0]) {
				start = minTime[1]*1;
			}else if(hours === maxTime[0]) {
				end = maxTime[1]*1;
			}
			
			for (var i = start; i <= end; i+=step) {
				arr.push(addZero(i));
			}
			return arr;
		};		
	
		return app.f7.picker({
			input: input,
			container: container,
			toolbar: false,
			rotateEffect: true,
		 
			formatValue: function (p, values, displayValues) {
				return values[0] + ' в ' + values[1] + ':' + values[2];
			},
			
			value: ['Сегодня', initTime[0], initTime[1]],
		
			cols: [
				// Day + month
				{
					values: days
				},
				// Hours
				{
					values: (function () {
						var arr = [];
						for (var i = minTime[0]; i <= maxTime[0]; i++) { arr.push(addZero(i)); }
						return arr;
					})(),
		 
					onChange: function (picker, value) {
						if(picker.cols[2].replaceValues && options.checkTime) {
							var oldHour = isSideHour;
							var minute = picker.cols[2].value;
							var minutesArray, lastMinute;
							
							isSideHour = (value === minTime[0] || value === maxTime[0]);
							if(oldHour != isSideHour) {
								minutesArray = getMinutes(value);
								lastMinute = minutesArray[minutesArray.length-1];
								
								picker.cols[2].replaceValues(minutesArray);
								if(lastMinute < minute) {
									picker.cols[2].setValue(lastMinute, 0);
								}else {
									picker.cols[2].setValue(minute, 0);
								}
							}
						}
					}
				},
				// Minutes
				{
					values: getMinutes(),
				}
			]
		});
	}
	
	function createTimePicker(input, container, options) {
		var hour = today.getHours();
		var minutes=0;
		hour = hour + 1 > 23 ? 0 : hour + 1;
		
		if(options.initTime){
			var initTime = timeToArray(options.initTime);
			hour=initTime[0];
			minutes=initTime[1];
		}
		
		return app.f7.picker({
			input: input,
			container: container,
			toolbar: false,
			rotateEffect: true,
		 
			formatValue: function (p, values) {
				return values[0] + ':' + values[1];
			},
			
			value: [addZero(hour), addZero(minutes)],
		
			cols: [
				// Hours
				{
					values: (function() {
						var arr = [];
						
						for (var i = 0; i <= 23; i++) {
							arr.push(addZero(i));
						}
						return arr;
					})()
				},
				// Minutes
				{
					values: ( function() {
						var arr = [];
						var step = options.minuteStep || 1;
			
						for (var i = 0; i <= 59; i+=step) {
							arr.push(addZero(i));
						}
						return arr;
					})()
				}
			]
		});
	}
	
	return {
		createDateTimePicker: createDateTimePicker,
		createTimePicker: createTimePicker
	};
});