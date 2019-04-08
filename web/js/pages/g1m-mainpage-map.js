
var admin = false;

var infoWindow, map, level = 13;
var markers = [];	//	所有地点标注，包括点、线
var showingMarkers = [];    //  当前显示的地点标注
var distPolygons = [];	//	所有行政区标注
var showingDists = [];	//	当前显示的行政区标注
var boundPolylines = [];	//	所有界线标注
var showingBounds = [];	//	当前显示的界线标注
var boundMarkers = [];	//	所有界桩、界碑
var showingbms = [];    //	当前显示的界桩、界碑
var mouseTool;  //  地图图形编辑工具，用于勾选范围等
var placedata;  //  项目中的所有地名
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html

var distsInited = false;	//	地区是否已经初始化

var mousePos;   //  鼠标位置



$(function() {

    var wholepnurl = 'wholeGeonames.action';

    var thisurl = window.location.href;
    if(thisurl.indexOf('admin') > -1) {
        admin = true;
        wholepnurl = "wholeGeonames.action?admin=admin";
    }

    $.ajax({
        url: wholepnurl,
        type:'get',
        dataType: 'json',
        success:function(data){
            var places = data;
            AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
                map = new AMap.Map('mapContainer',{
                    resizeEnable: true,
                    center: [110.66, 30.91],
                    zoom: level,
                    keyboardEnable :false,
                });
                map.on('complete', function(){
                    map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function(){
                        map.addControl(new AMap.ToolBar);
                        map.addControl(new AMap.OverView({isOpen: true}));
                        map.addControl(new AMap.Scale);
                        map.addControl(new BasicControl.LayerSwitcher({position: 'rt'}));
                    });
                });
                map.on('rightclick', function(e) {
                    // me.contextMenu.open(map, e.lnglat);
                    // me.contextMenuPositon = e.lnglat; //右键菜单位置
                    var pos = [e.lnglat.lng, e.lnglat.lat];
                    mousePos = pos;
                });
                mouseTool = new AMap.MouseTool(map);
                AMap.event.addListener( mouseTool,'draw',function(e){ //添加事件
                    $("#mapextentdone")[0].innerHTML = "已选择地图范围";
                    mouseTool.close(false);
                });
                placedata = places;
                showingPlaces = placedata;
                initGeonames();
                setAutoComplete();
                setRightMenu();
                initTrees(true);
                initBounds(true);
                initBoundMarkers(true);
                if(admin) {
                    initTmpDists();
                }
                toResStat();
            });
        },
        error:function(data){
            console.log(data);
        }
    })

});

