var G_RobotUrl = 'http://www.rsteq.com:2001/?userid=MacWin.local&plain_text=1';
var ChatBotBar = {
    'initialize': function (placeholder, options) {
    	 var oDiv=document.getElementById(placeholder);
    	 if (oDiv!=null){
    	 	oDiv.innerHTML=
    	 "<div class='side-bar'>\
    	 	<div class='icon-chat' id='ChatBot'  onclick='ChatBotBar.onActBtnClick()'></div>\
    	 	<div class='chat-tips' id = 'ChatTips'>\
    	 		<i></i>\
				<div id='ChatBody'>\
		  			<div id='ChatContent'>\
		  				<div id='msg' style='overflow:hidden;'></div>\
		  				<div id='msg_end' style='height:0px; overflow:hidden'></div>\
		  			</div>\
		  			<div id='ChatBtn'>\
		  				<form name='chat' >\
		  					<input name='ChatValue' id='ChatValue'/>\
		  					<input name='Submit' type='button' value='发送' onclick='ChatBotBar.ChatSend(this.form);' />\
		  				</form>\
		  			</div>\
		  		</div>\
			</div>\
		</div>";

    	 }
    },
    
	'ChatSend' : function (obj){
    	var o = obj.ChatValue;
    	if (o.value.length>0){
    		$.ajax({
    			type: 'GET',
    			url: 'http://fanyi.youdao.com/openapi.do?keyfrom=giser-of-chinese&key=880693222&type=data&doctype=jsonp&version=1.1' ,
    			data: { q : o.value } ,
    			dataType: 'jsonp',
    			jsonpCallback:"show",
    			success:function(data) {
    				//alert(data);
      			},
      			error : function() {
      			}  
    		});
    		o.value='';
    	}
	},
	
	'onActBtnClick' : function (){
		document.getElementById("ChatBot").checked=!document.getElementById("ChatBot").checked;
		if(document.getElementById("ChatBot").checked){
            document.getElementById("ChatBot").style.backgroundColor = '#669fdd';
            document.getElementById("ChatTips").style.display='block';
            if(document.getElementById("msg").innerHTML.length<=0){
                $.ajax({
                    type: 'GET',
                    url: G_RobotUrl,
                    data: { text : 'GEOBOT BEGIN', botid:'Geonto' } ,
                    dataType: 'jsonp',
                    jsonpCallback:"jsonpCallback",
                    success:function(data) {
                    },
                    error : function() {
                        //alert("�쳣��");
                    }
                });
            }
		}
		else{
			document.getElementById("ChatBot").style.backgroundColor = 'transparent';
			document.getElementById("ChatTips").style.display='none';
		}
	}
};

isChinese = function(c) {
	return escape(c).indexOf( "%u" ) >= 0;
};

jsonpCallback = function (data) {
    if (data.result.length>0){
        var respText = data.result;
        var perfix = respText.substr(0, 1);
        var suffix = respText.substr(respText.length-1, 1);
        if (perfix == "{" && suffix == "}"){
            var res = eval("("+data.result+")");
            respText = res.text;
            switch(res.serviceName)
            {
                case "showCurrentViewWiki":
                {
                    showCurrentViewWiki(res.para);
                    break;
                }
                case "showCurrentViewWikiType":
                {
                    showCurrentViewWikiType(res.para);
                    break;
                }
                case "calcRelation":
                {
                    calcRelation(res.para);
                    break;
                }
            }
        }

        if (respText == "")
            respText = "小佳无法回答您的问题，请您换个问题!";

    	var rtag = /(.*)<([a-z]+)\s*\/?>(.*)<\/([a-z]+)\s*>(.*)/i;
    	var t = data.result.match(rtag);
    	if(isChinese(data.result)){
    		document.getElementById("msg").innerHTML += "<font color='green'><strong>小佳机器人:</strong>"+respText+"</font><br/>";
    		document.getElementById("msg_end").scrollIntoView(); 
    		return;
    	}
    	$.ajax({
    		type: 'GET',
    		url: 'http://fanyi.youdao.com/openapi.do?keyfrom=giser-of-chinese&key=880693222&type=data&doctype=jsonp&version=1.1' ,
    		data: { q :data.result } ,
    		dataType: 'jsonp',
    		jsonpCallback:"show_chinese",
    		success:function(rt) {
    			document.getElementById("msg").innerHTML += "<font color='green'><strong>小佳机器人:</strong>"+rt.translation[0]+"</font><br/>";
    			document.getElementById("msg_end").scrollIntoView(); 
    		}
    	});
    }
};

show =  function (v) {
	var rt = v.translation;
	if(rt.length > 0){
		var eTxt = rt[0].replace("'","\'");
    	document.getElementById("msg").innerHTML += "<font color='black'><strong>>></strong>" + v.query + "</font><br/>";
    	document.getElementById("msg_end").scrollIntoView(); 
    	$.ajax({
    		type: 'GET',
    		url: G_RobotUrl,
    		data: { text : eTxt, botid:'Geonto' } ,
    		dataType: 'jsonp',
    		jsonpCallback:"jsonpCallback",
    		success:function(data) {
    		},
    		error : function() {
    			//alert("�쳣��");  
    		}  
    	});
    }
};

initChatBotBar = function (placeholder, options) {
    return ChatBotBar.initialize(placeholder, options);
};

// 显示当前视图范围的地理百科要素
showCurrentViewWiki = function(para){
    document.getElementById("btnView").click();
};

// 查询当前视图范围内某类型的地理百科要素
showCurrentViewWikiType = function(para){
    require(['hummingUtil', 'hummingMap'], function(HMUtil, HMMap){
        var geoCatalog = HMUtil.G_GeoCatalog;
        var code = getGBCode(geoCatalog, para[0]);
        var e = {
            gb: code
        };
        HMMap.showSpaTypeWiki(e);
    });
};

getGBCode = function(calalog, key){
    for (var i=0; i<calalog.length; i++){
        var geoObj = calalog[i];
        if (key == geoObj.key){
            return geoObj.GB;
        }
    }
    return "";
};

// 计算地理要素之间的关系
calcRelation = function(para){
    require(['hummingMap'], function(HMMap){
        HMMap.robotCalcRelation(para);
    });
};