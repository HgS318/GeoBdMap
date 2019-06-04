
function showXY(x, y) {
    try {
        var text = $('#coordSys option:selected').text();
        var extData = {
            "name": "坐标",
            "texts": [x.toString() + ", " + y.toString(), "坐标系统: " + text],
            "winwidth": 150,
            "maxTexts": 1000,
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
                transXY(x, y, extData, {"addr": 1, "post": 1, "phone": 1});
                addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
                map.centerAndZoom(bp, 15);
                setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
            });
        } else {
            var bp = obPoint;
            // var marker = new BMap.Marker(bp);
            // marker.spaType = 1;
            var marker = createNewMarker(bp);
            transXY(x, y, extData, {"addr": 1, "post": 1, "phone": 1});
            addOverlayAndInfowin(marker, extData, null, posadd.coord_overlays);
            map.centerAndZoom(bp, 15);
            setResultItems([posadd.coord_overlays[posadd.coord_overlays.length - 1]], "distresults", "coord_overlays", true);
        }
    } catch (e) {
        alert("暂无法定位，请检查输入");
    }
}

function transXY(x, y, extData, options) {
    if(options === undefined || options == null) {
        options = {"addr": 1,"post": 1,"phone": 1};
    }
    var locaStr = y.toString() + "," + x.toString();
    var service_url = "http://api.map.baidu.com/geocoder/v2/?location=" + locaStr +
        "&output=json&pois=0&latest_admin=1&ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7";
    var query_url = encodeMyUrl(service_url);
    $.ajax({
        url: "queryAPI.action?url=" + query_url,
        type: 'get',
        dataType: 'json',
        success: function (_data) {
            if(_data['status'] == 0 && _data['result'] != undefined) {
                if(extData['texts'] === undefined || extData['texts'] == null) {
                    extData['texts'] = [];
                }
                var result = _data['result'];
                if(options['addr'] == 1) {
                    if (result['formatted_address'] != undefined || result['formatted_address'] != null) {
                        extData['texts'].push("地址：" + result['formatted_address']);
                    }
                }
                var addressComponent = result['addressComponent'];
                if(addressComponent != undefined && addressComponent != null) {
                    var country = addressComponent['country'];
                    var province = addressComponent['province'];
                    var city = addressComponent['city'];
                    var district = addressComponent['district'];
                    if(options.phone == 1) {
                        var areacode = getCityCodeByName(province, city, district);
                        if (areacode != null) {
                            extData['texts'].push("电话区号：" + areacode);
                        }
                    }
                    if(options.post == 1) {
                        var postcode = getZipCodeByName(province, city, district);
                        if (postcode != null) {
                            extData['texts'].push("邮编：" + postcode);
                        }
                    }
                }
            }
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
                try {
                    var postInfo = $("#postAboutText")[0].value;
                    if(postInfo != null && postInfo != '') {
                        texts.push(postInfo);
                    }
                    var dataList = data['data']['list'];
                    var firstObj = dataList[0];
                    var province = firstObj['Province'];
                    var city = firstObj['City'];
                    var district = firstObj['District'];
                    var Address = firstObj['Address'];
                    var addr = province + city + district + Address;
                    var areacode = getCityCodeByName(province, city, district);
                    if (dataList.length > 1) {
                        try {
                            addr = addr + "，" + dataList[1]['Province'] + dataList[1]['City'] + dataList[1]['District']
                                + dataList[1]['Address'] + " 等";
                        } catch (secondExp) {
                            addr = addr + " 等";
                        }
                    }
                    texts.push("地址：" + addr);
                    var x = polygon_data[0][0];
                    var y = polygon_data[0][1];
                    var posStr = (Math.round(x * 1000) / 1000).toString() + ", " + (Math.round(y * 1000) / 1000).toString();
                    texts.push("位置估计：" + posStr);
                    if (areacode != null) {
                        texts.push("电话区号：" + areacode);
                    }
                } catch (dataExp){

                }
                var extData = {
                    "winwidth": 150,
                    "texts": texts,
                    "name": "邮编",
                    "maxTexts": 1000,
                    "id": generateUUID()
                };
                addOverlayAndInfowin(polygon, extData, null, posadd.post_overlays);
                setResultItems([posadd.post_overlays[posadd.post_overlays.length - 1]], "distresults", "post_overlays", true);
            }
        }, error: function (err_data) {
            showPostcodeDistrict(postcode);
//                console.log(err_data);
        }
    });

}

