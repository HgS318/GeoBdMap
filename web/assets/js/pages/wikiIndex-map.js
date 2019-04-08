
var map;
var markersGroup = L.layerGroup();
//  所有要素
var all_point_features = [];
var all_line_features = [];
var all_features = [];
//  通过关键词搜索得到的要素，作为分类的全集
var current_point_features = [];
var current_line_features = [];
var current_features = [];
//  通过地名分类、行政区域分类查询到的要素，作为分页的全集
var result_point_features = [];
var result_line_features = [];
var result_features = [];

// var my_service_url = 'http://localhost:6080/arcgis/rest/services/SampleWorldCities/MapServer';
// var my_service_url = "http://10.5.220.20:6080/arcgis/rest/services/my_map_service_01/MapServer";
var my_service_url = "http://localhost:6080/arcgis/rest/services/my_map_service_01/MapServer";
// var my_service_url = "http://10.5.220.242:6080/arcgis/rest/services/MyMapService/MapServer";

var query_point = L.esri.query({
    url: my_service_url
});
var query_line = L.esri.query({
    url: my_service_url
});
query_point.returnGeometry(true);
query_line.returnGeometry(true);

var opening_popup = null;

var layer_Def={};
var d_layer = L.esri.dynamicMapLayer({
    url: my_service_url,
    opacity: 1.0,
    // layerDefs:layer_Def
});

var myIcon = L.icon({
    iconUrl: 'js/leaflet/images/test.png',
    // iconSize: [38, 95],
    //iconAnchor: [22, 94],
    //popupAnchor: [-3, -76],
    //shadowUrl: 'my-icon-shadow.png',
    //shadowSize: [68, 95],
    //shadowAnchor: [22, 94]
});

//  查询（通用）
function do_query(find_point, find_line, query_sentence, update_current) {
    close_popup();
    if(update_current === undefined) {
        update_current = true;
    }
    // find_point.layers('0').fields(field_name).text(text);
    // find_line.layers('1').fields(field_name).text(text);
    find_point.layer('0').where(query_sentence);
    find_line.layer('1').where(query_sentence);
    result_point_features = [];
    result_line_features = [];
    find_point.run(function(error, featureCollection, response){
//            console.log('Found ' + featureCollection.features.length + ' feature(s)');
        if(featureCollection != undefined) {
            var searched_point_features = featureCollection.features;
            // result_point_features = get_common_features(searched_point_features, current_point_features);
            if(update_current) {
                result_point_features = searched_point_features;
                current_point_features = result_point_features;
            } else {
                result_point_features = get_common_features(searched_point_features, current_point_features);
            }
            // var search_query = create_search_query(result_point_features);
            // layer_Def["0"] = search_query;
        }
        find_line.run(function(error1, featureCollection1, response1){
            if(featureCollection1 != undefined) {
                var searched_line_features = featureCollection1.features;
                // var common_line_features = get_common_features(searched_line_features, current_line_features);
                if(update_current) {
                    result_line_features = searched_line_features;
                    current_line_features = result_line_features;
                    current_features = current_point_features.concat(current_line_features);
                } else {
                    result_line_features = get_common_features(searched_line_features, current_line_features);
                }
                result_features = result_line_features.concat(result_point_features);
                // var search_query1 = create_search_query(result_line_features);
                // layer_Def["1"] = search_query1;
                // d_layer.setLayerDefs(layer_Def);
                // d_layer.addTo(map);
                // add_markers(result_features);
                // setResultItems(result_features, "searchresults");
                // fit_features_bound(map, result_features);
                gotoPage(1);
            }
        });
    });
}

