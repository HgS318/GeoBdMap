
var geoEntities = [];

var simpleTextLen = 48;

function initGeoEntities() {

    $.ajax({
//                url:"getAllSynData.action",
        url:"getAllGeoEntities.action",
//                url:"http://localhost:8081/GeoBdMap/getAllGeoEntities",
        type: 'get',
        dataType: 'json',
        success:function(syn_data) {
            var dataJson = syn_data;
            for (var i = 0; i < dataJson.length; i++) {
                var entity = dataJson[i];
                var content = createContent(entity);

                var pointStr = entity['position'];
                if(pointStr != null && pointStr != undefined) {
                    var pointArray = pointStr.split(",");
                    var X = pointArray[0];
                    var Y = pointArray[1];
                    var Point = new BMap.Point(X, Y);
                    var marker = new BMap.Marker(Point);
                    marker.spaType = 1;
                    addOverlayAndWin(marker, entity, content, geoEntities);
                }
                var lineStr = entity['line'];
                if(lineStr != null && lineStr != undefined) {
                    var polyline = getFigureJson(lineStr, "line", geoEntities);
                    polyline.spaType = 3;
                    addOverlayAndWin(polyline, entity, content, geoEntities);
                }
                var polygonStr = entity['polygon'];
                if(polygonStr != null && polygonStr != undefined) {
                    var polygon = getFigureJson(polygonStr, "polygon");
                    polygon.spaType = 5;
                    addOverlayAndWin(polygon, entity, content, geoEntities);
                }
                var shapes = entity['shapes'];
                if(shapes != null && shapes != undefined && shapes.length > 0) {
                    for(var j = 0; j < shapes.length; j++) {
                        var shapeJson = shapes[j];
                        var spaType = shapeJson['spaType'];
                        var shape = shapeJson['shape'];
                        var overlay = getFigureByStr(shape, spaType);
                        addOverlayAndWin(polygon, entity, content, geoEntities);
                    }
                }
                if((entity['shapes'] == null || entity['shapes'] == "") && (entity['position'] == null || entity['position'] == "")
                   && (entity['line'] == null || entity['line'] == "") && (entity['polygon'] == null || entity['polygon'] == "")
                    && entity['name'] != null && entity['name'] != undefined && entity['name'] != "") {
                    var name = entity['name'];
                    var bdary = new BMap.Boundary();
                    bdary.get(name, function(rs){       //获取行政区域
                        var count = rs.boundaries.length; //行政区域的点有多少个
                        for(var i = 0; i < count; i++){
                            console.log(rs.boundaries[i]);
                            var distPolygon = new BMap.Polygon(rs.boundaries[i]);
                            distPolygon.spaType = 5;
                            addOverlayAndWin(distPolygon, entity, content, geoEntities);
                        }
                    });
                    // var distPolygon = getDistBaiduPolygon(entity['name']);
                    // distPolygon.spaType = 5;
                    // addOverlayAndWin(distPolygon, entity, content, geoEntities);
                }
            }
            setResultItems(geoEntities, "placeresults", "entity");
            $("#placeintotal")[0].innerHTML = "位置信息：" + geoEntities.length + "条记录";
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

function getDistBaiduPolygon(name) {
    var bdary = new BMap.Boundary();
    bdary.get(name, function(rs){       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        for(var i = 0; i < count; i++){
            var ply = new BMap.Polygon(rs.boundaries[i]);
        }
    });
}

function showGeoEntities() {
    for(var i = 0; i < geoEntities.length; i++) {
        geoEntities[i].show();
    }
}

function hideGeoEntities() {
    for(var i = 0; i < geoEntities.length; i++) {
        geoEntities[i].hide();
    }
}

function createContent(entity) {
    if(entity.infoAmount === undefined || entity.infoAmount == null) {
        return createSimpleContent(entity);
    }
    var content = "";
    if(entity['infoAmount'] != null && entity['infoAmount'] != undefined) {
        content += '<strong>图形</strong>： (信息量: ' + entity['infoAmount']['figureLength'] + ' 字节)<br/>';
    }
    if(entity.address != null && entity.address != undefined) {
        content += '&nbsp;&nbsp;地址：' + entity.address + '<br/>';
    }
    if(entity['text'] != null) {
        content += '<strong>文本</strong>： (信息量: ' + entity['infoAmount']['textLenth'] + ' 字节)<br/>';
        if(entity.infoAmount != undefined && entity.infoAmount != null) {
            for (var j = 0; j < entity['text'].length; j++) {
                var content_text = entity['text'][j];
                if (content_text.length > 56) {
                    content += ('&nbsp;&nbsp;&nbsp;&nbsp;' + content_text.substring(0, 53) + '...' + '<br/>' );
                } else {
                    content += ('&nbsp;&nbsp;&nbsp;&nbsp;' + content_text + '<br/>' );
                }
            }
        }
    }
    if(entity['texts'] != null) {
        // content += "<strong>文字</strong>";
        for(var j = 0; j < entity['texts'].length; j++) {
            var text = entity['texts'][j];
            if(text.length > 56) {
                text = text.substring(0, 53) + '...';
            }
            content += "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>&nbsp;&nbsp;&nbsp;&nbsp;" + text + "</p>";
        }
    }
    if(entity['flashes'] != null && entity['flashes'].length > 0) {
        content += '<strong>动画</strong>： (信息量: ' + entity['infoAmount']['flashLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['flashes'].length; j++) {
            var flash_path = entity['flashes'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + flash_path + '' +
            ' onclick="openWindowY(this, \'flash\', \'' + flash_path + '\')">动画' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['images'] != null && entity['images'].length > 0) {
        content += '<strong>图像</strong>： (信息量: ' + entity['infoAmount']['imageLength'] + ' 字节)<br/>';
        for (var j = 0; j < entity['images'].length; j++) {
            var img_path = entity['images'][j];
//                                content += "<img src='" + img_path + "' class='img' alt='' onclick='openWindowY(img_path)'"
//                                        + "style='zoom:1;overflow:hidden;width:50px;height:50px;'/>";
            content += '&nbsp;&nbsp;<img src=' + img_path + ' class="img" onclick="openWindowY(this, \'image\')" ' +
                'alt="" style="zoom:1;overflow:hidden;width:50px;height:50px;"/>'

        }
        content += '<br/>';
    }
    if(entity['audios'] != null && entity['audios'].length > 0) {
        content += '<strong>音频</strong>： (信息量: ' + entity['infoAmount']['audioLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['audios'].length; j++) {
            var audio_path = entity['audios'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + audio_path + ' onclick="openWindowY(this, \'audio\', \'' +
            audio_path + '\', \'' +
            (entity['name'] + ' 音频' + (j + 1)) + '\')">音频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['vedios'] != null && entity['vedios'].length > 0) {
        content += '<strong>视频</strong>： (信息量: ' + entity['infoAmount']['vedioLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['vedios'].length; j++) {
            var vedio_path = entity['vedios'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + vedio_path + '' +
                ' onclick="openWindowY(this, \'vedio\', \'' + vedio_path + '\')">视频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['models'] != null && entity['models'].length > 0) {
        content += '<strong>模型</strong>： (信息量: ' + entity['infoAmount']['modelLength'] + ' 字节)<br/>';
        for (var j = 0; j < entity['models'].length; j++) {
            var model_paths = entity['models'][j];
            var model_pic = model_paths.split(':');
            var model_path = model_pic[0];
            var model_pic = model_pic[1];
            content += '<a href="' + model_path + '"> <img class="img" alt="" ' +
                'style="zoom:1;overflow:hidden;width:50px;height:50px;" src="' + model_pic + '" /> </a>';
        }
        content += '<br/>';
    }
    if(entity['links'] != null && entity['links'].length > 0) {
        content += "<br/>";
        for (var j = 0; j < entity['links'].length; j++) {
            var link = entity['links'][j];
            var linkContent = "&nbsp;&nbsp;&nbsp;<a href='#' onclick='openContentWindow(\"" + link
                + "\", \"查看原网页\",650, 520, 30, 30)'>查看链接" + (j + 1) + "</a>";
            content += linkContent;
        }
    }
    content += '</div>';
    return content;
}

function createSimpleContent(entity) {

    var content = "";
    if(entity.address != null && entity.address != undefined) {
        content += '&nbsp;&nbsp;地址：' + entity.address + '<br/><br/>';
    }
    if(entity['text'] != null) {
        content +=  "&nbsp;&nbsp;&nbsp;&nbsp;" + entity['text'] + "<br/>";
    }
    var linkShown = false;
    if(entity['texts'] != null) {
        // content += "<strong>文字</strong>";
        if(simpleTextLen == undefined || simpleTextLen == null || simpleTextLen == 0) {
            simpleTextLen = 48;
        }
        if(simpleTextLen != 48) {
            content += "<br/><strong>网页文本</strong>";
        }
        var textsLen = entity['texts'].length;
        if(textsLen < 5 && entity['links'] != null && entity['links'].length == textsLen) {
            for(var j = 0; j < textsLen; j++) {
                var text = entity['texts'][j];
                if(text.length > simpleTextLen) {
                    text = text.substring(0, simpleTextLen - 3) + '...';
                }
                var linkContent = "&nbsp;&nbsp;&nbsp;<a href='#' onclick='openContentWindow(\""
                    + entity['links'][j] + "\", \"查看原网页\",650, 520, 30, 30)'>链接</a>";
                content += "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'>" + text + linkContent + "</p>";
            }
            linkShown = true;
        } else {
            var showTextNum = textsLen > 4 ? 4 : showTextNum;
            for(var j = 0; j < showTextNum; j++) {
                var text = entity['texts'][j];
                if(text.length > simpleTextLen) {
                    text = text.substring(0, simpleTextLen - 3) + '...';
                }
                content += "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:1em'>" + text + "</p>";
            }
        }
    }
    if(linkShown == false && entity['links'] != null && entity['links'].length > 0) {
        content += "<br/>";
        if(entity['links'].length == 1) {
            content += ("&nbsp;&nbsp;&nbsp;<a href='#' onclick='openContentWindow(\""
                + entity['links'][0] + "\", \"查看原网页\",650, 520, 30, 30)'>链接</a>");
        } else {
            for (var j = 0; j < entity['links'].length; j++) {
                var link = entity['links'][j];
                var linkContent = "&nbsp;&nbsp;&nbsp;<a href='#' onclick='openContentWindow(\""
                    + link + "\", \"查看原网页\",650, 520, 30, 30)'>链接" + (j + 1) + "</a>";
                content += linkContent;
            }
        }
        content += "<br/>";
    }
    if(entity['flashes'] != null && entity['flashes'].length > 0) {
        content += '<br/><strong>动画</strong><br/>';
        for (var j = 0; j < entity['flashes'].length; j++) {
            var flash_path = entity['flashes'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + flash_path + '' +
            ' onclick="openWindowY(this, \'flash\', \'' + flash_path + '\')">动画' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['images'] != null && entity['images'].length > 0) {
        content += '<br/><strong>图片</strong><br/>';
        for (var j = 0; j < entity['images'].length; j++) {
            var img_path = entity['images'][j];
//                                content += "<img src='" + img_path + "' class='img' alt='' onclick='openWindowY(img_path)'"
//                                        + "style='zoom:1;overflow:hidden;width:50px;height:50px;'/>";
            content += '&nbsp;&nbsp;<img src=' + img_path + ' class="img" onclick="openWindowY(this, \'image\')" ' +
                'alt="" style="zoom:1;overflow:hidden;width:50px;height:50px;"/>'

        }
        content += '<br/>';
    }
    if(entity['audios'] != null && entity['audios'].length > 0) {
        content += '<br/><strong>音频</strong><br/>';
        for (var j = 0; j < entity['audios'].length; j++) {
            var audio_path = entity['audios'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + audio_path + ' onclick="openWindowY(this, \'audio\', \'' +
            audio_path + '\', \'' +
            (entity['name'] + ' 音频' + (j + 1)) + '\')">音频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['vedios'] != null && entity['vedios'].length > 0) {
        content += '<br/><strong>视频</strong><br/>';
        for (var j = 0; j < entity['vedios'].length; j++) {
            var vedio_path = entity['vedios'][j];
//                      content += ('&nbsp;&nbsp;&nbsp;' + '<a href="' + vedio_path + '" target="_blank" onclick="openWindowY(this, \'vedio\')">视频' + (j + 1) + '</a>');
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + vedio_path + '' +
            ' onclick="openWindowY(this, \'vedio\', \'' + vedio_path + '\')">视频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }

    if(entity['models'] != null && entity['models'].length > 0) {
        content += '<br/><strong>模型</strong><br/>';
        for (var j = 0; j < entity['models'].length; j++) {
            var model_paths = entity['models'][j];
            var model_pic = model_paths.split(':');
            var model_path = model_pic[0];
            var model_pic = model_pic[1];
            content += '<a href="' + model_path + '"> <img class="img" alt="" ' +
                'style="zoom:1;overflow:hidden;width:50px;height:50px;" src="' + model_pic + '" /> </a>';

        }
        content += '<br/>';
    }

    content += '</div>';
    return content;
}

function addOverlayAndWin(overlay, data, content, list) {
    overlay.name = data['name'];
    overlay.extData = data;
    if(content === undefined || content === null) {
        content = createContent(data);
    }
    addClickHandler(overlay, content);
    if(list != undefined && list != null) {
        list.push(overlay);
    }
    map.addOverlay(overlay);
}

function addClickHandler(overlay, content){
    overlay.addEventListener("click",function(e){
        openInfoWin(e, content)}
    );
}

function getOnePointOfOverlay(overlay) {
    var point = null;
    if(overlay.spaType == 1 || overlay.extData.spaType == 1) {
        point = new BMap.Point(overlay.getPosition().lng, overlay.getPosition().lat);
    } else if (overlay.spaType == 3 || overlay.spaType == 5 || overlay.extData.spaType == 3 || overlay.extData.spaType == 5) {
        var first_point = overlay.getPath()[0];
        point = new BMap.Point(first_point.lng, first_point.lat);
    }
    return point;
}

function openInfoWin(e, content, title, width) {
    var overlay = e.target;
    var point = getOnePointOfOverlay(overlay);
    if(point == null) {
        point = new BMap.Point(e.x, e.y);
    }
    if(width === undefined || width == null) {
        if(overlay.extData != undefined && overlay.extData.winwidth != undefined) {
            width = overlay.extData.winwidth;
        } else {
            width = 225;
        }
    }
    // if(content == null || content === undefined) {
        content = createContent(overlay.extData);
    // }
    if(title === undefined || title == null || title == "") {
        title = overlay['title'];
    }
    if(title === undefined || title == null || title == "") {
        title = overlay['name'];
    }
    if(title === undefined || title == null || title == "") {
        infoWindow = new BMap.InfoWindow(content);
    } else {
        infoWindow = new BMap.InfoWindow(content ,{
            title: title,
            enableMessage:true,//设置允许信息窗发送短息
            width : width
        });
    }
    map.openInfoWindow(infoWindow, point);
}

//  从信息窗体打开小窗体
function openWindowY(e, type, path, name) {
    var windowHtml = "";
    var title = "浏览多媒体数据";
    var width = 500;
    var height = 521;
    if (path === undefined || path == null || path == "") {
        if (e.src != undefined && e.src != null && e.scr != "") {
            path = e.src;
        } else {
            path = id;
        }
    }
    if (type == "image") {
        title = "查看图片";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        width = 469;
        height = 497;
        windowHtml = "<div><img src='" + path +
            "' class='img' alt='' style='zoom:1;overflow:hidden;width:450px;height:450px;' /></div>";
    } else if (type == "vedio") {
        title = "观看视频";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        var html0 = "<div><iframe src='download/vide7.4.1/sph5.html?url=../../" + path + "'";
        if (name != undefined && name != null || name != "") {
            html0 = "<div><iframe src='download/vide7.4.1/sph5.html?url=../../" + path + "&name =" + name + "'";
        }
        windowHtml = html0 + " width='626px' height='482px' /></div>";
        width = 644;
        height = 528;
    } else if (type == "audio") {
        title = "收听音频";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><iframe src='download/bofq/yp.html?url=../../" + path + "' " +
            "width='460px' height='220px' /></div>";
        width = 478;
        height = 266;
    } else if (type == "flash") {
        title = "收看动画";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><iframe src='download/view_flash.html?url=../" + path + "' " +
            "width='605px' height='466px' /></div>";
        width = 623;
        height = 512;
    } else if (type == "model") {
        title = "查看模型";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
    } else if (type == "track") {
        title = "查看轨迹";
        if (name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><iframe src='download/mapv/examples/baidu-map-polyline-time.html' " +
            "width='510px' height='510px' /></div>";
        width = 529;
        height = 557;
    }
    document.getElementById("y").innerHTML = windowHtml;
    var $win = $('#y').window({
        title: title,
        width: width,
        height: height,
        top: 30,
        left: 60,
        //shadow: true,
        //modal:true,
        //iconCls:'icon-add',
        //closed:true,
        //minimizable:false,
        maximizable: false,
        // collapsible:false
    });
    $win.window('open');
}

//  打开小窗体
function openContentWindow(url, title, width, height, top, left) {
    if(title === undefined || title === null || title == '') {
        title = "信息窗体";
    }
    if(width === undefined || width === null || width == 0) {
        width = 650;
    }
    if(height === undefined || height === null || height == 0) {
        height = 500;
    }
    if(top === undefined || top === null || top == 0) {
        top = 30;
    }
    if(left === undefined || left === null || left == 0) {
        left = 70;
    }
    var windowHtml = "<div><iframe src='" + url + "' width='" + width + "px' height='" + height + "px' /></div>";
    document.getElementById("y").innerHTML = windowHtml;
    var $win = $('#y').window({
        title: title,
        width: width + 19,
        height: height + 47,
        top: top,
        left: left,
        //shadow: true,
        //modal:true,
        // iconCls:'icon-tip',
        iconCls: null,
        //closed:true,
        //minimizable:false,
        maximizable:false,
        // collapsible:false
    });
    $win.window('open');
}