//	初始化并显示所有地点
function initGeonames(pdata) {
    // if(pdata) {
    //     showingPlaces = pdata;
    // } else {
    //     showingPlaces = placedata;
    // }
    for(var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
    markers = [];
    var pldata = pdata ? pdata : placedata;
    createGeonameFeature(pldata, markers);
    setResultItems(pldata, "placeresults", "geoname")
    setShowingGeonames(markers);
    showGeonames();
}

//  根据json数据生成地名的地图要素（点或线），并加入列表中
function createGeonameFeature(psdata, markers) {
    for (var i = 0; i < psdata.length; i++) {
        var data = psdata[i];
        data["selected"] = false;
        if ("1" == data.spaType) {
            var marker = new AMap.Marker({
                // map: map,
                position: data.position,
                zIndex: 100,
                extData: data,
                title: data.name,
                icon: "images/markers/common_marker.png",
            });
            AMap.event.addListener(marker, "mouseover", markerHighlight);
            AMap.event.addListener(marker, "mouseout", markerMouseOut);
            AMap.event.addListener(marker, "click", mapFeatureClick);
            markers.push(marker);
        } else if("3" == data.spaType) {
            var lineArr = JSON.parse(data.path);
            var polyline = new AMap.Polyline({
                // map: map,
                zIndex: 95,
                extData: data,
                path: lineArr,          //设置线覆盖物路径
                strokeColor: "#3366FF", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
            AMap.event.addListener(polyline, "mouseover", markerHighlight);
            AMap.event.addListener(polyline, "mouseout", markerMouseOut);
            AMap.event.addListener(polyline, "click", mapFeatureClick);
            markers.push(polyline);
        }
    }
}

//	显示一定量的地点
function showGeonames(psdata) {
    // placesHide();
    // createGeonameFeature(psdata, showingMarkers);
    // setNewMarkers(psdata);
    if(psdata) {
        setShowingGeonames(psdata);
    } else {
        showingMarkers = markers;
    }
    placesShow();
    $("#toolbarPlaces")[0].selected = true;
}

//  设置某些地点需要显示（暂时不显示出来，调用placesShow方法再最终显示出来）
function setShowingGeonames(psdata) {
    showingMarkers = [];
    for(var i = 0; i < markers.length; i++) {
        for(var j = 0; j < psdata.length; j++) {
            if(markers[i].getExtData(0)['id'] == psdata[j]['id']) {
                showingMarkers.push(markers[i]);
                break;
            }
        }
    }
    return showingMarkers;
}

//  根据json数据生成行政区多边形，并加入列表中
function createDistPolygon(distjson, dists) {
    if(!distjson.path) {
        return;
    }
    distjson['overlay'] = "dist";
    var pathArr = JSON.parse(distjson.path);
    var polygon = new AMap.Polygon({
        zIndex: 40,
        extData: distjson,
        path: pathArr,//设置多边形边界路径
        strokeColor: "#FF44FF", //线颜色
        strokeOpacity: 0.3, //线透明度
        strokeWeight: 1.5,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.3//填充透明度
    });
    // AMap.event.addListener(polygon, "dblclick", distDbClick);
    AMap.event.addListener(polygon, "mouseover", overlayHighlight);
    AMap.event.addListener(polygon, "mouseout", overlayMouseOut);
    AMap.event.addListener(polygon, "click", overlayFeatureClick);
    // polygon.setMap(map);
    dists.push(polygon);
}

//  产生临时行政区域多边形
function initTmpDists() {
    var wholeTmpDistsUrl = 'wholeEasyBounds.action';
    if(admin) {
        wholeTmpDistsUrl = "";
    }
    $.ajax({
        url: wholeTmpDistsUrl,
        type:'get',
        dataType: 'json',
        success:function(dist_data){
            var distArrayJson = dist_data;
            // initBounds(boundArrayJson);
            for(var i = 0; i < distArrayJson.length; i++) {
                var distjson = distArrayJson[i];
                distjson['selected'] = false;
                createDistPolygon(distjson, distPolygons);
            }
            showingDists = distPolygons;
        },
        error:function(dist_data){
            console.log(dist_data);
        }
    });
}

//  显示部分行政区域，第二个参数表示是否自动调整地图范围
function showDists(distpolygons, fit) {
    if(distPolygons != distpolygons) {
        for(var i = 0; i < distPolygons.length; i++) {
            var old = distPolygons[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < distpolygons.length; i++) {
        var polygon = distpolygons[i];
        polygon.setMap(map);
        polygon.show();
    }
    $("#toolbarDists")[0].checked = true;
    if(fit) {
        map.setFitView(distpolygons);
    }
}

//  初始化行政界线
function initBounds(show) {
    var wholeBoundsUrl = 'wholeEasyBounds.action';

    $.ajax({
        url: wholeBoundsUrl,
        type:'get',
        dataType: 'json',
        success:function(bound_data){
            var boundArrayJson = bound_data;
            // initBounds(boundArrayJson);
            for(var i = 0; i < boundArrayJson.length; i++) {
                var boundjson = boundArrayJson[i];
                boundjson['selected'] = false;
                createBoundPolyline(boundjson, boundPolylines);
            }
            showingBounds = boundPolylines;
            setResultItems(boundArrayJson, "boundresults", "bound");
            if(show) {
                boundsShow();
            }
        },
        error:function(bound_data){
            console.log(bound_data);
        }
    });

    // showBounds(boundPolylines);
}

//  根据json数据生成行政界线地图要素，并加入列表中
function createBoundPolyline(boundjson, bounds) {
    if(!boundjson.path) {
        return;
    }
    boundjson['overlay'] = "bound";
    var lineArr = JSON.parse(boundjson.path);
    var polyline = new AMap.Polyline({
        zIndex: 50,
        extData: boundjson,
        path: lineArr,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.9,       //线透明度
        strokeWeight: 3,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [10, 5] //补充线样式
    });
    // AMap.event.addListener(polyline, "dblclick", boundDbClick);
    AMap.event.addListener(polyline, "mouseover", overlayHighlight);
    AMap.event.addListener(polyline, "mouseout", overlayMouseOut);
    AMap.event.addListener(polyline, "click", overlayFeatureClick);
    // polyline.setMap(map);
    bounds.push(polyline);
}

//  显示部分行政界线
function showBounds(boundPylylines) {
    if(boundPolylines != boundPylylines) {
        for(var i = 0; i < boundPolylines.length; i++) {
            var old = boundPolylines[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < boundPylylines.length; i++) {
        var polyline = boundPylylines[i];
        polyline.setMap(map);
        polyline.show();
    }

    $("#toolbarBounds")[0].checked = true;
}

//  初始化界桩
function initBoundMarkers(show) {
    var wholebmurl = 'wholeEasyBoundMarkers.action';
    $.ajax({
        url: wholebmurl,
        type:'get',
        dataType: 'json',
        success:function(bm_data){
            var bmArrayJson = bm_data;
            setResultItems(bmArrayJson, "boundmarkersall", "boundmarker");
            setResultItems(bmArrayJson, "boundmarkrsresults", "boundmarker");
            // initBoundMarkers(bmArrayJson);
            for(var i = 0; i < bmArrayJson.length; i++) {
                var bmjson = bmArrayJson[i];
                bmjson['selected'] = false;
                createBoundMarkers(bmjson, boundMarkers);
            }
            showingbms = boundMarkers;
            if(show) {
                bdmarksShow();
            }
        },
        error:function(bm_data){
            console.log(bm_data);
        }
    });

    // showBoundMarkers(boundMarkers);
}

//  根据json数据生成界桩地图要素，并加入列表中
function createBoundMarkers(bmjson, boundMarkers) {
    if(!bmjson.position) {
        return;
    }
    bmjson['overlay'] = "boundmarker";
    var marker = new AMap.Marker({
        // map: map,
        position: bmjson.position,
        zIndex: 180,
        extData: bmjson,
        title: bmjson.name,
        icon: "images/markers/boundmarker_blue.png",
    });
    // AMap.event.addListener(marker, "dblclick", bdmarkDbClick);
    AMap.event.addListener(marker, "mouseover", overlayHighlight);
    AMap.event.addListener(marker, "mouseout", overlayMouseOut);
    AMap.event.addListener(marker, "click", overlayFeatureClick);
    // marker.setMap(map);
    boundMarkers.push(marker);
}

//  显示部分界桩
function showBoundMarkers(bmMarkers) {
    if(boundMarkers != bmMarkers) {
        for(var i = 0; i < boundMarkers.length; i++) {
            var old = boundMarkers[i];
            old.setMap(null);
        }
    }
    for(var i = 0; i < bmMarkers.length; i++) {
        var marker = bmMarkers[i];
        marker.setMap(map);
        marker.show();
    }
    $("#toolbarBoundMarkers")[0].checked = true;
}

//	产生新的点标注
function setNewMarkers(newdata) {
    for(var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
    closeInfoWindow();
    showingMarkers = [];
    createGeonameFeature(newdata, showingMarkers);
    // map.setFitView();
}

//	在右边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname, clas) {

    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var num = 0;
    if(!muldata || "" == muldata || "{}" == muldata || !muldata.length || muldata.length < 1) {
        parentdiv.innerHTML = "";
    } else {
        num = muldata.length;
        var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
        for (var i = 0; i < muldata.length; i++) {
            var data = muldata[i];
            if(!data['g1m']) {
                data = data.getExtData();
            }
            var str;
            if (clas) {
                if (clas == "geoname") {
                    str = consPlaceResult(data, i + 1);
                } else if (clas == "dist") {
                    str = consDistResult(data, i + 1);
                }
                if (clas == "bound") {
                    str = consBoundResult(data, i + 1);
                }
                if (clas == "boundmarker") {
                    str = consBoundMarkerResult(data, i + 1);
                }
            } else {
                str = consPlaceResult(data, i + 1);
            }
            midstr += str;
        }
        var totalstr = prestr + midstr + endstr;
        parentdiv.innerHTML = totalstr;
        // document.getElementById("distinfo").style.display = "none";
    }

    if(clas) {
        if(clas == "geoname") {
            document.getElementById("placeintotal").innerText = "      地名：" + num +" 条记录";
        } else if(clas == "dist") {
            if(num == 1) {
                var distData = muldata[0];
                document.getElementById("distintotal").innerHTML = "      行政区：<strong>" + distData.name + "</strong>"
                    + "<br/>      乡村数：" + distData.NumVillage
                    + "<br/>      社区数：" + distData.NumCommu
                    + "<br/>      下属村、居委会：" + distData.SubCommu
                ;
                // document.getElementById("distname").innerHTML = '      行政区名称：<strong>' + distData.name + '</strong>';
                // document.getElementById("numval").innerHTML ='      乡村数：<strong>' + distData.NumVillage + '</strong>';
                // document.getElementById("numcomu").innerHTML ='     社区数：<strong>' + distData.NumCommu + '</strong>';
                // document.getElementById("subcom").innerHTML ='     下属村、居委会：<strong>' + distData.SubCommu + '</strong>';
            } else {
                document.getElementById("distintotal").innerText = "      行政区：" + num + " 条记录";
            }
        }if(clas == "bound") {
            document.getElementById("boundintotal").innerText = "      行政界线：" + num +" 条记录";
        }if(clas == "boundmarker") {
            document.getElementById("bmintotal").innerText = "      界桩、界碑：" + num +" 条记录";
        }
    } else{
        document.getElementById("placeintotal").innerText = "      地名：" + num +" 条记录";
    }
}

//	在左边结果栏显示若干条结果，items为html
function setResultsInDiv(items, divname) {
    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
    for(var i = 0; i < items.length; i++) {
        midstr += items[i];
    }
    var totalstr = prestr + midstr + endstr;
    parentdiv.innerHTML = totalstr;
}

//	产生右边结果栏的一条数据——名称，位置，起点/终点，最左序号，下方详情
function consResultItem(clas, name, id, type, order, content){
    str = "<div class='list-group-item'" +"onclick=\"gotoOverlay('"+ clas + "', '" + id + "')\"" +
        "><div class='SearchResult_item_left' " +
        "><p><strong>" + order +
        "</strong></p></div><div class='SearchResult_item_content'>" +
        "<p><font color='#0B73EB'>" + name +
        "</font><span class='wikiTag'>" + type +
        "</span></p><p>" + content + "</p></div></div>";
    return str;
}

//	产生右边结果栏的一条地点数据
function consPlaceResult(place, order) {
    return consResultItem("geoname" ,place.name, place.id, place['小类'], order,
        "地域代码：" + place.dist);
    // return consResultItem_old(place.name, place.position, place['小类'], order, "地域代码：" + place.dist);
}
//	产生右边结果栏的一条行政区域数据
function consDistResult(dist, order) {
    return consResultItem("dist" ,dist.name, dist.id, dist['Grade'], order,
        "地域代码：" + dist.id + "&nbsp;&nbsp;&nbsp;上级行政区:" + dist['上级行政区']);
}
//	产生右边结果栏的一条行政界线数据
function consBoundResult(bound, order) {
    return consResultItem("bound" ,bound.name, bound.Id, bound['Grade'], order,
        "相关行政区：" + bound.LeftName + ", " + bound.RightName);
}
//	产生右边结果栏的一条界桩数据
function consBoundMarkerResult(bm, order) {
    return consResultItem("bm" ,bm.name, bm.Id, bm['TypeName'], order,
        "相关行政区：" + bm.relatedDists);
}

//  根据json显示出地图要素，包括地名、行政区、行政界线、界桩
function showOverlays(psdata, distdata, bounddata, bmdata) {
    if(distdata == "{}") {
        distsHide();
    }
    if(bounddata == "{}") {
        boundsHide();
    }
    if(bmdata == "{}") {
        bdmarksHide();
    }
    setShowingOverlays(psdata, distdata, bounddata, bmdata);
    if(distdata && distdata != "{}") {
        showDists(showingDists);
    }
    if(bounddata && bounddata != "{}") {
        showBounds(showingBounds);
    }
    if(bmdata && bmdata != "{}") {
        showBoundMarkers(showingbms);
    }
    if(!psdata || psdata =="" || psdata == "{}" || psdata.length < 1) {
        placesHide();
        $("#toolbarPlaces")[0].selected = false;
    } else {
        showGeonames(psdata);
    }
}

//  根据json设置要显示的地图要素，包括地名、行政区、行政界线、界桩（暂时不显示，调用showXXX方法最终显示出来）
function setShowingOverlays(psdata, distdata, bounddata, bmdata) {
    // setShowingGeonames(psdata);

    showingDists = [];
    for(var i = 0; i < distPolygons.length; i++) {
        for(var j = 0; j < distdata.length; j++) {
            if(distPolygons[i].getExtData(0)['id'] == distdata[j]['id']) {
                showingDists.push(distPolygons[i]);
                break;
            }
        }
    }

    showingBounds = [];
    for(var i = 0; i < boundPolylines.length; i++) {
        for(var j = 0; j < bounddata.length; j++) {
            if(boundPolylines[i].getExtData(0)['Id'] == bounddata[j]['Id']) {
                showingBounds.push(boundPolylines[i]);
                break;
            }
        }
    }

    showingbms = [];
    for(var i = 0; i < boundMarkers.length; i++) {
        for(var j = 0; j < bmdata.length; j++) {
            if(boundMarkers[i].getExtData(0)['Id'] == bmdata[j]['Id']) {
                showingbms.push(boundMarkers[i]);
                break;
            }
        }
    }

}

//	点击地名要素时
function mapFeatureClick(e){
    openInfoWindow(e);
}

//  地名要素高亮显示
function markerHighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker_selected.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#FF0000"});
    }

}

//  取消地名要素高亮显示
function markerUnhighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    data["selected"] = false;
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#3366FF"});
    }
}

//  鼠标移开地名要素时
function markerMouseOut(e) {
    var fea = e.target;
    var data = fea.getExtData();
    if(data["selected"]) {
        return;
    }
    if("1" == data.spaType) {
        fea.setIcon("images/markers/common_marker.png");
    } else if("3" == data.spaType) {
        fea.setOptions({strokeColor: "#3366FF"});
    }
}

//	点击行政区、行政界线、界桩要素时
function overlayFeatureClick(e){
    openSimpleInfoWindow(e);
}

//  行政区、行政界线、界桩要素高亮显示
function overlayHighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#00FFFF", //填充色
            fillOpacity: 0.5//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF3322",
            strokeOpacity: 1,       //线透明度
            strokeWeight: 7,        //线宽
         });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_red.png");
    }

}

