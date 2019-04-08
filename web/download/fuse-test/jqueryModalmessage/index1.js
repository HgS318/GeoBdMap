
function openWin(win) {
	win.style.display = "block";
}

function closeWin(win) {
	win.style.display="none";
}

function drag(ev, win) {
	var maxLeft = document.documentElement.clientWidth - win.offsetWidth;
	var maxTop  = document.documentElement.clientHeight - win.offsetHeight;
	var e = ev || window.event;
	var X = e.clientX - win.offsetLeft;
	var Y = e.clientY - win.offsetTop;
	
	//只针对IE浏览器
	if(win.setCapture) {
		win.setCapture();
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
		win.style.left = left + 'px';
		win.style.top = top + 'px';
	};
	document.onmouseup = function () {
		document.onmousemove = null;
		document.onmouseup = null;
		//取消捕获事件
		if(win.releaseCapture){
			win.releaseCapture();
		}
	};
}
	

	
window.onload=function(){
	
    var btn1  = document.getElementById("btn1");
    var btn2  = document.getElementById("btn2");
	
    var win1  = document.getElementById("win1");
    var top1  = document.getElementById("toptool1");
    var close1= document.getElementById("close1");
    var win2  = document.getElementById("win2");
    var top2  = document.getElementById("toptool2");
    var close2= document.getElementById("close2");
    var win3  = document.getElementById("win3");
    var top3  = document.getElementById("toptool3");
    var close3= document.getElementById("close3");
	
	openWin(win1);
	openWin(win2);
	
	
    btn1.onclick=function(){
        closeWin(win1);
        closeWin(win2);
        openWin(win3);
    };
   
    btn2.onclick=function(){
        openWin(win1);
        openWin(win2);
        closeWin(win3);
    };
   
	// 拖拽
	top1.onmousedown = function (ev) {
		drag(ev, win1);
	};
	top2.onmousedown = function (ev) {
		drag(ev, win2);
	}
	top3.onmousedown = function (ev) {
		drag(ev, win3);
	}

	//关闭弹出页
	close1.onclick = function(){
		closeWin(win1);
	};
	close2.onclick = function(){
		closeWin(win2);
	};
	close3.onclick = function(){
		closeWin(win3);
	};


};


	