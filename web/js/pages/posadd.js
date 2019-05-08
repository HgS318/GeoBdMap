// var python_service = "http://localhost:5050/";
var python_service = "http://106.12.93.49:5050/";

var posadd_init = {

    geoCoder: new BMap.Geocoder(),
    convertor: new BMap.Convertor(),
    addr_overlays :[],
    coord_overlays: [],
    post_overlays:[],
    phone_overlays:[],
    ip_overlays:[],
    city_polygons: {},
    tmp_addrs: [],
    pointCollection: null,
    mapvpDataset: null,
    spaMethod: 1,
    timeMethod: 1,
    startTime: null,
    endTime: null,
    mapExtent: null,
    road_conditions: [],
    traffic_lines: [],
    baiduSeachWord: "武汉 火灾 2月27日",
    baiduSearch: {},
    baiduSearchUrls: [],

};

// var posadd = cloneObject(posadd_init);
var posadd = posadd_init;

var mapvpLayer = null;

function getPosaddsNum() {
    var count = 0;
    count += posadd.addr_overlays.length;
    count += posadd.coord_overlays.length;
    count += posadd.post_overlays.length;
    count += posadd.phone_overlays.length;
    count += posadd.ip_overlays.length;
    count += posadd.road_conditions.length;
    count += relpos.positions.length;
    count += relpos.relPositions.length;
    count += getMassPointsNum();

    return count;

}

function getMassPointsNum() {
    var count = 0;
    if(mapvpLayer != null) {
        try {
            count += mapvpLayer.dataSet._data.length;
        } catch (e1) {}
    }
    if(posadd.pointCollection != null) {
        try {
            count += posadd.pointCollection['ea']['ia'].length;
        } catch (e2) {}
    }
    return count;
}

function updatePosaddNum() {
    var count = getPosaddsNum();
    $("#distintotal")[0].innerHTML = "感知接入信息：" + count + "条记录";
    updateMassPointsNum();
}

function updateMassPointsNum() {
    var count = getMassPointsNum();
    $("#boundintotal")[0].innerHTML = "海量点：" + count + "条记录";
}

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
        map.addOverlay(pointCollection);
        // $("#boundintotal")[0].innerHTML = "海量点：" + china_pois.length + "条记录";
        // $("#distintotal")[0].innerHTML = "感知接入信息：" + china_pois.length + "条记录";
        updatePosaddNum();
        var checkBox = document.getElementById('toolbarMassp');
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

        // $("#boundintotal")[0].innerHTML = "海量点：" + dataSet._data.length + "条记录";
        // $("#distintotal")[0].innerHTML = "感知接入信息：" + dataSet._data.length + "条记录";
        updatePosaddNum();
        var checkBox = document.getElementById('toolbarMassp');
        if(checkBox.checked != true) {
            checkBox.checked = true;
        }
        $("#mapvLayerControl")[0].style.display = "block";
    });
}

