
var orgX, orgY, orgPath;
var orgData;
var orgDist1, orgDist2;
var inited = false;
var feature;
var editorTool;
var map;
var editor;
var editing = false;
var distPolygon1, distPolygon2;
var distData1 = null, distData2 = null;
var allDistJson;
var picUploaders = new Array();
var singlePicInfoArray = [
    ["DXCG", "地形图", 455],
    ["TSCG", "图式图像", 160],
    ["SJCG", "实景图片", 564],
    ["SJQJ", "实景全景", 800],
    ["SJHR", "实景环绕", 700],
    ["YGCG", "遥感图像", 700],
    ["LTCG", "立体图像", 700],
    ["SYCG", "示意图像", 700]
];
var multiPicInfoArray = [
    ["SJDJ", "实景多角度", 700],
    ["SJDS", "实景多时相", 219],
    ["YGDS", "遥感多时相", 720]
];

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

$(function() {

    var idStr = getQueryString("id");
    if(idStr && "" != idStr) {  //  修改界线
        $.ajax({
            url: 'getBoundInfoById.action?id=' + idStr,
            type: 'get',
            dataType: 'json',
            success: function (bound_data) {
                orgData = bound_data;

                consPicsListContent(idStr, bound_data);
                consMainContent(bound_data);

                consUploaders(bound_data);
                var leftDistId = bound_data.Left_;
                var rightDistId = bound_data.Right_;
                $.when(
                    $.ajax({
                        url: 'getDistInfoByNum.action?id=' + leftDistId,
                        type: 'get',
                        dataType: 'json',
                        success: function (dist_data) {
                            distData1 = dist_data;
                            orgDist1 = dist_data;
                        },
                        error: function (dist_data) {
                        }
                    }),
                    $.ajax({
                        url: 'getDistInfoByNum.action?id=' + rightDistId,
                        type: 'get',
                        dataType: 'json',
                        success: function (dist_data) {
                            distData2 = dist_data;
                            orgDist2 = dist_data;
                        },
                        error: function (dist_data) {
                        }
                    })).done(function() {
                    mapInit(bound_data);
                    initSelectLists();
                    inited = true;
                });

            },
            error: function (bound_data) {
            }
        });
    } else {    //新增界线
        var distidStr = getQueryString("distid");

        $.ajax({
            url: 'getDistInfoByNum.action?id=' + distidStr,
            type: 'get',
            dataType: 'json',
            success: function (dist_data) {
                distData1 = dist_data;
                orgDist1 = dist_data;
                var bound_data = {
                    'name': '新增界线',
                    'Left_': distidStr,
                    'LeftName': dist_data.name,
                    'Grade': dist_data.Grade,
                    'AdminGrade': dist_data.AdminGrade,
                    'newbound':true,
                }


                orgData = bound_data;

                consPicsListContent(bound_data.name, bound_data);
                consMainContent(bound_data);

                consUploaders(bound_data);
                mapInit(bound_data);
                initSelectLists();
                inited = true;
            },
            error: function (dist_data) {
            }
        });

    }


});

function setChildIds(treedata) {
    if(!treedata.children) {
        return;
    }
    for(var i = 0; i < treedata.children.length; i++) {
        var child = treedata.children[i];
        child['childid'] = i;
        child['p'] = treedata.name;
        if(treedata.childid) {
            child['pchildid'] = treedata.childid;
        }
        if(treedata.pchildid) {
            child['gpchildid'] = treedata.pchildid;
        }
        setChildIds(child);
    }
}

