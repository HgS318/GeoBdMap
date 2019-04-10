
var win1;
var top1;
var close1;
var win2;
var top2;
var close2;
var win3;
var top3;
var close3;
var tb1, tb2, tb3;
// var tbCont1, tbCont2, tbCont3;

var page1;
var page2;
var page3;
var tPage1, tPage2, tPage3;
var inited = false;

// var btn1;
// var btn2;

var menuItemNum;
var angle = 120;
var distance = 90;
var startingAngle = 180 + (-angle / 2);
var slice;

var on = false;
var firstFuse = true;

function openWin(win, html) {
	if(html != undefined && html != null && html != "") {
		win.html = html;
	}
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

function fuse_simple(first) {
	closeWin(win1);
	closeWin(tb1);
	closeWin(win2);
	closeWin(tb2);
	if(first) {
		$("#content3").html(createWindowHtml(page3));
		$("#tbCont3").html(createTbHtml(tPage3));
	}
	openWin(win3);
	openWin(tb3);
}

function split_simple() {
	openWin(win1);
	openWin(win2);
	openWin(tb1);
	openWin(tb2);
	// openWin(win3);
	closeWin(win3);
	closeWin(tb3);
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
	tb1 =document.getElementById("tb1");
	tb2 =document.getElementById("tb2");
	tb3 =document.getElementById("tb3");
	// tbCont1 =document.getElementById("tbCont1");
	// tbCont2 =document.getElementById("tbCont2");
	// tbCont3 =document.getElementById("tbCont3");

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

}

function initPages() {
	page1 = decodeURI(getQueryString("page1"));
	page2 = decodeURI(getQueryString("page2"));
	page3 = decodeURI(getQueryString("page3"));
	tPage1 = decodeURI(getQueryString("tb1"));
	tPage2 = decodeURI(getQueryString("tb2"));
	tPage3 = decodeURI(getQueryString("tb3"));
	var default_pages = ["html3/beihang_haidian.html",
		"html3/beihang_shahe.html",
		"html3/beihang_total.html",
		"html3/beihang_haidian.html",
		"html3/beihang_shahe.html",
		"html3/beihang_total.html"
	];
	if(page1 == "" || page1 == null) {
		page1 = default_pages[0];
	}
	if(page2 == "" || page2 == null) {
		page2 = default_pages[1];
	}
	if(page3 == "" || page1 == null) {
		page3 = default_pages[2];
	}
    if(tPage1 == "" || tPage1 == null) {
        tPage1 = default_pages[3];
    }
    if(tPage2 == "" || tPage2 == null) {
        tPage2 = default_pages[4];
    }
    if(tPage3 == "" || tPage31 == null) {
        tPage3 = default_pages[5];
    }
	$("#content1").html(createWindowHtml(page1));
	$("#content2").html(createWindowHtml(page2));

	$("#tbCont1").html(createTbHtml(tPage1));
	$("#tbCont2").html(createTbHtml(tPage2));


	var mainTitle = decodeURI(getQueryString("h1"));
	var subTitle = decodeURI(getQueryString("h2"));
	var top1 = decodeURI(getQueryString("top1"));
	var top2 = decodeURI(getQueryString("top2"));
	var top3 = decodeURI(getQueryString("top3"));
	$("#mainTitle")[0].innerHTML = mainTitle;
	$("#webTitle")[0].innerHTML = mainTitle;
	$("#subTitle")[0].innerHTML = subTitle;
	$("#toptool1")[0].innerHTML = top1;
	$("#toptool2")[0].innerHTML = top2;
	$("#toptool3")[0].innerHTML = top3;


	inited = true;
}

function createWindowHtml(page) {
	return "<iframe src='" + page +"' width='495px' height='362px'></iframe>";
}

function createTbHtml(page) {
	return "<iframe src='" + page +"' width='395px' height='300px'></iframe>";
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
		var delay = i * 0.08;

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
							fuse_simple(firstFuse);
							firstFuse = false;
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
	slice=angle / (menuItemNum - 1);
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