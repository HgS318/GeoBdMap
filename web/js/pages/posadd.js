// var python_service = "http://localhost:5050/";
var python_service = "http://106.12.56.213:5050/";

var posadd_init = {

    geoCoder: new BMap.Geocoder(),
    convertor: new BMap.Convertor(),
    addr_overlays :[],
    coord_overlays: [],
    post_overlays: [],
    phone_overlays: [],
    ip_overlays: [],
    global_poses : [],
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
    demo_words: {
        "武汉大学信息学部8栋": [114.365385,30.532532, "住宅区", "湖北省武汉市洪山区珞喻路"],
        "武汉大学信息学部8幢": [114.365385,30.532532, "住宅区", "湖北省武汉市洪山区珞喻路"],
        "武汉大学信息学部8舍": [114.365385,30.532532, "住宅区", "湖北省武汉市洪山区珞喻路"],
        "宝安区公明街道合水口第二工业区16栋": [113.884064,22.791882, "公司企业", "广东省深圳市光明区公明松白路合水口泥围新村小区附近"],
        "公明街道合水口第二工业区16栋": [113.884064,22.791882, "公司企业", "广东省深圳市光明区公明松白路合水口泥围新村小区附近"],
        "合水口第二工业区16栋": [113.884064,22.791882, "公司企业", "广东省深圳市光明区公明松白路合水口泥围新村小区附近"],
    },
    realTimeDataInit: false,
    airCites: null,
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
    count += posadd.global_poses.length;
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
        posadd.pointCollection.addEventListener('click', pointCollectionListener);
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
        pointCollection.addEventListener('click', pointCollectionListener);
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

var pointCollectionListener = function (e) {
    // var info = JSON.stringify(e.point.extData);
    // alert(info);
    var extData = e.point.extData;
    var width = 230;
    var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['type2'] + '</span>';
    var content = "类型：" + extData.type2 + "<br/>" +"地址：" + extData.addr + "<br/>" +
        "经度：" + extData['wgsx'] + "<br/>" + "纬度：" + extData['wgxy'];
    openInfoWin({'x':extData['wgsx'], 'y': extData['wgxy'], 'target': {'spaType': -1}}, content, title, width);
};

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
        posadd.pointCollection.removeEventListener('click', pointCollectionListener);
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
            var x = point.lng;
            var y = point.lat;
            var posStr = (Math.round(x * 10000) / 10000).toString() + ", " + (Math.round(y * 10000) / 10000).toString();
            var marker = createNewMarker(point);
            var extData = {
                "name": "地名/地址",
                "texts": [addr, "位置估计：" + posStr],
                "winwidth": 200,
                "maxTexts": 1000,
                "id": generateUUID()
            };
            transXY(x, y, extData, {"addr": 0, "post": 1, "phone": 1});
            addOverlayAndInfowin(marker, extData, null, posadd.addr_overlays);
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

function extract_global_demo(text, region) {
    if(text === undefined || text == null || "" == test) {
        text = $("#glopostext")[0].value;
    }
    var current_view = false;
    if(region === undefined || region == null || "" == region) {
        region = $("#gloposCity")[0].value;
    }
    var service_url = "http://api.map.baidu.com/place_abroad/v1/search?scope=1&query=" + text +
        "&page_size=5&page_num=0&output=json&ak=r5Cpb39ZYRGL2aaDqFyvdOAUzhTqOsfC&region=" + region;
    if(region === undefined || region == null || "" == region || "当前地图范围" == region) {
        var bound = map.getBounds();
        var sw = bound.getSouthWest();
        var ne = bound.getNorthEast();
        var boundStr = sw.lat.toString() + ',' + sw.lng.toString() + ',' + ne.lat.toString() + ',' + ne.lng.toString();
        service_url = "http://api.map.baidu.com/place_abroad/v1/search?scope=1&query=" + text +
            "&page_size=5&page_num=0&output=json&ak=r5Cpb39ZYRGL2aaDqFyvdOAUzhTqOsfC&bounds=" + boundStr;
        current_view = true;
    }
    var query_url = encodeMyUrl(service_url);
    $.ajax({
        url: "queryAPI.action?url=" + query_url,
        type: 'get',
        dataType: 'json',
        success: function (_data) {
            if(_data['status'] == 0 && _data['results'] != undefined) {
                var len = _data['results'].length;
                for(var i = 0; i < len; i++) {
                    var poi = _data['results'][i];
                    try {
                        var x = poi['location']['lng'];
                        var y = poi['location']['lat'];
                        var bp = new BMap.Point(x, y);
                        var info = [];
                        if(poi['name'] != undefined && poi['name'] != null) {
                            info.push(poi['name']);
                        }
                        if(poi['address'] != undefined && poi['address'] != null) {
                            info.push("address: " + poi['address']);
                        }
                        if(poi['telephone'] != undefined && poi['telephone'] != null) {
                            info.push("telephone: " + poi['telephone']);
                        }
                        var extData = {
                            "name": "全球位置",
                            "texts": info,
                            "winwidth": 225,
                            "id": generateUUID()
                        };
                        var marker = createNewMarker(bp);
                        addOverlayAndInfowin(marker, extData, null, posadd.global_poses);
                        if(i == 0 && current_view == false) {
                            map.centerAndZoom(bp, 15);
                        }
                    } catch (e) {

                    }
                }
                setResultItems(posadd.global_poses, "distresults", "global_poses", true);
                updatePosaddNum();
            }

        }, error: function (err_data) {
            console.log(err_data);
        }
    });
    
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

//  左边搜索按钮的测试程序
function search_test_left() {
    var point = new BMap.Point(13.7875871, 52.837132999999994);
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    map.centerAndZoom(point, 15);
    var opts = {
        width : 210,     // 信息窗口宽度
        height: 120,     // 信息窗口高度
        title : "McDonald's Restaurant" , // 信息窗口标题
        enableMessage:true,//设置允许信息窗发送短息
        message:"..."
    }
    var infoWindow = new BMap.InfoWindow("&nbsp;&nbsp;&nbsp;Classic, long-running fast-food chain known for its burgers, fries & shakes." +
        "<br/>&nbsp;&nbsp;&nbsp;Cash only·Good for kids<br/>&nbsp;&nbsp;&nbsp;167, 16244 Schorfheide, Germany<br/>" +
        "&nbsp;&nbsp;&nbsp;+49 3335 3747", opts);  // 创建信息窗口对象
    marker.addEventListener("click", function(){
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
    var marker2 = new BMap.Marker(new BMap.Point(13.820236935702765,52.8351017192936));
    map.addOverlay(marker2);              // 将标注添加到地图中
}

//  保留小数点后若干位
function round(v, e){
    var t = 1;
    for(;e>0;t*=10,e--);
    for(;e<0;t/=10,e++);
    return Math.round(v*t)/t;
}

// 直接接入示例地点的具体操作
function demoPlaceSearchShow(word) {
    var text = $("#posGeneral")[0].value;
    var word = text.trim();
    if(word in posadd.demo_words) {
        var bp = new BMap.Point(posadd.demo_words[word][0], posadd.demo_words[word][1]);
        var marker = createNewMarker(bp);
        var extData = {
            "name": word,
            "texts": [posadd.demo_words[word][2], posadd.demo_words[word][3], "位置估计：[" +
                round(posadd.demo_words[word][0], 4).toString() + "," + round(posadd.demo_words[word][1].toString(), 4) + "]"],
            "winwidth": 200,
            "maxTexts": 1000,
            "id": generateUUID()
        };
        addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
        map.centerAndZoom(bp, 16);
        setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
    }
}

//  （混合）地点搜索
function autoSearchPlace() {
    var text = $("#posGeneral")[0].value;
    var word = text.trim();
    //  清楚原先要素
    clear_coords();
    posadd.coord_overlays = [];
    setResultItems(posadd.coord_overlays, "distresults", "coord_overlays", false);
    $("#eastTabsDiv").tabs("select", "信息列表");
    $("#resultsdiv").accordion("select", 2);
    //  示例地点：直接接入
    if(word in posadd.demo_words) {
        setTimeout("demoPlaceSearchShow()", 8000);
        return;
    }
    //  非示例地点：混合搜索
    var service_url = python_service + "mixed_place_search_1";
    // var url = service_url + "?google=1&word=" + word;
    var url = service_url + "?word=" + word;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        timeout: 120000,
        success: function (srh_data) {
            var pois = srh_data["results"];
            if(pois.length < 1) {
                alert("暂时没有找到该位置。");
            } else if(pois.length < 3) {
                for(var i = 0; i < pois.length; i++) {
                    var poi = pois[i];
                    if("bdx" in poi && "bdy" in poi) {
                        var extData = {
                            "name": poi["name"],
                            "texts": poi["texts"],
                            "winwidth": 200,
                            "maxTexts": 1000,
                            "id": generateUUID()
                        };
                        var bp = new BMap.Point(poi["bdx"], poi["bdy"]);
                        var marker = createNewMarker(bp);
                        addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
                        setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
                        if(i == 0) {
                            map.centerAndZoom(bp, 12);
                        }
                    }
                }
            } else {
                var texts = ["&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可能包含的地点："];
                var sx = 0.0, sy = 0.0, fx = 0.0, fy = 0.0;
                var num = 5;
                if(pois.length < num) {
                    num = pois.length;
                }
                for(var i = 0; i < num; i++) {
                    var poi = pois[i];
                    if("bdx" in poi && "bdy" in poi) {
                        sx += poi["bdx"];
                        sy += poi["bdy"];
                        if(i == 0) {
                            fx = poi["bdx"];
                            fy = poi["bdy"];
                        }
                        if(pois.length > num && i == num - 1) {
                            texts.push("<strong>" + poi["name"] + "</strong> ...");
                        } else {
                            texts.push("<strong>" + poi["name"] + "</strong>");
                        }
                    }
                }
                var avgx = sx / num;
                var avgy = sy / num;
                // var bp = new BMap.Point(avgx, avgy);
                // texts = ["&nbsp;&nbsp;[" + round(avgx, 3).toString() + "," + round(avgy, 3).toString() + "]&nbsp;（估计位置）"].concat(texts)
                var bp = new BMap.Point(fx, fy);
                texts = ["&nbsp;&nbsp;[" + round(fx, 3).toString() + "," + round(fy, 3).toString() + "]&nbsp;（估计位置）"].concat(texts)
                var extData = {
                    "name": word,
                    "texts": texts,
                    "winwidth": 200,
                    "maxTexts": 1000,
                    "id": generateUUID()
                };
                var marker = createNewMarker(bp);
                addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
                setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
                map.centerAndZoom(bp, 15);
            }

        }, error: function (err_data) {
            alert("服务繁忙，请稍后再试。")
            console.log(err_data);
        }
    });

}

//  自动识别类型并接入
function autoAdd() {
    autoSearchPlace();
    // if(admin == true) {
    //     search_test_left();
    //     return;
    // }
    // var text = $("#posGeneral")[0].value;
    // var coords = parseCoordStr(text);
    // if(coords != null) {
    //     showXY(coords[0], coords[1]);
    //     return;
    // }
    // var post = parsePostcode(text);
    // if(post != null) {
    //     showPostcode(post);
    //     return;
    // }
    // var ip = parseIP(text);
    // if(ip != null) {
    //     showIpArea(ip);
    //     return;
    // }
    // var areaCode = parsePhoneAreaCode(text);
    // if(areaCode != null) {
    //     showAreacode(areaCode, text);
    //     return;
    // }
    // extract_positions(text);
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
                "maxTexts": 1000,
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
                "maxTexts": 1000,
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
    //     global_poses : [],
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
    try {
        var bPoint = overlay.getBounds().getCenter();
        // var path = overlay.getPath();
        // if (path.length > 0) {
        //     var bPoint = path[0];
        //     if (scale === undefined || scale == null) {
        //         scale = 9;
        //     }
        map.centerAndZoom(bPoint, scale);
    } catch (e) {}
    openInfoWin({target: overlay});
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


