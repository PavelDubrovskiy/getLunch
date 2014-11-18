define(["js/utilities/validate"], function( validate ) {
	function User(values) {
		try{
			tempValues=JSON.parse(localStorage.getItem('User'));
			values=tempValues;
		}catch(e){}
		values = values || {};
		this.id = values['id'] || '';

		this.name = values['name'] || '';
		this.email = values['email'] || '';
		this.password = values['password'] || '';
		this.avatar = values['avatar'] || '';
		this.code = values['code'] || '';
		this.fb_token = values['fb_token'] || '';
	}

	User.prototype.setValues = function( formInput ) {
		if(formInput['id']){
			localStorage.setItem('User',JSON.stringify(formInput));
		}
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