//  取消行政区、行政界线、界桩要素高亮显示
function overlayUnhighlight(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    data["selected"] = false;
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.3//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF33FF",
            strokeOpacity: 0.9,       //线透明度
            strokeWeight: 3,        //线宽
        });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_blue.png");
    }
}

//  鼠标移开行政区、行政界线、界桩要素时
function overlayMouseOut(e) {
    var fea = e.target;
    var data = fea.getExtData();
    var type = data['overlay'];
    if(data["selected"]) {
        return;
    }
    if("dist" == type) {
        fea.setOptions({
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.3//填充透明度
        });
    } else if("bound" == type) {
        fea.setOptions({
            strokeColor: "#FF33FF",
            strokeOpacity: 0.9,       //线透明度
            strokeWeight: 3,        //线宽
        });
    } else if("boundmarker" == type) {
        fea.setIcon("images/markers/boundmarker_blue.png");
    }
}

//	在所有地名中按属性查询
function findPlaceByAttr(attr, _name) {
    var pla = null;
    for(var i = 0; i < markers.length; i++) {
        var testplace = markers[i].getExtData();
        if(testplace[attr] == _name) {
            pla = markers[i];
            break;
        }
    }
    return pla;
}

//  除地名外其他要素都设置为空
function setPlaceElseNone() {
    var nullArray = [];
    boundsHide();
    bdmarksHide();
    // initBoundMarkers();
    // initBounds();
    initTrees(true);
    setResultItems(nullArray, "distresults", "dist");
    setResultItems(nullArray, "boundresults", "bound");
    setResultItems(nullArray, "boundmarkrsresults", "boundmarker");
}

