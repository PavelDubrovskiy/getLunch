 // Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available

function onDeviceReady() {
    // find all contacts with 'Bob' in any name field
	try{
	    /*var options = new ContactFindOptions();
	    options.filter = "";
		options.multiple = true; 
	    var fields = ["*"];
	    navigator.contacts.find(fields, onSuccess, onError, options);*/
	    //facebookConnectPlugin.login(data, onSuccessFCP, onErrorFCP);
	}catch(e){
		alert(e);
	}
}
$(document).ready(function(){
	openFB.init({appId: '281560105368956'});
	$('#messageSelect span').click(function(){
		if($(this).attr('data-type')=='fb'){
			openFB.getLoginStatus(function(loginStatus){
				if(loginStatus.status=='connected'){
					openFB.api({path: '/me/friends', success:function(data) {
		                alert(dump(data));
		            }, error:onErrorFCP});
					
					openFB.api({
		            path: '/me',
		            success: function(data) {
		                alert(data.name);
		            },
		            error: function(data) {
		                alert(data);
		            }
		            });
				}else{
					openFB.login(
						function(response) {}, 
						{scope: 'email,read_stream,publish_stream'}
					);
				}
			})
		}
	});
});
// onSuccess: Get a snapshot of the current contacts
function onSuccessFCP(data) {
	try{
		alert(dump(data));
	    /*for (var i = 0; i < contacts.length; i++) {
			text='<tr>'+
				'<td>'+i+' <b>'+dump(contacts[i])+'</b></td>'+
			'<tr>';
			$('#contactList table tbody').append(text);
		};*/
	}catch(e){
		alert(e);
	}
}
function onErrorFCP(data) {
	 alert('FaceBookConnect Error!');
}
function onSuccess(contacts) {
	try{
	    for (var i = 0; i < contacts.length; i++) {
			text='<tr>'+
				'<td>'+i+' <b>'+dump(contacts[i])+'</b></td>'+
			'<tr>';
			$('#contactList table tbody').append(text);
		};
	}catch(e){
		alert(e);
	}
}

// onError: Failed to get the contacts

function onError(contactError) {
    alert('onError!');
}
function dump(obj) {
    var out = "";
    if(obj && typeof(obj) == "object"){
        for (var i in obj) {
        	if(obj[i] && typeof(obj[i]) == "object"){
        		obj[i]=dump(obj[i]);
        	}
            out += i + ": " + obj[i] + "\n";
        }
    } else {
        out = obj;
    }
    return out;
}