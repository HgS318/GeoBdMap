
var posadd = {

    geoCoder: new BMap.Geocoder(),
    addr_overlays :[],
    coord_overlays: [],
    post_overlays:[],
    phone_overlays:[],
    ip_overlays:[],
    city_polygons: {},
    addrs: [],
    pointCollection: null,
    mapvpDataset: null

};
var mapvpLayer = null;

function showMassPoints(load) {
    showPointCollection(load);
    showMapvpLayer(load);
}

function showPointCollection(load) {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.show();
        return;
    }
    if(load === undefined || !load) {
        return;
    }

    // map.centerAndZoom(new BMap.Point(105.000, 38.000), 5);
    map.centerAndZoom(new BMap.Point(105.000, 38.000), 5);  //  全国
    map.centerAndZoom(new BMap.Point(114.26150872132702,30.544557867767217), 10);   //  武汉

    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        var points = [];  // 添加海量点数据
        for (var i = 0; i < china_pois.length; i++) {
            var poi = china_pois[i];
            var bp = new BMap.Point(poi['wgsx'], poi['wgxy']);  //  武汉
            // var bp = new BMap.Point(poi[0], poi[1]);    //  全国示例
            bp.extData = poi;
            bp.spaType = 1;
            points.push(bp);
        }
        var options = {
            size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_STAR,
            color: '#d340c3'
        };
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        posadd.pointCollection = pointCollection;
        pointCollection.addEventListener('click', function (e) {
            // var info = JSON.stringify(e.point.extData);
            // alert(info);
            var extData = e.point.extData;
            var width = 230;
            var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['type2'] + '</span>';
            var content = "类型：" + extData.type2 + "<br/>" +"地址：" + extData.addr + "<br/>" +
                "经度：" + extData['wgsx'] + "<br/>" + "纬度：" + extData['wgxy'];
            openInfoWin({'x':extData['wgsx'], 'y': extData['wgxy'], 'target': {'spaType': -1}}, content, title, width);
        });
        map.addOverlay(pointCollection);  // 添加Overlay
        $("#boundintotal")[0].innerHTML = "海量点：" + china_pois.length + "条记录";
        $("#distintotal")[0].innerHTML = "接入信息：" + china_pois.length + "条记录";

        var checkBox = document.getElementById('toolbarBounds');
        if(checkBox.checked != true) {
            checkBox.checked = true;
        }
        $("#pointCollControl")[0].style.display = "block";
    } else {
        alert('请在chrome、safari、IE8+以上浏览器查看海量点效果');
    }
}

function showMapvpLayer(load) {

    if(mapvpLayer != null) {
        mapvpLayer.show();
        return;
    }
    if(load === undefined || !load) {
        return;
    }
    var dataset_path = "download/mapv/examples/data/Beijing_37w.csv";
//        var dataset_path = "data/ShanghaiPOI_coords.csv";
//        $.get('data/nyc-taxi.csv', function(csvstr) {
    $.get(dataset_path, function(csvstr) {

        map.centerAndZoom(new BMap.Point(116.402544,39.919583), 11);
        var options = {
            size: 1.5,
            context: 'webgl',
            fillStyle: 'rgba(250, 50, 50, 0.6)',
            draw: 'simple'
        };
        var dataSet = mapv.csv.getDataSet(csvstr);
        dataSet.initGeometry();
        mapvpLayer = new mapv.baiduMapLayer(map, dataSet, options);

        $("#boundintotal")[0].innerHTML = "海量点：" + dataSet._data.length + "条记录";
        $("#distintotal")[0].innerHTML = "接入信息：" + dataSet._data.length + "条记录";
        var checkBox = document.getElementById('toolbarBounds');
        if(checkBox.checked != true) {
            checkBox.checked = true;
        }
        $("#mapvLayerControl")[0].style.display = "block";
    });
}

function showPosAdds() {
    show_address();
    show_coords();
    show_postcode();
    show_phone_number();
    show_ip();
    showRelposOverlays();
}

function hidePosAdds() {
    clear_address();
    clear_coords();
    clear_postcode();
    clear_phone_number();
    clear_ip();
    hideRelposOverlays();
}

function hidePointCollection() {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.hide();
    }
}

function hideMapv() {
    if(mapvpLayer != null) {
        mapvpLayer.hide();
    }
}


function hideMassPoints() {
    hidePointCollection();
    hideMapv();
}

function geocodeSearch(addr, index){
    if(index < posadd.addrs.length){
        setTimeout(window.bdGEO, 400);
    }
    posadd.geoCoder.getPoint(addr, function(point){
        if (point) {
            var bp = new BMap.Point(point.lng, point.lat);
            var marker = new BMap.Marker(bp);
            marker.spaType = 1;
            addOverlayAndWin(marker, {
                "name": "地名/地址",
                "text": addr,
                "winwidth": 200
            }, null, posadd.addr_overlays);
            map.centerAndZoom(bp, 16);
        }
        else{
            document.getElementById("result").innerHTML +=  index + " " + addr + ":  " + "无法精确定位" + "</br>";
            alert("暂无法定位" + addr + "，请检查输入");
        }
    });
}

