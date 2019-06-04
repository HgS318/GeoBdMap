
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
                    if(options.post == 1) {
                        var postcode = getZipCodeByName(province, city, district);
                        if (postcode != null) {
                            extData['texts'].push("邮编：" + postcode);
                        }
                    }
                    if(options.phone == 1) {
                        var areacode = getCityCodeByName(province, city, district);
                        if (areacode != null) {
                            extData['texts'].push("电话区号：" + areacode);
                        }
                    }
                }
            }
        }, error: function (err_data) {
            console.log(err_data);
        }
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