function query_adapt(find_point, find_line, field_name, text, precise, update_current) {
    if(precise === undefined || precise == null) {
        precise = true;
    }
    if(update_current ==undefined || update_current == null) {
        update_current = false;
    }
    if(is_all_feature(text)) {
        if(update_current) {
            // // layer_Def = {
            // //     "0": "FID>-1",
            // //     "1": "FID>-1"
            // // };
            // layer_Def = {};
            // d_layer.setLayerDefs(layer_Def);
            // d_layer.addTo(map);
            // // add_markers(current_features);
            // current_features = all_features;
            // current_point_features = all_point_features;
            // current_line_features = all_line_features;
            // fit_features_bound(map, current_features);
            get_all_features();
        } else {
            // layer_Def = {
            //     "0": create_search_query(current_point_features),
            //     "1": create_search_query(current_line_features)
            // };
            // d_layer.setLayerDefs(layer_Def);
            // add_markers(current_features);
            // fit_features_bound(map, current_features);

            result_point_features = current_point_features;
            result_line_features = current_line_features;
            result_features = current_features;
            gotoPage(1);
        }
        return;
    }
    var sql = "";
    if(precise) {
        sql = field_name + "='" + text + "'";
    } else {
        sql = field_name + " LIKE '%" + text + "%'";
    }
    do_query(find_point, find_line, sql, update_current);
}

function search_keyword() {
    var keyword = $("#autocomplete")[0].value;
    if( keyword != undefined && "" != keyword) {
        var sql = "name LIKE '%" + keyword + "%'";
        var selected_item = $("#searchSelected")[0].innerText;
        if("全部地名" == selected_item) {
            // find_adapt(find_word_point, find_word_line, "name", keyword, true);
            query_adapt(query_point, query_line, "name", keyword, false, true);
        } else {
            if("单位" == selected_item) {
                sql += " and bigtype='单位类'";
            } else if("居民点" == selected_item) {
                sql += " and bigtype='居民点类'";
            } else if("自然地物" == selected_item) {
                sql += " and (bigtype='陆地水系类' or bigtype='陆地地形类')";
            }
            do_query(query_point, query_line, sql, true);
        }
        // find_adapt(find_word_point, find_word_line, "name", keyword, true);
        // query_adapt(query_point, query_line, "name", keyword, true);
    }
}

function search_press() {
    var key_val = event.keyCode;
    if(key_val == 13) {
        search_keyword();
    }
}

//	显示某大类的所有地名
function gotoBigType(bigtype) {
    query_adapt(query_point, query_line, "bigtype", bigtype);
}

//	显示某小类的所有地名
function gotoSmallType(bigtype, smalltype) {
    query_adapt(query_point, query_line, "type", smalltype);
}

//	显示某地区的所有地名
function gotoDist(distcode, distname) {
    query_adapt(query_point, query_line, "adminarea", distname);
}


//  根据leaflet的find模块查询到的要素，生成查询语句（多个FID号），该查询语句作为DynamicLayer的layerDefs参数使用
function create_search_query(features) {
    if (features == undefined || features == null || features.length < 1) {
        return "FID<0";
    }
    var q = "";
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var _id = feature["id"];
        q = q + "FID=" + _id;
        if (i != features.length - 1) {
            q = q + " or ";
        }
    }
    return q;
}

function get_common_features(searched_features, current_features) {
    var common_features = [];
    for (var i = 0; i < searched_features.length; i++) {
        var srh_feature = searched_features[i];
        if (srh_feature===undefined) {
            continue;
        }
        var srh_feature_id = srh_feature.id;
        for (var j = 0; j < current_features.length; j++) {
            var cur_feature = current_features[j];
            if (cur_feature===undefined) {
                continue;
            }
            var cur_feature_id = cur_feature.id;
            if (srh_feature_id == cur_feature_id) {
                common_features.push(srh_feature);
            }
        }
    }
    return common_features;
}