function extract_address() {
    var addrStr = $("#addrtext")[0].value;
    var addrs = addrStr.split('\n');
    for(var i = 0; i < addrs.length; i++) {
        var address = addrs[i];
        geocodeSearch(address, i);
    }
}

function extract_coords() {
    var coordStr = $("#coordtext")[0].value;
    if(coordStr.indexOf(",") < 0) {
        if(coordStr.indexOf('bei') > -1) {
            setTimeout(showMapvpLayer(true), 800);
        } else if(coordStr.indexOf('uhan') > -1) {
            setTimeout(showPointCollection(true), 800);
        } else {
            setTimeout(showMassPoints(true), 800);
        }
        return;
    }
    var xyStr = coordStr.split(',');
    if(xyStr.length != 2) {
        alert("暂无法定位，请检查输入");
        return;
    }
    try {
        var x = parseFloat(xyStr[0]);
        var y = parseFloat(xyStr[1]);
        var text = $('#coordSys option:selected').text();//选中的文本
        var bp = new BMap.Point(x, y);
        var marker = new BMap.Marker(bp);
        marker.spaType = 1;
        addOverlayAndWin(marker, {
            "name": "坐标",
            "texts": [coordStr, "坐标系统: " + text],
            "winwidth": 150
        }, null, posadd.coord_overlays);
        map.centerAndZoom(bp, 16);
    } catch (e) {
        alert("暂无法定位，请检查输入");
    }

}

function extract_postcode() {
    var postcode = $("#posttext")[0].value;
    showPostcode(postcode);
}

function extract_phone_number() {
    var phoneNumber = $("#phonetext")[0].value;
    var areaCode = getAreaNumFromPhnoeNum(phoneNumber);
    showAreacode(areaCode, phoneNumber);
}

function getAreaNumFromPhnoeNum(phoneNum) {
    var areaCode = null;
    var splashId = phoneNum.indexOf('-');
    if(splashId > 0) {
        areaCode = phoneNum.substring(0, splashId);
        return areaCode;
    }
    var spaceId = phoneNum.indexOf(' ');
    if(spaceId > 0) {
        areaCode = phoneNum.substring(0, spaceId);
        return areaCode;
    }
    var bracket1 = phoneNum.indexOf('(');
    if(bracket1 < 0) {
        bracket1 = phoneNum.indexOf('（');
    }
    var bracket2 = phoneNum.indexOf(')');
    if(bracket2 < 0) {
        bracket2 = phoneNum.indexOf('）');
    }
    if(bracket1 > -1 && bracket2 > -1) {
        areaCode = phoneNum.substring(bracket1 + 1, bracket2);
        return areaCode;
    }
    var areaCodes3 = ["010", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029"];
    for(var i = 0; i < areaCodes3.length; i++) {
        var areaCode3 = areaCodes3[i];
        if(phoneNum.indexOf(areaCode3) == 0) {
            return areaCode3;
        }
    }
    areaCode = phoneNum.substring(0, 4);
    return areaCode;
}

function extract_ip() {
    var ip = $("#iptext")[0].value;
    showIpArea(ip);
}

function clear_address() {
    for(var i = 0; i < posadd.addr_overlays; i++) {
        posadd.addr_overlays[i].hide();
    }
}

function clear_coords() {
    for(var i = 0; i < posadd.coord_overlays; i++) {
        posadd.coord_overlays[i].hide();
    }
}

function clear_postcode() {
    for(var i = 0; i < posadd.post_overlays; i++) {
        posadd.post_overlays[i].hide();
    }
}

function clear_phone_number() {
    for(var i = 0; i < posadd.phone_overlays; i++) {
        posadd.phone_overlays[i].hide();
    }
}

function clear_ip() {
    for(var i = 0; i < posadd.ip_overlays; i++) {
        posadd.ip_overlays[i].hide();
    }
}

function clear_posadds() {
    clear_address();
    clear_coords();
    clear_postcode();
    clear_phone_number();
    clear_ip();
}

function show_address() {
    for(var i = 0; i < posadd.addr_overlays; i++) {
        posadd.addr_overlays[i].show();
    }
}

function show_coords() {
    for(var i = 0; i < posadd.coord_overlays; i++) {
        posadd.coord_overlays[i].show();
    }
}

function show_postcode() {
    for(var i = 0; i < posadd.post_overlays; i++) {
        posadd.post_overlays[i].show();
    }
}

function show_phone_number() {
    for(var i = 0; i < posadd.phone_overlays; i++) {
        posadd.phone_overlays[i].show();
    }
}

function show_ip() {
    for(var i = 0; i < posadd.ip_overlays; i++) {
        posadd.ip_overlays[i].show();
    }
}

function gotoProtocolCases(seq) {
    if(seq === undefined || seq === null) {
        seq = 0;
    }
    var url = "fuse/" + sequences[seq];
    window.open(url);
}

function doSearchAll() {
    var word = $("#xqinput")[0].value;
    var idx = 0;
    try {
        idx = parseInt(word);
    } catch (e) {
        idx = 0;
    }

    $.ajax({
        url: 'getAllFireLocalSites.action',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            // var sitesStr = data['sites'];
            // var sites = JSON.parse(sitesStr);
            var site = data[idx];
            var windowHtml = "<div><iframe src='" + site +"' " + "width='500px' height='500px' /></div>";
            document.getElementById("y").innerHTML = windowHtml;
            var $win = $('#y').window({
                title: "新闻",
                width: 552,
                height: 559,
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
        }, error: function (err) {
            console.log(err);
        }

    });
}

var openFile = function(event, divName){
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        if(reader.result){
            var text = reader.result;
            alert(text);
            document.getElementById(divName).value = text;
            if(divName == "extrapostext") {
                relpos.text = text;
            } else if(divName == "addrtext") {

            }
        }
    };
    reader.readAsText(input.files[0]);
};

var openFileName = function (event, showPathDivName) {
    // document.getElementById(showPathDivName).value = document.getElementById(fileDivName).value;
    // document.getElementById(showPathDivName).value = fileDiv.value;
    // var input = event.target;
    // var file = input.files[0];
    document.getElementById(showPathDivName).value = event.target.files[0].name;
    // var url = getObjectURL(file);files[0].name
    // document.getElementById(showPathDivName).value = url;
};

function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}



