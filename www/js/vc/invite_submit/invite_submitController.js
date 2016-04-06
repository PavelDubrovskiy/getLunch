define(["app","js/vc/invite_submit/invite_submitView", "js/utilities/picker"/*,"js/utilities/invite"*/], function(app, view, picker/*, invite*/) {
	var $ = Framework7.$;
	var lunch ={};
	var header, date, bottom;
	var bindings = [
		/*{
			element: ".p_invite_submit_list",
			event: "click",
			handler: invite.personUncheck,
			delegateTo: ".b_invite_sel_item"
		},*/
		{
			element: "#shareMe",
			event: "click",
			handler: shareMe
		},{
			element: "#inviteDatetime",
			event: "change",
			handler: setTime
		}
	];

	function init(query) {
		//invite.fillSelectedContent();
		lunch = JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		app.GAPage('/restaurant/'+lunch.name+'/'+lunch.id+'/callfriends/');
		var initTime=lunch.lunchfromStr;
		var date=new Date();
		initTime=(date.getHours()+1)+':00';
		var dateTimePicker = picker.createDateTimePicker('#inviteDatetime', '#invitePicker', {
			daysCount: 14,
			//minTime: lunch.lunchfromStr,
			//maxTime: lunch.lunchtoStr,
			minTime:'0:00',
			maxTime:'23:55',
			minuteStep: 5,
			initTime: initTime,
			checkTime: true
		});
		
		view.render({
			bindings: bindings
		});
		
		header = 'Приглашаю на ланч в заведение: ' + lunch.name + "\n";
		date = $('#inviteDatetime').val() + '\n';
		bottom = 'По адресу: ' + lunch.address + "\n";
		bottom += 'Подробнее тут: ' + app.config.source + '/restaurant/' + lunch.id + '/';
		$('#invitation').val(header + date + bottom);
	}
	
	function shareMe() {
		var text=$('#invitation').val();
		text+="\n\nhttp://getlunch.ru/download/";
		var subject='Приглашаю на ланч в заведение: '+lunch.name;
		var logo=app.config.source+lunch.logo;
		var url=app.config.source+'/restaurant/'+lunch.id+'/';
		app.GAEvent('callfriends', 'send', lunch.name+' - '+lunch.id);
		try{
			window.plugins.socialsharing.share(text, subject);
		}catch(e){
			console.log(text+' '+subject+' '+logo+' '+url);
		}
	}
	
	function setTime() {
		date = $('#inviteDatetime').val() + '\n';
		$('#invitation').val(header + date + bottom);
	}
	return {
		init: init
	};
});