//  显示所有类型的地名
function gotoAllType() {
    var tmpdata = placedata;
    showingPlaces = tmpdata;
    // setNewMarkers(tmpdata);
    showGeonames(tmpdata);
    setPlaceElseNone();
    setResultItems(tmpdata, "placeresults");
    toPlaceRes();
}

//	显示某大类的所有地名
function gotoBigType(bigtype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        if(data['大类'] == bigtype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showGeonames(tmpdata);
        setPlaceElseNone();
        setResultItems(tmpdata, "placeresults");
        toPlaceRes();
    } else {
        alert("暂无 " + bigtype + " 相关数据...");
    }
}

//	显示某小类的所有地名
function gotoSmallType(bigtype, smalltype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var flag = false;
        if(data['大类'] == bigtype && data['小类'] == smalltype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showGeonames(tmpdata);
        setPlaceElseNone();
        setResultItems(tmpdata, "placeresults");
        toPlaceRes();
    } else {
        alert("暂无 " + bigtype +"-" + smalltype + " 相关数据...");
    }
}

//	显示某地区的所有地名
function gotoDist(distcode) {

    var diststr = distcode.toString();
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var thiscode = data['dist'];
        if(distIn(thiscode, diststr)) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        // setNewMarkers(tmpdata);
        showGeonames(tmpdata);
        setResultItems(tmpdata, "placeresults");
    } else {
        alert("暂无 " + distcode + " 地区相关数据...");
    }
    if(distcode != 420527000) {
        var dp = findDistPolygon(distcode);
        if (dp) {
            var ba = findDistBounds(distcode);
            var bma = [];
            for(var i = 0; i < ba.length; i++) {
                var bd = ba[i];
                var bid = bd.getExtData()['Id'];
                findBoundBms(bid, bma);
            }
            var bms = unique1(bma);
            setResultItems(ba, "boundresults", "bound");
            showBounds(ba);
            setResultItems(bms, "boundmarkrsresults", "boundmarker");
            showBoundMarkers(bms);
            var distData = dp.getExtData();
            var dtatArray = [];
            dtatArray.push(distData);
            setResultItems(dtatArray, "distresults", "dist");
            showingDists = [];
            showingDists.push(dp);
            distsShow();
            toResStat();
        }
    } else {
        // var dtatArray = [];
        // for(var i = 0; i < distPolygons.length; i++) {
        //     var distData = distPolygons[i].getExtData();
        //     dtatArray.push(distData);
        // }
        // setResultItems(dtatArray, "distresults", "dist");
        // showingDists = distPolygons;
        // // showingDists.push(dp);
        // distsShow();
        // toPlaceRes();
        initTrees(true);
        initBounds(true);
        initBoundMarkers(true);
    }
}

