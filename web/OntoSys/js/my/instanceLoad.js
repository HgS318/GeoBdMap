
function load() {
	setInterval(test0,500);
}

function test0() {
	try {
		var textBox=document.getElementById("ModelName");
		var fileBox=document.getElementById("Upload");
		var textValue=textBox.value,fileName=fileBox.value;
		if(textValue==null||""==textValue) {
			textBox.value=fileName;
			var splashId=Math.max(fileName.lastIndexOf('\\'),fileName.lastIndexOf('/'))
			var dotId=fileName.lastIndexOf('.');
			var fileValue="";
			if(dotId<0&&splashId<0) {
				fileValue = fileName;
			} else if(dotId>-1&&splashId<0) {
				fileValue = fileName.substring(0,dotId);
			} else if(dotId<0&&splashId>-1) {
				fileValue = fileName.substring(splashId+1);
			} else {
				fileValue = fileName.substring(splashId+1, dotId);
			}
			var barId= fileValue.lastIndexOf('-');
			if(barId<0) {
				textBox.value = fileValue;
			} else {
				textBox.value = fileValue.substring(0,barId);
			}
		}
	} catch (e) {
	}
}

function callback(msg) {   
    //document.getElementById("file").outerHTML = document.getElementById("file").outerHTML;
    document.getElementById("msg").innerHTML = "<font color=red>"+msg+"</font>";   
}

var prog=0;

function doProgressLoop() { 
    if (prog < 100) {
	    setTimeout("getProgress()", 500);
	    setTimeout("doProgressLoop()", 800);
    }
}

function getProgress() {
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
				callback(msg);
			} else if(404==xmlhttp.status) {
				
			}
		}
	}
	xmlhttp.open("get","ProgressServlet.do1",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send(null);
}
   
function fSubmit()
{
	callback("正在上传文件... 0 % 已上传");
	getProgress();
	doProgressLoop();
	document.getElementById("form1").submit();
}