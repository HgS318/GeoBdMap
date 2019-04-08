/*
 abstract: 本模块主要实现跟搜索相关的功能
 author: cwj
 date: 2014/6/18
 */
require.config({
    paths: {
        "jquery.autocomplete": "jquery.autocomplete",
        "kkpager": "kkpager",
        "hummingUtil": "hummingUtil"
    },
    shim: {

    }
});

define(function(require){
    "use strict";

    require('jquery.autocomplete');
    require('kkpager');
    var HMUtil = require('hummingUtil');

    var srUrl = HMUtil.G_HMSearchUrl,
        srData = null,
        srWikiData = null,
        srMarkers = null,
        srType = "HMatrSearch",
        preSelItem = null,
        srMarkerClusterer = null,
        srSelWikiMK = null,
        srSelMarkGeo = null,
        _map = null;

    var clusterStyle = [
        {
            //图上url
            url:'http://www.rsteq.com/geowikitdmap/images/cluster/cluster0.png',
            size: new TSize(53, 53), //图片大小
            offset: new TPixel(-26, -25), //显示图片的偏移量
            textColor: '#000000', //显示数字的颜色
            textSize: 10 //显示文字的大小
        }, {
            url:'http://www.rsteq.com/geowikitdmap/images/cluster/cluster1.png',
            size: new TSize(56, 56),
            offset: new TPixel(-28, -27),
            textColor: '#000000',
            textSize: 10
        }, {
            url:'http://www.rsteq.com/geowikitdmap/images/cluster/cluster2.png',
            size: new TSize(66, 66),
            soffset: new TPixel(-33, -32),
            textColor: '#000000',
            textSize: 10
        }, {
            url:'http://www.rsteq.com/geowikitdmap/images/cluster/cluster3.png',
            size: new TSize(78, 78),
            offset: new TPixel(-39, -38),
            textColor: '#000000',
            textSize: 10
        }, {
            url:'http://www.rsteq.com/geowikitdmap/images/cluster/cluster4.png',
            size: new TSize(90, 90),
            soffset: new TPixel(-45, -44),
            textColor: '#000000',
            textSize: 10
        }
    ];
		
	// 初始化搜索控件
    function init(map){
        _map = map;
/*
		// 设置地理百科的搜索提示
		$( "#autocomplete" ).autocomplete({
			serviceUrl: srUrl + '/getsuggest',
			dataType:'json',
			minChars: 1,
			deferRequestBy: 400,
			triggerSelectOnValidInput: false,
			noCache:false,
			paramName:'word',
			params:{limit: 10},
			transformResult:function(response){				
				return {
		            suggestions: $.map(response, function(dataItem) {
		                return { value: dataItem, data: dataItem };
		            })
		        };		
			},
			onSelect: function(suggestion) {
                var opt = {word:suggestion.value};
                genPaginate(opt);
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
		*/
		// 响应单击搜索结果
		/*$("#searchresults").on("click", ".list-group-item", locResult);
        // 响应鼠标移过和移开结果列表事件
        $("#searchresults").on("mouseover mouseout", ".list-group-item", dealHighlight);*/
	}

    /*// 销毁对象事件
    function close(){
        *//*$("#autocomplete").off("keydown");
        $("#search").off("click");*//*
        $("#searchresults").off("click", ".list-group-item", "");
        $("#searchresults").off("mouseover mouseout", ".list-group-item", "");
    }*/

    // 绑定搜索结果列表对象事件
    function bindSearchResultEvent(){
        // 响应单击搜索结果
        $("#searchresults").on("click", ".list-group-item", locResult);
        // 响应鼠标移过和移开结果列表事件
        $("#searchresults").on("mouseover mouseout", ".list-group-item", srMarkers, dealHighlight);
    }

    // 销毁对象事件
    function closeSearchResultEvent(){
        /*$("#autocomplete").off("keydown");
         $("#search").off("click");*/
        $("#searchresults").off("click", ".list-group-item", "");
        $("#searchresults").off("mouseover mouseout", ".list-group-item", "");
    }

    // 根据关键字搜索
    /*function searchKey(){
        // 搜索输入关键字
        var key = $("#autocomplete").val();
        if (key == ""){
            alert('搜索条件不能为空');
            return;
        }
        var opt = {word:key};
        genPaginate(opt);
    }*/

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
    function dealHighlight(e){
        var selIndex = $(this).index();
        if (e.data == null) return;

        var mName = String.fromCharCode(65 + selIndex);
        var mk = e.data[selIndex];
        if (mk != null && typeof(mk) != "undefined"){
            /*//创建图片对象
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
            } // end switch*/
            var icon = (srType != "HMSpaSearch")? getSearchMarkIcon(e.type, mName) : getWikiMarkIcon(e.type);
            mk.setIcon(icon);
        }
    }

    // 获取普通搜索icon
    function getSearchMarkIcon(sType, mName){
        //创建图片对象
        var strPic = "images/unselect/" + mName + ".png";
        var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
        switch (sType){
            case "mouseover":
                strPic = "images/select/" + mName + ".png";
                icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                break;
            case "mouseout":
                strPic = "images/unselect/" + mName + ".png";
                icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                break;
        }
        return icon;
    }

    // 获取地理百科icon
    function getWikiMarkIcon(sType){
        //创建图片对象
        var strPic = "images/markwiki-unselect.png";
        var icon = new TIcon(strPic, new TSize(48,40),{anchor:new TPixel(3,40)});
        switch (sType){
            case "mouseover":
                strPic = "images/markwiki-select.png";
                icon = new TIcon(strPic, new TSize(48,40),{anchor:new TPixel(3,40)});
                break;
            case "mouseout":
                strPic ="images/markwiki-unselect.png";
                icon = new TIcon(strPic, new TSize(48,40),{anchor:new TPixel(3,40)});
                break;
        }
        return icon;
    }

    // 单击Marker弹出气泡
    function onClickMarker(e, d){
        /*var t = this.getLngLat().getLng() + "," + this.getLngLat().getLat();
        alert(t);*/
        showInfoWindow(this);
    }

    // 显示气泡提示信息框
    function showInfoWindow(mk){
        var bShow = false;
        var dt = null;

        if (srData != null){
            for(var i=0; i<srMarkers.length; i++){
                if (srMarkers[i] == mk){
                    bShow = true;
                    break;
                }
            }
            dt = srData;
        }

        if (!bShow && srWikiData != null){
            var clusters = srMarkerClusterer.getMarkers();
            for(var i=0; i<clusters.length; i++){
                if (srSelWikiMK != null){
                    var strPic = "images/markwiki-unselect.png";
                    var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                    srSelWikiMK.setIcon(icon);
                }

                if (clusters[i] == mk){
                    bShow = true;
                    var strPic = "images/markwiki-select.png";
                    var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                    mk.setIcon(icon);
                    srSelWikiMK = mk;
                    break;
                }
            }
            dt = srWikiData;
        }

        if (bShow){
            var tip = getWikiTip(dt, i);
            mk.setInfoWinWidth(350);
            mk.setInfoWinHeight(100);
            mk.openInfoWinHtml(tip);
        }
        _map.panTo(mk.getLngLat());
    }

    // 获取实例库对象的提示信息
    function getWikiTip(dtContent, index){
        var tip = "";
        if (dtContent != null && typeof(dtContent.Amount) !='undefined'
            && dtContent.Amount > 0 && index < dtContent.Amount){
            var fields = dtContent.Results[index].fields;
            var code = fields.GB;
            var nm = fields.NAME.trim();
            if (nm == "")
                nm = fields.ONTOID;


            var itemCenter = getGeometryCenter(fields);
            var poiItem = {
                name : nm,
                lonlat: itemCenter.center.getLng() + " " + itemCenter.center.getLat()
            };

            _map.removeOverLay(srSelMarkGeo);
            srSelMarkGeo = itemCenter.shape;
            if (srSelMarkGeo != null)
                _map.addOverLay(srSelMarkGeo);

            var head = "<div class='infoWindow_head'>" +
                "<p style='font-size: 14px'><B>{0}</B>" +
                "<a onclick='javascript:searchGeoWiki(" + code + ")' class=\"wikilink\">百科预览</a>" +
                "<a id='hm_owldownload' title='下载当前地理实体要素相关的owl文件' onclick='javascript:downLoadOwl(" + JSON.stringify(fields) + ")' class=\"wikilink\">OWL</a>" +
                "<a onclick='javascript:removeGeoNameSpace()' class=\"wikilink\">清除地名空间</a>" +
                //"<a id='hm_owldownload' title='下载当前地理实体要素相关的owl文件' href='http://www.rsteq.com:58877/GeoKnowledgeService.asmx/GetOWL?ONTOID=" + fields.ONTOID + "' class=\"wikilink\">OWL</a>" +
                "</p></div>";

            var content = "<div class='infoWindow_content'>" +
                "<p>地理概念代码：{0}</p>" +
                    /*"<p>电话：{1}</p>" +*/
                "</div>";

            var tail = "<div class='infoWindow_tail'><p>" +
                "<a id='hm_walkIndex' style='margin-left:-5px' title='计算与当前要素或POI相关生活指数' onclick='javascript:getWalkIndex(" + JSON.stringify(poiItem) + ")' class=\"wikilink\">" +
                "<i class=\"fa fa-lg fa-bullseye fa-fw\"></i>生活步行指数</a>" +
                "<a id='hm_owldownload' style='margin-left:-5px' title='查找当前地理要素的地名空间范围' onclick='javascript:geoNameSpace(" + JSON.stringify(fields) + ")' class=\"wikilink\">" +
                "<i class=\"fa fa-lg fa-building-o fa-fw\"></i>地名空间</a>" +
                "<a id='hm_relFeatures' style='margin-left:-5px' title='计算与当前地理实体要素有关系的其它地理实体要素' onclick='javascript:surRelCalc(" + JSON.stringify(fields) + ")' class=\"wikilink\">" +
                "<i class=\"fa fa-lg fa-group fa-fw\"></i>周边关系计算</a>" +
                "<a id='hm_addRelCal' style='margin-left:-5px' title='将当前地理实体要素加入到关系计算' onclick='javascript:addRelationCalFeature(" + JSON.stringify(fields) + ")' class=\"wikilink\">" +
                "<i class=\"fa fa-lg fa-code-fork fa-fw\"></i>加入计算</a>" +
                "</p></div>";

            tip = head.format(nm) + content.format(code) + tail;
        }
        return tip;
    }

	// 搜索结果
    function search(sOpt){
        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getWordSearchResult",
                type: 'GET',
                data: sOpt,
                dataType: "json",
                success: function(data) {
                    if (data.wordResult != ""){
                        srData = eval("("+data.wordResult+")");
                        _map.clearOverLays();
                        setResultsItemList(srData);
                    }
                }
            });
        }
	}

    function setResultsItemList(srData){
        srMarkers = new Array();
        closeSearchResultEvent();
        // 显示搜索结果内容
        document.getElementById("hm_mapInfo").style.display="none";
        document.getElementById("searchresults").style.display="block";
        var divshow = $("#resultitems");
        var strResult = '<div class=\"list-group\">';

        if (srData != null && typeof(srData.Amount) !='undefined' && srData.Amount > 0){
            var i = 0;
            $.map( srData.Results, function( item ) {
                var mName = String.fromCharCode(65 + i);
                var fields = srData.Results[i].fields;
                var wItem = "<div class=\"list-group-item\">" +
                    "<div class='SearchResult_item_left'><p><strong>{0}</strong></p></div>" +
                    "<div class='SearchResult_item_content'>" +
                    "<p><font color=\"#0B73EB\">{1}</font><span class='wikiTag'>地理实体</span></p>" +
                    "<p>地理概念代码：{2}</p>" +
                        /*"<p>电话：{3}</p>" +*/
                    "</div>" +
                    "</div>";
                strResult += wItem.format(mName, fields.NAME, fields.GB);

                //创建图片对象
                var strPic = "images/unselect/" + mName + ".png";
                var icon = new TIcon(strPic, new TSize(36,46),{anchor:new TPixel(18,46)});
                // 获取标注位置坐标,向地图上添加自定义标注
                var marker = null;
                var retObj = getGeometryCenter(fields);
                if (retObj.center != null)
                    marker = new TMarker(retObj.center,{icon:icon});
                if (retObj.shape != null)
                    _map.addOverLay(retObj.shape);

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
	
	// 生成分页
    function genPaginate(dtOpt){
		var totalRecords = 0;
		var showNum = 5;
		var pageNo = 1;

        var pageDiv = $("#hm_Paginate");
        pageDiv.html('<div id="kkpager"></div>');

		// 获取搜索总数
		totalRecords = getSearchResultCount(dtOpt);
		var totalPage = Math.ceil(totalRecords/showNum);		
		// 显示第一页的请求
        dtOpt.from = pageNo-1;
        dtOpt.limit = showNum;
        (srType != "HMSpaSearch") ? search(dtOpt) : spaSearch(dtOpt) ;

		// 生成分页显示，有些参数是可选的，比如lang，若不传有默认值
        var cfg = {
            pno 				: pageNo,
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
                dtOpt.word = key;
                dtOpt.from = (n-1)*showNum;
                dtOpt.limit = showNum;
                if (srType != "HMSpaSearch")
                {
                    search(dtOpt);
                }
                else
                {
                    var bounds = _map.getBounds();
                    var sw = bounds.getSouthWest();
                    var ne = bounds.getNorthEast();
                    var ltPt = sw.getLng() + ',' + ne.getLat();
                    var rbPt = ne.getLng() + ',' + sw.getLat();
                    dtOpt.lt = ltPt;
                    dtOpt.rb = rbPt;
                    spaSearch(dtOpt) ;
                }

                cfg.pno = n;
                this.generPageHtml(cfg,true);
            }
        };
		kkpager.generPageHtml(cfg, true);
	}

    // 空间搜索结果
    function spaSearch(sOpt){

        //提交搜索...
        $.ajax({
            url: "geoWikiSearch.php?act=getSpatialBoxSearchResult",
            type: 'GET',
            dataType: "json",
            data: sOpt,
            success: function(data) {
                if (data.wordResult != "") {
                    var geoWikiMakers = new Array();
                    srWikiData = eval("(" + data.wordResult + ")");
                    if (srWikiData != null && typeof(srWikiData.Amount) !='undefined' && srWikiData.Amount > 0){
                        var i = 0;
                        $.map( srWikiData.Results, function( item ) {
                            var fields = srWikiData.Results[i].fields;
                            //创建图片对象
                            var strPic = "images/markwiki-unselect.png";
                            var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                            // 获取标注位置坐标,向地图上添加自定义标注
                            var marker = null;
                            var retObj = getGeometryCenter(fields);
                            if (retObj.center != null)
                                marker = new TMarker(retObj.center,{icon:icon});
                            /*if (retObj.shape != null)
                                _map.addOverLay(retObj.shape);*/

                            if (marker != null) {
                               geoWikiMakers.push(marker);
                               //注册标注的点击事件
                               TEvent.addListener(marker, "click", onClickMarker);
                            }
                            i++;
                        });

                        if (srMarkerClusterer == null){
                            var config = {
                                markers:geoWikiMakers,
                                //styles:clusterStyle,
                                isAverangeCenter: true
                            };
                            srMarkerClusterer = new TMarkerClusterer(_map,config);
                        }
                        else{
                            srMarkerClusterer.clearMarkers();
                            srMarkerClusterer.addMarkers(geoWikiMakers);
                        }
                    }
                }
                window._loaderControl.hidden();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window._loaderControl.hidden();
            },
            complete: function(XMLHttpRequest, textStatus) {
                window._loaderControl.hidden();
            }
        });
    }

	// 地图可视化范围空间搜索
    function spaBoxSearch(bounds){
        //srType = "HMSpaSearch";
        window._loaderControl.show();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var ltPt = sw.getLng() + ',' + ne.getLat();
        var rbPt = ne.getLng() + ',' + sw.getLat();
        var opt = {
            spatype:'withinbox',
            lt:ltPt,
            rb:rbPt
        };
        //genPaginate(opt);
        /*var wikiCount = 0;
        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getSpatialBoxCount",
                type: 'GET',
                async: false,
                data: opt,
                dataType: "json",
                success: function(data) {
                    wikiCount = data.count;
                }
            });
        }*/

        //opt.from = 0;
        //opt.limit = wikiCount;
        spaSearch(opt);

        /*if (wikiCount > 0){
            opt.from = 0;
            opt.limit = wikiCount;
            spaSearch(opt);
        }
        else{
            window._loaderControl.hidden();
        }*/
	}

    // 地图可视范围内某一类型的要素
    function spaBoxTypeSearch(bounds, type){
        window._loaderControl.show();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var ltPt = sw.getLng() + ',' + ne.getLat();
        var rbPt = ne.getLng() + ',' + sw.getLat();
        var opt = {
            gb:type,
            lt:ltPt,
            rb:rbPt
        };

        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getGBAndEnvolopeSelect",
                type: 'GET',
                data: opt,
                dataType: "json",
                success: function(data) {
                    if (data.retResult != "") {
                        var geoWikiMakers = new Array();
                        srWikiData = eval("(" + data.retResult + ")");
                        if (srWikiData != null && typeof(srWikiData.Amount) !='undefined' && srWikiData.Amount > 0){
                            var i = 0;
                            $.map( srWikiData.Results, function( item ) {
                                var fields = srWikiData.Results[i].fields;
                                //创建图片对象
                                var strPic = "images/markwiki-unselect.png";
                                var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                                // 获取标注位置坐标,向地图上添加自定义标注
                                var marker = null;
                                var retObj = getGeometryCenter(fields);
                                if (retObj.center != null)
                                    marker = new TMarker(retObj.center,{icon:icon});
                                /*if (retObj.shape != null)
                                 _map.addOverLay(retObj.shape);*/

                                if (marker != null) {
                                    geoWikiMakers.push(marker);
                                    //注册标注的点击事件
                                    TEvent.addListener(marker, "click", onClickMarker);
                                }
                                i++;
                            });

                            if (srMarkerClusterer == null){
                                var config = {
                                    markers:geoWikiMakers
                                };
                                srMarkerClusterer = new TMarkerClusterer(_map,config);
                            }
                            else{
                                srMarkerClusterer.clearMarkers();
                                srMarkerClusterer.addMarkers(geoWikiMakers);
                            }
                        }
                    }
                    window._loaderControl.hidden();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window._loaderControl.hidden();
                },
                complete: function(XMLHttpRequest, textStatus) {
                    window._loaderControl.hidden();
                }

            });
        }

    }

    // 机器人搜索
    function robotSpaBoxSearch(bounds, para){
        window._loaderControl.show();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var ltPt = sw.getLng() + ',' + ne.getLat();
        var rbPt = ne.getLng() + ',' + sw.getLat();
        var opt = {
            spatype:'withinbox',
            lt:ltPt,
            rb:rbPt
        };

        var wikiObjs = [];
        var centerPt = bounds.getCenter();

        //var GBS = [];
        for (var i=0; i<para.length; i++){
            var gb = getKeyGB(para[i]);
            //GBS.push(gb);
            var obj = {
                GB:gb,
                OBJ:null,
                dis:99999999
            }
            wikiObjs.push(obj);
        }

        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getSpatialBoxSearchResult",
                type: 'GET',
                data: opt,
                async: false,
                dataType: "json",
                success: function(data) {
                    if (data.wordResult != "") {
                        var geoWikiMakers = new Array();
                        srWikiData = eval("(" + data.wordResult + ")");
                        if (srWikiData != null && typeof(srWikiData.Amount) !='undefined' && srWikiData.Amount > 0){
                            var i = 0;
                            $.map( srWikiData.Results, function( item ) {
                                var fields = srWikiData.Results[i].fields;

                                //创建图片对象
                                //var strPic = "images/markwiki-unselect.png";
                                //var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                                // 获取标注位置坐标,向地图上添加自定义标注
                                //var marker = null;
                                var retObj = getGeometryCenter(fields);
                                if (retObj.center != null){
                                    //marker = new TMarker(retObj.center,{icon:icon});

                                    for(var j=0; j<wikiObjs.length; j++){
                                        // 判断是否是相同类型的要素
                                        var fGB = "" + fields.GB;
                                        if (fGB.substr(0, 2) == wikiObjs[j].GB.substr(0, 2)){
                                            var ptDis = retObj.center.distanceFrom(centerPt);
                                            if (ptDis<wikiObjs[j].dis){
                                                wikiObjs[j].OBJ = fields;
                                                wikiObjs[j].dis = ptDis;
                                            }
                                        }
                                    }

                                }

                                /*if (marker != null) {
                                    geoWikiMakers.push(marker);
                                    //注册标注的点击事件
                                    TEvent.addListener(marker, "click", onClickMarker);
                                }*/
                                i++;
                            });

                            var n=0;
                            var fieldsArray = [];
                            for (var k=0; k<wikiObjs.length; k++){
                                if (wikiObjs[k].OBJ != null) {
                                    //创建图片对象
                                    var strPic = "images/markwiki-unselect.png";
                                    var icon = new TIcon(strPic, new TSize(48,32),{anchor:new TPixel(6,32)});
                                    var retObj = getGeometryCenter(wikiObjs[k].OBJ);
                                    var marker = new TMarker(retObj.center, {icon: icon});
                                    if (marker != null) {
                                        geoWikiMakers.push(marker);
                                        //注册标注的点击事件
                                        TEvent.addListener(marker, "click", onClickMarker);
                                    }
                                    n++;
                                    var fObj ={
                                        fields:wikiObjs[k].OBJ
                                    }
                                    fieldsArray.push(fObj);
                                }
                            }

                            srWikiData = {
                                Amount:n,
                                Results:fieldsArray
                            }

                            if (srMarkerClusterer == null){
                                var config = {
                                    markers:geoWikiMakers
                                };
                                srMarkerClusterer = new TMarkerClusterer(_map,config);
                            }
                            else{
                                srMarkerClusterer.clearMarkers();
                                srMarkerClusterer.addMarkers(geoWikiMakers);
                            }
                        }
                    }
                    window._loaderControl.hidden();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window._loaderControl.hidden();
                },
                complete: function(XMLHttpRequest, textStatus) {
                    window._loaderControl.hidden();
                }

            });
        }
        return wikiObjs;
    }

    function getKeyGB(key) {
        var calalog = HMUtil.G_GeoCatalog;
        for (var i = 0; i < calalog.length; i++) {
            var geoObj = calalog[i];
            if (key == geoObj.key) {
                return geoObj.GB;
            }
        }
        return "";
    }

    // 在地理百科中搜对应实例的概念
    function searchWikiConcept(code){
        var wikiPanelObj = document.getElementById("wikicontentpanel");
        wikiPanelObj.style.display="block";
        var wikiUrl = HMUtil.G_WIKISearchUrl;

        var divTipContentObj = document.getElementById("hm_tipcontent");
        divTipContentObj.style.display="none";

        // 获取对应的概念预览信息
        $.ajax({
            url: wikiUrl + "doc-docinfo-" + code,
            type: 'GET',
            success: function (data) {
                var dataJson = eval("("+data+")");

                // 概念描述信息
                var divWikiContent = $("#hm_wikicontent");
                var divWikiContentObj = document.getElementById("hm_wikicontent");
                divWikiContentObj.style.display="block";
                var strContent = '<div class="panel-heading hm-wikiInfoHead">所属概念：{0}' +
                    '<div style="float: right";>' +
                    "<a href=\"javascript:void(0)\" onclick = \"javascript:gotoWikiConcept(" + code + ")\" style=\"color:#CD0000;cursor: pointer;\">详情>></a>" +
                    '</div></div>' +
                    '<div class="panel-body" style="font-size: 12px">{1}</div>';
                var showHtml = strContent.format(dataJson.name, dataJson.doc);
                divWikiContent.html(showHtml); // 添加Html内容，不能用Text 或 Val

/*

                // 相关概念
                var divWikiRelate = $("#hm_wikirelate");
                var strContent = '<div class="panel-heading hm-wikiInfoHead">相关概念</div>' +
                    '<div class="panel-body"><div class="list-group">{0}</div></div>';
                var strResult = "";
                $.map( dataJson.relate, function( item ) {
                    var citem = '<a href="{0}" target="_blank" class="list-group-item">{1}</a>'
                    strResult += citem.format(item.link, item.name);
                });
                var showHtml = strContent.format(strResult);
                divWikiRelate.html(showHtml); // 添加Html内容，不能用Text 或 Val
*/

                // 相似概念
                var divWikiSimilar = $("#hm_wikisimilar");
                var divWikiSimilarObj = document.getElementById("hm_wikisimilar");
                divWikiSimilarObj.style.display="block";
                var strContent = '<div class="panel-heading hm-wikiInfoHead">相似概念</div>' +
                    '<div class="panel-body" style="font-size: 12px"><div class="list-group">{0}</div></div>';
                var strResult = "";
                $.map( dataJson.similar, function( item ) {
                    var citem = '<a href="{0}" target="_blank" class="list-group-item">{1}</a>'
                    strResult += citem.format(item.link, item.name);
                });
                var showHtml = strContent.format(strResult);
                divWikiSimilar.html(showHtml); // 添加Html内容，不能用Text 或 Val
            }
        });
    }

    // 构造天地图的Polygon对象
    function getTPolygon(shape){
        var points = [];
        var ptLength = shape[0].length;
        //var ptLength = shape[0][0].length;
        for (var i=0; i<ptLength-1; i++){
            //var pt = shape[0][0][i];
            var pt = shape[0][i];
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
        for (var i=0; i<ptLength; i++){
            var pt = shape[0][i];
            points.push(new TLngLat(pt[0],pt[1]));
        }
        //创建线对象
        var line = new TPolyline(points,{strokeColor:"green", strokeWeight:3, strokeOpacity:1});
        return line;
    }

    // 获取实例库搜索对象几何中心点和对应的天地图几何对象
    function getGeometryCenter(fields){
        var retVal = {"center":null, "shape":null};
        var ctArray = fields.Anchor.split(",");
        var ct = new TLngLat(ctArray[0], ctArray[1]);
        retVal.center = ct;
        if ("rings" in fields){
            var shape = getTPolygon(fields.rings);
            //var bd = shape.getBounds();
            retVal.shape = shape;
        }
        else if ("paths" in fields){
            var shape = getTPolyline(fields.paths);
            //var ptArray = shape.getLngLats();
            //var index = Math.ceil(ptArray.length/2);
            retVal.shape = shape;
        }
        else if (("x" in fields) && ("y" in fields)){
            var shape = [fields.x, fields.y];
            retVal.center = new TLngLat(shape[0], shape[1]);
        }
        /*switch (geo.type)
        {
            case "esriGeometryPolygon":
                var shape = getTPolygon(geo.coordinates);
                var bd = shape.getBounds();
                retVal.center = bd.getCenter();
                retVal.shape = shape;
                break;
            case "esriGeometryPolyline":
                var shape = getTPolyline(geo.coordinates);
                var ptArray = shape.getLngLats();
                var index = Math.ceil(ptArray.length/2);
                retVal.center = ptArray[index];
                retVal.shape = shape;
                break;
            case "esriGeometryPoint":
                var shape = geo.coordinates;
                retVal.center = new TLngLat(shape[0], shape[1]);
                break;
        }*/
        return retVal;
    }

    // 获取搜索结果用于分页的总数量，当有权限时获取的是实例库和poi库的累加
    function getSearchResultCount(dtOpt){
        var totalRecords = 0;
        // 获取实例库中的搜索总数,只有被认证登陆的用户才能使用实例的内容
        if (window.isSearchWiki){
            $.ajax({
                url: "geoWikiSearch.php?act=getCount",
                type: 'GET',
                async: false,
                data: dtOpt,
                dataType: "json",
                success: function(data) {
                    totalRecords = data.count;
                }
            });
        }
        return totalRecords;
    }

    // 清空搜索的全局变量
    function clearSearchResults(){
        if (srData != null)
            srData = null;
        if (srWikiData != null)
            srWikiData = null;
        if (srMarkers != null)
            srMarkers = null;
        if (srMarkerClusterer != null){
            srMarkerClusterer.clearMarkers();
            srMarkerClusterer = null;
        }

    }

    return{
        init:init,
        close:close,
        genPaginate:genPaginate,
        searchWikiConcept:searchWikiConcept,
        spaBoxSearch:spaBoxSearch,
        spaBoxTypeSearch:spaBoxTypeSearch,
        robotSpaBoxSearch:robotSpaBoxSearch,
        getGeometryCenter:getGeometryCenter,
        getWikiTip:getWikiTip,
        dealHighlight:dealHighlight,
        clearSearchResults:clearSearchResults
    }
}); // end define