//  找到某行政区的所有行政界线
function findDistBounds(distcode) {
    var ba = [];
    for(var i = 0; i < boundPolylines.length; i++) {
        var bound = boundPolylines[i];
        var bdata = bound.getExtData();
        if(distcode == bdata['Left_'] || distcode == bdata['Right_']) {
            ba.push(bound);
        }
    }
    return ba;
}

//  找到界桩相关的所有行政界线
function findBoundBms(bid, bma) {
    for(var i = 0; i < boundMarkers.length; i++) {
        var bm = boundMarkers[i];
        var bmdata = bm.getExtData();
        if(bid == bmdata['Bound1ID'] || bid == bmdata['Bound2ID'] || bid == bmdata['Bound3ID']
            || bid == bmdata['Bound4ID'] || bid == bmdata['Bound5ID'] ) {
            bma.push(bm);
        }
    }
    return bma;
}

//	地图前往某一坐标点
function gotoPlace(posStr, name) {
    var pla;
    if(name) {
        pla = findPlaceByAttr("name", name);
        closeInfoWindow();
    }
    var xystr = posStr.split(",");
    var x = parseFloat(xystr[0]);
    var y = parseFloat(xystr[1]);
    var npos = [x, y];
    var zom = map.getZoom();
    if(zom < 16) {
        map.setZoom(16);
    }
    map.panTo(npos);
    if(pla) {
        openInfoWindow({target: pla});
    }
}

