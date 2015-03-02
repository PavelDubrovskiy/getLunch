define(function() {
	var $ = Framework7.$;
	
	// ---------------------------- //
	// Утилиты для работы с формами //
	// ---------------------------- //
	
	// Сделать элемент доступным
	function enableElement( element ) {
		$(element).removeClass('st_disabled').prop('disabled',false);
	}
	
	// Сделать элемент недоступным
	function disableElement( element ) {
		$(element).addClass('st_disabled').prop('disabled',true);
	}
	
	// Проверка формы на заполненность
	function isFormFilled( form ) {
		var filled = true;
		$(form).find(".st_required").each( function(){
			if( this.value === '' ){
				filled = false;
			}
		});
		return filled;
	}
	
	// Показ сообщения
	function showMessage( message, type, inline ) {
		hideMessage( function( duration ) {
			var	$cnt = $(".page-on-center .page-content"),
				element = document.createElement("div")	
			;

			element.className = "b_form_message m_" + ( type || "error" ) + (inline ? " m_inline" : "");
			element.innerHTML = message;
			
			$cnt.append( element );
			setTimeout( function(){
				if( inline ) {
					$(element).parent().transition(300).transform('translate3d(0,' + $(element).outerHeight() + 'px,0)');
				}else{
					$(element).addClass("st_active");
				}
			}, duration );
		});
	}
	
	// Скрытие сообщения
	function hideMessage( callback ) {
		var $message = $(".b_form_message");
		if( $message.length ){
			$message.removeClass("st_active").parent().transform('translate3d(0,0,0)');
			setTimeout( function() {
				$message.remove();
				if( callback ){
					callback( 200 );
				}
			}, 300);
		}else{
			if( callback ){
				callback( 100 );
			}
		}
	}
	
	// Простановка курсора в конец строки в текстовых полях
	function resetInput() {
		this.value = this.value;
	}
	
	// Вызов клика по элементу
	function triggerClick() {
		$(this).trigger('click');
	}
	
	// Загрузка картинки "на лету"
	function uPicLoad() {
		var 	file = this.files[0],
				imageType = /image.*/,
				img = document.createElement("img"),
				reader = new FileReader(),
				src='',
				
				$upic = $(".b_upic_face"),
				$tx = $upic.find(".b_upic_tx span"),
				$preloader = $upic.find(".preloader"),
				$upic_return= $(".b_upic_return")
		;
		
		if ( !file.type.match(imageType) ) {
			app.f7.alert("Выбранный файл не является изображением.");
		}else{
			$upic.css({
				backgroundImage: ""
			});
			
			$preloader.show();
			
			img.file = file;
			
			reader.onload = ( function( aImg ) {
				return function( e ) {
					$upic.css({
						backgroundImage: "url(" + e.target.result + ")",
						backgroundSize: "cover"
					});
					$tx.text("Сменить");
					$preloader.hide();
					$upic_return.val(e.target.result);					
				};
			})( img );
			reader.readAsDataURL( file );
		}
	}
	
	return {
		enableElement: enableElement,
		disableElement: disableElement,
		isFormFilled: isFormFilled,
		showMessage: showMessage,
		hideMessage: hideMessage,
		resetInput: resetInput,
		triggerClick: triggerClick,
		uPicLoad: uPicLoad
	}
});