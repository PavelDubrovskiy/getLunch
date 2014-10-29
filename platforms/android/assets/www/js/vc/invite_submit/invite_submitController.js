define(["app","js/vc/invite_submit/invite_submitView","js/utilities/invite","js/utilities/spinningwheel"], function(app, view, invite, SpinningWheel) {
	var bindings = [
		{
			element: ".p_invite_submit_list",
			event: "click",
			handler: invite.personUncheck,
			delegateTo: ".b_invite_sel_item"
		}
	];

	function init(query) {
		var datePicker = new SpinningWheel({
			destination: ".b_invite_date"
		});
		datePicker.addSlot({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 }, 'left');
		datePicker.addSlot({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 }, 'left');
		datePicker.open();
		
		invite.fillSelectedContent();
		
		view.render({
			bindings: bindings
		});
	}
	
	return {
		init: init
	};
});