//	地图前往某一地名点
function gotoGeoname(placeid) {
    var pla = findPlaceByAttr("id", placeid);
    closeInfoWindow();
    var xystr = posStr.split(",");
    var x = parseFloat(xystr[0]);
    var y = parseFloat(xystr[1]);
    var npos = [x, y];
    var zom = map.getZoom();
    if(zom < 16) {
        map.setZoom(16);
    }
    map.panTo(npos);
    if(pla) {
        openInfoWindow({target: pla});
    }
}

//	地图前往某一覆盖物（地名、行政区、行政界线、界桩等）
function gotoOverlay(type, id) {
    var overlay, center;
    var zom = 11;
    if(type == "dist") {
        overlay = findOverlay(distPolygons, id);
        center = overlay.getBounds().getCenter();
    } else if(type == "bound") {
        overlay = findOverlay(boundPolylines, id);
        center = overlay.getBounds().getCenter();
    } else if(type == "bm") {
        overlay = findOverlay(boundMarkers, id);
        center = overlay.getPosition();
    } else {
        overlay = findOverlay(showingMarkers, id);
        center = overlay.getExtData().spaType == 1 ?
            overlay.getPosition() : overlay.getBounds().getCenter();
        zom = 16;
    }
    overlay.setMap(map);
    overlay.show();
    map.setZoom(zom);
    map.panTo(center);
    if(type == "geoname") {
        openInfoWindow({target: overlay});
    } else {
        openSimpleInfoWindow({target: overlay, 'lnglat': center});
    }

}

