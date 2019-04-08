
var win1;
var top1;
var close1;
var win2;
var top2;
var close2;
var win3;
var top3;
var close3;
var inited = false;

// var btn1;
// var btn2;

var menuItemNum;
var angle=120;
var distance=90;
var startingAngle=180+(-angle/2);
var slice=angle/(menuItemNum-1);

var on = false;

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

function fuse_simple() {
	closeWin(win1);
	closeWin(win2);
	openWin(win3);
}

function split_simple() {
	openWin(win1);
	openWin(win2);
	closeWin(win3);
}

function initWindows() {
	win1  = document.getElementById("win1");
	top1  = document.getElementById("toptool1");
	close1= document.getElementById("close1");
	win2  = document.getElementById("win2");
	top2  = document.getElementById("toptool2");
	close2= document.getElementById("close2");
	win3  = document.getElementById("win3");
	top3  = document.getElementById("toptool3");
	close3= document.getElementById("close3");
	
	// openWin(win1);
	// openWin(win2);

	// btn1  = document.getElementById("btn1");
	// btn2  = document.getElementById("btn2");
    // btn1.onclick=function(){
        // fuse_simple();
    // };
    // btn2.onclick=function(){
        // split_simple();
    // };
   
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

	// inited = true;
}

function initPages() {

	var page1 = getQueryString("page1");
	var page2 = getQueryString("page2");
	var page3 = getQueryString("page3");
	if(page1 == "" || page1 == null) {
		page1 = "../download/mapv/examples/baidu-map-polyline-time.html";
	}
	if(page2 == "" || page2 == null) {
		page2 = "../download/mapv/examples/baidu-map-polyline-time.html";
	}
	if(page3 == "" || page1 == null) {
		page3 = "../download/mapv/examples/baidu-map-polyline-time.html";
	}
	$("#content1").html("<iframe src='" + page1 +"' width='495px' height='362px'></iframe>");
	inited = true;
}


//锁定滚动条
function unScroll(){
	var top=$(document).scrollTop();
		$(document).on('scroll.unable',function (e){
		$(document).scrollTop(top);
	})
}

//打开滚动条
function removeUnScroll(){
	$(document).unbind("scroll.unable");
}



function pressHandler(event){
	on = !on;

	TweenMax.to($(this).children('.menu-toggle-icon'),0.4,{
		rotation:on ? 45 : 0,
		ease: Quint.easeInOut,
		force3D: true
	});

	on? openMenu() : closeMenu();
}

function openMenu(){
	$(".menu-item").each(function(i){
		var delay=i*0.08;

		var $bounce=$(this).children(".menu-item-bounce");
		TweenMax.fromTo($bounce,0.2,
		{
			transformOrigin:"50% 50%"
		},{
			delay:delay,
			scaleX:0.8,
			scaleY:1.2,
			force3D:true,
			ease:Quad.easeInOut,
			onComplete:function(){
				TweenMax.to($bounce,0.15,{
					// scaleX:1.2,
					scaleY:0.7,
					force3D:true,
					ease:Quad.easeInOut,
					onComplete:function(){
						TweenMax.to($bounce,3,{
							// scaleX:1,
							scaleY:0.8,
							force3D:true,
							ease:Elastic.easeOut,
							easeParams:[1.1,0.12]
						});
						if(inited) {
							split_simple();
						} else {
							initPages();
							split_simple();
						}
					}
				})
			}
		});
		
		TweenMax.to($(this).children(".menu-item-button"),0.5,{
			delay:delay,
			y:distance,
			force3D:true,
			ease:Quint.easeInOut
		});
	})
}

function closeMenu(){
	$(".menu-item").each(function(i){
		var delay=i*0.08;

		var $bounce=$(this).children(".menu-item-bounce");

		TweenMax.fromTo($bounce,0.2,{
			transformOrigin:"50% 50%"
		},{
			delay:delay,
			scaleX:1,
			scaleY:0.8,
			force3D:true,
			ease:Quad.easeInOut,
			onComplete:function(){
				TweenMax.to($bounce,0.15,{
					// scaleX:1.2,
					scaleY:1.2,
					force3D:true,
					ease:Quad.easeInOut,
					onComplete:function(){
						TweenMax.to($bounce,3,{
							// scaleX:1,
							scaleY:1,
							force3D:true,
							ease:Elastic.easeOut,
							easeParams:[1.1,0.12]
						});
						if(inited) {
							fuse_simple();
						}
					}
				})
			}
		});
		
		TweenMax.to($(this).children(".menu-item-button"),0.3,{
			delay:delay,
			y:0,
			force3D:true,
			ease:Quint.easeIn
		});
	})
}

function getQueryString(name) {
	var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if (result == null || result.length < 1) {
		return "";
	}
	return result[1];
}

$(document).ready(function(){
	initWindows();

	menuItemNum=$(".menu-item").length;
	slice=angle/(menuItemNum - 1);
	TweenMax.globalTimeScale(0.8);
	$(".menu-item").each(function(i){
		var angle=startingAngle+(slice*i);
		$(this).css({
			transform:"rotate("+(angle)+"deg)"
		})
		$(this).find(".menu-item-icon").css({
			transform:"rotate("+(-angle)+"deg)"
		})
	})
	$(".menu-toggle-button").mousedown(function(){
		TweenMax.to($(".menu-toggle-icon"),0.1,{
			scale:0.65
		})
	})
	$(document).mouseup(function(){
		TweenMax.to($(".menu-toggle-icon"),0.1,{
			scale:1
		})
	});
	$(document).on("touchend",function(){
		$(document).trigger("mouseup");
	});
	$(".menu-toggle-button").on("mousedown",pressHandler);
	$(".menu-toggle-button").on("touchstart",function(event){
		$(this).trigger("mousedown");
		event.preventDefault();
		event.stopPropagation();
	});
	pressHandler();

});