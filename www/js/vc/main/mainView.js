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
	return {
		render: render,
		expandMap: utilities.expandMap,
		reduceMap: utilities.reduceMap,
		openSearch: openSearch,
		toggleFavouriteState: utilities.toggleFavouriteState,
		attachLunches: attachLunches
	};
});