function add_markers(searched_result){
    markersGroup.clearLayers();
    // dict_line_popup ={};
    var markers = [];
    for (var i = 0; i < searched_result.length;i++) {
        var feature = searched_result[i];
        // var feature_shape = feature.properties.Shape;
        var feature_shape = feature.geometry.type;
        feature.properties.Shape = feature_shape;
        if(feature_shape =="折线" ||  feature_shape =="LineString") {
            //  添加折线（Polyline）及其信息窗体
            var line_coord_array_org = feature.geometry.coordinates;
            var num_points = line_coord_array_org.length;
            var line_array = [];
            for (var j = 0; j < num_points; j++) {
                var coord_org = line_coord_array_org[j];
                var coord = [];
                coord.push(coord_org[1]);
                coord.push(coord_org[0]);
                line_array.push(coord);
            }
            var polyline = L.polyline(line_array, {
                color: 'green',
                weight: 8,
                opacity: 0.03
            });
            polyline.id = feature.id;
            polyline.shape = feature_shape;
            var mid_coord = line_array[parseInt(num_points / 2)];
            polyline.centroid = L.latLng(mid_coord);
            polyline._feature = feature;
            polyline.on({
                click: function (e) {
                    // var key_line_ids = Object.keys(dict_line_popup);
                    var this_marker = e.sourceTarget;
                    open_popup(this_marker);
                }
            });
            markers.push(polyline);
        } else if(feature_shape =="点" ||  feature_shape =="Point"){
            //  添加点标注（Marker）及其信息窗体
            var x = feature.geometry.coordinates[0];
            var y = feature.geometry.coordinates[1];
            var name_info= feature.properties.name+"  "+feature.properties.brif;
            var marker = L.marker([y, x], {icon: myIcon});
            marker.id = feature.id;
            marker.shape = feature_shape;
            marker.centroid = L.latLng(y, x);
            marker._feature = feature;
            // marker.bindPopup(popup);
            marker.on({
                click: function (e) {
                    var this_marker = e.sourceTarget;
                    open_popup(this_marker);
                }
            });
            markers.push(marker);
        }
    }
    markersGroup = L.layerGroup(markers);
    map.addLayer(markersGroup);

}

function getBound(features) {
    var minx = -180, miny = -180, maxx = -90, maxy = 90;
    var feature_0 = features[0];
    var geo = feature_0.geometry;
    if(geo.type == "Point") {
        minx = geo.coordinates[0];
        maxx = geo.coordinates[0];
        miny = geo.coordinates[1];
        maxy = geo.coordinates[1];
    } else if(geo.type == "LineString") {
        minx = geo.coordinates[0][0];
        maxx = geo.coordinates[0][0];
        miny = geo.coordinates[0][1];
        maxy = geo.coordinates[0][1];
    }
    for(var i = 1; i < features.length; i++) {
        geo = features[i].geometry;
        if(geo.type == "Point") {
            var x = geo.coordinates[0];
            var y = geo.coordinates[1];
            if(x < minx) {
                minx = x;
            }
            if(x > maxx) {
                maxx = x;
            }
            if(y < miny) {
                miny = y;
            }
            if(y > maxy) {
                maxy = y;
            }
        } else if(geo.type == "LineString") {
            for(var j = 0; j < geo.coordinates.length; j++) {
                var x = geo.coordinates[j][0];
                var y = geo.coordinates[j][1];
                if(x < minx) {
                    minx = x;
                }
                if(x > maxx) {
                    maxx = x;
                }
                if(y < miny) {
                    miny = y;
                }
                if(y > maxy) {
                    maxy = y;
                }
            }
        }
    }
    return [[miny, minx], [maxy, maxx]];
}

function fit_features_bound(map, features) {
    if(features === undefined || features.length < 1) {
        return;
    }
    var bound = getBound(features);
    map.fitBounds(bound);
    // d_layer.redraw();
}

function is_all_feature(text) {
    var all_feature_text = ["#all", "所有分类", "秭归县"];
    for (var i = 0; i < all_feature_text.length; i++) {
        var all_text = all_feature_text[i];
        if(text == all_text) {
            return true;
        }
    }
    return false;
}

