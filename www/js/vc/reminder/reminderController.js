define(["app", "moment"], function(app, moment) {
	var $ = Framework7.$;
	
	function init(query) {
		var $input = $('#reminderTime'),
			$prompt = $('.b_reminder_prompt');
		//var time = moment().format('HH:mm:ss'); 
		//console.log(time);
		if( !$input.val() ){
			//$input.val(time);
			$input.focus();
			$prompt.show();
		}else{
			$prompt.remove();
		}
		
		$prompt.on('click', function() {
			$input.focus();
			$prompt.hide().remove();
		});
	}
	
	return {
		init: init
	};
});