function hidePosAdds() {
    clear_address();
    clear_coords();
    clear_postcode();
    clear_phone_number();
    clear_ip();
    clear_cityPolygons();
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

function geocoderSearch(index){
    // if(addrStr === undefined || addrStr == null || addrStr == "") {
    //     return null;
    // }
    if(index >= posadd.tmp_addrs.length) {
        posadd.tmp_addrs = [];
        return;
    }
    var addrStr = posadd.tmp_addrs[index];
    var addr = addrStr.trim();
    if(index < posadd.tmp_addrs.length){
        setTimeout("geocoderSearch(" + (index + 1) + ")", 300);
    }
    posadd.geoCoder.getPoint(addr, function(point){
        if (point) {
            // var bp = new BMap.Point(point.lng, point.lat);
            // var marker = new BMap.Marker(bp);
            // marker.spaType = 1;
            var marker = createNewMarker(point);
            addOverlayAndInfowin(marker, {
                "name": "地名/地址",
                "text": addr,
                "winwidth": 200,
                "id": generateUUID()
            }, null, posadd.addr_overlays);
            map.centerAndZoom(point, 13);
            setResultItems([posadd.addr_overlays[posadd.addr_overlays.length - 1]], "distresults", "addr_overlays", true);
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
    posadd.tmp_addrs = addrs;
    geocoderSearch(0);
    // for(var i = 0; i < addrs.length; i++) {
    //     var address = addrs[i];
    //     geocoderSearch(address, i);
    // }
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
    var coords = parseCoordStr(coordStr);
    if(coords == null) {
        alert("暂无法定位，请检查输入");
        return;
    }
    showXY(coords[0], coords[1]);
}

function extract_postcode() {
    var postcode = $("#posttext")[0].value;
    var post = parsePostcode(postcode);
    if(post != null) {
        // setTimeout("showPostcode('" + postcode + "')", 400 * i + 100);
        showPostcode(postcode);
    } else {
        alert("邮编输入有误，请检查");
    }
}

function extract_phone_number() {
    var phoneNumbersStr = $("#phonetext")[0].value;
    var phoneNumbers = phoneNumbersStr.split('\n');
    for(var i = 0; i < phoneNumbers.length; i++) {
        var phoneNumber = phoneNumbers[i];
        var areaCode = parsePhoneAreaCode(phoneNumber);
        if(areaCode != null) {
            setTimeout("showAreacode('" + areaCode + "', '" + phoneNumber + "')", 400 * i + 100);
            // if(i == 0) {
            //     showAreacode(areaCode, phoneNumber);
            // } else {
            //     setTimeout("showAreacode('" + areaCode + "', '" + phoneNumber + "')", 300 * i);
            // }
        }
    }
}

function extract_ip() {
    var ipsStr = $("#iptext")[0].value;
    var ips = ipsStr.split('\n');
    for(var i = 0; i < ips.length; i++) {
        var ipStr = ips[i];
        var ip = parseIP(ipStr);
        if(ip != null) {
            setTimeout("showIpArea('" + ip + "')", 300 * i + 100);
            // if(i == 0) {
            //     showIpArea(ip);
            // } else {
            //     setTimeout("showIpArea('" + ip + "')", 300 * i);
            // }
        }
    }
}

function parsePostcode(postStr) {
    if(postStr === undefined || postStr == null || postStr == "") {
        return null;
    }
    try {
        var post = postStr.trim();
        var postNum = post;
        if(postNum> 99999 && postNum < 1000000) {
            return post;
        }
        return null;
    } catch (e) {
        return null;
    }
}

function parseCoordStr(coordStr) {
    if(coordStr === undefined || coordStr == null || coordStr == "") {
        return null;
    }
    try {
        var coords = coordStr.trim().split(",");
        var xStr = coords[0].trim();
        var yStr = coords[1].trim();
        var x = parseFloat(xStr);
        var y = parseFloat(yStr);
        if(isNaN(x) || isNaN(y)) {
            return null;
        }
        return [x, y];
    } catch (e) {
        return null;
    }
}

function parseIP(ipStr) {
    if(ipStr === undefined || ipStr == null || ipStr == "") {
        return null;
    }
    try {
        var numStrs = ipStr.trim().split('.');
        var ip = "";
        for (var i = 0; i < 4; i++) {
            var num = parseInt(numStrs[i].trim());
            if(num > -1 && num < 256) {
                ip += num.toString();
            } else {
                return null;
            }
            if(i != 3) {
                ip += ".";
            }
        }
        return ip;
    } catch (e) {
        return null;
    }
    
}

function parsePhoneAreaCode(phoneNumberStr) {
    if(phoneNumberStr === undefined || phoneNumberStr == "" || phoneNumberStr == null) {
        return null;
    }
    try {
        var phoneNumber = phoneNumberStr.trim();
        var areaCode = getAreaNumFromPhnoeNum(phoneNumber);
        var areaCodeNum = parseInt(areaCode);
        if(isNaN(areaCodeNum)) {
            return null;
        }
        if(areaCodeNum > 0 && areaCodeNum < 10000) {
            return areaCode;
        }
        return null;
    } catch (exp) {
        return null;
    }
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

//  自动识别类型并接入
function autoAdd() {
    var text = $("#posGeneral")[0].value;
    var coords = parseCoordStr(text);
    if(coords != null) {
        showXY(coords[0], coords[1]);
        return;
    }
    var post = parsePostcode(text);
    if(post != null) {
        showPostcode(post);
        return;
    }
    var ip = parseIP(text);
    if(ip != null) {
        showIpArea(ip);
        return;
    }
    var areaCode = parsePhoneAreaCode(text);
    if(areaCode != null) {
        showAreacode(areaCode, text);
        return;
    }
    extract_positions(text);
}

function showXY(x, y) {
    try {
        var text = $('#coordSys option:selected').text();
        var extData = {
            "name": "坐标",
            "texts": [x.toString() + ", " + y.toString(), "坐标系统: " + text],
            "winwidth": 150,
            "id": generateUUID()
        };
        var obPoint = new BMap.Point(x, y);
        var shown = false;
        if(text != "百度坐标系") {
            var from = 1;
            if(text == "WGS 84") {
                from = 1
            } else if(text == "火星坐标系") {
                from = 3;
            }
            posadd.convertor.translate([obPoint], from, 5, function (data, status, message) {
                var bp, marker;
                if (status) {
                    bp = obPoint;
                    // var marker = new BMap.Marker(bp);
                    // marker.spaType = 1;
                    marker = createNewMarker(bp);
                } else {
                    bp = data.points[0];
                    marker = createNewMarker(bp);
                    shown = true;
                }
                addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
                map.centerAndZoom(bp, 15);
                setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
            });
        } else {
            var bp = obPoint;
            // var marker = new BMap.Marker(bp);
            // marker.spaType = 1;
            var marker = createNewMarker(bp);
            addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
            map.centerAndZoom(bp, 15);
            setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
        }
    } catch (e) {
        alert("暂无法定位，请检查输入");
    }
}

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
            getShape(province, city, district, "areacode", phoneNum);
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
            //         map.addOverlay(point);
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
                // var polygon = new BMap.Polygon(polyArr, {
                //     strokeColor: "blue",
                //     strokeWeight: 2,
                //     strokeOpacity: 0.5
                // });
                // posadd.post_overlays.push(polygon);
                var polygon = createNewPolygon(polyArr, "bp_array");
                polygon.spaType = 5;
                var texts = ["邮编：" + postcode];
                var postInfo = $("#postAboutText")[0].value;
                if(postInfo != null && postInfo != '') {
                    texts.push(postInfo);
                }
                addOverlayAndInfowin(polygon, {
                    "winwidth": 150,
                    "texts": texts,
                    "name": "邮编",
                    "id": generateUUID()
                }, null, posadd.post_overlays);
                setResultItems([posadd.post_overlays[posadd.post_overlays.length - 1]], "distresults", "post_overlays", true);
            }
        }, error: function (err_data) {
            showPostcodeDistrict(postcode);
//                console.log(err_data);
        }
    });

}

