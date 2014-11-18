define(function() {
	// --------------------------- //
	// Утилита для валидации полей //
	// --------------------------- //
	
	function validate( val, type ) {
		
		var exp;
		switch( type ) {
			case "email":
				exp = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;
			break;
			case "phone":
				exp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
			break;
			case "name":
				exp = /^[a-zа-яA-ZА-Я ]{1,60}$/;
			break;
			default:
				if( type !== undefined ){
					exp = new RegExp( type );
				}else{
					exp = /.+/;
				}
		}
		return exp.test( val );
		
	}
	
	return {
		validate: validate
	};
});