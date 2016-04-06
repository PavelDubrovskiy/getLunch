define(["app", "js/utilities/picker","js/utilities/forms"], function(app, picker, forms) {
	var $ = Framework7.$;
	
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
			localStorage.setItem('reminderForm',JSON.stringify(forms.serialize(form,'array')));
			var user=JSON.parse(localStorage.getItem('User'));
			if(user)data+='&iuser='+user.id;
			var pushRegistrationId=localStorage.getItem('pushRegistrationId');
			try{
				if( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
					data+='&code='+pushRegistrationId;
					data+='&platform=android';
					$.ajax({
						type: "POST",
						async: false,
						url: app.config.source+"/api/pull/",
						data: data,
						success: function(msg){
							forms.showMessage(msg, 'success');
						}
					});
				}else {
					data+='&code='+pushRegistrationId;
					data+='&platform=ios';
					$.ajax({
						type: "POST",
						async: false,
						url: app.config.source+"/api/pull/",
						data: data,
						success: function(msg){
							forms.showMessage(msg, 'success');
						}
					});
				}
			}catch(e){		
				console.log(e);
				data+='&code=1111111';
				data+='&platform=android';
				$.ajax({
					type: "POST",
					async: false,
					url: app.config.source+"/api/pull/",
					data: data,
					success: function(msg){
						forms.showMessage(msg, 'success');
					}
				});
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