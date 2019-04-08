var numt=1;
var logined=false;
function addTexture() {
	numt++;
	var table=document.getElementById("table3");
	newRow = table.insertRow(numt-1);
	var c1="<td><label>纹理"+numt+":</label></td>",
		c2="<td><input type='file' id='texture'"
			+" name='texture'/></td>";
	newRow.innerHTML="<tr>"+c1+c2+"</tr>";
}

function load() {
	setInterval(test0,500);
}

function test0() {
	try {
		var textBox=document.getElementById("ModelName");
		var fileBox=document.getElementById("modelFile");
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

