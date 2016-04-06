define(["app", "js/utilities/picker","js/utilities/forms"], function(app, picker, forms) {
	var $ = Framework7.$;
	var weekdays={mon:1,tue:2,wed:3,thu:4,fri:5,sat:6,sun:7};
	function init(query) {
		var $input = $('#reminderTime');
		var initTime=false;
		var $form = $('#reminderForm');
		var data=JSON.parse(localStorage.getItem('reminderForm'));
		if ($.isArray(data)==false){
			$.each(data, function(key, value){
				if($.isArray(value)){
					$form.find('input[name="'+key+'"]').each(function(){
						for(var i in value){	
							if($(this).val()==value[i]){
								$(this).prop('checked',true);
								$('.b_reminder_checkbox[data-val="'+value[i]+'"]').addClass('active');
							}
						}
					});
				}else{
					$form.find('input[name="'+key+'"]').val(value);
					initTime=value;
				}
			});
		}
		var timePicker = picker.createTimePicker('#reminderTime', '#reminderPicker', {
			minuteStep: 5,
			initTime: initTime
		});
		$('.p_reminder_submit').on('click', function(){
			var form = document.getElementById('reminderForm');
			var data=forms.serialize(form);
			var dataArr=forms.serialize(form,'array');			
			localStorage.setItem('reminderForm',JSON.stringify(dataArr));
			var every='';
			if($.isArray(dataArr.weekly)) every='week';
			//var user=JSON.parse(localStorage.getItem('User'));
			//if(user)data+='&iuser='+user.id;			
			//var pushRegistrationId=localStorage.getItem('pushRegistrationId');
			var date = new Date();
			var time=dataArr.time.split(':');
			if($.isArray(dataArr['days[]'])){
				for(var i in dataArr['days[]']){
					var d=new Date(date.getFullYear(),date.getMonth(),date.getDate()+weekdays[dataArr['days[]'][i]]-1,time[0],time[1],'00');
					try{
						cordova.plugins.notification.local.schedule({
						    id: i,
						    title: "GetLunch",
						    text: "Пора есть!",
						    at: d,
						    every: every,
						    sound: "",
						    icon: "/i/120pt.png",
						});
					}catch(e){console.log(e);}
				}
				forms.showMessage('Напоминание установлено!', 'success');
			}else{
				try{
					cordova.plugins.notification.local.cancel([1,2,3,4,5,6,7], function () {}, scope);
				}catch(e){console.log(e);}
				forms.showMessage('Напоминание отключено', 'success');
			}
		});
		$('.b_reminder_checkbox').on('click', function(){
			var $obj=$('#b_reminder_checkbox_'+$(this).data('val'));
			if($obj.prop('checked')==true){
				$obj.prop('checked',false);
				$(this).removeClass('active');
			}else{
				$obj.prop('checked',true);
				$(this).addClass('active');
			}
		});
	}
	return {
		init: init
	};
});