function showPostcodeDistrict(postcode) {
    try {
        var postNum = parseInt(postcode);
        var postCityNum = postNum / 1000;
        var cityPostCode = postCityNum * 1000;
        var vagePostCode = cityPostCode.toString();
    } catch (e) {
        console.log(e);
        alert("邮编输入有误！");
        return;
    }
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
                var addValue = postcode;
                var postInfo = $("#postAboutText")[0].value;
                if(postInfo != null && postInfo != '') {
                    addValue += ("  (" + postInfo + ")");
                }
                getShape(province, city, district, "postcode", addValue);
            }
        }, error: function (err_data) {
            console.log(err_data);
            alert("邮编输入有误！");
        }
    });
}

function getShape_local(province, city, district, key, addValue) {
    var type_show = {
        "postcode": "邮编",
        "areacode": "电话",
        "ip": "IP"
    };
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
            // var lineArr = JSON.parse(shape);
            // var pointArr = [];
            // for(var i = 0; i < lineArr.length; i++) {
            //     var bp = new BMap.Point(lineArr[i][0], lineArr[i][1]);
            //     pointArr.push(bp);
            // }
            // var polygon = new BMap.Polygon(pointArr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
            var polygon = createNewPolygon(shape, "string");
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
            var texts = [disText, type_show[key] + ": " + addValue];
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
                "texts": texts,
                "id": generateUUID()
            };
            polygon.name = city;
            posadd.city_polygons[city] = polygon;
            addOverlayAndInfowin(polygon, extData, null, list);
            setResultItems([polygon], "distresults", "city_polygons", true);
            gotoPolyOverlay(polygon, 9);
        }, error: function (err) {
            console.log(err);
        }
    });
}

