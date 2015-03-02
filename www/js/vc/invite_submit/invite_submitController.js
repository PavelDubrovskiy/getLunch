define(["app","js/vc/invite_submit/invite_submitView"/*,"js/utilities/invite"*/], function(app, view/*, invite*/) {
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
		lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		app.GAPage('/restaurant/'+lunch.Name+'/'+lunch.id+'/callfriends/');
		//console.log(lunch);
		header='Приглашаю на ланч в заведение: '+lunch.name+"\n";
		date="Сегодня в 13:00 \n";
		bottom='По адресу: '+lunch.address+"\n";
		bottom+='Подробнее тут: '+app.config.source+'/restaurant/'+lunch.id+'/';
		$('#invitation').val(header+date+bottom);
		view.render({
			bindings: bindings
		});
	}
	function shareMe() {
		var text=$('#invitation').val();
		text+="\n\nGetLunch.ru";
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
		var time=$('#inviteDatetime').val();
		var ndate=new Date();
		var d=ndate.getDate();
		d=d>9?d:'0'+d;
		var m=ndate.getMonth()*1+1;
		if(time.substr(0,10)==ndate.getFullYear()+'-'+m+'-'+d){
			date='Сегодня в ';
		}else{
			date=time.substr(8,2)+'.'+time.substr(5,2)+'.'+time.substr(0,4)+' в ';
		}
		date+=time.substr(11,2)+':'+time.substr(14,2)+"\n";
		$('#invitation').val(header+date+bottom);
	}
	return {
		init: init
	};
});