//  在覆盖物数组中根据id查询某一覆盖物
function findOverlay(overlays, id) {
    for(var i = 0; i < overlays.length; i++) {
        var ov = overlays[i];
        if(id == ov.getExtData()['id'] || id == ov.getExtData()['Id']) {
            return ov;
        }
    }
    return null;
}

//  根据地区编码查询行政区要素
function findDistPolygon(distcode) {
    for(var i = 0; i < distPolygons.length; i++) {
        var dp = distPolygons[i];
        var extData = dp.getExtData();
        var testcode = extData.id;
        if(testcode == distcode) {
            return dp;
        }
    }
    return null;
}

//	地区代码是否位于某地区
function distIn(sub, par) {
    var i = 1;
    for(i = 1; i < sub.length; i++) {
        var c1 = sub.charCodeAt(i), c2 = par.charCodeAt(i);
        if(c1 != c2) {
            break;
        }
    }
    for( ;i < par.length; i++) {
        var c = par.charCodeAt(i);
        if(c != 48) {
            return false;
        }
    }
    return true;
}

//  显示地名图层
function placesShow() {

    if(showingMarkers != markers &&
        showingMarkers.length != markers.length) {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            marker.hide();
        }
    }
    for (var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.setMap(map);
        marker.show();
    }
    map.setFitView(showingMarkers);
}

//  隐藏地名图层
function placesHide() {
    for(var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.hide();
        marker.setMap(null);
        map.remove(marker);
    }
}

//  显示行政区图层
function distsShow(fit) {
    showDists(showingDists, fit);
}

//  隐藏行政区图层
function distsHide() {
    for(var i = 0; i < showingDists.length; i++) {
        var dist = showingDists[i];
        dist.hide();
    }
}

//  显示行政界线图层
function boundsShow() {
    showBounds(showingBounds);
}

//  隐藏行政界线图层
function boundsHide() {
    for(var i = 0; i < showingBounds.length; i++) {
        var bound = showingBounds[i];
        bound.hide();
    }
}

//  显示界桩图层
function bdmarksShow() {
    showBoundMarkers(showingbms);
}

//  隐藏界桩图层
function bdmarksHide() {
    for(var i = 0; i < showingbms.length; i++) {
        var boundMarker = showingbms[i];
        boundMarker.hide();
    }
}

//  地名 checkbox
function placesCheckBox(checkbox) {
    if (checkbox.checked) {
        placesShow();
    } else {
        placesHide();
    }
}

//  行政区 checkbox
function distsCheckBox(checkbox) {
    if (checkbox.checked) {
        distsShow();
    } else {
        distsHide();
    }
}

//  行政界线 checkbox
function boundsCheckBox(checkbox) {
    if (checkbox.checked) {
        boundsShow();
    } else {
        boundsHide();
    }
}

//  界桩界碑 checkbox
function boundMarksCheckBox(checkbox) {
    if (checkbox.checked) {
        bdmarksShow();
    } else {
        bdmarksHide();
    }
}




