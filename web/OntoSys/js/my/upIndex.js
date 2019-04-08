
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
			var splashId=Math.max(fileName.lastIndexOf('\\'),fileName.lastIndexOf('/')); 
			if(splashId>-1) {
				textBox.value=fileName.substring(splashId+1);
			}
		}
	} catch (e) {
	}
}

function callback(msg) {   
    //document.getElementById("file").outerHTML = document.getElementById("file").outerHTML;   
    document.getElementById("msg").innerHTML = "<font color=red>"+msg+"</font>";   
}
