var tmp = new Array();		// ��� ���������������
var tmp2 = new Array();		// �������
var param = new Array();

var get = location.search;	// ������ GET �������
if(get != '') {
	tmp = (get.substr(1)).split('&');	// ��������� ����������
	for(var i=0; i < tmp.length; i++) {
		tmp2 = tmp[i].split('=');		// ������ param ����� ���������
		param[tmp2[0]] = tmp2[1];		// ���� ����(��� ����������)->��������
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