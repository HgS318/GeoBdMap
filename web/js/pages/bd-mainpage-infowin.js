
var geoEntities = [];

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
    // var content = '<br style="margin:0;line-height:10px;padding:2px;">';
    var content = "";
    if(entity.address != null && entity.address != undefined) {
        content += '地址：' + entity.address + '<br/><br/>';
    }
    if(entity['infoAmount'] != null && entity['infoAmount'] != undefined && entity['infoAmount']['figureLength']
            != null && entity['infoAmount']['figureLength'] != undefined) {
        content += '<strong>图形</strong>： (信息量: ' + entity['infoAmount']['figureLength'] + ' 字节)<br/>';
    }
    if(entity['text'] != null) {
        if(entity.infoAmount != undefined && entity.infoAmount != null) {
            content += '<br/><strong>文本</strong>： (信息量: ' + entity['infoAmount']['textLenth'] + ' 字节)<br/>';
            for (var j = 0; j < entity['text'].length; j++) {
                var content_text = entity['text'][j];
                if (content_text.length > 45) {
                    content += (content_text.substring(0, 45) + '...' + '<br/>' );
                } else {
                    content += (content_text + '<br/>' );
                }
            }
        } else {
            content += entity['text'] + "<br/>";
        }
    }
    if(entity['texts'] != null) {
        // content += "<strong>文字</strong>";
        for(var j = 0; j < entity['texts'].length; j++) {
            var text = entity['texts'][j];
            if(text.length > 48) {
                text = text.substring(0, 45) + '...';
            }
            content += "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + text + "</p>";
        }
    }
    if(entity['flashes'] != null && entity['flashes'].length > 0) {
        content += '<br/><strong>动画</strong>： (信息量: ' + entity['infoAmount']['flashLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['flashes'].length; j++) {
            var flash_path = entity['flashes'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + flash_path + '' +
            ' onclick="openWindowY(this, \'flash\', \'' + flash_path + '\')">动画' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['images'] != null && entity['images'].length > 0) {
        content += '<br/><strong>图像</strong>： (信息量: ' + entity['infoAmount']['imageLength'] + ' 字节)<br/>';
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
        content += '<br/><strong>音频</strong>： (信息量: ' + entity['infoAmount']['audioLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['audios'].length; j++) {
            var audio_path = entity['audios'][j];
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + audio_path + ' onclick="openWindowY(this, \'audio\', \'' +
            audio_path + '\', \'' +
            (entity['name'] + ' 音频' + (j + 1)) + '\')">音频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }
    if(entity['vedios'] != null && entity['vedios'].length > 0) {
        content += '<br/><strong>视频</strong>： (信息量: ' + entity['infoAmount']['vedioLength'] + ' 秒)<br/>';
        for (var j = 0; j < entity['vedios'].length; j++) {
            var vedio_path = entity['vedios'][j];
//                      content += ('&nbsp;&nbsp;&nbsp;' + '<a href="' + vedio_path + '" target="_blank" onclick="openWindowY(this, \'vedio\')">视频' + (j + 1) + '</a>');
            content += ('&nbsp;&nbsp;&nbsp;' + '<a href="#" id=' + vedio_path + '' +
            ' onclick="openWindowY(this, \'vedio\', \'' + vedio_path + '\')">视频' + (j + 1) + '</a>');
        }
        content += '<br/>';
    }

    if(entity['models'] != null && entity['models'].length > 0) {
        content += '<br/><strong>模型</strong>： (信息量: ' + entity['infoAmount']['modelLength'] + ' 字节)<br/>';
        for (var j = 0; j < entity['models'].length; j++) {
            var model_paths = entity['models'][j];
            var model_pic = model_paths.split(':');
            var model_path = model_pic[0];
            var model_pic = model_pic[1];

            content += '<a href="' + model_path + '"> <img class="img" alt="" ' +
                'style="zoom:1;overflow:hidden;width:50px;height:50px;" src="' + model_pic + '" /> </a>';
            // content += '<img src=' + model_pic + ' class="img" href="' + model_path + '"  onclick="openWindowY(this, \'track\')"' +
            //     'target="_blank" alt="" style="zoom:1;overflow:hidden;width:50px;height:50px;"/>'
//                                content += ('&nbsp;&nbsp;&nbsp;' + '<a href="' + vedio_path + '" onclick="getHref()">视频' + (j + 1) + '</a>');
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
    if(list != undefined) {
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
    if(overlay.spaType == 1) {
        point = new BMap.Point(overlay.getPosition().lng, overlay.getPosition().lat);
    } else if (overlay.spaType == 3 || overlay.spaType == 5) {
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
    if(content == null || content === undefined) {
        content = createContent(overlay.extData);
    }
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

// function addClickHandler(overlay, content){
//     overlay.addEventListener("click",function(e) {
//         openInfoWin(content, e);
//     });
// }
//
// function openInfoWin(content, e){
//     var overlay = e.target;
//     var point;
//     if(overlay.spaType == 1) {
//         point = new BMap.Point(overlay.getPosition().lng, overlay.getPosition().lat);
//     } else if (overlay.spaType == 3 || overlay.spaType == 5) {
//         var first_point = overlay.getPath()[0];
//         point = new BMap.Point(first_point.lng, first_point.lat);
//     }
// //        var infoWindow = new BMap.InfoWindow(content, {
// //            width : 150,     // 信息窗口宽度
// //            height: 50,     // 信息窗口高度
// //            title : overlay['title'] , // 信息窗口标题
// //            enableMessage:true//设置允许信息窗发送短息
// //        });
// //        var p = e.target;
// //        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
// //        // var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
//     searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
//         title: e.target.name,
//         width: 300,
//         height: 280,
//         panel: "panel",
//         enableAutoPan: true,
//         searchTypes: [
//             BMAPLIB_TAB_SEARCH,
//             BMAPLIB_TAB_TO_HERE,
//             BMAPLIB_TAB_FROM_HERE
//         ]
//     });
//     // map.openInfoWindow(searchInfoWindow,point); //开启信息窗口
//     searchInfoWindow.open(point);
// }

function openWindowY(e, type, path, name) {
    var windowHtml = "";
    var title = "浏览多媒体数据";
    var width = 492;
    var height = 513;
    if(path === undefined || path == null || path == "") {
        if(e.src != undefined && e.src != null && e.scr != "") {
            path = e.src;
        } else{
            path = id;
        }
    }
    if(type == "image") {
        title = "查看图片";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><img src='" + path +
            "' class='img' alt='' style='zoom:1;overflow:hidden;width:450px;height:450px;' /></div>";
    } else if(type == "vedio") {
//            windowHtml = "<div><iframe src='sp.html?url=download/220100SPCG1.flv' " +
//                    "width='600px' height='450px' /></div>";
//            width = 642;
//            height = 513;
        title = "观看视频";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        var html0 = "<div><iframe src='download/vide7.4.1/sph5.html?url=../../" + path + "'";
        if(name != undefined && name != null || name !="") {
            html0 = "<div><iframe src='download/vide7.4.1/sph5.html?url=../../" + path + "&name =" + name + "'";
        }
        windowHtml = html0 + " width='615px' height='472px' /></div>";
        width = 656;
        height = 546;
    } else if(type == "audio") {
        title = "收听音频";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><iframe src='download/bofq/yp.html?url=../../" + path + "' " +
            "width='460px' height='220px' /></div>";
        width = 490;
        height = 270;
    } else if(type == "flash") {
        title = "收看动画";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml = "<div><iframe src='download/view_flash.html?url=../" + path + "' " +
            "width='617px' height='465px' /></div>";
        width = 656;
        height = 546;
    } else if(type == "model") {
        title = "查看模型";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
    } else if(type == "track") {
        title = "查看轨迹";
        if(name != undefined && name != null && name != "") {
            title += ": " + name;
        }
        windowHtml ="<div><iframe src='download/mapv/examples/baidu-map-polyline-time.html' " +
            "width='500px' height='500px' /></div>"
        width = 552;
        height = 559;
    }
    document.getElementById("y").innerHTML = windowHtml;
    var $win = $('#y').window({
        title: title,
        width: width,
        height: height,
        top: 100,
        left:100,
        //shadow: true,
        //modal:true,
        //iconCls:'icon-add',
        //closed:true,
        //minimizable:false,
        maximizable:false,
        // collapsible:false
    });

    $win.window('open');
}
