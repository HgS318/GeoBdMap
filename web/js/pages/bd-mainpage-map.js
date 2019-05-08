
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

var overlay_styles = {

    markerIcon: new BMap.Icon("images/markers/marker_red_sprite.png", new BMap.Size(21, 25)),
    markerHighIcon: new BMap.Icon("images/markers/blue8.png", new BMap.Size(21, 25)),
    relMarkerIcon: new BMap.Icon("images/markers/boundmarker_blue.png", new BMap.Size(25 ,37)),
    lineStyle: {strokeColor: "#3366FF", strokeWeight: 5, strokeOpacity: 0.8},
    lineHighStyle: {strokeColor: "#FF3322", strokeWeight: 6, strokeOpacity: 0.9},
    polygonStyle: {
        strokeWeight: 3,//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor: "#FF44FF", //折线颜色,
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.3
    },
    polygonHighStyle: {
        strokeWeight: 3,//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor: "#00FFFF", //折线颜色,
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.5
    },
    newMarkerIcon: new BMap.Icon("images/markers/common_marker_selected_org.png", new BMap.Size(21, 31)),
    newMarkerHighIcon: new BMap.Icon("images/markers/common_marker_org.png", new BMap.Size(21, 31)),
    newPolygonStyle:{
        strokeWeight: 2,//折线的宽度，以像素为单位
        strokeOpacity: 0.6,//折线的透明度，取值范围0 - 1
        strokeColor: "blue", //折线颜色,
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.1
    },
    newPolygonHighStyle: {
        strokeWeight: 2,//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor: "#00FFFF", //折线颜色,
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.3
    },
};

var bmIcon = new BMap.Icon("images/markers/boundmarker_blue.png", new BMap.Size(25, 37), {
        imageSize: new BMap.Size(25, 37), // 引用图片实际大小
        imageOffset:new BMap.Size(0, 0)  // 图片相对视窗的偏移
    }
);
var bmHighIcon = new BMap.Icon("images/markers/boundmarker_red.png", new BMap.Size(25, 37), {
        imageSize: new BMap.Size(25, 37), // 引用图片实际大小
        imageOffset:new BMap.Size(0, 0)  // 图片相对视窗的偏移
    }
);

$(function() {
    initComponents();
});

