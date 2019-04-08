/*
 abstract: 本模块主要实现跟天地图搜索相关的功能
 author: cwj
 date: 2015/6/16
 */
require.config({
    paths: {
        "jquery.autocomplete": "jquery.autocomplete",
        "kkpager": "kkpager",
        "hummingSearch": "hummingSearch",
        "hummingUtil": "hummingUtil",
        "echartConfig": "echarts/config"
    },
    shim: {

    }
});

define(function(require){
    "use strict";

    require('jquery.autocomplete');
    require('kkpager');
    var HMUtil = require('hummingUtil');
    var HMSearch = require('hummingSearch');

    var srUrl = HMUtil.G_TDTSearchUrl,
        srData = null,
        srMarkers = null,
        preSelItem = null,
        _map = null,
        dtContent = null,
        srWalkPoiArray = [],
        srWalkMarker = null;

    // 初始化搜索控件
    function init(map){
        _map = map;

        // 设置调用天地图的搜索提示服务
        $( "#autocomplete" ).autocomplete({
            serviceUrl: srUrl,
            onSearchStart: function(query){
                var postString = getQuery(query.keyword, 4, 0, 10);
                $('#autocomplete').autocomplete().setOptions({
                    ajaxSettings:{
                        data: postString
                    }
                });
            },
            type: "POST",
            minChars: 1,
            deferRequestBy: 400,
            triggerSelectOnValidInput: false,
            noCache:false,
            paramName:'keyword',
            transformResult:function(response){
                var json = eval("("+response+")");
                return {
                    suggestions: $.map(json.suggests, function(item) {
                        return {value: item.name, data: item.name}
                    })
                };
            },
            onSelect: function(suggestion) {
                genPaginate(suggestion.value);
            }
        });

        $( "#autocomplete").keydown( function(e){
            if(e.keyCode == 13){
                searchKey();
            }
        });

        // 响应搜索按钮
        $( "#search" ).click(function(){
            searchKey();
        });
    }

    // 绑定搜索结果列表对象事件
    function bindSearchResultEvent(){
        // 响应单击搜索结果
        $("#searchresults").on("click", ".list-group-item", locResult);
        // 响应鼠标移过和移开结果列表事件
        $("#searchresults").on("mouseover mouseout", ".list-group-item", srMarkers, HMSearch.dealHighlight);m
        // 响应更多链接点击事件
        $("#hmWikiMore").on("click", searchMoreWiki);
    }

    // 销毁对象事件
    function closeSearchResultEvent(){
        /*$("#autocomplete").off("keydown");
        $("#search").off("click");*/
        $("#searchresults").off("click", ".list-group-item", "");
        $("#searchresults").off("mouseover mouseout", ".list-group-item", "");
        $("#hmWikiMore").on("click", "");
    }

    // 获取搜索条件
    function getQuery(w, t, s, n){
        //获取关键字
        var keyword = w;
        //获取搜索类型
        var queryType = t;
        var queryStart = s;
        var queryCount = n;
        var level = _map.getZoom();
        if (level < 11) level = 11;
        //获取当前底图范围
        var bound = _map.getBounds();
        //将范围转换为字符串形式。
        var bLeft = bound.getSouthWest().getLng();
        var bBottom = bound.getSouthWest().getLat();
        var bRight = bound.getNorthEast().getLng();
        var bTop = bound.getNorthEast().getLat();
        var mapBound = bLeft + "," + bBottom + "," + bRight + "," + bTop
        //构造请求的json串。
        var postStr = "{\"keyWord\":\""+keyword+"\",\"level\":\""+level+"\",\"mapBound\":\""+mapBound+"\",\"queryType\":\""+queryType+"\"";
        postStr += ",\"count\":\"" + queryCount + "\",\"start\":\"" + queryStart + "\"}";
        //构造完成json串，拼接为请求内容，ajax请求,请求自己服务端servlet(java版本)，依靠后台转发请求，从而解决ajax跨域问题。
        var postString = "jsonStr="+postStr;
        return postString;
    }

    // 根据关键字搜索
    function searchKey(){
        // 搜索输入关键字
        var key = $("#autocomplete").val();
        if (key == ""){
            alert('搜索条件不能为空');
            return;
        }
        genPaginate(key);
    }

    // 定位选中对象
    function locResult(e){
        var selIndex = $(this).index();
        if (srMarkers == null)  return;
        var mk = srMarkers[selIndex];
        if (mk != null && typeof(mk) != "undefined"){
            _map.panTo(mk.getLngLat());
        }
        activeSelectItem(e);
        showInfoWindow(mk);
    }

    // active选中列表项
    function activeSelectItem(e){
        if (preSelItem != null){
            var reg = new RegExp('(\\s|^)' + "active" + '(\\s|$)');
            preSelItem.className = preSelItem.className.replace(reg, ' ');
        }
        e.currentTarget.className += " active";
        preSelItem = e.currentTarget;
    }

    // 处理列表高亮
    /*function dealHighlight(e){
        var selIndex = $(this).index();
        if (srMarkers == null)  return;

        var mName = String.fromCharCode(65 + selIndex);
        var mk = srMarkers[selIndex];
        if (mk != null && typeof(mk) != "undefined"){
            //创建图片对象
            var strPic = "images/unselect/" + mName + ".png";
            var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
            switch (e.type){
                case "mouseover":
                    strPic = "images/select/" + mName + ".png";
                    icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                    break;
                case "mouseout":
                    strPic = "images/unselect/" + mName + ".png";
                    icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                    break;
            }
            mk.setIcon(icon);
        }
    }*/

    // 单击Marker弹出气泡
    function onClickMarker(e, d){
        /*var t = this.getLngLat().getLng() + "," + this.getLngLat().getLat();
         alert(t);*/
        showInfoWindow(this);
    }

    /*// 获取实例库对象的提示信息
    function getWikiTip(index){
        var tip = "";
        if (dtContent != null && typeof(dtContent.Amount) !='undefined'
            && dtContent.Amount > 0 && index < dtContent.Amount){
            var fields = dtContent.Results[index].fields;
            var code = fields.GB;
            var head = "<div class='infoWindow_head'>" +
                "<p style='font-size: 14px'><B>{0}</B>" +
                "<a onclick='javascript:searchGeoWiki(" + code + ")' class=\"wikilink\">百科预览</a>" +
                "</p></div>";

            var content = "<div class='infoWindow_content'>" +
                "<p>地理概念代码：{0}</p>" +
                *//*"<p>电话：{1}</p>" +*//*
                "</div>";
            tip = head.format(fields.NAME) + content.format(code);
        }
        return tip;
    }*/

    // 获取天地图POI对象的提示信息
    function getPOITip(index){
        var tip = "";
        var item = srData.pois[index];
        var item2Str = JSON.stringify(item);
        // 根据POI信息获取对应的地理概念代码
        var code = getPOIGeoConcept(item);
        var head = "<div class='infoWindow_head'>" +
            "<p style='font-size: 14px'><B>{0}</B>" +
            "<a onclick='javascript:searchGeoWiki(" + code + ")' class=\"wikilink\">百科预览</a>" +
            "</p></div>";

        var content = "<div class='infoWindow_content'>" +
            "<p>地址：{0}</p>" +
            "<p>电话：{1}</p>" +
            "</div>";

        var tail = "<div class='infoWindow_tail'>" +
            "<p id='hm_walkIndex'>" +
            "<a onclick='javascript:getWalkIndex(" + item2Str + ")' class=\"wikilink\">" +
            "<i class=\"fa fa-lg fa-bullseye fa-fw\"></i>生活步行指数</a>" +
            "</p></div>";

        var tip = head.format(item.name) + content.format(item.address, item.phone) + tail;
        return tip;
    }

    // 通过poi信息获取对应地理概念代码
    function getPOIGeoConcept(poi){
        var code = "";
        var location = poi.lonlat;
        var loc = location.replace(/(\w+)\s* \s*(\w+)/, "$1_$2");
        $.ajax({
            url: "geoWikiSearch.php?act=getOntoFeature",
            timeout: 10000,
            type: 'GET',
            async: false,
            data:{
                name: poi.name,
                address:poi.address,
                lnglat:loc
            },
            dataType: "json",
            success: function(data) {
                if (data.retResult != ""){
                    var ftdata = eval("("+data.retResult+")");
                    var features = ftdata.ontoFeatures;
                    if (features.length > 0)
                        code = features[0].GB;
                }
            }
        });
        return code;
    }

    // 显示气泡提示信息框
    function showInfoWindow(mk){
        if (srData != null){
            var bShow = false;
            for(var i=0; i<srMarkers.length; i++){
                if (srMarkers[i] == mk){
                    bShow = true;
                    break;
                }
            }

            if (bShow){
                var tip = HMSearch.getWikiTip(dtContent, i);
                if (tip == "")
                    tip =  getPOITip(i);

                mk.setInfoWinWidth(350);
                mk.setInfoWinHeight(100);
                mk.openInfoWinHtml(tip);
            }
        }
        _map.panTo(mk.getLngLat());
    }

    // 当有权限时，搜索结果将实例库和POI库中的数据进行融合。
    function search(key, type, fromid, shownum){
        // fromid = 0时意味着此时是第一页的请求，当登陆系统有权限且时需特殊处理一下。
        // 获取实例库中搜索的匹配结果,只有被认证登陆的用户才能使用实例的内容
        dtContent = null;
        if (window.isSearchWiki && fromid == 0){
            $.ajax({
                url: "geoWikiSearch.php?act=getWordSearchResult",
                type: 'GET',
                async: false,
                data: {
                    word:key,
                    from:0,
                    limit:1,
                    class:""
                },
                dataType: "json",
                success: function(data) {
                    if (data.wordResult != ""){
                        dtContent = eval("("+data.wordResult+")");
                    }
                }
            });
        }

        //提交搜索...
        var postString = getQuery(key, type, fromid, shownum);
        $.ajax({
            url: srUrl,
            type: 'POST',
            data: postString,
            success: function(data) {
                srData = eval("("+data+")");
                _map.clearOverLays();
                setResultsItemList(srData, dtContent, fromid);
            }
        });
    }


    function setResultsItemList(srData, dtContent, fromid){
        srMarkers = new Array();
        closeSearchResultEvent();
        // 显示搜索结果内容
        document.getElementById("hm_mapInfo").style.display="none";
        document.getElementById("searchresults").style.display="block";
        var divshow = $("#resultitems");
        var strResult = '<div class=\"list-group\">';
        var i = 0;
        if (typeof(srData.pois) == 'undefined') {
            // 天地没有数据,百科库有数据的情况
            var mName = String.fromCharCode(65 + i);
            var bWikiTag = false;
            if (dtContent != null && typeof(dtContent.Amount) !='undefined'
                && dtContent.Amount > 0 && fromid == 0 && i == 0){
                var fields = dtContent.Results[0].fields;
                var wItem = "<div class=\"list-group-item\">" +
                    "<div class='SearchResult_item_left'><p><strong>{0}</strong></p></div>" +
                    "<div class='SearchResult_item_content'>" +
                    "<p><font color=\"#0B73EB\">{1}</font><span class='wikiTag'>地理实体</span></p>" +
                    "<p>地理概念代码：{2}</p>" +
                        /*"<p>电话：{3}</p>" +*/
                    "</div>" +
                    "</div>";
                strResult += wItem.format(mName, fields.NAME, fields.GB);
                bWikiTag = true;
            }

            //创建图片对象
            var strPic = "images/unselect/" + mName + ".png";
            var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
            //向地图上添加自定义标注
            var marker = null;
            if (bWikiTag){
                // 获取标注位置坐标
                var fields = dtContent.Results[0].fields;
                /*var tLngLatObj = getGeometryCenter(fields.geometry);*/
                var retObj = HMSearch.getGeometryCenter(fields);
                if (retObj.center != null)
                    marker = new TMarker(retObj.center,{icon:icon});
                if (retObj.shape != null)
                    _map.addOverLay(retObj.shape);
            }

            if (marker != null){
                _map.addOverLay(marker);
                //注册标注的点击事件
                TEvent.addListener(marker, "click", onClickMarker);
                srMarkers[i] = marker;
            }
        }
        else{
            // 天地图和百科库都有数据的情况
            $.map( srData.pois, function( item ) {
                var mName = String.fromCharCode(65 + i);
                var bWikiTag = false;
                if (dtContent != null && typeof(dtContent.Amount) !='undefined'
                    && dtContent.Amount > 0 && fromid == 0 && i == 0){
                    var fields = dtContent.Results[0].fields;
                    var wItem = "<div class=\"list-group-item\">" +
                        "<div class='SearchResult_item_left'><p><strong>{0}</strong></p></div>" +
                        "<div class='SearchResult_item_content'>" +
                        "<p><font color=\"#0B73EB\">{1}</font><span class='wikiTag'>地理实体</span></p>" +
                        "<p>地理概念代码：{2}</p>" +
                        //"<p class='wikiMore'><a id='hmWikiMore' title='搜索更多地理实体要素'>更多>>></a></p>" +
                        "</div>" +
                        "</div>";
                    strResult += wItem.format(mName, fields.NAME, fields.GB);
                    bWikiTag = true;
                }
                else{
                    var citem = "<div class=\"list-group-item\">" +
                        "<div class='SearchResult_item_left'><p><strong>{0}</strong></p></div>" +
                        "<div class='SearchResult_item_content'>" +
                        "<p><font color=\"#0B73EB\">{1}</font></p>" +
                        "<p>地址：{2}</p>" +
                        "<p>电话：{3}</p>" +
                        "</div>" +
                        "</div>";
                    strResult += citem.format(mName, item.name, item.address, item.phone);
                }

                //创建图片对象
                var strPic = "images/unselect/" + mName + ".png";
                var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                //向地图上添加自定义标注
                var marker = null;
                if (bWikiTag){
                    // 获取标注位置坐标
                    var fields = dtContent.Results[0].fields;
                    /*var tLngLatObj = getGeometryCenter(fields.geometry);*/
                    var retObj = HMSearch.getGeometryCenter(fields);
                    if (retObj.center != null)
                        marker = new TMarker(retObj.center,{icon:icon});
                    if (retObj.shape != null)
                        _map.addOverLay(retObj.shape);
                }
                else{
                    var lonlatArr = item.lonlat.split(' ');
                    var tLngLatObj = new TLngLat(lonlatArr[0], lonlatArr[1]);
                    marker = new TMarker(tLngLatObj,{icon:icon});
                }

                if (marker != null){
                    _map.addOverLay(marker);
                    //注册标注的点击事件
                    TEvent.addListener(marker, "click", onClickMarker);
                    srMarkers[i] = marker;
                }
                i++;
            });
        }

        strResult += '</div>';
        divshow.html(strResult); // 添加Html内容，不能用Text 或 Val

        var mk = srMarkers[0];
        if (mk != null && typeof(mk) != "undefined"){
            showInfoWindow(mk);
            _map.panTo(mk.getLngLat());
        }
        bindSearchResultEvent();
    }

    function searchMoreWiki(){
        alert("test");
    }


/*    // 构造天地图的Polygon对象
    function getTPolygon(shape){
        var points = [];
        var ptLength = shape[0][0].length;
        for (var i=0; i<ptLength-1; i++){
            var pt = shape[0][0][i];
            points.push(new TLngLat(pt[0],pt[1]));
        }
        //创建面对象
        var polygon = new TPolygon(points,{strokeColor:"blue", fillColor:"#B9E2FF", strokeWeight:3, strokeOpacity:0.5, fillOpacity:0.5});
        return polygon;
    }

    // 构造天地图的Polygon对象
    function getTPolyline(shape){
        var points = [];
        var ptLength = shape[0].length;
        for (var i=0; i<ptLength-1; i++){
            var pt = shape[0][i];
            points.push(new TLngLat(pt[0],pt[1]));
        }
        //创建线对象
        var line = new TPolyline(points,{strokeColor:"green", strokeWeight:3, strokeOpacity:1});
        return line;
    }

    // 获取实例库搜索对象几何中心点和对应的天地图几何对象
    function getGeometryCenter(geo){
        var tLngLatObj = null;
        switch (geo.type)
        {
            case "esriGeometryPolygon":
                var shape = getTPolygon(geo.coordinates);
                var bd = shape.getBounds();
                tLngLatObj = bd.getCenter();
                _map.addOverLay(shape);
                break;
            case "esriGeometryPolyline":
                var shape = getTPolyline(geo.coordinates);
                var ptArray = shape.getLngLats();
                var index = ptArray.length/2;
                tLngLatObj = ptArray[index];
                _map.addOverLay(shape);
                break;
            case "esriGeometryPoint":
                var shape = geo.coordinates;
                tLngLatObj = new TLngLat(shape[0], shape[1]);
                break;
        }
        return tLngLatObj;
    }*/

    // 获取搜索结果用于分页的总数量，当有权限时获取的是实例库和poi库的累加
    function getSearchResultCount(postString, key){
        var totalRecords = 0;
        // 获取天地图的POI搜索总数及耗时
        $.ajax({
            url: srUrl,
            type: 'POST',
            async: false,
            data: postString,
            success: function(result) {
                var json = eval("("+result+")");
                if (typeof(json.pois) != 'undefined')
                    totalRecords = parseInt(json.count);
            }
        });

        // 获取实例库中的搜索总数,只有被认证登陆的用户才能使用实例的内容
        var ftCount = 0;
        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getCount",
                type: 'GET',
                async: false,
                data: {
                    word:key,
                    class:""
                },
                dataType: "json",
                success: function(data) {
                    if (data.count > 0){
                        ftCount = 1;
                    }
                }
            });
        }

        totalRecords += ftCount;
        return totalRecords;
    }

    // 生成分页
    function genPaginate(key){
        var showNum = 5;
        var pageNo = 1;
        var sType = 7       // 只搜POI

        var pageDiv = $("#hm_Paginate");
        pageDiv.html('<div id="kkpager"></div>');

        var postString = getQuery(key, sType, 0, showNum);
        var totalRecords = getSearchResultCount(postString, key);
        var totalPage = Math.ceil(totalRecords/showNum);
        // 显示第一页的请求
        search(key, sType, pageNo-1, showNum);
        // 生成分页显示，有些参数是可选的，比如lang，若不传有默认值
        var cfg = {
            pno 				: pageNo,		//页码
            total 				: totalPage,
            totalRecords 		: totalRecords,	//总数据条数
            isShowFirstPageBtn	: false, 		//是否显示首页按钮
            isShowLastPageBtn	: false, 		//是否显示尾页按钮
            isGoPage 			: false,		//是否显示页码跳转输入框
            mode 				: 'click',		//默认值是link，可选link或者click
            lang : {
                prePageText				: '<<',
                nextPageText			: '>>',
                totalPageBeforeText	: '<br/>&nbsp;&nbsp;共',
                totalRecordsAfterText : '条数据'
            },
            click : function(n){
                var key = $("#autocomplete").val();
                search(key, sType, (n-1)*showNum, showNum);

                cfg.pno = n;
                this.generPageHtml(cfg,true);
            }
        };
        kkpager.generPageHtml(cfg, true);
    }

    // 获取POI的步行指数
    function gePOIWalkIndex(e){
        /*var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
        var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
        //I'm not going to redefine those two in latter examples.
        var retVal = proj4(firstProjection,secondProjection,[2,5]);
        // [-2690666.2977344505, 3662659.885459918]*/

        var strLngLat = e.lonlat.replace(" ", ",");
        var keyWordsArray = ["医院", "学校", "地铁站", "公交站", "超市", "餐饮"];
        srWalkPoiArray = [];
        for(var i=0; i<keyWordsArray.length; i++)
        {
            var poi = getNearestPOI(keyWordsArray[i], strLngLat);
            srWalkPoiArray.push(poi);
        }

        var weight_hospital = (srWalkPoiArray[0] != null) ? weightCalculation(srWalkPoiArray[0].distance) : 0;
        var weight_school = (srWalkPoiArray[1] != null) ? weightCalculation(srWalkPoiArray[1].distance) : 0;
        var weight_subway_station = (srWalkPoiArray[2] != null) ? weightCalculation(srWalkPoiArray[2].distance) : 0;
        var weight_bus_station = (srWalkPoiArray[3] != null) ? weightCalculation(srWalkPoiArray[3].distance) : 0;
        var weight_supermarket = (srWalkPoiArray[4] != null) ? weightCalculation(srWalkPoiArray[4].distance) : 0;
        var weight_restaurant = (srWalkPoiArray[5] != null) ? weightCalculation(srWalkPoiArray[5].distance) : 0;
        var walk_Score = (13 * weight_hospital) + (15 * weight_school) + (10 * weight_subway_station) + (15 * weight_bus_station) + (34 * weight_supermarket) + (13 * weight_restaurant);

        var popTitle = '<span style="font-size: 12px"><b>{0}生活步行指数 ({1})</b></span><div style="float: right;">' +
            '<a href="javascript:closeWalkIndexPanel();" class="dropdown-toggle" data-toggle="dropdown">' +
            '<i class="fa fa-times fa-fw"></i></a></div>';
        popTitle = popTitle.format(e.name, Math.round(walk_Score));

        var chartContent = '<div id="hm_walkChart" style="width: 230px; height: 260px"></div>'

        $("#hm_walkIndex").popover('destroy');
        $("#hm_walkIndex").popover({html:true, title:popTitle,  placement:'left', animation:true, content:chartContent});
        $("#hm_walkIndex").popover('show');

        $("#hm_walkIndex").on('hide.bs.popover', function () {
            if (srWalkMarker != null)
                _map.removeOverLay(srWalkMarker);
        })

        setWalkRadarChart(e, srWalkPoiArray);
    }

    // 设置步行指数雷达图
    function setWalkRadarChart(loc, data){
        var maxVal = 2000;
        var indicatorData = [
            { text: '医院', max: maxVal },
            { text: '学校', max: maxVal },
            { text: '地铁站', max: maxVal },
            { text: '公交站', max: maxVal },
            { text: '超市', max: maxVal },
            { text: '餐饮', max: maxVal }
        ];
        var hospitalDis = (data[0] != null) ? data[0].distance : maxVal;
        var schoolDis = (data[1] != null) ? data[1].distance : maxVal;
        var subwayDis = (data[2] != null) ? data[2].distance : maxVal;
        var busDis = (data[3] != null) ? data[3].distance : maxVal;
        var supermarketDis = (data[4] != null) ? data[4].distance : maxVal;
        var restaurantDis = (data[5] != null) ? data[5].distance : maxVal;
        var walkChart = echarts.init(document.getElementById('hm_walkChart'));
        var option = {
            title: {
                text: '2公里范围内步行指数雷达图',
                textStyle:{
                    fontSize: 14,
                    align: 'center'
                }
            },
            tooltip: {
                trigger: 'axis',
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
                formatter: function(params,ticket,callback){
                    var res = "";
                    if (params[0].value >= maxVal){
                        res = params[0].name + "<br/>2公里范围内无最近" + params[0].indicator
                    }
                    else{
                        res = params[0].name + "距最近<br/>" + params[0].indicator + ' : ' + params[0].value;
                    }
                    return res;
                }
            },
            calculable: true,
            polar: [
                {
                    indicator: indicatorData,
                    radius: 80
                }
            ],
            series: [
                {
                    name: '步行距离数据',
                    type: 'radar',
                    data: [
                        {
                            value: [
                                hospitalDis,
                                schoolDis,
                                subwayDis,
                                busDis,
                                supermarketDis,
                                restaurantDis
                            ],
                            name: loc.name
                        }
                    ]
                }
            ]
        };
        walkChart.setOption(option);
        var ec = require("echartConfig");
        walkChart.on(ec.EVENT.CLICK, panToPoi);
    }

    function panToPoi(e){
        //向地图上添加自定义标注
        if (srWalkPoiArray[e.special] != null){
            //创建图片对象
            var poi = srWalkPoiArray[e.special];
            var strPic = "images/walkMarker.png";
            var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
            var lonlatArr = poi.lonlat.split(' ');
            var tLngLatObj = new TLngLat(lonlatArr[0], lonlatArr[1]);

            if (srWalkMarker != null)
                _map.removeOverLay(srWalkMarker);

            srWalkMarker = new TMarker(tLngLatObj,{icon:icon});
            _map.addOverLay(srWalkMarker);
            _map.panTo(tLngLatObj);
        }
    }

    // 获取周边搜索最近的POI
    function getNearestPOI(key, loc){
        var nearestPoi = null;
        var postString = getQuery(key, 3, 0, 1000);
        var index = postString.lastIndexOf("}");
        var postData = postString.substring(0, index) + ",\"pointLonlat\":\"" + loc + "\",\"queryRadius\":\"2000\"}";
        $.ajax({
            url: srUrl,
            async: false,
            timeout: 1000,
            type: 'POST',
            data: postData,
            success: function(result) {
                var retJson = eval("("+result+")");
                if (retJson.count > 0){
                    var i= 0,
                        minDis = 0;
                    $.map( retJson.pois, function( item ) {
                        if (i == 0){
                            if (key == "地铁站" || key == "公交站"){
                                if (typeof(item.poiType) != "undefined" && item.poiType == 102){
                                    nearestPoi = item;
                                    minDis = item.distance;
                                }
                            }
                            else{
                                nearestPoi = item;
                                minDis = item.distance;
                            }
                        }
                        else if (item.distance < minDis){
                            if (key == "地铁站" || key == "公交站"){
                                if (typeof(item.poiType) != "undefined" && item.poiType == 102){
                                    nearestPoi = item;
                                    minDis = item.distance;
                                }
                            }
                            else{
                                nearestPoi = item;
                                minDis = item.distance;
                            }
                        }
                        i++;
                    }); // end map
                }// end if
            }
        });
        return nearestPoi;
    }

    // 计算距离权重-理工大的算法
    function weightCalculation(distance) {
        var weight = 0 ;
        if (distance <= 400)
            weight = 1;
        if (distance > 400 && distance <= 1600)
            weight = (1900 - distance) / 1500;
        if (distance > 1600 && distance <= 2400)
            weight = (2400 - distance) / 4000;
        if (distance > 2400)
            weight = 0;
        return weight;
    }

    return{
        init:init,
        gePOIWalkIndex:gePOIWalkIndex
    }
}); // end define