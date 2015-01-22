define( function() {
	var $ = Framework7.$;
	function checkLoginStateFB() {
	    FB.getLoginStatus(function(response) {
	    	if(response.status=='connected'){
	    		return true;
	    	}else{
	    		addFB();
	    	}
	    });
	}
	function LoginFB(){
		/*FB.getLoginStatus(function(response) {
	    	if(response.status=='connected'){
				LoginFBResponse(response);
			}else{
	    		FB.login(function(response){
		    		if(response.status=='connected'){
		    			LoginFBResponse(response);
		    		}
	    		}, {scope: 'publish_actions,email,user_friends'});
	    	}
		});*/
	}
	function LoginFBResponse(response){
		$.ajax({
			type: "POST",
			url: "/registration/login/",
			data: "token="+response.authResponse.accessToken+"&provider=fb&iuser="+response.authResponse.userID,
			success: function(msg){
				if(msg=='registered'){
					document.location.reload();
				}else{
					$('.b_form').html(msg);
				}
			}
		});
	}
	function removeFB(){
		FB.getLoginStatus(function(response) {
		    if(response.status=='connected'){
		    	FB.logout();
				$.ajax({
					type: "POST",
					url: "/cabinet/removesocnet/",
					data: "provider=fb",
					success: function(msg){
						$('#spanFB').removeClass('st_active').attr('onclick','addFB()');
					}
				});
			}
		});
	}
	function addFB(){
		FB.login(function(response){
			if(response.status=='connected'){
	   			$.ajax({
					type: "POST",
					url: "/cabinet/addsocnet/",
					data: "token="+response.authResponse.accessToken+"&provider=fb&iuser="+response.authResponse.userID,
					success: function(msg){
						$('#spanFB').addClass('st_active').attr('onclick','removeFB()');
					}
				});
	   		}
		}, {scope: 'publish_actions,email,user_friends'});
	}
	return {
		checkLoginStateFB: checkLoginStateFB,
		LoginFB: LoginFB,
		LoginFBResponse: LoginFBResponse,
		removeFB: removeFB,
		addFB: addFB
	};
});