function initSelectLists() {
    //获取json数据
    var url = "getEasyDistInfoWithZeroChilds.action";
    $.getJSON(url, function(data) {
        // setChildIds(data[0]);
        allDistJson = data;
        // province();
        var i = 0;
        $(".selectList").each(function(){
            i++;
            var num = i;
            var areaJson = data[0].children;
            var temp_html;
            var oProvince = $(this).find(".cityselect");
            var oCity = $(this).find(".countyselect");
            var oDistrict = $(this).find(".streetselect");
            //初始化省
            var province = function(){
                $.each(areaJson,function(i, province){
                    temp_html += "<option value='"+province.name+"'>"+province.name+"</option>";
                });
                oProvince.html(temp_html);
                city();
            };
            //赋值市
            var city = function(){
                temp_html = "";
                var n = oProvince.get(0).selectedIndex;
                var provinceChildren = areaJson[n].children;
                if(provinceChildren) {
                    $.each(provinceChildren,function(i,city){
                        temp_html+="<option value='"+city.name+"'>"+city.name+"</option>";
                    });
                }
                oCity.html(temp_html);
                county();
            };
            //赋值县
            var county = function(){
                temp_html = "";
                var m = oProvince.get(0).selectedIndex;
                var n = oCity.get(0).selectedIndex;
                // if(typeof(areaJson[m].children[n].children) == "undefined"){
                    // oDistrict.css("display","none");
                if(m < 0 || n < 0){
                    oDistrict.html(temp_html);
                } else {
                    oDistrict.css("display","inline");
                    var cityChildren = areaJson[m].children[n].children;
                    if(cityChildren) {
                        $.each(cityChildren,function(i,district){
                            temp_html+="<option value='"+district.name+"'>"+district.name+"</option>";
                        });
                    }
                    oDistrict.html(temp_html);
                }
            };
            //选择省改变市
            oProvince.change(function(e){
                city();
                if(inited) {
                    changeDist(num);
                }
            });
            //选择市改变县
            oCity.change(function(e){
                county();
                if(inited) {
                    changeDist(num);
                }
            });
            oDistrict.change(function(e){
                if(inited) {
                    changeDist(num);
                }
            });
            province();
        });
        toSelect(orgDist1, 1);
        toSelect(orgDist2, 2);
    });

}

function changeDist(num) {
    var cityDiv = $("#city" + num)[0];
    var countyDiv = $("#county" + num)[0];
    var streetDiv = $("#street" + num)[0];
    var cii = cityDiv.selectedIndex;
    var coi = countyDiv.selectedIndex;
    var sti = streetDiv.selectedIndex;
    var cityname = cii < 0 ? "" : cityDiv.options[cii].innerText;
    var countyName = coi < 0 ? "" : countyDiv.options[coi].innerText;
    var streetName = sti < 0 ? "" : streetDiv.options[sti].innerText;

    // if(cityname && countyName && streetName) {
        var distJson = findDist(cityname, countyName, streetName);
        if(num == 1) {
            setDistPolygon(distJson, "left");
        } else if(num == 2) {
            setDistPolygon(distJson, "right");
        }
    // }

}

function findMatch(singledata, alldata) {
    if(singledata.id == alldata.id) {
        return alldata;
    }
    if(!alldata.children) {
        return null;
    }
    for(var i = 0 ; i < alldata.children.length; i++) {
        var child = alldata.children[i];
        if(child.id == singledata.id) {
            return child;
        } else {
            var test = findMatch(singledata, child);
            if(test) {
                return test;
            }
        }
    }
    return null;
}

function toSelect(dist, num) {
    // var cityname, countyname, streetname;
    var cityci, countyci, streetci;
    // var dist = findMatch(origindist ,allDistJson[0]);
    if(dist.AdminGrade == "5") {
        streetci = dist.childid;
        countyci = dist.pchildid;
        cityci = dist.gpchildid;
        $("#city" + num)[0].selectedIndex = cityci;
        $("#city" + num).trigger("change");
        $("#county" + num)[0].selectedIndex = countyci;
        $("#county" + num).trigger("change");
        $("#street" + num)[0].selectedIndex = streetci;
        $("#street" + num).trigger("change");
        // streetname = dist.name;
        // countyname = dist.parent.name;
        // cityname = dist.parent.parent.name;
        // $("#city" + num).selectedItem = cityname;
        // $("#county" + num).selectedItem = countyname;
        // $("#street" + num).selectedItem = streetname;
    } else if(dist.AdminGrade == "4") {
        countyci = dist.childid;
        cityci = dist.pchildid;
        $("#city" + num)[0].selectedIndex = cityci;
        $("#city" + num).trigger("change");
        $("#county" + num)[0].selectedIndex = countyci;
        $("#county" + num).trigger("change");
        // countyname = dist.name;
        // cityname = dist.parent.name;
        // $("#city" + num).selectedItem = cityname;
        // $("#county" + num).selectedItem = countyname;
    } else if(dist.AdminGrade == "3") {
        cityci = dist.childid;
        $("#city" + num)[0].selectedIndex = cityci;
        $("#city" + num).trigger("change");
        // cityname = dist.name;
        // $("#city" + num).selectedItem = cityname;
    }
}