function showPostcodeDistrict(postcode) {
    var distObj = getDistObjByPostCode(postcode);
    if(distObj == null) {
        return;
    }
    var texts = ["邮编：" + postcode];
    var postInfo = $("#postAboutText")[0].value;
    if(postInfo != null && postInfo != '') {
        texts.push(postInfo);
    }
    var MergerName = null;
    try {
        MergerName = distObj['MergerName'];
        texts.push("地址/地区：" + MergerName);
        var x = distObj['lng'];
        var y = distObj['lat'];
        var posStr = (Math.round(x * 100) / 100).toString() + ", " + (Math.round(y * 100) / 100).toString();
        texts.push("位置估计：" + posStr);
    } catch (posExp) {}
    try {
        var areacode = distObj['CityCode'];
        texts.push("电话区号：" + areacode);
    } catch (phoneExp) {}
    if(MergerName != undefined && MergerName != null) {
        var eles = MergerName.split(',');
        if(eles.length > 1) {
            var province = "", city = "", district = "";
            province = eles[1];
            if(eles.length > 2) {
                city =eles[2];
            }
            if(eles.length > 3) {
                district =eles[3];
            }
            createDistMapElement(province, city, district, "邮政编码", texts);
        }
    }
    // try {
    //     var postNum = parseInt(postcode);
    //     var postCityNum = postNum / 1000;
    //     var cityPostCode = postCityNum * 1000;
    //     var vagePostCode = cityPostCode.toString();
    // } catch (e) {
    //     console.log(e);
    //     alert("邮编输入有误！");
    //     return;
    // }
    // $.ajax({
    //     url: 'getDistrictsByPostcode.action?postcode=' + postcode,
    //     type: 'get',
    //     dataType: 'json',
    //     success: function (dists) {
    //         var len = dists.length;
    //         for (var i = 0; i < len; i++) {
    //             var dist = dists[i];
    //             var simcall = dist['simcall'];
    //             var elements = simcall.split(',');
    //             var ele_len = elements.length;
    //             var province = elements[ele_len - 2];
    //             var city = elements[ele_len - 1];
    //             var district = "";
    //             var addValue = postcode;
    //             var postInfo = $("#postAboutText")[0].value;
    //             if(postInfo != null && postInfo != '') {
    //                 addValue += ("  (" + postInfo + ")");
    //             }
    //             getShape(province, city, district, "postcode", addValue);
    //         }
    //     }, error: function (err_data) {
    //         console.log(err_data);
    //         alert("邮编输入有误！");
    //     }
    // });
}

function showAreacode(areacode, phoneNum) {
    $.ajax({
        url: 'getCoordsByAreacode.action?areacode=' + areacode,
        type: 'get',
        dataType: 'json',
        success: function (dist) {
            var simcall = dist['simcall'];
            var texts = [phoneNum, "区号：" + areacode, "地址/地区：" + simcall];
            var elements = simcall.split(',');
            var ele_len = elements.length;
            var province = elements[ele_len - 2];
            var city = elements[ele_len - 1];
            var district = "";
            var postcode = getZipCodeByName(province, city, district);
            if (postcode != null) {
                texts.push("邮编：" + postcode);
            }
            // getShape(province, city, district, "areacode", phoneNum);
            createDistMapElement(province, city, district, "固定电话", texts, true);
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
            var _content = dist['content'];
            if(_content === undefined || _content == null) {
                return;
            }
            var addr = _content['address'];
            var texts = [ip, "地址/地区：" + addr];
            var address_detail = _content['address_detail'];
            var province = address_detail['province'];
            var city = address_detail['city'];
            var district = address_detail['district'];
            if(province === undefined || province == null) {
                province = "";
            }
            if(city === undefined || city == null) {
                city = "";
            }
            if(district === undefined || district == null) {
                district = "";
            }
            var areacode = getCityCodeByName(province, city, district);
            if (areacode != null) {
                texts.push("电话区号：" + areacode);
            }
            var postcode = getZipCodeByName(province, city, district);
            if (postcode != null) {
                texts.push("邮编：" + postcode);
            }
            try {
                var xStr = _content['point']['x'];
                var yStr = _content['point']['y'];
                var x = parseFloat(xStr);
                var y = parseFloat(yStr);
                var posStr = (Math.round(x * 100) / 100).toString() + ", " + (Math.round(y * 100) / 100).toString();
                texts.push("位置估计：" + posStr);
                createDistMapElement(province, city, district, "固定IP", texts, false);
            } catch (coordExp) {
                createDistMapElement(province, city, district, "固定IP", texts, true);
            }
            // getShape(province, city, district, "ip", ip);
        }, error: function (err_data) {
            console.log(err_data);
        }
    });
}

