var tmp = new Array();		// два вспомагательных
var tmp2 = new Array();		// массива
var param = new Array();

var get = location.search;	// строка GET запроса
if(get != '') {
	tmp = (get.substr(1)).split('&');	// разделяем переменные
	for(var i=0; i < tmp.length; i++) {
		tmp2 = tmp[i].split('=');		// массив param будет содержать
		param[tmp2[0]] = tmp2[1];		// пары ключ(имя переменной)->значение
	}
}
jQuery.fn.rotate=function(degrees){
	$(this).css({
	  '-webkit-transform' : 'rotate('+degrees+'deg)',
	     '-moz-transform' : 'rotate('+degrees+'deg)',  
	      '-ms-transform' : 'rotate('+degrees+'deg)',  
	       '-o-transform' : 'rotate('+degrees+'deg)',  
	          'transform' : 'rotate('+degrees+'deg)',
    });
}