function findDist(cityname, countyname, streetname) {
    var city = findSubDist(allDistJson[0], cityname);
    if (city == null) {
        return ntull;
    }
    var county = findSubDist(city, countyname);
    if (countyname == null) {
        return null;
    }
    var dist = findSubDist(county, streetname);
    return dist;
}

function findSubDist(superDist, subname) {
    if(subname == null || "" == subname) {
        return superDist;
    }
    for(var i = 0; i < superDist.children.length; i++) {
        var json = superDist.children[i];
        if(subname == json.name) {
            return json;
        }
    }
    return superDist;
}

function createDistPolygon(distjson) {
    if(!distjson || !distjson.path) {
        return null;
    }
    var pathArr = JSON.parse(distjson.path);
    var polygon = new AMap.Polygon({
        zIndex: 40,
        extData: distjson,
        path: pathArr,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 1,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35//填充透明度
    });
    // polygon.setMap(map);
    return polygon;
}

function setDistPolygons() {
    setDistPolygon(distData1, "left");
    setDistPolygon(distData2, "right");

}

function setDistPolygon(distjson, direct) {
    var polygon = createDistPolygon(distjson);
    if("left" == direct) {
        if(distPolygon1 != null) {
            distPolygon1.hide();
            map.remove(distPolygon1);
            distPolygon1.setMap(null);
        }
    } else  if("right" == direct) {
        if (distPolygon2 != null) {
            distPolygon2.hide();
            map.remove(distPolygon2);
            distPolygon2.setMap(null);
        }
    }
    if(polygon != null) {
        if("left" == direct) {
            distData1 = distjson;
            distPolygon1 = polygon;
            distPolygon1.setMap(map);
        } else if("right" == direct) {
            distData2 = distjson;
            distPolygon2 = polygon;
            distPolygon2.setMap(map);
        }
    }
}

