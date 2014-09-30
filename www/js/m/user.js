define(["js/utilities/validate"], function( validate ) {
	function User(values) {
		values = values || {};
		this.id = values['id'] || Math.floor((Math.random() * 100000) + 5).toString();

		this.name = values['name'] || '';
		this.email = values['email'] || '';
		this.password = values['password'] || '';
	}

	User.prototype.setValues = function( formInput ) {
		for( var field in formInput ){
			if ( this[field] !== undefined ) {
				this[field] = formInput[field];
			}
		}
	};

	User.prototype.validate = function( fields ) {
		var result = {
			isValid: true,
			message: ""
		};
		
		for( i in fields ){
			switch( fields[i] ){
				case "name":
					if( validate.validate( this.name ) === false ){
						result.isValid = false;
						result.message = "Пожалуйста, заполните имя"
						return result;
					}
				break;
				
				case "email":
					if( validate.validate( this.email, "email" ) === false ){
						result.isValid = false;
						result.message = "Пожалуйста, введите правильный адрес электронной почты"
						return result;
					}
				break;
				
				case "password":				
					if( validate.validate( this.password ) === false ){
						result.isValid = false;
						result.message = "Пожалуйста, введите пароль"
						return result;
					}
				break;
			}
		}
		
		return result;
	};

	return User;
});