function initComponents() {

    map = new BMap.Map("mapContainer");
    // map.centerAndZoom(new BMap.Point(110.79581, 30.88069), 11);
    // var _point = new BMap.Point(120.76387299284131, 31.92252143886308);
    var _point = new BMap.Point(114.371347,30.541142);
    map.centerAndZoom(_point, 12);
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
    var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}); //右上角，仅包含平移和缩放按钮
    var mapType1 = new BMap.MapTypeControl( {
            mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP],
            anchor: BMAP_ANCHOR_TOP_LEFT
        }
    );
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});

    map.addControl(top_left_control);
    // map.addControl(top_left_navigation);
    map.addControl(top_right_navigation);
    map.addControl(mapType1);          //2D图，混合图
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
    map.enableScrollWheelZoom();
    initMouseTool();

    initElements();
    // setRightMenu();
    initGeoInfos();
    toResStat();
    initRelpos();
    // initGeoEntities();
}

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
            var pt = new BMap.Point(data.position[0], data.position[1]);
            var marker = new BMap.Marker(pt,{
                title: data.name,
                zIndex: 100,
                icon: markerIcon,
            });
            marker.extData = data;
            marker.addEventListener("mouseover", markerHighlight);
            marker.addEventListener("mouseout", markerMouseOut);
            marker.addEventListener("click", mapFeatureClick);
            markers.push(marker);
        } else if("3" == data.spaType) {
            var lineArr = JSON.parse(data.path);
            var bdLineArr = [];
            for(var j = 0; j < lineArr.length; j++) {
                var _pt = new BMap.Point(lineArr[j][0], lineArr[j][1]);
                bdLineArr.push(_pt);
            }
            var polyline = new BMap.Polyline(bdLineArr, {
                enableEditing: false,//是否启用线编辑，默认为false
                enableClicking: true,//是否响应点击事件，默认为true
                // icons:[icons],
                strokeWeight:'5',//折线的宽度，以像素为单位
                strokeOpacity: 1,//折线的透明度，取值范围0 - 1
                strokeColor:"#3366FF", //折线颜色,
            });
            polyline.extData = data;
            polyline.addEventListener("mouseover", markerHighlight);
            polyline.addEventListener("mouseout", markerMouseOut);
            polyline.addEventListener("click", mapFeatureClick);
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
            if(markers[i].extData['id'] == psdata[j]['id']) {
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
    var lineArr = JSON.parse(distjson.path);
    var bdLineArr = [];
    for(var j = 0; j < lineArr.length; j++) {
        var _pt = new BMap.Point(lineArr[j][0], lineArr[j][1]);
        bdLineArr.push(_pt);
    }
    var polygon = new BMap.Polygon(bdLineArr, {
        zIndex: 3,
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        // icons:[icons],
        strokeWeight: 1.5,//折线的宽度，以像素为单位
        strokeOpacity: 0.3,//折线的透明度，取值范围0 - 1
        strokeColor:"#FF44FF", //折线颜色,
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.3
    });
    polygon.extData = distjson;
    polygon.addEventListener("mouseover", overlayHighlight);
    polygon.addEventListener("mouseout", overlayMouseOut);
    polygon.addEventListener("click", overlayFeatureClick);
    // var polygon = new AMap.Polygon({
    //     zIndex: 40,
    //     extData: distjson,
    //     path: pathArr,//设置多边形边界路径
    //     strokeColor: "#FF44FF", //线颜色
    //     strokeOpacity: 0.3, //线透明度
    //     strokeWeight: 1.5,    //线宽
    //     fillColor: "#1791fc", //填充色
    //     fillOpacity: 0.3//填充透明度
    // });
    // // AMap.event.addListener(polygon, "dblclick", distDbClick);
    // AMap.event.addListener(polygon, "mouseover", overlayHighlight);
    // AMap.event.addListener(polygon, "mouseout", overlayMouseOut);
    // AMap.event.addListener(polygon, "click", overlayFeatureClick);
    // // polygon.setMap(map);
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
            // old.setMap(null);
            map.removeOverlay(old);
        }
    }
    for(var i = 0; i < distpolygons.length; i++) {
        var polygon = distpolygons[i];
        // polygon.setMap(map);
        map.addOverlay(polygon);
        polygon.show();
    }
    $("#toolbarDists")[0].checked = true;
    if(fit) {
        // map.setFitView(distpolygons);
        // var view = map.getViewport(distpolygons[0]);
        // var mapZoom = view.zoom;
        // var centerPoint = view.center;
        // map.centerAndZoom(centerPoint, mapZoom);
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
    var bdLineArr = [];
    for(var j = 0; j < lineArr.length; j++) {
        var _pt = new BMap.Point(lineArr[j][0], lineArr[j][1]);
        bdLineArr.push(_pt);
    }
    var polyline = new BMap.Polyline(bdLineArr, {
        zIndex: 50,
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        // icons:[icons],
        strokeWeight:'3',//折线的宽度，以像素为单位
        strokeOpacity: 0.9,//折线的透明度，取值范围0 - 1
        strokeColor:"#FF33FF", //折线颜色,
    });
    polyline.extData = boundjson;
    polyline.addEventListener("mouseover", overlayHighlight);
    polyline.addEventListener("mouseout", overlayMouseOut);
    polyline.addEventListener("click", overlayFeatureClick);
    bounds.push(polyline);
}