function getShape(province, city, district, key, addValue) {
    if(city.indexOf("南京") > -1) {
        getShape_local(province, city, district, key, addValue);
        return;
    }
    var type_show = {
        "postcode": "邮编",
        "areacode": "电话",
        "ip": "IP"
    };
    if(city.lastIndexOf("市") == city.length - 1) {
        city = city.substring(0, city.length - 1);
    }
    if(posadd.city_polygons[city] != undefined) {
        var existOverlay = posadd.city_polygons[city];
        existOverlay.extData.texts.push("  " + type_show[key] + ": " + addValue);
        gotoPolyOverlay(existOverlay);
        return;
    }
    var bdary = new BMap.Boundary();
    bdary.get(city, function (rs) {       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count > 0) {
            var polygon = new BMap.Polygon(rs.boundaries[0], overlay_styles.newPolygonStyle);
            polygon = createNewPolygon(polygon, "polygon");
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
            var texts = [disText, type_show[key] + ": " + addValue];
            var list = null;
            if(key == "postcode") {
                list = posadd.post_overlays;
            } else if(key == "areacode") {
                list = posadd.phone_overlays;
            } else if(key == "ip") {
                list = posadd.ip_overlays;
            }
            var extData = {
                "name": city,
                "winwidth": 200,
                "texts": texts,
                "id": city
            };
            posadd.city_polygons[city] = polygon;
            addOverlayAndInfowin(polygon, extData, null, list);
            gotoPolyOverlay(polygon, 8);
            setResultItems([polygon], "distresults", "city_polygons", true);
        }
    });

}

function clear_address() {
    for(var i = 0; i < posadd.addr_overlays.length; i++) {
        posadd.addr_overlays[i].hide();
    }
}

function clear_coords() {
    for(var i = 0; i < posadd.coord_overlays.length; i++) {
        posadd.coord_overlays[i].hide();
    }
}

function clear_postcode() {
    for(var i = 0; i < posadd.post_overlays.length; i++) {
        posadd.post_overlays[i].hide();
    }
}

function clear_phone_number() {
    for(var i = 0; i < posadd.phone_overlays.length; i++) {
        posadd.phone_overlays[i].hide();
    }
}

function clear_ip() {
    for(var i = 0; i < posadd.ip_overlays.length; i++) {
        posadd.ip_overlays[i].hide();
    }
}

function clear_cityPolygons() {
    for(var city in posadd.city_polygons) {
        var polygon = posadd.city_polygons[city];
        polygon.hide();
    }
}

function clear_posadds() {
    window.location.reload();
    // clear_address();
    // clear_coords();
    // clear_postcode();
    // clear_phone_number();
    // clear_ip();
    // clear_cityPolygons();
    // posadd = {
    //
    //     geoCoder: new BMap.Geocoder(),
    //     convertor: new BMap.Convertor(),
    //     addr_overlays :[],
    //     coord_overlays: [],
    //     post_overlays:[],
    //     phone_overlays:[],
    //     ip_overlays:[],
    //     city_polygons: {},
    //     tmp_addrs: [],
    //     pointCollection: null,
    //     mapvpDataset: null,
    //     spaMethod: 1,
    //     timeMethod: 1,
    //     startTime: null,
    //     endTime: null,
    //     mapExtent: null,
    //     road_conditions: [],
    //     traffic_lines: [],
    //     baiduSeachWord: "武汉 火灾 2月27日",
    //     baiduSearch: {},
    //     baiduSearchUrls: [],
    // };
    // initComponents();
}