function consUploaders(data) {
    var picInfoArr = singlePicInfoArray.concat(multiPicInfoArray);
    for(var i = 0; i < picInfoArr.length; i++) {
        var typecode = picInfoArr[i][0];
        var typename = picInfoArr[i][1];
        var picnum = parseInt(data[typecode]);
        var uploader = uploadImage({
            wrap: jQuery("#uploader" + typecode), //包裹整个上传控件的元素，必须。可以传递dom元素、选择器、jQuery对象
            /*预览图片的宽度，可以不传，如果宽高都不传则为包裹预览图的元素宽度，高度自动计算*/
            //width: "160px",
            height: 150,//预览图片的高度
            auto: false, //是否自动上传
            method: "POST",//上传方式，可以有POST、GET
            sendAsBlob: false,//是否以二进制流的形式发送
            viewImgHorizontal: true,//预览图是否水平垂直居中
            fileVal: "file", // [默认值：'file'] 设置文件上传域的name。
            btns: {//必须
                uploadBtn: $("#upload_now" + typecode), //开始上传按钮，必须。可以传递dom元素、选择器、jQuery对象
                retryBtn: null, //用户自定义"重新上传"按钮
                chooseBtn: '#choose_file_' + typecode,//"选折图片"按钮，必须。可以传递dom元素、选择器、jQuery对象
                chooseBtnText: "选择本地图片" //选择文件按钮显示的文字
            },
            pictureOnly: true,//只能上传图片
            datas: {
                "uuid": new Date().getTime()
            }, //上传的参数,如果有参数则必须是一个对象
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！false为不压缩
            resize: false,
            //是否可以重复上传，即上传一张图片后还可以再次上传。默认是不可以的，false为不可以，true为可以
            duplicate: false,
            multiple: true, //是否支持多选能力
            swf: "Uploader.swf", //swf文件路径，必须
            url: "index2.html", //图片上传的路径，必须
            maxFileNum: 20, //最大上传文件个数
            maxFileTotalSize: 10485760, //最大上传文件大小，默认10M
            maxFileSize: 2097152, //单个文件最大大小，默认2M
            showToolBtn: true, //当鼠标放在图片上时是否显示工具按钮,
            onFileAdd: null, //当有图片进来后所处理函数
            onDelete: null, //当预览图销毁时所处理函数
            /*当单个文件上传失败时执行的函数，会传入当前显示图片的包裹元素，以便用户操作这个元素*/
            uploadFailTip: null,
            onError: null, //上传出错时执行的函数
            notSupport: null, //当浏览器不支持该插件时所执行的函数
            /*当上传成功（此处的上传成功指的是上传图片请求成功，并非图片真正上传到服务器）后所执行的函数，会传入当前状态及上一个状态*/
            onSuccess: null
        });
        for(var j = 0; j < picnum; j++) {
            var picpath;
            if(i < singlePicInfoArray.length) {
                picpath = "../data/wikiContent/place/" + placenickname + "/" +
                    placenickname + typename + ".jpg";
            } else{
                picpath = "../data/wikiContent/place/" + placenickname + "/" +
                    placenickname + typename + (j + 1) + ".jpg";
            }
//						var fso = new ActiveXObject("Scripting.FileSystemObject");
//						var file = fso.GetFile(picpath);
//						uploader.onFileQueued(file);
            uploader.onInitImg(picpath, typecode + "def" + (j + 1));
        }

        /*如果按钮开始是隐藏的，经过触发后才显示，则可以用这个方法重新渲染下*/
        //uploader.refresh();//该方法可以重新渲染选择文件按钮
        //uploader.upload();//调用该方法可以直接上传图片
        //uploader.retry();//调用该方法可以重新上传图片
        //console.log(uploader);
        picUploaders.push(uploader);
    }
}

function mapInit(data) {
    inited = false;

    AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {

        map = new AMap.Map('mapContainer', {
            resizeEnable: true,
            center: data.position,
            zoom: 15,
            keyboardEnable: false,
        });
        map.on('complete', function () {
            map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function () {
                map.addControl(new AMap.ToolBar);
                map.addControl(new AMap.OverView({isOpen: true}));
                map.addControl(new AMap.Scale);
                map.addControl(new BasicControl.LayerSwitcher({position: 'rt'}));
            });
        });
        // consBasicCotent(data, "X", "xpos");
        // consBasicCotent(data, "Y", "ypos");
        consBasicCotent(data, "path", "pathtext");

        if(data.newbound) {
            editorTool = new AMap.MouseTool(map);
            AMap.event.addListener( editorTool,'draw',function(e){ //添加事件
                var path = e.obj.getPath();
                var tmpdata = {"path": path };
                consBasicCotent(tmpdata, "path", "pathtext");
                editorTool.close(false);
            });
        } else {
            var lineArr = JSON.parse(data.path);
            orgPath = lineArr;
            editor = {};
            editor._line = (function () {
                var lineArr = JSON.parse(data.path);
                orgPath = lineArr;
                var polyline = new AMap.Polyline({
                    map: map,
                    zIndex: 3,
                    extData: data,
                    title: data.name,
                    path: lineArr,          //设置线覆盖物路径
                    extData: data,
                    strokeColor: "#0000FF", //线颜色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: 5,        //线宽
                    strokeStyle: "solid",   //线样式
                    strokeDasharray: [10, 5] //补充线样式
                });
                return polyline;
            })();
            feature = editor._line;
            AMap.event.addListener(feature, "change", lineEdit);
            editor._lineEditor = new AMap.PolyEditor(map, editor._line);
            editor.startEditLine = function () {
                editor._lineEditor.open();
            }
            editor.closeEditLine = function () {
                editor._lineEditor.close();
            }
        }

        setDistPolygons();
        map.setFitView();
    });
}

