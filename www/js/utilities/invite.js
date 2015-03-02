define(["js/utilities/forms"], function(forms) {
	var $ = Framework7.$;
	
	// Компилируем шаблон с именем человека
	var invitePersonTemplate = Template7.compile( $("#t_invite_person").html() );
	
	// Функция выбора человека по чекбоксу
	function personToggle(e) {
		var $item = $(this).parents(".item-checkbox");
		
		if( e.target.checked === true ) {
			$(".b_invite_sel_list").append(
				invitePersonTemplate({
					id: $item.data('id'),
					firstName: $item.find(".b_invite_firstName").text(),
					lastName: $item.find(".b_invite_lastName").text()
				})
			);
			
			forms.hideMessage();
		}else{
			$("[data-check-id=" + $item.data('id') + "]").remove();
		}
		
		checkSelectedContent();
	}

	// Функция удаления человека по нажатию на его имя
	function personUncheck() {
		$("[data-id=" + $(this).data('check-id') + "]").find("input").prop("checked", false);
		$("[data-check-id=" + $(this).data('check-id') + "]").remove();
		
		checkSelectedContent();
	}
	
	// Проверяем, есть ли выбранные люди, и регулируем наличие отступов у списка
	function checkSelectedContent() {
		var $list = $(".b_invite_sel_list"),
			$items = $list.find(".b_invite_sel_item");
			
		if( $items.length > 0 ) {
			$list.addClass("st_hascontent");
			forms.enableElement(".p_invite_social_forward");
		}else{
			$list.removeClass("st_hascontent");
			forms.disableElement(".p_invite_social_forward");
		}
	}
	
	// Заполняем список выбранных людей на вновь загруженной странице
	function fillSelectedContent() {
		var $selectedList = $(".p_invite_social_list"),
			$submitList = $(".p_invite_submit_list")
		;
		
		$submitList.html( $selectedList.html() ).addClass("st_hascontent");
		
		checkSelectedContent();
	}
	
	return {
		personToggle: personToggle,
		personUncheck: personUncheck,
		checkSelectedContent: checkSelectedContent,
		fillSelectedContent: fillSelectedContent
	};	
});