//  显示部分行政界线
function showBounds(boundPylylines) {
    if(boundPolylines != boundPylylines) {
        for(var i = 0; i < boundPolylines.length; i++) {
            var old = boundPolylines[i];
            // old.setMap(null);
            map.removeOverlay(old);
        }
    }
    for(var i = 0; i < boundPylylines.length; i++) {
        var polyline = boundPylylines[i];
        // polyline.setMap(map);
        map.addOverlay(polyline);
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
            // setResultItems(bmArrayJson, "boundmarkersall", "boundmarker");
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

    var pt = new BMap.Point(bmjson.position[0], bmjson.position[1]);
    var marker = new BMap.Marker(pt,{
        title: bmjson.name,
        zIndex: 300,
        icon: bmIcon,
    });
    marker.extData = bmjson;
    marker.addEventListener("mouseover", overlayHighlight);
    marker.addEventListener("mouseout", overlayMouseOut);
    marker.addEventListener("click", overlayFeatureClick);
    boundMarkers.push(marker);
}

//  显示部分界桩
function showBoundMarkers(bmMarkers) {
    if(boundMarkers != bmMarkers) {
        for(var i = 0; i < boundMarkers.length; i++) {
            var old = boundMarkers[i];
            // old.setMap(null);
            map.removeOverlay(old);
        }
    }
    for(var i = 0; i < bmMarkers.length; i++) {
        var marker = bmMarkers[i];
        // marker.setMap(map);
        map.addOverlay(marker);
        marker.show();
    }
    // $("#toolbarBoundMarkers")[0].checked = true;
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
            if(distPolygons[i].extData['id'] == distdata[j]['id']) {
                showingDists.push(distPolygons[i]);
                break;
            }
        }
    }

    showingBounds = [];
    for(var i = 0; i < boundPolylines.length; i++) {
        for(var j = 0; j < bounddata.length; j++) {
            if(boundPolylines[i].extData['Id'] == bounddata[j]['Id']) {
                showingBounds.push(boundPolylines[i]);
                break;
            }
        }
    }

    showingbms = [];
    for(var i = 0; i < boundMarkers.length; i++) {
        for(var j = 0; j < bmdata.length; j++) {
            if(boundMarkers[i].extData['Id'] == bmdata[j]['Id']) {
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
    var data = fea.extData;
    if("1" == data.spaType) {
        // fea.setIcon("images/markers/common_marker_selected.png");
        fea.setIcon(markerHighIcon);
    } else if("3" == data.spaType) {
        // fea.setOptions({strokeColor: "#FF0000"});
        fea.setStrokeColor("#FF0000");
    }

}

//  取消地名要素高亮显示
function markerUnhighlight(e) {
    var fea = e.target;
    var data = fea.extData;
    data["selected"] = false;
    if("1" == data.spaType) {
        // fea.setIcon("images/markers/common_marker.png");
        fea.setIcon(markerIcon);
    } else if("3" == data.spaType) {
        // fea.setOptions({strokeColor: "#3366FF"});
        fea.setStrokeColor("#3366FF");
    }
}

//  鼠标移开地名要素时
function markerMouseOut(e) {
    var fea = e.target;
    var data = fea.extData;
    if(data["selected"]) {
        return;
    }
    if("1" == data.spaType) {
        // fea.setIcon("images/markers/common_marker.png");
        fea.setIcon(markerIcon);
    } else if("3" == data.spaType) {
        // fea.setOptions({strokeColor: "#3366FF"});
        fea.setStrokeColor("#3366FF");
    }
}

//	点击行政区、行政界线、界桩要素时
function overlayFeatureClick(e){
    openSimpleInfoWindow(e);
}

//	在所有地名中按属性查询
function findPlaceByAttr(attr, _name) {
    var pla = null;
    for(var i = 0; i < markers.length; i++) {
        var testplace = markers[i].extData;
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
    toInfoRes();
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
        toInfoRes();
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
        toInfoRes();
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
                var bid = bd.extData['Id'];
                findBoundBms(bid, bma);
            }
            var bms = unique1(bma);
            setResultItems(ba, "boundresults", "bound");
            showBounds(ba);
            setResultItems(bms, "boundmarkrsresults", "boundmarker");
            showBoundMarkers(bms);
            var distData = dp.extData;
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
        // toInfoRes();
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
        var bdata = bound.extData;
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
        var bmdata = bm.extData;
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

//  根据地区编码查询行政区要素
function findDistPolygon(distcode) {
    for(var i = 0; i < distPolygons.length; i++) {
        var dp = distPolygons[i];
        var extData = dp.extData;
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
        // marker.setMap(map);
        map.addOverlay(marker);//添加到地图上
        marker.show();
    }
    // map.setFitView(showingMarkers);
}

//  隐藏地名图层
function placesHide() {
    for(var i = 0; i < showingMarkers.length; i++) {
        var marker = showingMarkers[i];
        marker.hide();
        // marker.setMap(null);
        // map.remove(marker);
        map.removeOverlay(marker);
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
        showGeoInfo();
    } else {
        hideGeoInfo();
    }
}

//  行政区 checkbox
function distsCheckBox(checkbox) {
    // if (checkbox.checked) {
    //     distsShow();
    // } else {
    //     distsHide();
    // }
    if (checkbox.checked) {
        showPosAdds();
    } else {
        hidePosAdds();
    }
}

//  融合要素 checkbox
function entityCheckBox(checkbox) {
    if (checkbox.checked) {
        showGeoEntities();
    } else {
        hideGeoEntities();
    }
}

//  行政界线 checkbox
function boundsCheckBox(checkbox) {
    // if (checkbox.checked) {
    //     boundsShow();
    // } else {
    //     boundsHide();
    // }
    if (checkbox.checked) {
        showMassPoints(false);
    } else {
        hideMassPoints();
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

//	查询范围画完时
var drawComplete = function(e){
    $("#mapextentdone")[0].innerHTML = "范围已在图中选择";
    // var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
    // var str = "[";
    // for(var i=0;i < path.length;i++){
    //     str += " [" + path[i].lng + ", " + path[i].lat + "],";
    // }
    // str = str.substring(0, str.length - 1);
    // str += "]";
    // $("#mapextentdone")[0].innerHTML = str;
    mouseTool.painting = e.overlay;
    posadd.mapExtent = mouseTool.painting;
    mouseTool.close();
};

//  初始化画笔工具（用于选择自定义范围）
function initMouseTool() {
    mouseTool = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingMode:BMAP_DRAWING_POLYGON,//绘制模式  多边形
        // drawingMode:BMAP_DRAWING_POLYLINE,//绘制模式  线
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes:[
                BMAP_DRAWING_POLYGON
            ]
        },
        polygonOptions: {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.7,       //边线透明度，取值范围0 - 1。
            fillOpacity: 0.15,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    mouseTool.addEventListener('overlaycomplete', drawComplete);

}

function spaTypeName(spaType) {
    if(spaType === undefined || spaType == null || spaType == 0) {
        return "未知";
    }
    switch(spaType) {
        case 1: return "点";
        case 3: return "线";
        case 5: return "多边形";
        default: return "未知";
    }
}

function getFigureByStr(coordStr, type) {
    if(coordStr === null) {
        return null;
    }
    coordStr = coordStr.trim();
    var lineArr = JSON.parse(coordStr);
    return getFigureJson(lineArr, type);
}

//  行政区、行政界线、界桩要素高亮显示
function overlayHighlight(e) {
    var fea = e.target;
    var data = fea.extData;
    var type = data['overlay'];
    if(fea.spaType == 5 || data.spaType == 5) {
        fea.setStrokeWeight(overlay_styles.polygonHighStyle.strokeWeight);
        fea.setFillColor(overlay_styles.polygonHighStyle.fillColor);
        fea.setFillOpacity(overlay_styles.polygonHighStyle.fillOpacity);
    } else if(fea.spaType == 3 || data.spaType == 3) {
        fea.setStrokeWeight(overlay_styles.lineHighStyle.strokeWeight);
        fea.setStrokeColor(overlay_styles.lineHighStyle.strokeColor);
        fea.setStrokeOpacity(overlay_styles.lineHighStyle.strokeOpacity);
    } else if(fea.spaType == 1 || data.spaType == 1) {
        fea.setIcon(overlay_styles.markerHighIcon);
    }

}

//  取消行政区、行政界线、界桩要素高亮显示
function overlayUnhighlight(e) {
    var fea = e.target;
    var data = fea.extData;
    var type = data['overlay'];
    data["selected"] = false;
    if(fea.spaType == 5 || data.spaType == 5) {
        fea.setStrokeWeight(overlay_styles.polygonStyle.strokeWeight);
        fea.setFillColor(overlay_styles.polygonStyle.fillColor);
        fea.setFillOpacity(overlay_styles.polygonStyle.fillOpacity);
    } else if(fea.spaType == 3 || data.spaType == 3) {
        fea.setStrokeWeight(overlay_styles.lineStyle.strokeWeight);
        fea.setStrokeColor(overlay_styles.lineStyle.strokeColor);
        fea.setStrokeOpacity(overlay_styles.lineStyle.strokeOpacity);
    } else if(fea.spaType == 1 || data.spaType == 1) {
        fea.setIcon(overlay_styles.markerIcon);
    }
}

//  鼠标移开行政区、行政界线、界桩要素时
function overlayMouseOut(e) {
    var fea = e.target;
    var data = fea.extData;
    var type = data['overlay'];
    if(data["selected"]) {
        return;
    }
    if(fea.spaType == 5 || data.spaType == 5) {
        fea.setStrokeWeight(overlay_styles.polygonStyle.strokeWeight);
        fea.setFillColor(overlay_styles.polygonStyle.fillColor);
        fea.setFillOpacity(overlay_styles.polygonStyle.fillOpacity);
    } else if(fea.spaType == 3 || data.spaType == 3) {
        fea.setStrokeWeight(overlay_styles.lineStyle.strokeWeight);
        fea.setStrokeColor(overlay_styles.lineStyle.strokeColor);
        fea.setStrokeOpacity(overlay_styles.lineStyle.strokeOpacity);
    } else if(fea.spaType == 1 || data.spaType == 1) {
        fea.setIcon(overlay_styles.markerIcon);
    }
}

function getFigureJson(coordJson, type, refuse) {
    var overlay = null;
    if(type == "point" | type == 1) {
        var bp = new BMap.Point(coordJson[0], coordJson[1]);
        overlay = new BMap.Marker(bp, {icon: overlay_styles.markerIcon});
        overlay.spaType = 1;
    } else {
        var bdPointArr = [];
        for (var i = 0; i < coordJson.length; i++) {
            var xy = coordJson[i];
            var _x = xy[0];
            var _y = xy[1];
            var bp = new BMap.Point(_x, _y);
            bdPointArr.push(bp);
        }
        if (type == "line" || type == 3) {
            overlay = new BMap.Polyline(bdPointArr, overlay_styles.lineStyle);
            overlay.spaType = 3;
        } else {
            overlay = new BMap.Polygon(bdPointArr, overlay_styles.polygonStyle);
            overlay.spaType = 5;
        }
    }
    if(refuse != true && refuse != 1) {
        overlay.addEventListener("mouseover", overlayHighlight);
        overlay.addEventListener("mouseout", overlayMouseOut);
    }
    return overlay;
}

function newHighLight(e) {
    var fea = e.target;
    var data = fea.extData;
    var type = data['overlay'];
    if(fea.spaType == 5 || data.spaType == 5) {
        fea.setStrokeColor(overlay_styles.newPolygonHighStyle.strokeColor);
        fea.setFillColor(overlay_styles.newPolygonHighStyle.fillColor);
        fea.setFillOpacity(overlay_styles.newPolygonHighStyle.fillOpacity);
    } else if(fea.spaType == 3 || data.spaType == 3) {
        fea.setStrokeWeight(overlay_styles.lineHighStyle.strokeWeight);
        fea.setStrokeColor(overlay_styles.lineHighStyle.strokeColor);
        fea.setStrokeOpacity(overlay_styles.lineHighStyle.strokeOpacity);
    } else if(fea.spaType == 1 || data.spaType == 1) {
        fea.setIcon(overlay_styles.newMarkerHighIcon);
    }
}

function newMouseOut(e) {
    var fea = e.target;
    var data = fea.extData;
    var type = data['overlay'];
    if(data["selected"]) {
        return;
    }
    if(fea.spaType == 5 || data.spaType == 5) {
        fea.setStrokeColor(overlay_styles.newPolygonStyle.strokeColor);
        fea.setFillColor(overlay_styles.newPolygonStyle.fillColor);
        fea.setFillOpacity(overlay_styles.newPolygonStyle.fillOpacity);
    } else if(fea.spaType == 3 || data.spaType == 3) {
        fea.setStrokeWeight(overlay_styles.lineStyle.strokeWeight);
        fea.setStrokeColor(overlay_styles.lineStyle.strokeColor);
        fea.setStrokeOpacity(overlay_styles.lineStyle.strokeOpacity);
    } else if(fea.spaType == 1 || data.spaType == 1) {
        fea.setIcon(overlay_styles.newMarkerIcon);
    }
}

function newMouseDbClick(e) {
    try {
        e.target.hide();
    } catch (e){}
}

function createNewMarker(bp) {
    var marker = new BMap.Marker(bp, {icon: overlay_styles.newMarkerIcon});
    marker.spaType = 1;
    // marker.extData['id'] = generateUUID();
    marker.addEventListener("mouseover", newHighLight);
    marker.addEventListener("mouseout", newMouseOut);
    marker.addEventListener("rightclick", newMouseDbClick);
    marker.addEventListener("dblclick", newMouseDbClick);
    return marker;
}

function createNewPolygon(data, data_type) {
    if(data_type == "string") {
        var lineArr = JSON.parse(data);
        return createNewPolygon(lineArr, "line_array");
    }
    if(data_type == "line_array") {
        var pointArr = [];
        for(var i = 0; i < data.length; i++) {
            var bp = new BMap.Point(data[i][0], data[i][1]);
            pointArr.push(bp);
        }
        return createNewPolygon(pointArr, "bp_array");
    }
    if(data_type == "bp_array") {
        var polygon = new BMap.Polygon(data, overlay_styles.newPolygonStyle);
        return createNewPolygon(polygon, "polygon");
    }
    if(data_type == "polygon") {
        data.spaType = 5;
        // polygon.extData['id'] = generateUUID();
        data.addEventListener("mouseover", newHighLight);
        data.addEventListener("mouseout", newMouseOut);
        data.addEventListener("rightclick", newMouseDbClick);
        data.addEventListener("dblclick", newMouseDbClick);
        // data.addEventListener("mouseup", function (e) {
        //     openInfoWin(e);
        // });

        return data;
    }
    return null;
}