function lineEdit() {
    var editline = editor._line;
    var newpath = editline.getPath();
    var newpathstr = toPathString(newpath);
    var tmpdata = {"path": newpathstr};
    consBasicCotent(tmpdata, "path", "pathtext");
}

function toPathString(pathdata) {
    var pathstr = "[";
    for(var i = 0; i < pathdata.length; i++) {
        var pdata = pathdata[i];
        var str = "[" + pdata.lng + ", " + pdata.lat +"]";
        if(i != pathdata.length - 1) {
            str += ",";
        }
        pathstr += str;
    }
    pathstr += "]";
    return pathstr;
}

function startEdit() {
    if(orgData.newbound) {
        editorTool.close(true);
        var drawPolyline = editorTool.polyline(); //用鼠标工具画折线
    } else {
        $('#pathtext').attr("disabled",false);
        editor.startEditLine();
    }
    editing = true;

}

function stopEdit() {
    document.getElementById("pathtext").disabled = "true";
    if(orgData.newbound) {
        if(editing) {
            alert('请在地图上双击完成绘制!');
        }
        // editorTool.close(false);
    } else {
        editor.closeEditLine();
    }
    editing = false;
}

function discardEdit() {
    stopEdit();
    if(orgData.newbound) {
        editorTool.close(true);
    } else {
        map.remove(feature);
    }
    map.clearMap(orgData);
    mapInit(orgData);
    initSelectLists();
    inited = true;
}

function onchangeXYtext() {
    // if(spaType == "1") {
    //     var xText = document.getElementById("xpos").value;
    //     var yText = document.getElementById("ypos").value;
    //     var x = parseFloat(xText);
    //     var y = parseFloat(yText);
    //     var pos = [x, y];
    //     feature.setPosition(pos);
    // }
}

function onchangePathText() {
    var pathText = document.getElementById("pathtext").value;
    var lineArr = JSON.parse(pathText);
    feature.setPath(lineArr);
}

function consBasicCotent(data, attaname, divname) {
    if(data[attaname]) {
        document.getElementById(divname).value = data[attaname];
    }
}

function consDetailedContent(data, attaname, divname) {
    if(data[attaname]) {
        var org = data[attaname];
        var str = org.replace(/\<br\/\>/g,"\r\n &nbsp;&nbsp;&nbsp;&nbsp;")
//			str = str.replace(/\n/g,"<br>&nbsp;&nbsp;&nbsp;&nbsp;");
        document.getElementById(divname).innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + str;
    }
}

function consMainContent(data) {

    var name = data['name'];
    document.title = name + " - 行政界线编辑";
    // var bc = data['大类'],sc = data['小类'];
    var bc = "行政界线", sc = name;
    document.getElementById("name0").setAttribute("value", name);
    if(data.newbound) {
        document.getElementById("doctitle").innerHTML = "新增行政界线";
    } else {
        document.getElementById("doctitle").innerHTML = "编辑界线：" + name;
    }

    document.getElementById("bigclass1").innerHTML = bc;
    document.getElementById("smallclass1").innerHTML = sc;
    document.getElementById("bigclass2").innerHTML = "地名一张图";
    document.getElementById("smallclass2").innerHTML = bc;
    document.getElementById("name2").innerHTML = name;
    // document.getElementById("smallclass3").innerHTML = sc;

    consBasicCotent(data, "name", "stdname");
    consBasicCotent(data, "Grade", "admingrade");
    consBasicCotent(data, "markNum", "marknum");
    consBasicCotent(data, "createTime","createtime");
    consBasicCotent(data, "updateTime","updatetime");

    // consDetailedContent(data, "地名含义","hanyi");
    // consDetailedContent(data, "地名来历","laili");
    // consDetailedContent(data, "历史沿革","yange");
    // consDetailedContent(data, "地理实体描述","miaoshu");
    // consDetailedContent(data, "资料来源及出处","ziliao");

}