// var postcode = getQueryString('postcode');
// var ip = getQueryString('ip');
// var areacode = getQueryString('areacode');
// if(areacode == null || "" == areacode) {
//     if(ip == null || "" == ip) {
//         if(postcode == null || "" == postcode) {
//             postcode = "430079";
//         }
//         showPostcode(postcode);
//     } else {
//         showIpArea(ip);
//     }
// } else {
//     showAreacode(areacode);
// }

function showAreacode(areacode, phoneNum) {
    $.ajax({
        url: 'getCoordsByAreacode.action?areacode=' + areacode,
        type: 'get',
        dataType: 'json',
        success: function (dist) {
            var simcall = dist['simcall'];
            var elements = simcall.split(',');
            var ele_len = elements.length;
            var province = elements[ele_len - 2];
            var city = elements[ele_len - 1];
            var district = "";
            var areaShape = getShape(province, city, district, "areacode", phoneNum);
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
}

function showIpArea(ip) {
    $.ajax({
        url: 'getCoordsByIP.action?ip=' + ip,
        type: 'get',
        dataType: 'json',
        success: function (dist) {
            if(dist['status'] != 0) {
                return;
            }
            var address_detail = dist['content']['address_detail'];
            var province = address_detail['province'];
            var city = address_detail['city'];
            var district = "";
            getShape(province, city, district, "ip", ip);
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
}

function showPostcode(postcode) {

    $.ajax({
        url: 'getPolygonByPostcode.action?postcode=' + postcode,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var point_data = data['points'];
            // if(point_data != null && point_data.length > 0) {
            //     for (var i = 0; i < point_data.length; i++) {
            //         var point = point_data[i];
            //         var location = point['location'];
            //         var x = location['lng'];
            //         var y = location['lat'];
            //         var point = new BMap.Point(x, y);
            //         addMarker(point);
            //         if(i == 0) {
            //             map.centerAndZoom(point, 12);
            //         }
            //     }
            // }
            var polygon_data = data['polygon'];
            if(polygon_data != null && polygon_data.length > 2) {
                var len = polygon_data.length;
                var polyArr = [];
                for (var i = 0; i < len; i++) {
                    var bp = new BMap.Point(polygon_data[i][0], polygon_data[i][1]);
                    polyArr.push(bp);
                    if(i == 0) {
                        map.centerAndZoom(bp, 12);
                    }
                }
                var polygon = new BMap.Polygon(polyArr, {
                    strokeColor: "blue",
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                });
                posadd.post_overlays.push(polygon);
                polygon.spaType = 5;
                addOverlayAndWin(polygon, {
                    "winwidth": 150,
                    "texts": ["邮编：" + postcode],
                    "name": "邮编"
                }, null, posadd.post_overlays);
            }
        }, error: function (err_data) {
            showPostcodeDistrict(postcode);
//                console.log(err_data);
        }
    });

}

function showPostcodeDistrict(postcode) {
    $.ajax({
        url: 'getDistrictsByPostcode.action?postcode=' + postcode,
        type: 'get',
        dataType: 'json',
        success: function (dists) {
            var len = dists.length;
            for (var i = 0; i < len; i++) {
                var dist = dists[i];
                var simcall = dist['simcall'];
                var elements = simcall.split(',');
                var ele_len = elements.length;
                var province = elements[ele_len - 2];
                var city = elements[ele_len - 1];
                var district = "";
                getShape(province, city, district, "postcode", postcode);
            }
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
}

function getShape(province, city, district, key, addValue) {
    var type_show = {
        "postcode": "邮编",
        "areacode": "电话",
        "ip": "IP"
    }
    if(city.lastIndexOf("市") == city.length - 1) {
        city = city.substring(0, city.length - 1);
    }
    if(posadd.city_polygons[city] != undefined) {
        var existOverlay = posadd.city_polygons[city];
        existOverlay.extData.texts.push("  " + type_show[key] + ": " + addValue);
        gotoPolyOverlay(existOverlay);
        return;
    }
    $.ajax({
        url: 'getShape.action?province=' + province + '&city=' + city + '&district=' + district,
        type: 'get',
        dataType: 'json',
        success: function (shp_data) {
            var shape = shp_data['shape'];
            var lineArr = JSON.parse(shape);
            var pointArr = [];
            for(var i = 0; i < lineArr.length; i++) {
                var bp = new BMap.Point(lineArr[i][0], lineArr[i][1]);
                pointArr.push(bp);
            }
            var polygon = new BMap.Polygon(pointArr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
            var disText = "";
            if(province != null && province != "") {
                disText += "省份:" + province + "  ";
            }
            if(city != null && city != "") {
                disText += "城市:" + city + "  ";
            }
            if(district != null && district != "") {
                disText += "地区:" + district + "  ";
            }
            var texts = [type_show[key] + ": " + addValue, disText];
            var list = null;
            if(key == "postcode") {
                // texts = ["邮编: " + value, disText];
                list = posadd.post_overlays;
            } else if(key == "areacode") {
                // texts = ["区号: " + value, disText];
                list = posadd.phone_overlays;
            } else if(key == "ip") {
                // texts = ["IP: " + value, disText];
                list = posadd.ip_overlays;
            } else {

            }
            var extData = {
                "name": city,
                "winwidth": 200,
                "texts": texts
            };
            polygon.spaType = 5;
            polygon.name = city;
            posadd.city_polygons[city] = polygon;
            addOverlayAndWin(polygon, extData, null, list);
            gotoPolyOverlay(polygon, 9);
        }, error: function (err) {
            console.log(err);
        }
    });
}

function gotoPolyOverlay(overlay, scale) {
    openInfoWin({target: overlay});
    // var path = overlay.getPath();
    // if(path.length > 0) {
    //     var bPoint = path[0];
    //     if(scale === undefined || scale == null) {
    //         scale = 9;
    //     }
    //     map.centerAndZoom(bPoint, scale);
    // }
}

function addMarker(point) {
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}

function addGo() {
    setTimeout(clearGeoEntities, 800);
}


function clearGeoEntities() {
    for(var i = 0; i < geoEntities.length; i++) {
        geoEntities[i].hide();
    }
    geoEntities.splice(0, geoEntities.length);
    setTimeout(initPointGeoEntities, 600);
}


function setAddStats() {
    var info = "<p>&nbsp;&nbsp;<strong>叠加模式：</strong></p>"+
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;上确共位叠加，串联时态叠加，自选范围</p><br/>"+
        "<p>&nbsp;&nbsp;<strong>处理的信息量：</strong></p>"+
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;文字：16304字节，图形：33256字节，<br/>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;图像：46926846字节，视频：2523秒，<br/>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;音频：865秒，动画：75秒</p>"+
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;处理了74条位置信息，<br/>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;叠加产生了23个组合地理实体</p><br/>"+
        "<p>&nbsp;&nbsp;<strong>叠加产生要素的信息量：</strong></p>"+
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;文字：9102字节，图形：13368字节，<br/>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;图像：29105662字节，视频：1273秒，<br/>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;音频：241秒，动画：31秒</p>";
    $("#infoStats").html(info);
}

function initPointGeoEntities() {

    $.ajax({
        url:"getPointGeoEntities.action",
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
            }
            setTimeout(initGeoEntities, 1000);
            setAddStats(setAddStats, 1000);
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

function toShowPointCool(checkbox) {
    if(checkbox.checked) {
        showPointCollection(false);
    } else {
        hidePointCollection();
    }
}

function toShowMapv(checkbox) {
    if (checkbox.checked) {
        showMapvpLayer(false);
    } else {
        hideMapv();
    }
}