function createDistMapElement_local(province, city, district, type, texts, addCoord) {
    $.ajax({
        url: 'getShape.action?province=' + province + '&city=' + city + '&district=' + district,
        type: 'get',
        dataType: 'json',
        success: function (shp_data) {
            var shape = shp_data['shape'];
            var polygon = createNewPolygon(shape, "string");
            var type_map = {
                "邮政编码": "post_overlays",
                "固定电话": "phone_overlays",
                "固定IP": "ip_overlays"
            };
            var overlay_type = type_map[type];
            var list = posadd[overlay_type];
            var extData = {
                "name": type,
                "winwidth": 200,
                "texts": texts,
                "maxTexts": 1000,
                "id": generateUUID()
            };
            // posadd.city_polygons[city] = polygon;
            addOverlayAndInfowin(polygon, extData, null, list);
            gotoPolyOverlay(polygon, 8);
            // setResultItems([polygon], "distresults", "city_polygons", true);
            setResultItems([polygon], "distresults", overlay_type, true);
        }, error: function (err) {
            console.log(err);
        }
    });
}

function createDistMapElement(province, city, district, type, texts, addCoord) {
    var dist_name = province + city + district;
    var bdary = new BMap.Boundary();
    bdary.get(dist_name, function (rs) {       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count > 0) {
            var type_map = {
                "邮政编码": "post_overlays",
                "固定电话": "phone_overlays",
                "固定IP": "ip_overlays"
            };
            var overlay_type = type_map[type];
            var list = posadd[overlay_type];
            var extData = {
                "name": type,
                "winwidth": 200,
                "texts": texts,
                "maxTexts": 1000,
                "id": generateUUID()
            };
            for(var i = 0; i < count; i++) {
                var polygon = new BMap.Polygon(rs.boundaries[i], overlay_styles.newPolygonStyle);
                polygon = createNewPolygon(polygon, "polygon");
                // posadd.city_polygons[city] = polygon;
                if(i == 0) {
                    if(addCoord == true || addCoord == 1) {
                        try {
                            var center = polygon.getBounds().getCenter();
                            var x = center.lng;
                            var y = center.lat;
                            var posStr = (Math.round(x * 100) / 100).toString() + ", " + (Math.round(y * 100) / 100).toString();
                            texts.push("位置估计：" + posStr);
                        } catch (centerExp) {}
                    }
                    addOverlayAndInfowin(polygon, extData, null, list);
                    gotoPolyOverlay(polygon, 8);
                    // setResultItems([polygon], "distresults", "city_polygons", true);
                    setResultItems([polygon], "distresults", overlay_type, true);
                } else {
                    addOverlayAndInfowin(polygon, extData, null, null);
                }
            }

        } else {
            createDistMapElement_local(province, city, district, type, texts, addCoord);
        }
        // else if(count > 1) {
        //     createDistMapElement_local(province, city, district, type, texts);
        // }
    });
}


function getZipCodeByName(province, city, district) {
    var obj = getDistObjByName(province, city, district);
    if(obj != null) {
        if(obj["ZipCode"] != undefined) {
            return obj["ZipCode"];
        }
    }
    return null;
}

function getCityCodeByName(province, city, district) {
    var obj = getDistObjByName(province, city, district);
    if(obj != null) {
        if(obj["CityCode"] != undefined) {
            return obj["CityCode"];
        }
    }
    return null;
}

function getDistObjByName(province, city, district) {
    var conts = [];
    if(province != undefined && province != null && province != "") {
        var pro = province.substring(0, 2);
        conts.push(pro);
    }
    if(city != undefined && city != null && city != "") {
        var ci = city.replace("自治州", "").replace("自治县", "");
        conts.push(ci);
    }
    if(district != undefined && district != null && district != "") {
        var dist = district.replace("自治州", "").replace("自治县", "");
        conts.push(dist);
    }
    for (var key in china_dists) {
        var obj = china_dists[key];
        var merge_name = obj["MergerName"];
        var flag = true;
        for(var j = 0; j < conts.length; j++) {
            var cont = conts[j];
            if(merge_name.indexOf(cont) < 0) {
                flag = false;
                break;
            }
        }
        if(flag) {
            return obj;
        }
    }
    return null;

}

function getDistObjByPostCode(postcode) {
    for (var key in china_dists) {
        var obj = china_dists[key];
        var obj_post = obj["ZipCode"];
        if(obj_post == postcode) {
            return obj;
        }
    }
    var postNum = parseInt(postcode);
    if(postNum <= 0) {
        return null;
    }
    var tens = 10;
    while(postNum % tens == 0) {
        tens = tens * 10;
    }
    var superNum = Math.floor(postNum / tens) * tens;
    if(superNum > 0) {
        var superPost = superNum.toString();
        return getDistObjByPostCode(superPost);
    }
}