cloneObject = function(obj) {
    if(typeof obj === "object") {
        if(util.isArray(obj)) {
            var newArr = [];
            for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
            return newArr;
        } else {
            var newObj = {};
            for(var key in obj) {
                newObj[key] = cloneObject(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
};

function show_address() {
    for(var i = 0; i < posadd.addr_overlays.length; i++) {
        posadd.addr_overlays[i].show();
    }
}

function show_coords() {
    for(var i = 0; i < posadd.coord_overlays.length; i++) {
        posadd.coord_overlays[i].show();
    }
}

function show_postcode() {
    for(var i = 0; i < posadd.post_overlays.length; i++) {
        posadd.post_overlays[i].show();
    }
}

function show_phone_number() {
    for(var i = 0; i < posadd.phone_overlays.length; i++) {
        posadd.phone_overlays[i].show();
    }
}

function show_ip() {
    for(var i = 0; i < posadd.ip_overlays.length; i++) {
        posadd.ip_overlays[i].show();
    }
}

function showCityPolygons() {
    for(var city in posadd.city_polygons) {
        var polygon = posadd.city_polygons[city];
        polygon.show();
    }
}

function showPosAdds() {
    show_address();
    show_coords();
    show_postcode();
    show_phone_number();
    show_ip();
    showRelposOverlays();
    showCityPolygons();
}

function gotoProtocolCases(seq) {
    if(seq === undefined || seq === null) {
        seq = 0;
    }
    var url = "fuse/" + sequences[seq];
    window.open(url);
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

function timeAddMehod(method, group) {
    var timeText1 = $("#starttime" + group + "t")[0];
    var timep1 = $("#starttime" + group + "p")[0];
    var timep2 = $("#endtime" + group + "p")[0];
    switch(method) {
        case 1:
        case 2:
            timep1.style.display = 'none';
            timep2.style.display = 'none';
            break;
        case 3:
            timep1.style.display = 'block';
            timep2.style.display = 'none';
            timeText1.innerText = timeText1.innerText.replace("起始", "选择");
            break;
        case 4:
            timep1.style.display = 'block';
            timep2.style.display = 'block';
            timeText1.innerText = timeText1.innerText.replace("选择", "起始");
            break;
        default:
            break;
    }
    if(group == 1) {
        posadd.timeMethod = method;
    }
}

//  开始叠加
function addGo() {
    // setTimeout(clearGeoEntities, 800);
    posadd.spaMethod = parseInt($("input[name='coloMethod1']:checked").val());
    posadd.timeMethod = parseInt($("input[name='tenseMethod']:checked").val());
    posadd.startTime = $("#starttime1").datebox("getValue");
    posadd.endTime = $("#endtime1").datebox("getValue");
    // posadd.startTime = $("#starttime1")[0].value;
    // posadd.endTime = $("#endtime1")[0].value;
    console.log(posadd.spaMethod);
    console.log(posadd.timeMethod);
    console.log(posadd.startTime);
    console.log(posadd.endTime);
    var url = "posadd.action?spaMethod=" + posadd.spaMethod.toString() + "&timeMethod=" +
        posadd.timeMethod.toString() + "&time1=" + posadd.startTime + "&time2=" + posadd.endTime;
    if(posadd.mapExtent != null) {
        var polygon = posadd.mapExtent;
        var in_points = [];
        for(var i = 0; i < geoInfos.length; i++) {
            var point = getOnePointOfOverlay(geoInfos[i]);
            var inPolygon = BMapLib.GeoUtils.isPointInPolygon(point, polygon);
            if(inPolygon) {
                in_points.push(geoInfos[i].extData['infoId']);
            }
        }
        var ids = "";
        for(var j = 0; j < in_points.length; j++) {
            ids += (in_points[j] + ",");
        }
        url += ("&ids=" + ids);
        // posaddAction(url);
        setTimeout("posaddAction('" + url + "')", 1000);
    } else {
        // posaddAction(url);
        setTimeout("posaddAction('" + url + "')", 1000);
    }

}

//  调用叠加服务
function posaddAction(url) {
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        timeout: 60000,
        success: function (data) {
            var brief = data['brief'];
            var entities = data['entities'];
            initGeoEntities(entities);
            $("#toolbarInfo")[0].checked = false;
            $("#toolbarEntities")[0].checked = true;
            hideGeoInfo();
            // c1.prop("checked", true);
            // $("#toolbarEntities")[0].prop('checked', true);
            toEntityRes();
            alert(brief.replace(";", "\r\n"));
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
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
                    addOverlayAndInfowin(marker, entity, content, geoEntities);
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
