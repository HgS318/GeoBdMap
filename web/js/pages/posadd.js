
var posadd = {

    geoCoder: new BMap.Geocoder(),
    addr_overlays :[],
    coord_overlays: [],
    post_overlays:[],
    area_overlays:[],
    ip_overlays:[],
    city_polygons: {}

};

function extract_address() {
    var address = $("#addrtext")[0].value;
    posadd.geoCoder.getPoint(address, function(point){
        if (point) {
            // document.getElementById("result").innerHTML +=  index + " " + add + ":" + point.lng + "," + point.lat + "</br>";
            var bp = new BMap.Point(point.lng, point.lat);
            var marker = new BMap.Marker(bp);
            marker.spaType = 1;
            addOverlayAndWin(marker, {
                "name": "地名/地址",
                "text":address,
                "winwidth": 200
            }, null, posadd.addr_overlays);
            map.centerAndZoom(bp, 16);
            // addMarker(address, new BMap.Label(index+":"+add,{offset:new BMap.Size(20,-10)}));
        }
        else{
            alert("暂无法定位，请检查输入");
        }
    });
}

function extract_coords() {
    var coordStr = $("#coordtext")[0].value;
    var xyStr = coordStr.split(',');
    if(xyStr.length != 2) {
        alert("暂无法定位，请检查输入");
        return;
    }
    try {
        var x = parseFloat(xyStr[0]);
        var y = parseFloat(xyStr[1]);
        // var obj = document.getElementById("coordtext"); //定位id
        // var index = obj.selectedIndex; // 选中索引
        // var text = obj.options[index].text; // 选中文本
        // var value = obj.options[index].value; // 选中值
        var text = $('#coordSys option:selected').text();//选中的文本

        var bp = new BMap.Point(x, y);
        var marker = new BMap.Marker(bp);
        marker.spaType = 1;
        addOverlayAndWin(marker, {
            "name": "坐标",
            "text":text,
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
    var splashId = phoneNumber.indexOf('-');
    if(splashId < 0) {
        return;
    }
    var areaCode = phoneNumber.substring(0, splashId);
    showAreacode(areaCode);
}

function extract_ip() {
    var ip = $("#iptext")[0].value;
    showIpArea(ip);
}

function clear_address() {

}

function clear_coords() {

}

function clear_postcode() {

}

function clear_phone_number() {

}

function clear_ip() {

}

function clear_posadds() {
    
}

function gotoProtocolCases() {
    
}

function doSearchAll() {
    
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

var openFileName = function (event, divName) {
    var input = event.target;
    var file = input.files[0];
    // var file = event.files[0];
    var url = getObjectURL(file);
    document.getElementById(divName).value = url;
    // var reader = new FileReader();
    // reader.onload = function(){
    //     if(reader.result){
    //         var text = reader.result;
    //         alert(text);
    //         document.getElementById(divName).value = text;
    //         if(divName == "extrapostext") {
    //             relpos.text = text;
    //         } else if(divName == "addrtext") {
    //
    //         }
    //     }
    // };
    // reader.readAsText(input.files[0]);
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

function showAreacode(areacode) {
    $.ajax({
        url: 'getCoordsByAreacode?areacode=' + areacode,
        type: 'get',
        dataType: 'json',
        success: function (dist) {
            var simcall = dist['simcall'];
            var elements = simcall.split(',');
            var ele_len = elements.length;
            var province = elements[ele_len - 2];
            var city = elements[ele_len - 1];
            var district = "";
            var areaShape = getShape(province, city, district, "areacode", areacode);
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
}

function showIpArea(ip) {
    $.ajax({
        url: 'getCoordsByIP?ip=' + ip,
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
        url: 'getPolygonByPostcode?postcode=' + postcode,
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
        url: 'getDistrictsByPostcode?postcode=' + postcode,
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

function getShape(province, city, district, key, value) {
    if(posadd.city_polygons[city] != undefined) {
        var existOverlay = posadd.city_polygons[city];
        existOverlay.extData.texts.push("  " + key + ": " + value);
        gotoPolyOverlay(existOverlay);
        return;
    }
    $.ajax({
        url: 'getShape?province=' + province + '&city=' + city + '&district=' + district,
        type: 'get',
        dataType: 'json',
        success: function (shp_data) {
            var shape = shp_data['shape'];
            var lineArr = JSON.parse(shape);
            var pointArr = [];
            for(var i = 0; i < lineArr.length; i++) {
                var [_x, _y] = lineArr[i];
                var bp = new BMap.Point(_x, _y);
                pointArr.push(bp);
            }
            var polygon = new BMap.Polygon(pointArr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
            var disText = "";
            if(province != null && province != "") {
                disText += "省份:" + province + "  ";
            }
            if(city.lastIndexOf("市") == city.length - 1) {
                city = city.substring(0, city.length - 1);
            }
            if(city != null && city != "") {
                disText += "城市:" + city + "  ";
            }
            if(district != null && district != "") {
                disText += "地区:" + district + "  ";
            }
            var texts = [];
            var list = null;
            if(key == "postcode") {
                texts = ["邮编: " + value, disText];
                list = posadd.post_overlays;
            } else if(key == "areacode") {
                texts = ["区号: " + value, disText];
                list = posadd.area_overlays;
            } else if(key == "ip") {
                texts = ["IP: " + value, disText];
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
            gotoPolyOverlay(polygon);
            // map.addOverlay(polygon);
            // var _point = pointArr[0];
            // map.centerAndZoom(_point, 9);
        }, error: function (err) {
            console.log(err);
        }
    });
}

function gotoPolyOverlay(overlay) {
    var path = overlay.getPath();
    if(path.length > 0) {
        var bPoint = path[0];
        map.centerAndZoom(bPoint, 10);
    }
}

function addMarker(point) {
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
