define(["app","js/vc/invite_submit/invite_submitView"/*,"js/utilities/invite"*/], function(app, view/*, invite*/) {
	var $ = Framework7.$;
	var lunch ={};
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
		}
	];

	function init(query) {
		//invite.fillSelectedContent();
		lunch=JSON.parse(localStorage.getItem('lunch'+localStorage.getItem("currentId")));
		//console.log(lunch);
		var text='Приглашаю на ланч в заведение: '+lunch.name+"\n";
		text+="Сегодня в 13:00 \n";
		text+='По адресу: '+lunch.address+"\n";
		text+='Подробнее тут: '+app.config.source+'/restourant/'+lunch.id+'/';
		$('#invitation').html(text);
		view.render({
			bindings: bindings
		});
	}
	function shareMe() {
		var text=$('#invitation').html(text);
		text+="\n\nGetLunch.ru";
		var subject='Приглашаю на ланч в заведение: '+lunch.name;
		var logo=app.config.source+lunch.logo;
		var url=app.config.source+'/restourant/'+lunch.id+'/';
		try{
			window.plugins.socialsharing.share(text, subject);
		}catch(e){
			console.log(text+' '+subject+' '+logo+' '+url)
		}
	}
	return {
		init: init
	};
});