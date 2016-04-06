define(["app", "js/utilities/common"], function( app, utilities ) {
	var $ = Framework7.$;
	
	var template = $('#lunchItem').html();
	var compiledTemplate = Template7.compile(template);
	
	var soughtTemplate = $('#soughtItem').html();
	var compiledSoughtTemplate = Template7.compile(soughtTemplate);
	
	function render(params) {
		if(params.filter!==null){
			$('input[name=lunchfrom]').val(params.filter.lunchfrom);
			$('input[name=lunchto]').val(params.filter.lunchto);
			$('input[name=pricefrom]').val(params.filter.pricefrom);
			$('input[name=priceto]').val(params.filter.priceto);
			$('#filterForm').each(function(){
				if(params.filter.features!==undefined) {
					if(params.filter.features.join(',').indexOf($(this).val())>=0){
						$(this).prop('checked',true);
					}
				}
			});
		}
		utilities.bindEvents(params.bindings);
	}
	
	// Показать поиск
	function openSearch() {
		var sought=[];
		if(localStorage.getItem('sought')!==null){
			sought=localStorage.getItem('sought').split('!__;__!');
		}
		var html='';
		sought.forEach(function(element, index, array){
			html+=compiledSoughtTemplate(element);
		});
		app.GAEvent('search', 'click', 'start');
		$('#soughtList').html(html);
		$(".p_main_search_input").focus();
	}
	
	// Добавить ланчи
	function attachLunches(values){
		var html='',
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		var marks = [];
		
		if(typeof values.lunchList !== 'undefined'){
			values.lunchList.forEach(function(element, index, array){
				element.metr=Math.round(element.metr);
				if(element.metr/1000>1)element.metrString=Math.round(element.metr/1000)+' км';
				else element.metrString=element.metr+' м';
				element.inactive='';
				element.inactiveText='';
				if(element.lunchfrom>fer){
					element.inactive='st_inactive';
					element.inactiveText='Время ланча не началось';
				}else if(fer>element.lunchto){
					element.inactive='st_inactive';
					element.inactiveText='Закончилось время ланча';
				}
				html+=compiledTemplate(element);
				
				marks.push({
					type: 'Feature',
					id: element.id,
					properties: {
						name: element.name,
						inactive: (element.inactive === 'st_inactive' ? true : false),
						id: element.id
					},
					geometry: {
						type: 'Point',
						coordinates: [element.latitude*1, element.longitude*1]
					},
					options: {
						iconImageHref: element.inactive === 'st_inactive' ? 'i/svg/geotag_inactive.svg' :'i/svg/geotag.svg'
					}
				});
				
				/*values.map.createMark([element.latitude*1,element.longitude*1],{
					name: element.name,
					inactive: (element.inactive === 'st_inactive' ? true : false),
					id: element.id
				});*/
			});
			
			values.map.createMarks(marks);
		}
		
		
		$('#mainCardsList').html(html);
	}
	
	function attachSearch(values){
		var html='',
			date=new Date();
		var fer=date.getHours()+""+date.getMinutes();
		
		values.lunchList.forEach(function(element, index, array){
			values.map.createMark([element.latitude*1,element.longitude*1], 'card.html', element.name);
			element.metr=Math.round(element.metr);
			if(element.metr/100>1)element.metrString=Math.round(element.metr/100,1)+' км';
			else element.metrString=element.metr+' м';
			element.inactive='';
			element.inactiveText='';
			if(element.lunchfrom>fer){
				element.inactive='st_inactive';
				element.inactiveText='Время ланча не началось';
			}else if(fer>element.lunchto){
				element.inactive='st_inactive';
				element.inactiveText='Закончилось время ланча';
			}
			html+=compiledTemplate(element);
		});
		$('#mainCardsList').html(html);
	}
	
	var countEnter=localStorage.getItem('countEnter');
	var ratedEnter=localStorage.getItem('ratedEnter');
	console.log(countEnter+' '+ratedEnter);
	if(countEnter%3==0 && ratedEnter!=1){
		window.setTimeout(function(){showRaiting()},5000);
	}
	function showRaiting(){
		var modal=app.f7.modal({
			title: 'Оценить приложение'+
				'<div class="modal-stars">'+
					'<a href="addappreview.html" class="modal-star-setReview"><span class="modal-star"></span><span class="modal-star"></span><span class="modal-star"></span></a>'+
					'<span class="modal-star modal-star-setRating"></span><span class="modal-star modal-star-setRating"></span>'+
				'</div>',
		    buttons: [
		      {
		        text: '<span class="modal-button-small">Больше не напоминать</span>',
		        class: 'bt_small',
		        onClick: function() {
		        	localStorage.setItem('ratedEnter', 1);
	          	},
		      },
		      {
		    	text: '<span class="modal-button-small">Напомнить позже</span>',
		    	class: 'bt_small',
	          	onClick: function() {},
		      }
		    ]
		});
		$('.modal-star-setRating').on('click',function(){setRating(modal)});
		$('.modal-star-setReview').on('click',function(){setReview(modal)});
	}
	function setReview(modal){
		app.f7.closeModal(modal);
		localStorage.setItem('ratedEnter', 1);
	}
	function setRating(modal){
		app.f7.closeModal(modal);
		localStorage.setItem('ratedEnter', 1);
		try{
			if (device.platform == "iOS") {
				window.open('https://itunes.apple.com/ru/app/getlunch/id964509772?mt=8');
			} else if (device.platform == "Android") {
				window.open('market://details?id=ru.one_touch.getlunch');
			}
		}catch(e){console.log(e)}
	}
	
	return {
		render: render,
		expandMap: utilities.expandMap,
		reduceMap: utilities.reduceMap,
		openSearch: openSearch,
		toggleFavouriteState: utilities.toggleFavouriteState,
		attachLunches: attachLunches,
		setRating: setRating
	};
});