function consPicsListContent(placename, data) {

    var sharp = 2;

    for(var i = 0; i < singlePicInfoArray.length; i++) {
        var info = singlePicInfoArray[i];
        consListContent(placename, ++sharp, info[0], info[1], info[2]);
    }

    for(var i = 0; i < multiPicInfoArray.length; i++) {
        var info = multiPicInfoArray[i];
        var typecode = info[0];
        var num = data[typecode];
        consListMultiContent(placename, ++sharp, typecode, info[1], info[2]);
    }

}

function consListContent(nickname, sharp, typecode, typename, fwitdh) {
    // var lis = consListItem(sharp, typename);
    // document.getElementById("hidesection").innerHTML += lis;
    var cont = consPicCont(nickname, sharp, typecode, typename, fwitdh);
    document.getElementById("details").innerHTML += cont;
}

function consListMultiContent(nickname, sharp, typecode, typename, fwitdh, numStr) {
    // var lis = consListItem(sharp, typename);
    // document.getElementById("hidesection").innerHTML += lis;
//		var cont = consMultiPicCont(nickname, sharp, typecode, typename, fwitdh, numStr);
    var cont = consPicCont(nickname, sharp, typecode, typename, fwitdh);
    document.getElementById("details").innerHTML += cont;
}

function consListItem(sharp, typename) {
    var str = "<li style=\"display:none\">&#8226; <a href=\"#" + sharp +"\">" + typename + "</a></li>";
    return str;
}

function consPicCont(nickname, sharp, typecode, typename, fwitdh) {

    var url1 = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + ".jpg";
    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
    var str4 = "<div id='uploader" + typecode + "'></div> <div class='choose-file-btn' id='choose_file_" +
        typecode + "'>选择图片</div>";
    var recon = str1 + str2 + str4;
    return recon;


}

function consMultiPicCont(nickname, sharp, typecode, typename, fwitdh, numStr) {

    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
    var str3 =	"<div class='content_topp'><p></p><p></p>";
    var reg1 = new RegExp("typename","g"); //创建正则RegExp对象
    var mul = "";
    var num = parseInt(numStr);
    for(var i = 0; i < num; i++) {
        var url = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + (i+1) + ".jpg";
        var reg = new RegExp("url","g"); //创建正则RegExp对象
        var s1 = "<div class='img img_l' style='width: " + fwitdh +"px;'>";
        var s2tmp = "<a title='typename' href='url' target='_blank'><img title='typename' alt='typename' src='url' /></a>";
        var s2tmp1 = s2tmp.replace(reg1, typename);
        var s2 = s2tmp1.replace(reg, url);
        var s3 = "<span style='clear: both; display: block; padding-top: 10px; color: rgb(51, 51, 51);'>"
            +typename+"</span></div>";
        mul += (s1 + s2 + s3);
    }
    var str5 = "</div>";
    var recon = str1 + str2 + str3 + mul + str5;
    return recon;
}

function partsection(){
    $('#fullsection').css('display','block');
    $('#partsection').css('display','none');
    $("#hidesection > li:gt(3)").css('display','none');
}

function fullsection(){
    $('#fullsection').css('display','none');
    $('#partsection').css('display','block');
    $("#hidesection > li:gt(3)").css('display','block');
}


function resetFun() {
    $('#btn-dialogBox').dialogBox({
        hasClose: true,
        hasBtn: true,
        confirmValue: '确定',
        confirm: function(){
            // alert('this is callback function');
            document.location.reload();
        },
        cancelValue: '取消',
        title: '重置页面',
        content: '确定放弃现有的编辑，重新填写？'
    });
}

function deleteFun(typename) {
    $('#btn-dialogBox').dialogBox({
        hasClose: true,
        hasBtn: true,
        confirmValue: '确定',
        confirm: function(){
            // alert('this is callback function');
            document.location.reload();
        },
        cancelValue: '取消',
        title: '删除' + typename,
        content: '确定删除该' + typename + '？'
    });
}

function submitFun() {
    $('#btn-dialogBox').dialogBox({
        hasClose: true,
        hasBtn: true,
        confirmValue: '确定',
        confirm: function(){
            // alert('this is callback function');

        },
        cancelValue: '取消',
        title: '提交编辑',
        content: '完成地名编辑，提交本页面？'
    });
}




