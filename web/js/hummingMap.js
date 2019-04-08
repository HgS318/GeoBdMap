/*
 abstract: 本模块完成与地图相关操作的功能,主要与高德地图进行交互
 author: cwj
 date: 2017/03/12
 */

require.config({
    paths: {
        "hummingUtil": "hummingUtil",
        "hummingSearch": "hummingSearch",
        "tdtSearch": "tdtSearch",
        "echartConfig": "echarts/config"
    },
    shim: {
    }
});

define(function(require){
    "use strict";

    var HMUtil = require('hummingUtil');
    var HMSearch = require('hummingSearch');
    var TDTSearch = require('tdtSearch');
    var _map = null;
    var _vecMapType = null;
    var _satMapType = null;
    var _preHeadOid = null;
    var _circleTool = null;
    var _rectTool = null;
    var _lineTool = null;
    var _polygonTool = null;
    var _markerTool = null;
    var _mapmoveend = null;
    var _featureMarks = [];

    var _featureIDS = [];
    var _relations = [];
    var _relMarksShapes = [];
    var _relMarkerGeo = null;
    var _geoNameShapes = [];
    var _relMarkSel = null;
    // 初始化地图
    function initmap(){

        //创建版权控件对象
        //var atrCtrl = new TCopyrightControl();

        // 根据窗口变换动态改变地图高度
        window.onresize = function(){
            var h = document.documentElement.clientHeight - ($("#hm_header").height());
            var w = document.documentElement.clientWidth - ($("#hm_sidebar").width());
            $("#map").height(h);
            $("#map").width(w);
            $("#hm_sidebar").height(h - 40);

            //设置版权的位置
            //atrCtrl.setLeft(160);
           // atrCtrl.setTop($("#map").height()-21);

            //window._loaderControl.setLeft($("#map").width()/2 - 50);
            //window._loaderControl.setTop($("#map").height()/2 - 50);
        }
        $(window).resize();

        //初始化高德地图对象
        _map = new AMap.Map('map',{
            resizeEnable: true,
            zoom: 12,
            center: [114.3364, 30.5457]
        });

        // 加载地图上相应插件
        AMap.plugin(['AMap.ToolBar','AMap.MapType'],function(){
            //创建并添加工具条控件
            var toolbar = new AMap.ToolBar();
            _map.addControl(toolbar);

            // 图层切换插件
            var mapType = new AMap.MapType();
            _map.addControl(mapType);
        })
        /*
        //创建比例尺控件对象
        var scale = new TScaleControl();
        //添加比例尺控件
        _map.addControl(scale);
        var config = {
            type:"TMAP_NAVIGATION_CONTROL_LARGE",   //缩放平移的显示类型
            anchor:"TMAP_ANCHOR_TOP_LEFT",          //缩放平移控件显示的位置
            offset:[0,0],                           //缩放平移控件的偏移值
            showZoomInfo:true                       //是否显示级别提示信息，true表示显示，false表示隐藏。
        };
        //创建缩放平移控件对象
        var zoomctrl=new TNavigationControl(config);
        //添加缩放平移控件
        _map.addControl(zoomctrl);
        // 地图上添加按钮组控件
        var appBtnGroup = document.getElementById("appbtngroup");
        var appBtnControl = new THtmlElementControl(appBtnGroup);
        appBtnControl.setRight(10);
        appBtnControl.setTop(10);
        _map.addControl(appBtnControl);

        // 添加底图切换控件
        var baseMapObj = document.getElementById("basemapbtn");
        var baseMapControl = new THtmlElementControl(baseMapObj);
        baseMapControl.setLeft(80);
        baseMapControl.setTop(10);
        _map.addControl(baseMapControl);

        //添加版权控件
        _map.addControl(atrCtrl);
        var bs = _map.getBounds();   //返回地图可视区域
        //添加版权内容及事件
        atrCtrl.addCopyright({id:1,content:"© <a href='http://sres.whu.edu.cn/' target='_blank' style='font-size:12px;background:transparent'>武汉大学资源与环境科学学院</a>"});

        // 添加底部百科信息预览面板
        var wikiPanelObj = document.getElementById("wikicontentpanel");
        var wikiPanelControl = new THtmlElementControl(wikiPanelObj);
        wikiPanelControl.setRight(10);
        wikiPanelControl.setTop(60);
        _map.addControl(wikiPanelControl);

        _map.addControl(window._loaderControl);
        window._loaderControl.hidden();*/

        $("#infohead").on("click", "div", this, onHeadClick);
        $("#hm_wikinav").click();
        // 绑定百科分类搜索单击事件
        $("#hm_wikiClass").on("click", ".wikiClass-list-item", {type:"TWikiClassAtr"}, searchFeaturesByClass);
        $("#basemapbtn").on("click", onClickBaseMap);
        $('.dropdown-toggle').dropdown();
       /* onClickAppBtnGroup();
        initSearch();
        initViewPanel();
        setBaseMapType();*/
    }

    // 设置地图数据类型
    function setBaseMapType(){
        var vecCfg = {};
        vecCfg.getTileUrl = function(x,y,z){
            return HMUtil.G_TDTVecMapUrl + "x=" + x + "&y=" + y + "&l=" + z;
        }

        var vecTCfg = {};
        vecTCfg.getTileUrl = function(x,y,z){
            return HMUtil.G_TDTVecAnnotationUrl + "x=" + x + "&y=" + y + "&l=" + z;
        }

        var vbLay = new TTileLayer(vecCfg);
        vbLay.setGetTileUrl(vecCfg.getTileUrl);

        var vtLay = new TTileLayer(vecTCfg);
        vtLay.setGetTileUrl(vecTCfg.getTileUrl);

        _vecMapType = new TMapType([vbLay, vtLay], "VectorMap");

        var satCfg = {};
        satCfg.getTileUrl = function(x,y,z){
            return HMUtil.G_TDTSatMapUrl + "TileMatrix=" + z + "&TileRow=" + y + "&TileCol=" + x + "&style=default&format=tiles";
        }

        var satTCfg = {};
        satTCfg.getTileUrl = function(x,y,z){
            return HMUtil.G_TDTSatAnnotationUrl + "TileMatrix=" + z + "&TileRow=" + y + "&TileCol=" + x + "&style=default&format=tiles";
        }

        var bLay = new TTileLayer(satCfg);
        bLay.setGetTileUrl(satCfg.getTileUrl);

        var tLay = new TTileLayer(satTCfg);
        tLay.setGetTileUrl(satTCfg.getTileUrl);

        _satMapType = new TMapType([bLay, tLay], "SatelliteMap");

        _map.setMapType(_vecMapType);
    }

    // 切换地图类型
    function onClickBaseMap(){
        var vecObj = document.getElementById("hm_vecbase");
        var satObj = document.getElementById("hm_satbase");
        var mpType = _map.getMapType();
        var name = mpType.getName();
        if (name == "VectorMap")
        {
            _map.setMapType(_satMapType);
            vecObj.style.display="block";
            satObj.style.display="none";
        }
        else
        {
            _map.setMapType(_vecMapType);
            vecObj.style.display="none";
            satObj.style.display="block";
        }
    }

    // 图层菜单
    function onClickMapMenuItem(){

    }

    // 初始化搜索
    function initSearch(){
        /*if (window.searchType == 'HMSearch')
        {
            TDTSearch.close();
            HMSearch.init(_map);
        }
        else if (window.searchType == 'TDTSearch')
        {
            HMSearch.close();
            TDTSearch.init(_map);
        }*/

        //HMSearch.close();
        TDTSearch.init(_map);
        HMSearch.init(_map);
    }

    // 添加鹰眼地图
    function addMiniMap(){

    }

    // 地图放大
    function zoomIn(e){
        _map.zoomIn();
    }

    // 地图缩小
    function zoomOut(e){
        _map.zoomOut();
    }

    function toChangeHead(oid) {
        // var titles=["hm_wikinav", "hm_classnav", "hm_favnav"];
        var titles=["hm_wikinav", "hm_classnav"];
        var infoClassObj = document.getElementById("hm_infoClass");
        // var favoritesObj = document.getElementById("hm_favorites");
        var wikiClassObj = document.getElementById("hm_wikiClass");

        for(var i = 0;i < titles.length; i++) {
            var title = titles[i];
            var preHeadObj = document.getElementById(title);
            var reg = new RegExp('(\\s|^)' + "active" + '(\\s|$)');
            preHeadObj.className = preHeadObj.className.replace(reg, ' ');
        }
        document.getElementById(oid).className += " active";
        document.getElementById("hm_mapInfo").style.display="block";
        document.getElementById("searchresults").style.display="none";
        switch(oid) {
            case "hm_classnav":{
                infoClassObj.style.display="block";
                // favoritesObj.style.display="none";
                wikiClassObj.style.display="none";
                break;
            }
            // case "hm_favnav":{
            //     infoClassObj.style.display="none";
            //     favoritesObj.style.display="block";
            //     wikiClassObj.style.display="none";
            //     break;
            // }
            case "hm_wikinav":{
                infoClassObj.style.display="none";
                // favoritesObj.style.display="none";
                wikiClassObj.style.display="block";
                break;
            }
        }

    }

    // 响应侧边栏头部单击切换
    function onHeadClick(e){
        //_map.clearOverLays();
        var oid = e.currentTarget.id;
        toChangeHead(oid);
    }

    // 根据分类搜索实例要素
    function searchFeaturesByClass(e){
        // 切换到百科搜索类
        /*var a = document.getElementById("wiki_search");
        window.activeLogoNav('HMSearch', a);
        initSearch();*/
        /*HMSearch.close();
        HMSearch.init(_map);*/

        _featureMarks = [];
        var type = 0;
        var classCode = e.currentTarget.attributes["data-value"].nodeValue;
        switch (classCode)
        {
            case "200000":
                type = 2;
                break;
            case "400000":
                type = 4;
                break;
            case "700000":
                type = 7;
                break;
            case "500000":
                type = 5;
                break;
            case "300000":
                type = 3;
                break;
            case "800000":
                type = 8;
                break;
            case "900000":
                type = 9;
                break;
            case "600000":
                type = 6;
                break;
            case "100000":
                type = 1;
                break;
        }

        //获取当前底图范围
        var bound = _map.getBounds();
        //将范围转换为字符串形式。
        var bLeft = bound.getSouthWest().getLng();
        var bBottom = bound.getSouthWest().getLat();
        var bRight = bound.getNorthEast().getLng();
        var bTop = bound.getNorthEast().getLat();
        var mapBound = bLeft + "," + bBottom + "," + bRight + "," + bTop;

        if (type != 0){
            var opt = {};
            if (e.data.type == "TWikiClassAtr"){
                opt = {
                    word:"",
                    class:type
                };
            }
            else if (e.data.type == "TWikiClassSpa"){
                opt = {
                    word:"",
                    spatialtype:"withinbox",
                    class:type,
                    dis:"",
                    loc:"",
                    pts:"",
                    lt:"",
                    rb:""
                };
            }

            HMSearch.genPaginate(opt);
        }
    }

    // 绑定地图按钮组单击事件
    function onClickAppBtnGroup(){
        var groupObj = document.getElementById("appbtngroup");
        var btnsObj = groupObj.getElementsByTagName("button");
        //用循环绑定鼠标单击事件
        for(var i=0; i<btnsObj.length; i++) {
            btnsObj[i].onclick = function(e) {
                switch (e.currentTarget.id)
                {
                    case "btnCircleSelect":
                    {
                        onClickClear();
                        window.closeViewPanel();
                        onClickCircleSelect();
                        break;
                    }
                    case "btnRecSelect":
                    {
                        onClickClear();
                        window.closeViewPanel();
                        onClickRecSelect();
                        break;
                    }
                    case "btnGeoKnowledge":
                    {
                        addMapMoveend();
                        break;
                    }
                    case "btnMarkGeo":
                    {
                        //var test = $('div[background-image~="cluster0"]');
                        //onClickMarker();
                        break;
                    }
                    case "btnRelCal":
                    {
                        window.closeViewPanel();
                        onClickRelCal();
                        break;
                    }
                    case "btnView":
                    {
                        //onClickClear();
                        var level = _map.getZoom();
                        if (level > 13){
                            var bounds = _map.getBounds();
                            HMSearch.spaBoxSearch(bounds);
                        }
                        else
                        {
                            alert("请在13等级以下进行视野内百科查看!");
                        }

                        break;
                    }
                    case "btnMeasureDis":
                    {
                        onClickClear();
                        window.closeViewPanel();
                        onClickMeasureDis();
                        break;
                    }
                    case "btnMeasureArea":
                    {
                        onClickClear();
                        window.closeViewPanel();
                        onClickMeasureArea();
                        break;
                    }
                    case "btnClear":
                    {
                        onClickClear();
                        window.closeViewPanel();
                        break;
                    }
                }
            }
        }
    }

    // 清除
    function onClickClear(){
        if (_circleTool != null){
            _circleTool.close();
            _circleTool = null
        }

        if (_rectTool != null){
            _rectTool.close();
            _rectTool = null;
        }

        if (_lineTool != null){
            _lineTool.close();
            _lineTool = null;
        }

        if (_polygonTool != null){
            _polygonTool.close();
            _polygonTool = null;
        }

        if (_markerTool != null){
            _markerTool.close();
            _markerTool = null;
        }
        _map.clearOverLays();
        HMSearch.clearSearchResults();
        window.closeRelCalPanel();
        $("#hm_wikinav").click();
        _featureMarks = [];
        _relMarksShapes = [];
        _featureIDS = [];
        _geoNameShapes = [];
        $("#btnRelCal").text("关系计算");
    }

    // 响应圆形选择工具
    function onClickCircleSelect(){
        var circleCfg = {
            strokeColor:"#000000",	//圆边线颜色
            fillColor:"#FFFFFF",	//填充颜色。
            strokeWeight:"3px",	    //圆边线线的宽度，以像素为单位
            strokeOpacity:0.5,	    //圆边线线的透明度，取值范围0 - 1
            fillOpacity:0.5,		//填充的透明度，取值范围0 - 1
            strokeStyle:"solid"	    //圆边线线的样式，solid或dashed
        };

        //创建画圆工具对象
        _circleTool = new TCircleTool(_map,circleCfg);
        //注册画圆工具在绘制过程中的事件
        TEvent.addListener(_circleTool,"draw",onDrawCircle);
        //注册画圆工具绘制完成后的事件
        TEvent.addListener(_circleTool,'drawend',onDrawCircleEnd);
        _circleTool.open();
    }

    function onDrawCircleEnd(circle) {
        var center = circle.getCenter();
        var radius = circle.getRadius();
        circle = new TCircle(center,radius);
        _map.addOverLay(circle);
        _circleTool.close();
    }

    function onDrawCircle(center,radius) {
        //document.getElementById('info').value="圆的半径是 "+parseInt(radius)+" 米";
    }

    // 响应矩形选择工具
    function onClickRecSelect(){
        var recCfg = {
            strokeColor:"#000000",	//折线颜色
            fillColor:"#FFFFFF",	//填充颜色。当参数为空时，折线覆盖物将没有填充效果
            strokeWeight:"2px",	    //折线的宽度，以像素为单位
            opacity:0.5,	        //折线的透明度，取值范围0 - 1
            strokeStyle:"solid"	    //折线的样式，solid或dashed
        };
        //创建矩形工具对象
        _rectTool = new TRectTool(_map,recCfg);
        //注册矩形工具绘制完成后的事件
        TEvent.addListener(_rectTool, "draw", onDrawRect);
        _rectTool.open();
    }

    function onDrawRect(bounds) {
        var rect = new TRect(bounds);
        _map.addOverLay(rect);
        //关闭矩形工具体
        _rectTool.close();
    }

    function addMapMoveend()
    {
        //移除地图的移动停止事件,防止多次注册事件
        removeMapMoveend();
        //注册地图的移动停止事件
        _mapmoveend = TEvent.addListener(_map,"mouseup", doQuery);
    }

    function doQuery(lnglat){
        /*alert(lnglat.getLng()+","+lnglat.getLat());*/
        var level = _map.getZoom();
        if (_mapmoveend != null && level > 10){
            var bounds = _map.getBounds();
            HMSearch.spaBoxSearch(bounds);
        }
    }

    function removeMapMoveend()
    {
        //移除地图的移动停止事件
        TEvent.removeListener(_mapmoveend);
        _mapmoveend = null;
    }

    // 设置自定义图层
    function setOwnerLayer(){
        addMapMoveend();
    }

    // 响应标注工具
    function onClickMarker(){
        var strPic = "images/marker-icon.png";
        var mkicon = new TIcon(strPic, new TSize(25,41),{anchor:new TPixel(12,41)});
        //创建标注工具对象
        _markerTool = new TMarkTool(_map, {icon: mkicon});
        //注册标注的mouseup事件
        TEvent.addListener(_markerTool,"mouseup", markerMouseUp);
        _markerTool.open();
    }

    function markerMouseUp(point){
        if (_featureMarks.length >= 10){
            alert("目前仅支持10个百科要素的关系计算!");
            return;
        }

        var strPic = "images/marker-icon.png";
        var mkicon = new TIcon(strPic, new TSize(25,41),{anchor:new TPixel(12,41)});
        var marker = new TMarker(point, {icon: mkicon});
        _map.addOverLay(marker);
        _markerTool.close();
        _featureMarks.push(marker);
    }

    // 响应量距离工具
    function onClickMeasureDis(){
        var lineCfg = {
            strokeColor:"blue",	//折线颜色
            strokeWeight:"3px",	//折线的宽度，以像素为单位
            strokeOpacity:0.5,	//折线的透明度，取值范围0 - 1
            strokeStyle:"solid"	//折线的样式，solid或dashed
        };
        //创建测距工具对象
        _lineTool = new TPolylineTool(_map,lineCfg);
        //注册测距工具绘制完成后的事件
        TEvent.addListener(_lineTool,"draw",onDrawLine);
        _lineTool.open();
    }

    //关闭测距工具
    function onDrawLine(bounds,line,obj) {
        _lineTool.close();
    }

    // 响应量面积工具
    function onClickMeasureArea(){
        var areaCfg = {
            strokeColor:"blue",	    //折线颜色
            fillColor:"#FFFFFF",	//填充颜色。当参数为空时，折线覆盖物将没有填充效果
            strokeWeight:"3px",	    //折线的宽度，以像素为单位
            strokeOpacity:0.5,	    //折线的透明度，取值范围0 - 1
            fillOpacity:0.5			//填充的透明度，取值范围0 - 1
        };
        //创建测面工具对象
        _polygonTool = new TPolygonTool(_map,areaCfg);
        //注册测面工具绘制完成后的事件
        TEvent.addListener(_polygonTool,"draw",onDrawPolygon);
        _polygonTool.open();
    }

    //关闭测面工具
    function onDrawPolygon(bounds,line){
        _polygonTool.close();
    }

    //关系计算
    function onClickRelCal(){
        //var calContent = '<div class="hm-relCal"></div>';
        //var textContent = '<div style="margin-top:10px;font-size: 12px"><a>查看详情>></a></div>';
        //var content = '<div class="text-center">{0}{1}</div>';
        if (_featureMarks.length == 0){
            alert("进行关系计算前,请先添加要参与计算的百科要素!");
            return;
        }

        // 计算获取标注对应的要素ID
        //var ontoids = getFeaturesID();

        if (_featureIDS.length == 0){
            window._loaderControl.hidden();
            return;
        }

        var popContent = '<div style="width: 580px"><div id="hmRelCalChart" class="hm-relCal"></div><div id="hmRelResults" class="hm-relResults"></div></div>';

        var popTitle = '<span style="font-size: 12px"><b>关系计算</b></span>' +
            //'<a id="hm_relDetail" href="javascript:void(0)" onclick = "javascript:watchRelationDetail()" style="font-size:11px;margin-left:10px;color:#0a89cd;cursor: pointer;">详情>></a>' +
            '<div style="float: right;">' +
            '<a href="javascript:closeRelCalPanel();" class="dropdown-toggle" data-toggle="dropdown">' +
            '<i class="fa fa-times fa-fw"></i></a></div>';

        $("#btnRelCal").popover('destroy');
        $("#btnRelCal").popover({html:true, title:popTitle,  placement:'bottom', animation:true, content:popContent});
        $("#btnRelCal").popover('show');

        $("#btnRelCal").on('hide.bs.popover', function () {
            if (_relMarkerGeo != null)
                _map.removeOverLay(_relMarkerGeo);
        })

        var fids = "";
        for (var i=0; i<_featureIDS.length; i++){
            fids += _featureIDS[i] + ",";
        }
        if (fids != "")
            fids = fids.substr(0, fids.length-1);

        window._loaderControl.show();

        // 计算关系
        $.ajax({
            url: "geoWikiSearch.php?act=getOntoFeatureRelation",
            type: 'GET',
            //async: false,
            data: {
                fids:fids
            },
            dataType: "json",
            success: function(data) {
                var res = eval("("+data.retResult+")");
                if (res.length > 0){
                    window._loaderControl.hidden();

                    setRelationChart(res);

                    if (_relations.length > 0){
                        var detailItems = '<ul class="list-group">'
                        $.map( _relations, function( item ) {
                            var fStr = '<font color="#28AAE2"><strong>' + item.source + '</strong></font>';
                            var tStr = '<font color="#28AAE2"><strong>' + item.target + '</strong></font>';
                            var cStr = item.name.replace("*", fStr);
                            cStr = cStr.replace("@", tStr);
                            detailItems += '<li class="list-group-item">' + cStr + '</li>';
                        });
                        detailItems += '</ul>';
                        $('#hmRelResults').html(detailItems);
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window._loaderControl.hidden();
            },
            complete: function(XMLHttpRequest, textStatus) {
                window._loaderControl.hidden();
            }
        });

    }

    // 查看关系计算详情
    function showRelationDetail(){
        var popTitle = '<span style="font-size: 12px"><b>关系计算详情</b></span><div style="float: right;">' +
            '<a href="javascript:closeWatchRelationDetailPanel();" class="dropdown-toggle" data-toggle="dropdown">' +
            '<i class="fa fa-times fa-fw"></i></a></div>';

        var detailItems = '<ul class="list-group">'
        $.map( _relations, function( item ) {
            detailItems += '<li class="list-group-item"><font color="#880707">' + item.source
            + '</font>与<font color="#880707">' + item.target + '</font>的关系为<font color="#880707">'
            + item.name + '</font></li>'
        });
        detailItems += '</ul>';

        var detailContent = '<div style="font-size:12px;width: 230px;">{0}</div>';
        detailContent = detailContent.format(detailItems);

        $("#hm_relDetail").popover('destroy');
        $("#hm_relDetail").popover({html:true, title:popTitle,  placement:'bottom', animation:true, content:detailContent});
        $("#hm_relDetail").popover('show');
    }

    // 获取标注要素的ONTOID
    function getFeaturesID(){
        var idArray = [];
        _relMarksShapes = [];
        for (var i=0; i<_featureMarks.length; i++){
            var lnglat = _featureMarks[i].getLngLat();
            var location = lnglat.getLng() + "," + lnglat.getLat();
            $.ajax({
                url: "geoWikiSearch.php?act=getOntoFeatureID",
                type: 'GET',
                async: false,
                data: {
                    loc:location,
                    buffer:500
                },
                dataType: "json",
                success: function(data) {
                    var res = eval("("+data.retResult+")");
                    if (res.Amount > 0){
                        idArray.push(res.Results[0].fields.ONTOID);
                        var centerShape = HMSearch.getGeometryCenter(res.Results[0].fields);
                        _relMarksShapes.push(centerShape);
                    }
                }
            });
        }
        return idArray;
    }

    // 重新组织form to 对象的id和名称，便于图表数据设置
    function setChartObjArray(ids, names, objArs){
        for (var j=0; j<ids.length; j++){
            var id = ids[j];
            var name = names[j];

            if (id != ""){
                if (name == " ") name = id;

                var bExist = false;
                for (var k=0; k<objArs.length; k++){
                    var obj = objArs[k];
                    if (obj.key == id){
                        bExist = true;
                        break;
                    }
                }

                if (!bExist){
                    var obj = {
                        key: id,
                        value: name
                    }
                    objArs.push(obj);
                }
            } // end if (id != "")
        }
    }

    // 获取节点数据
    function getNodeData(e){
        var objArs = [];
        for (var i=0; i< e.length; i++){
            var ids = e[i].from.id.split(",");
            var names = e[i].from.name.split(",");
            setChartObjArray(ids, names, objArs);
            ids = e[i].to.id.split(",");
            names = e[i].to.name.split(",");
            setChartObjArray(ids, names, objArs);
        }
        return objArs;
    }

    // 获取关系数据
    function getRelationData(e){
        var rels = [];
        for (var i=0; i< e.length; i++){
            if (e[i].relaiton != "" && e[i].relaiton != null){
                var fids = e[i].from.id.split(",");
                var fnames = e[i].from.name.split(",");

                var tids = e[i].to.id.split(",");
                var tnames = e[i].to.name.split(",");

                for (var j=0; j<fids.length; j++){
                    if (fids[j] != ""){
                        var fName = fnames[j];
                        if (fName == " ") fName = fids[j];
                        for (var k=0; k<tids.length; k++){
                            if (tids[k] != ""){
                                var tName = tnames[k];
                                if (tName == " ") tName = tids[k];
                                var rel = {source : fName, target : tName, weight : 10, name: e[i].relaiton}
                                rels.push(rel);
                            }
                        }
                    }
                }
            }
        }
        return rels;
    }

    function isSameFtID(id){
        for (var i=0; i<_featureIDS.length; i++){
            if (_featureIDS[i] == id){
                return true;
            }
        }
        return false;
    }

    // 设置关系计算力导图
    function setRelationChart(e){
        var objArs = getNodeData(e);

        // 设置分类和节点数据,选择的要素设置为同一分类
        var cIndex = 0;
        var category = [];
        var nds = [];
        for (var n=0; n<objArs.length; n++){
            var co = objArs[n].value.trim();
            if (co != ""){
                var catObj = {
                    name:co
                }
                category.push(catObj);

                var nc = 1;
                if (isSameFtID(objArs[n].key)){
                    nc = 0;
                }
                var ndObj = {
                    category:nc,
                    name:co
                }
                nds.push(ndObj);
            }
        }

        // 设置关系数据
        _relations = getRelationData(e);

        var relationChart = echarts.init(document.getElementById('hmRelCalChart'));
        var option = {
            tooltip : {
                trigger: 'item',
                //transitionDuration:0,
                backgroundColor : 'rgba(39,116,201,0.3)',
                padding: 5,
                borderRadius : 8,
                borderWidth: 2,
                textStyle : {
                    color: '#960400',
                    //decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                formatter: '{a} : {b}'
            },
            series : [
                {
                    type:'force',
                    name : "地理关系",
                    categories : category,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#333'
                                }
                            },
                            nodeStyle : {
                                brushType : 'both',
                                borderColor : 'rgba(255,215,0,0.4)',
                                borderWidth : 1
                            },
                            linkStyle: {
                                type: 'line'
                            }
                        }
                    },
                    useWorker: false,
                    minRadius : 15,
                    maxRadius : 25,
                    gravity: 1.1,
                    scaling: 1.1,
                    //roam: 'move',
                    roam: true,
                    linkSymbol: 'arrow',
                    nodes:nds,
                    links : _relations
                }
            ]
        };
        relationChart.setOption(option);
        var ec = require("echartConfig");
        relationChart.on(ec.EVENT.CLICK, panToFeature);
    }

    function panToFeature(e){
        if (typeof(e.data.category) != "undefined"){
           /* var nIndex = e.data.category;
            if (nIndex < _relMarksShapes.length){
                _map.removeOverLay(_relMarkerGeo);
                var centerPt = _relMarksShapes[nIndex].center;
                _relMarkerGeo = _relMarksShapes[nIndex].shape;
                if (_relMarkerGeo != null)
                    _map.addOverLay(_relMarkerGeo);

                if (centerPt != null)
                    _map.panTo(centerPt);
            }*/

            for (var i=0; i<_relMarksShapes.length; i++){
                if (e.data.name == _relMarksShapes[i].name){
                    _map.removeOverLay(_relMarkerGeo);
                    var centerPt = _relMarksShapes[i].center;
                    _relMarkerGeo = _relMarksShapes[i].shape;
                    if (_relMarkerGeo != null)
                        _map.addOverLay(_relMarkerGeo);

                    if (centerPt != null)
                        _map.panTo(centerPt);

                    if (_relMarkSel != null){
                        var strPic = "images/marker-icon.png";
                        var icon = new TIcon(strPic, new TSize(25,41),{anchor:new TPixel(12,41)});
                        _relMarkSel.setIcon(icon);
                    }

                    var strPic = "images/marker-icon-sel.png";
                    var selicon = new TIcon(strPic, new TSize(25,41),{anchor:new TPixel(12,41)});
                    _featureMarks[i].setIcon(selicon);
                    _relMarkSel = _featureMarks[i];
                    break;
                }
            }
        }
    }

    // 初始化视野范围内搜索面板
    function initViewPanel(){

        /*
        var classContent = '<div id="hm_viewClass"><div class="hm-viewClassContent">' +
            '<ul>' +
            '<li><a data-value="200000">水系</a></li>' +
            '<li class="line"></li><li><a data-value="400000">交通</a></li>' +
            '<li class="line"></li><li><a data-value="700000">地貌</a></li>' +
            '</ul>' +
            '</div>' +
            '<div class="hm-viewClassContent">' +
            '<ul>' +
            '<li><a data-value="500000">管线</a></li>' +
            '<li class="line"></li><li><a data-value="300000">居民地及设施</a></li>' +
            '<li class="line"></li><li><a data-value="800000">植被与土质</a></li>' +
            '</ul>' +
            '</div>' +
            '<div class="hm-viewClassContent">' +
            '<ul>' +
            '<li><a data-value="900000">地名</a></li>' +
            '<li class="line"></li><li><a data-value="600000">境界与政区</a></li>' +
            '<li class="line"></li><li><a data-value="100000">定位基础</a></li>' +
            '</ul>' +
            '</div></div>';
        var searchContent = '<div class="input-group hm-viewSearchContent"><input id="hm_viewSearchText" type="text" class="form-control"><span class="input-group-btn">' +
            '<button id="hm_btnViewSearch" class="btn btn-default" type="button">搜索</button></span></div>';
        var content = '<div class="hm-viewSearch">{0}{1}</div>';
        var popContent = content.format(classContent, searchContent);
        var popTitle = '<span style="font-size: 12px"><b>在地图视野范围搜索百科</b></span><div style="float: right;">' +
            '<a href="javascript:closeViewPanel();" class="dropdown-toggle" data-toggle="dropdown">' +
            '<i class="fa fa-times fa-fw"></i></a></div>';

        $("#btnView").popover({html:true, title:popTitle,  placement:'bottom', animation:true, content:popContent});
        $("#btnView").popover('toggle');
        $("#btnView").popover('hide');

        // pop对话框弹出时绑定里面按钮click事件
        $("#btnView").on('shown.bs.popover', function () {
            $("#hm_viewClass").on("click", "a", {type:"TWikiClassSpa"}, searchFeaturesByClass);
            $("#hm_btnViewSearch").on("click", searchView);
            $("#hm_viewSearchText").keydown( function(e){
                if(e.keyCode == 13){
                    searchView();
                }
            });
        })

        // 隐藏时将绑定事件销毁
        $("#btnView").on('hide.bs.popover', function () {
            $("#hm_viewClass").off("click", "a", function(){});
            $("#hm_btnViewSearch").off("click", function(){});
        })
        */

    }
    // 视野范围内搜索
    function searchView(){
        // 切换到百科搜索类
        var key = $("#hm_viewSearchText").val();
        HMSearch.genPaginate(key);
    }

    // 添加地理百科要素到关系计算数组
    function addRelCalFeature(e){
        if (_featureMarks.length >= 10){
            alert("目前仅支持10个百科要素的关系计算!");
            return;
        }

        var c = HMSearch.getGeometryCenter(e);
        var cObj = c;
        if (e.NAME.trim() == "")
            cObj.name = e.ONTOID;
        else
            cObj.name = e.NAME;

        // 地图上添加标注
        var strPic = "images/marker-icon.png";
        var mkicon = new TIcon(strPic, new TSize(25,41),{anchor:new TPixel(12,41)});
        var marker = new TMarker(c.center, {icon: mkicon});
        _map.addOverLay(marker);
        _featureMarks.push(marker);
        _relMarksShapes.push(cObj);
        _featureIDS.push(e.ONTOID);

        $("#btnRelCal").text("关系计算 (" + _featureIDS.length + ")");
    }

    // 周边关系计算
    function surroundingRelCalc(e){
        window._loaderControl.show();

        var fid = e.ONTOID;
        var name = e.NAME.trim();
        if (name == "")
            name = fid;

        // 计算关系
        $.ajax({
            url: "geoWikiSearch.php?act=getOntoRelationFeature",
            type: 'GET',
            data: {
                fid:fid
            },
            dataType: "json",
            success: function(data) {
                var res = eval("("+data.retResult+")");
                if (res.length > 0){
                    window._loaderControl.hidden();

                    var fts = getSurroundFeatures(res, fid);
                    var wikiPanelObj = document.getElementById("wikicontentpanel");
                    wikiPanelObj.style.display="block";

                    // 周边关系计算提示信息
                    var divWikiContentObj = document.getElementById("hm_wikicontent");
                    divWikiContentObj.style.display="none";
                    var divWikiSimilarObj = document.getElementById("hm_wikisimilar");
                    divWikiSimilarObj.style.display="none";

                    var divTipContent = $("#hm_tipcontent");
                    var divTipContentObj = document.getElementById("hm_tipcontent");
                    divTipContentObj.style.display="block";

                    var strContent = '<div class="panel-heading hm-wikiInfoHead"><font color="yellow"><i>{0}</i></font> 相关要素</div>';
                    strContent += '<div class="panel-body" style="font-size: 12px">';
                    strContent += '<div class="table-responsive" style="background-color: #ffffff;color: #000000">';
                    strContent += '<table class="table table-bordered table-striped">';
                    strContent += '<thead><tr><th style="width: 50%;">名称</th><th style="width: 50%;">关系</th></tr></thead><tbody>';
                    for (var i=0; i<fts.length; i++){
                        strContent += '<tr><td>' + fts[i].name + '</td><td>' + fts[i].rel + '</td></tr>';
                    }
                    strContent += '</tbody></table></div></div>';
                    var divHtml = strContent.format(name);
                    divTipContent.html(divHtml); // 添加Html内容，不能用Text 或 Val
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window._loaderControl.hidden();
            },
            complete: function(XMLHttpRequest, textStatus) {
                window._loaderControl.hidden();
            }
        });
    }

    // 获取与选择要素有关系的其它百科要素
    function getSurroundFeatures(e,f){
        var fts = [];
        for (var i=0; i< e.length; i++){
            var rel = e[i].relaiton;
            var fids = e[i].from.id.split(",");
            var fnames = e[i].from.name.split(",");
            //setRelObj(fids, fnames, f, rel, fts);

            var tids = e[i].to.id.split(",");
            var tnames = e[i].to.name.split(",");
            //setRelObj(tids, tnames, f, rel, fts);

            setRelObj(fids, fnames, tids, tnames, f, rel, fts);

        }
        return fts;
    }

    //
    function setRelObj(fids, fnames, tids, tnames, pid, rel, fts){
        var id = "";
        var nm = "";
        for (var j=0; j<fids.length; j++){
            var fid = fids[j].trim();
            var fnm = fnames[j].trim();
            if (fid != "" && fid != pid){
                id = fid;
                if (fnm == "")
                    fnm = fid;
                nm = fnm;
            }

            for (var k=0; k<tids.length; k++){
                var tid = tids[k].trim();
                var tnm = tnames[k].trim();

                if (tid != "" && tid != pid){
                    id = tid;
                    if (tnm == "")
                        tnm = tid;
                    nm = tnm;
                }

                var cStr = rel.replace("*", fnm);
                cStr = cStr.replace("@", tnm);

                var obj = {
                    ontoid : id,
                    name: nm,
                    rel: cStr
                }

                fts.push(obj);
            }

        }

        /*for (var j=0; j<ids.length; j++){
            var id = ids[j].trim();
            var nm = names[j].trim();
            if (id != "" && id != fid){
                if (nm == "")
                    nm = id;

                var obj = {
                    ontoid : id,
                    name: nm,
                    rel: rel
                }

                fts.push(obj);
            }
        }*/
    }

    // 构造天地图的Polygon对象获取地名空间聚合面
    function getGeoNamePolygon(shape){
        var points = [];
        var ptLength = shape[0].length;
        //var ptLength = shape[0][0].length;
        for (var i=0; i<ptLength-1; i++){
            //var pt = shape[0][0][i];
            var pt = shape[0][i];
            points.push(new TLngLat(pt[0],pt[1]));
        }
        //创建面对象
        var polygon = new TPolygon(points,{strokeColor:"blue", fillColor:"#FFAEC9", strokeWeight:3, strokeOpacity:0.5, fillOpacity:0.5});
        return polygon;
    }

    // 清除地名空间图形
    function removeGeoNameSpace(){
        for(var j=0; j<_geoNameShapes.length; j++){
            if (_geoNameShapes[j] != null)
                _map.removeOverLay(_geoNameShapes[j]);
        }
        _geoNameShapes = [];
    }

    // 获取要素对应的地名空间
    function getGeoNameSpace(e){
        window._loaderControl.show();

        var name = e.NAME.trim();
        if (name == "")
            name = e.ONTOID;

        for(var j=0; j<_geoNameShapes.length; j++){
            if (_geoNameShapes[j] != null)
                _map.removeOverLay(_geoNameShapes[j]);
        }
        _geoNameShapes = [];

        $.ajax({
            url: "geoWikiSearch.php?act=getFeatureGeoNameSpace",
            type: 'GET',
            data: {
                ontoid:e.ONTOID,
                geoname:name
            },
            dataType: "json",
            success: function(data) {
                window._loaderControl.hidden();
                if (data.retResult == ""){
                    alert("当前选中的地理要素无对应的地名空间图形!");
                    return;
                }

                var res = eval("("+data.retResult+")");
                if (res.length > 0){
                    for (var i=0; i<res.length; i++){
                        var geoJson = eval("("+res[i].GeoJson+")");
                        var shape = getGeoNamePolygon(geoJson.rings);
                        _geoNameShapes.push(shape);
                        if (_geoNameShapes[i] != null)
                            _map.addOverLay(_geoNameShapes[i]);
                    }
                }
                else{
                    alert("当前选中的地理要素无对应的地名空间图形!");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window._loaderControl.hidden();
            },
            complete: function(XMLHttpRequest, textStatus) {
                window._loaderControl.hidden();
            }
        });
    }

    // 下载要素对应的OWL文件
    function downLoadOwlFile(e){
        var id = e.ONTOID;
        $.ajax({
            url: HMUtil.G_HMOWLUrl + "/GetGDBInfo.jsp" ,
            type: "POST",
            data: {
                mode:"11",
                featuresID:id
            },
            dataType:"text",
            success:function(data){
                var _data = String($.trim(data));
                var _url = HMUtil.G_HMOWLUrl + "/downloadOnt.jsp?fileName=" + _data+ "&mode=1";
                window.open(_url);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("下载OWL文件出错.");
            },
            complete: function(XMLHttpRequest, textStatus) {

            }
        });
    }

    // 显示视图范围内某类型的地理要素
    function showSpaTypeWiki(e){
        if (e.gb == "") return;

        var level = _map.getZoom();
        if (level > 11){
            var bounds = _map.getBounds();
            HMSearch.spaBoxTypeSearch(bounds, e.gb);
        }
        else
        {
            alert("请在11等级以下进行视野内百科查看!");
        }
    }

    // 机器人计算要素关系
    function robotCalcRelation(e){
        var level = _map.getZoom();
        if (level > 13){
            var bounds = _map.getBounds();
            var wikiObjs = HMSearch.robotSpaBoxSearch(bounds, e);
            for (var n=0; n<_featureMarks.length; n++){
                _map.removeOverLay(_featureMarks[n]);
            }
            _featureMarks = [];
            _relMarksShapes = [];
            _featureIDS = [];
            for (var i=0; i<wikiObjs.length; i++){
                if (wikiObjs[i].OBJ != null){
                    addRelCalFeature(wikiObjs[i].OBJ);
                }
            }
            document.getElementById("btnRelCal").click();
        }
        else
        {
            alert("请在13等级以下进行视野内进行地理要素关系计算!");
        }
    }

    return {
        initmap:initmap,
        initSearch: initSearch,
        setOwnerLayer: setOwnerLayer,
        showRelationDetail: showRelationDetail,
        addRelCalFeature: addRelCalFeature,
        surroundingRelCalc: surroundingRelCalc,
        getGeoNameSpace: getGeoNameSpace,
        removeGeoNameSpace: removeGeoNameSpace,
        downLoadOwlFile: downLoadOwlFile,
        showSpaTypeWiki: showSpaTypeWiki,
        robotCalcRelation: robotCalcRelation,
        getMap: function(){return _map;}
    };
});

