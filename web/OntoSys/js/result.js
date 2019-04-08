$(document).ready(function () {
	$('#cmt').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true,
    });
});

function showatom(name){
	var expltitle = document.getElementById("expltitle");
	expltitle.innerHTML=name;
	var xmlhttp;
	if(window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
	}
	xmlhttp.onreadystatechange=function(){
		if(4==xmlhttp.readyState) {
			if(200==xmlhttp.status) {
				var msg=xmlhttp.responseText;
				var expl=document.getElementById("expl");
				expl.innerHTML=msg;
			} else if(404==xmlhttp.status) {
				expl.innerHTML="对不起，未找到该定义...";
			}
		}
	}
	xmlhttp.open("get","atomsrh.do1?name="+name,true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send(null);
	
	var iWidth = document.documentElement.clientWidth;
	var iHeight = document.documentElement.clientHeight;
	var oShow = document.getElementById("overexpl");
	oShow.style.display = 'block';
	oShow.style.left = (iWidth-302)/2+"px";
	oShow.style.top = (iHeight-372)/2+"px";
	var oClose = document.createElement("span");
	oClose.innerHTML = "×";
	oShow.appendChild(oClose);
	oClose.onclick = function(){
		oShow.style.display = 'none';
		oShow.removeChild(this);
	}
}

function imageNotFound() {

	var eless=document.getElementsByName("smallimg");
	for(var i=0;i<eless.length;i++) {
		var img=eless[i];
		img.src="img/nopics.jpg";
		img.onerror=null;
	}
	var elels=document.getElementsByName("lightimg");
	for(var i=0;i<elels.length;i++) {
		var ele=elels[i];
		ele.style.visibility ="hidden";
	}
}

