function checkLoginStateVK() {
	VK.Auth.getLoginStatus(function(response) {
    	if(response.status=='connected'){
    		return true;
    	}else{
    		addVK();
    	}
    });
}
window.vkAsyncInit = function() {
    VK.init({
      apiId: '4532400'
    });
};

setTimeout(function() {
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "//vk.com/js/api/openapi.js";
    el.async = true;
    document.getElementsByTagName('body')[0].appendChild(el);
    //document.getElementById("vk_api_transport").appendChild(el);
}, 0);
function LoginVK(){
	VK.Auth.login(function(response) {
    	if(response.status=='connected'){
			LoginVKResponse(response);
		}else{
    		VK.Auth.login(function(response){
	    		if(response.status=='connected'){
	    			LoginVKResponse(response);
	    		}
    		}, {scope: 'friends,notify,wall,messages'});
    	}
	});
}
function LoginVKResponse(response){
	$.ajax({
		type: "POST",
		url: "/registration/login/",
		data: "token="+response.session.sid+"&provider=vk&iuser="+response.session.user.id,
		success: function(msg){
			console.log(msg);
			if(msg=='registered'){
				document.location.reload();
			}else{
				$('.b_form').html(msg);
			}
		}
	});
}
function removeVK(){
	VK.Auth.getLoginStatus(function(response) {
	    if(response.status=='connected'){
	    	VK.Auth.logout();
			$.ajax({
				type: "POST",
				url: "/cabinet/removesocnet/",
				data: "provider=vk",
				success: function(msg){
					$('#spanVK').removeClass('st_active').attr('onclick','addVK()');
				}
			});
		}
	});
}
function addVK(){
	VK.Auth.login(function(response) {
		if(response.status=='connected'){
   			$.ajax({
				type: "POST",
				url: "/cabinet/addsocnet/",
				data: "token="+response.session.sid+"&provider=vk&iuser="+response.session.user.id,
				success: function(msg){
					$('#spanVK').addClass('st_active').attr('onclick','removeVK()');
				}
			});
   		}
	}, {scope: 'friends,notify,wall,messages'});
}