function get_all_features() {
    var new_searched_features = [];
    current_point_features = [];
    current_line_features = [];
    current_features = [];
    query_point.layer(0).where("FID>-1").run(function(error, featureCollection, response){
        if(featureCollection != undefined) {
            new_searched_features = featureCollection.features;
            current_point_features = current_point_features.concat(new_searched_features);
            query_point.layer(0).where("FID>999").run(function(error, featureCollection, response){
                if(featureCollection != undefined) {
                    new_searched_features = featureCollection.features;
                    current_point_features = current_point_features.concat(new_searched_features);
                    query_point.layer(0).where("FID>1999").run(function(error, featureCollection, response){
                        if(featureCollection != undefined) {
                            new_searched_features = featureCollection.features;
                            current_point_features = current_point_features.concat(new_searched_features);
                            query_point.layer(0).where("FID>2999").run(function(error, featureCollection, response){
                                if(featureCollection != undefined) {
                                    new_searched_features = featureCollection.features;
                                    current_point_features = current_point_features.concat(new_searched_features);
                                    query_point.layer(0).where("FID>3999").run(function(error, featureCollection, response){
                                        if(featureCollection != undefined) {
                                            new_searched_features = featureCollection.features;
                                            current_point_features = current_point_features.concat(new_searched_features);
                                            query_point.layer(0).where("FID>4999").run(function(error, featureCollection, response){
                                                if(featureCollection != undefined) {
                                                    new_searched_features = featureCollection.features;
                                                    current_point_features = current_point_features.concat(new_searched_features);
                                                    query_point.layer(0).where("FID>5999").run(function(error, featureCollection, response){
                                                        if(featureCollection != undefined) {
                                                            new_searched_features = featureCollection.features;
                                                            current_point_features = current_point_features.concat(new_searched_features);
                                                            query_line.layer(1).where("FID>-1").run(function(error, featureCollection, response){
                                                                if(featureCollection != undefined) {
                                                                    new_searched_features = featureCollection.features;
                                                                    current_line_features = current_line_features.concat(new_searched_features);
                                                                    current_features = current_point_features.concat(current_line_features);
                                                                    current_features = current_features.sort(sort_places);
                                                                    all_point_features = current_point_features;
                                                                    all_line_features = current_line_features;
                                                                    all_features = current_features;
                                                                    result_point_features = current_point_features;
                                                                    result_line_features = current_line_features;
                                                                    result_features = current_features;
                                                                    gotoPage(1);

                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}

function sort_places(fea1, fea2) {
    if(fea1.properties["地名代码"] > fea2.properties["地名代码"]) {
        return -1;
    }
    return 1;
    // val = fea1.properties.name - fea2.properties.name;
    // return val;
}

// 初始化地图
function initMap() {

    // 计算地图的高
    document.getElementById("map").style.height = document.documentElement.clientHeight-106+"px";
    var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
            maxZoom: 18,
            minZoom: 2
        }),
        normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
            maxZoom: 18,
            minZoom: 2
        }),
        imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            maxZoom: 18,
            minZoom: 2
        }),
        imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
            maxZoom: 18,
            minZoom: 2
        });

    var normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);

    var baseLayers = {
        "地图": normal,
        "影像": image,
    }

    var overlayLayers = {

    }
    // document.getElementById('map_out_div').innerHTML = "<div id='mymap'></div>";

    map = L.map("map", {
        center: [30.9, 110.7],
        zoom: 10,
        layers: [normal],
        zoomControl: false
    });

    map.addLayer(markersGroup);

    L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);
    // find_adapt(find_type_point, find_type_line, "bigtype", "交通运输设施类");

    // var map = L.map("map").setView([30.901154,110.66997], 11);
    //基础底图
    // L.esri.basemapLayer("TianDiTuSat_A").addTo(map);
    // var baseLayer= L.esri.basemapLayer("TianDiTuSat");
    // var baseLabelLayer = L.esri.basemapLayer("TianDiTuSat_A");
    // map.addLayer(baseLayer);
    // map.addLayer(baseLabelLayer);

    // //加载动态地图
    // // var url = "http://maiserver:6080/arcgis/rest/services/wuhan/MapServer";
    // var url = "http://maiserver:6080/arcgis/rest/services/zg/MapServer";
    // var dynamicLayer = L.esri.dynamicMapLayer({
    //     url: url,
    //     //layers:[0,1,2,3,4],
    //     useCors: false
    // });
    // map.addLayer(dynamicLayer);


    // 网页变化重新计算地图控件的大小
    window.onresize=function(){
        document.getElementById("map").style.height = document.documentElement.clientHeight-106+"px";
    }
}

//	地图前往某一坐标点
function gotoPlace(fid, shape) {
    var _layers = markersGroup.getLayers();
    for(var i = 0; i < _layers.length; i++) {
        var _marker = _layers[i];
        if(_marker.id == fid && _marker.shape == shape) {
            // _marker.openPopup();
            open_popup(_marker);
            var _latlng = _marker.centroid;
            map.setView(_latlng, 13);
            return;
        }
    }
}

//	地区代码是否位于某地区
function distIn(sub, par) {
    var i = 0;
    for(i = 0; i < sub.length; i++) {
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

//	生成信息窗体的内容
function create_popup(feature) {
    var extData = feature.properties;
    var showobj = extData['desbrif'];
    var title = '';
    if (extData.name.length > 16) {
        title = '<span style="font-size:7px">' + extData.name + '</span>';
        // title = '<font size="7">' + extData.name + '</font>';
    } else if (extData.name.length > 12) {
        title = '<span style="font-size:7px">' + extData.name + '</span>'
            + '<span style="font-size:6px;color:#F00;">&nbsp;&nbsp;' + extData['type'] + '</span>';
    } else {
        title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['type'] + '</span>';
    }
    var content = "";
    var pic_info = extData["pic"];
    if(pic_info.indexOf('.jpg') <0 && pic_info.indexOf('.JPG')) {
        pic_info = extData['name'] + "11.jpg"
    }
    var img_src = "data/media/201803/mini/" + pic_info;
    // var img_src = "images/contentdemopic.jpg";

    content = content + ("<img src='" + img_src +
        "' onerror='this.src=\"images/contentdemopic.jpg\"' />"
        + "<strong>地名含义：</strong>" + extData['brif'] + "<br/>");
    content = content + ("<strong>行政区：</strong>" + extData['adminarea'] + "<br/>");
    var usetime = "现今地名";
    if('usetime' in extData && "" != extData['usetime']) {
        usetime = extData['usetime'];
    }
    // content = content + ("<strong>使用时间：</strong>" + usetime + "<br/>");
    content = content + ("<strong>地名类型：</strong>" + extData['type'] + "<br/>");
    if(showobj.indexOf('...') <0) {
        showobj = showobj + "...";
    }
    content = content + ("<strong>地理实体描述：</strong>" + showobj + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "<a href='html/wikiContent_fitall.html?zgid=" + extData['zgid'] + "' target='_blank'>详细信息</a>");
    var info_window = document.createElement("div");
    info_window.className = "info";
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
//        var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = "&nbsp;" + title;
//        closeX.src = "images/close2.gif";
//        closeX.onclick = closeInfoWindow;
    top.appendChild(titleD);
//        top.appendChild(closeX);
    info_window.appendChild(top);
    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info_window.appendChild(middle);
    return info_window;
}

function open_popup(marker) {
    close_popup();
    var feature = marker._feature;
    var info_win = create_popup(feature);
    var popup = L.popup({maxWidth: 300,});
    popup.setContent(info_win);
    popup.setLatLng(marker.centroid);
    popup.openOn(map);
    opening_popup = popup;
}

function close_popup() {
    if(opening_popup != null) {
        opening_popup.remove();
    }
}

// 侧边导航下拉列表
$('.tpl-left-nav-link-list').on('click', function() {
    $(this).siblings('.tpl-left-nav-sub-menu').slideToggle(80)
        .end()
        .find('.tpl-left-nav-more-ico').toggleClass('tpl-left-nav-more-ico-rotate');
});

// 头部导航隐藏菜单
$('.tpl-header-nav-hover-ico').on('click', function() {
    $('.tpl-left-nav').toggle();
    $('.tpl-content-wrapper').toggleClass('tpl-content-wrapper-hover');
});

$(function() {

    $("#searchSelected").click(function(){
        $("#searchTab").show();
        $(this).addClass("searchOpen");
    });

    $("#searchTab li").hover(function(){
        $(this).addClass("selected");
    },function(){
        $(this).removeClass("selected");
    });

    $("#searchTab li").click(function(){
        $("#searchSelected").html($(this).html());
        $("#searchTab").hide();
        $("#searchSelected").removeClass("searchOpen");
    });


    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
        $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });


    $('.tpl-switch').find('.tpl-switch-btn-view').on('click', function() {
        $(this).prev('.tpl-switch-btn').prop("checked", function() {
            if ($(this).is(':checked')) {
                return false;
            } else {
                return true;
            }
        });
        // console.log('123123123')

    });

    initMap();

    // d_layer.setLayerDefs(layer_Def).addTo(map);
    get_all_features();

});
