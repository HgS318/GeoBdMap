window.onload=function(){
    var btn  =document.getElementById("btn");
    var reset=document.getElementById("reset");
    var top  =document.getElementById("talk");
    var close=document.getElementById("close");
    var btn2 =document.getElementById("btn2");
    var btn3 =document.getElementById("btn3");
    var userName =document.getElementById("username");
    var conTent =document.getElementById("content");
    
    btn.onclick=function(){
        reset.style.display = "block";
    };
   
	//关闭弹出页
    close.onclick = function(){
        reset.style.display="none";
    };
	// 取消发布
	btn3.onclick = function(){
		reset.style.display = "none";
	};
    //发布           
    btn2.onclick = function() {   	
		var _username = username.value;
		var _content  = content.value;
		
		if (_username == '') {
			alert('请输入您的姓名');
			return;
		}
		if (_content == '') {
			alert('请输入您的留言');
			return;
		}
		var sensitiveWords = ['你好', '好不好', '不好'];
		sensitiveWords.forEach(function (v) {
				while(_content.indexOf(v) !== -1) {
					_content = _content.replace(v, '***');
				}
			});
		//限制字数为150
		function LimitNumber(txt) {
		    var str = txt;
		    str = str.substr(0,150);
		    _content.innerText=str;
		}
		if (_content.length>150){
			alert("您输入超出限制");	
			LimitNumber();
		}
		var uls   = document.getElementById('uls');
		var newLi = document.createElement('li');
		newLi.innerHTML = '<div class="username">' + _username + '</div><a href="javascript:;" class="delet">X</a><p>' + _content + '</p>';
		uls.appendChild(newLi);
		userName.value = '';
		conTent.value = '';
	    reset.style.display="none";
	};
	// 拖拽
	top.onmousedown = function (ev) {
		var maxLeft = document.documentElement.clientWidth - reset.offsetWidth;
		var maxTop  = document.documentElement.clientHeight - reset.offsetHeight;
		var e = ev || window.event;
		var X = e.clientX - reset.offsetLeft;
		var Y = e.clientY - reset.offsetTop;
		
		//只针对IE浏览器
		if(reset.setCapture) {
			reset.setCapture();
		}
		document.onmousemove = function (ev) {
			var e = ev || window.event;
			
			var left = e.clientX - X;
			var top = e.clientY - Y;
			
			//限定范围
			if(left < 0){
				left = 0;
			}
			if(top < 0){
				top = 0;
			}
			if(top> maxTop ){
				top = maxTop;
			}
			if(left > maxLeft ){
				left = maxLeft;
			}
			reset.style.left = left + 'px';
			reset.style.top = top + 'px';
		};
		document.onmouseup = function () {
			document.onmousemove = null;
			document.onmouseup = null;
			//取消捕获事件
			if(reset.releaseCapture){
				reset.releaseCapture();
			}
		};
	};
};
var uls = document.getElementById('uls');

uls.onclick = function (ev) {
	var e = ev || window.event;
	var o = e.srcElement || e.target;
	if(o.nodeName === "A") {
		uls.removeChild( o.parentNode );
	}
};


	