
function toShowRealtimeData(checkbox) {
    if(checkbox.checked) {
        if(posadd.realTimeDataInit) {
            showRealtimeData();
        } else {
            initRealtimeData();
        }

    } else {
        if(posadd.realTimeDataInit) {
            hideRealtimeData();
        } else {
            
        }
    }
}

var realtimeListener = function(e) {
    // var info = e.point.extData['name'];
    // alert(info);
    var _id = e.point.extData['id'];
    var _name = e.point.extData['name'];
    var _city = e.point.extData['city'];
    var wid = getWeatherId(null, _city, null);
    if(wid == null) {
        openContentWindow("download/jquery-easyui-1.7.0/demo/datagrid/air_table_page0.html?id="
            + _id + "&name=" + _name, "查看“" + _name + "”站点实时信息", 500, 430, 30, 30);
    } else {
        openContentWindow("download/jquery-easyui-1.7.0/demo/datagrid/air_table_page1.html?id="
            + _id + "&name=" + _name + "&city=" + wid, "查看“" + _name + "”站点实时信息", 520, 430, 30, 30);
    }
};

var bikesListener = function(e) {
    var extData = e.point.extData;
    var width = 220;
    var title = extData["pname"] + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;&nbsp;公共自行车点</span>';
    var content = "<strong>站台容量</strong>: " + extData["capacity"] + "<br/>" +  "<strong>可停自行车</strong>: " + extData['canstop'] +
        "<br/>" + "<strong>可借自行车</strong>: " + extData['canget'] + "<br/>" + "<strong>地址</strong>: " + extData["address"];
    openInfoWin({'x':extData['bdx'], 'y': extData['bdy'], 'target': {'spaType': -1}}, content, title, width);
};

//  实时空气质量（代）
function initAirQualityRep() {
    $.ajax({
//        url: 'readchina_00.action',
        url: 'data/air/cites_poses.json',
        type: 'get',
        dataType: 'json',
        success: function (dataMap) {
            if (document.createElement('canvas').getContext) {
                posadd.airCites = dataMap;
                var points = [];  // 添加海量点数据
                for(var _key in dataMap) {
                    var _data = dataMap[_key];
                    var point = new BMap.Point(_data["bdx"], _data["bdy"]);
                    point.extData = {
                        "id": _data["id"],
                        "name": _data["name"],
                        "city": _data["city"]
                    };
                    points.push(point);
                }
                var options = {
                    size: BMAP_POINT_SIZE_NORMAL,
                    shape: BMAP_POINT_SHAPE_WATERDROP,
                    color: '#d340c3'
                };
                // var options = {
                //     size: BMAP_POINT_SIZE_NORMAL,
                //     shape: BMAP_POINT_SHAPE_STAR,
                //     color: '#d340c3'
                // };
                var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                pointCollection.addEventListener('click', realtimeListener);
                posadd.pointCollection = pointCollection;
                map.addOverlay(pointCollection);  // 添加Overlay
            }
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

//  实时自行车
function initPublicBikes(cities) {
    var base_url = "data/test/public_bikes_demo_";
    // var base_url = "http://api.k780.com/?app=pbike.state&appkey=40713&sign=b3afd3d892135334df45dd0db8655e3a&format=json&city=";
    if(cities === undefined || cities == null || cities.length < 1) {
        cities = ["zhongshan", "zhuhai"];
        posadd.publicBikes = {};
    }
    var city = cities.pop();
    $.ajax({
        url: base_url + city + ".json",
        // url: base_url + city,
        type: 'get',
        dataType: 'json',
        success: function (_data) {
            if("1" == _data["success"]) {
                for(var _key in _data["result"]) {
                    try {
                        var _info = _data["result"][_key];
                        if ("lng" in _info && "lat" in _info) {
                            var ox = parseFloat(_info["lng"]);
                            var oy = parseFloat(_info["lat"]);
                            // var bdxy = wgs84tobd09(ox, oy);
                            var bdxy = gcj02tobd09(ox, oy);
                            // var bdxy = [ox, oy];
                            _info["bdx"] = bdxy[0];
                            _info["bdy"] = bdxy[1];
                            posadd.publicBikes[_key] = _info;
                        }
                    } catch (exp) {}
                }
            }
            if(cities.length > 0) {
                initPublicBikes(cities);
            } else {
                drawPublicBikes();
            }
            // drawPublicBikes();
        }, error: function (err_data) {
            if(cities.length > 0) {
                initPublicBikes(cities);
            } else {
                drawPublicBikes();
            }
        }
    });
}

//  在地图上标出 posadd.publicBikes
function drawPublicBikes() {
    if (document.createElement('canvas').getContext) {
        var points = [];  // 添加海量点数据
        for (var _key in posadd.publicBikes) {
            var _data = posadd.publicBikes[_key];
            var point = new BMap.Point(_data["bdx"], _data["bdy"]);
            point.extData = _data;
            points.push(point);
        }
        var options = {
            size: BMAP_POINT_SIZE_NORMAL,
            shape: BMAP_POINT_SHAPE_STAR,
            color: '#d340c3'
        };
        // var options = {
        //     size: BMAP_POINT_SIZE_NORMAL,
        //     shape: BMAP_POINT_SHAPE_STAR,
        //     color: '#d340c3'
        // };
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', bikesListener);
        posadd.publicBikesCollection = pointCollection;
        map.addOverlay(pointCollection);  // 添加Overlay
    }
}

function initRealtimeData() {
    initAirQualityRep();
    initPublicBikes();

    posadd.realTimeDataInit = true;
}

function showRealtimeData() {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.addEventListener('click', realtimeListener);
        posadd.pointCollection.show();
    }
    if(posadd.publicBikesCollection != null) {
        posadd.publicBikesCollection.addEventListener('click', bikesListener);
        posadd.publicBikesCollection.show();
    }
}

function hideRealtimeData() {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.removeEventListener('click', realtimeListener);
        posadd.pointCollection.hide();
    }
    if(posadd.publicBikesCollection != null) {
        posadd.publicBikesCollection.removeEventListener('click', bikesListener);
        posadd.publicBikesCollection.hide();
    }
}

function deleteRealtimeData() {
    hideRealtimeData();
    posadd.pointCollection.clear();
    posadd.pointCollection = null;
    posadd.publicBikesCollection.clear();
    posadd.publicBikesCollection = null;
    posadd.realTimeDataInit = false;
}

//`模拟生成一天的气温数组
function createDayTempArray(temp, this_hour, this_max, this_min) {
    var ref_arr = [-3,-3,-4,-5,-5,-5,-6,-5,-3,-1,-2,0,1,2,3,4,4,3,2,1,0,0,-1,-2];
    var ref_max = 4.0, ref_min = -6.0;
    var max = this_max + 0.1, min = this_min - 0.1;
    if(temp > this_max) {
        if(this_hour != 15 && this_hour != 16) {
            max = this_max + 2.0;
        }
    }
    if(temp < this_min) {
        if(this_hour != 6) {
            min = this_min - 2.0;
        }
    }
    var ref_this = ref_arr[this_hour];
    var ref_this_max = ref_max - ref_this, ref_this_min = ref_this - ref_min;
    var ref_to_max = [], ref_to_min = [], ref_to_this = [];
    for(var i = 0; i < 24; i++) {
        ref_to_max.push(ref_max - ref_arr[i]);
        ref_to_min.push(ref_arr[i] - ref_min);
        ref_to_this.push(ref_arr[i] - ref_this);
    }
    var ref_pros = [];
    for(var i = 0; i < 24; i++) {
        var ref_diff = ref_to_this[i];
        if(Math.abs(ref_diff) < 0.0001) {
            ref_pros.push(0.0);
        } else if (ref_diff > 0){
            ref_pros.push(parseFloat(ref_to_max[i]) / ref_this_max);
        } else if(ref_diff < 0) {
            ref_pros.push(-parseFloat(ref_to_min[i]) / ref_this_min);
        }
    }
    var to_max = max - temp, to_min = temp - min;
    var farr = [], iarr = [];
    for(var i = 0; i < 24; i++) {
        var simu_temp = 0.0, ref_pro = ref_pros[i];
        if(Math.abs(ref_pro) < 0.0001) {
            simu_temp = temp;
        } else if (ref_pro > 0){
            simu_temp = temp + to_max * ref_pro;
        } else if(ref_pro < 0) {
            simu_temp = temp + to_min * ref_pro;
        }
        farr.push(simu_temp);
        iarr.push(parseInt(simu_temp));
    }
    return iarr;
}

function showRealtimeTemp(uuid) {
    var geo = findOverlay(geoEntities, uuid);
    if(geo != null) {
        var point = getOnePointOfOverlay(geo);
        if(point != null) {
            var x = point.lng;
            var y = point.lat;
            var coord_str = y.toString() + "," + x.toString();
            var reverse_geocoding_url = "http://api.map.baidu.com/reverse_geocoding/v3/?ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7&output=json&coordtype=wgs84ll&location=";
            $.ajax({
                url: reverse_geocoding_url + coord_str,
                type: 'get',
                dataType: 'json',
                success: function (_data) {
                    if (0 == _data["status"] && "addressComponent" in _data) {
                        try {
                            var city = _data["addressComponent"]["city"];
                            var weatherId = getWeatherId(null, city, null);
                            if (weatherId != null) {

                            } else {
                                alert("服务繁忙，获取实时气温信息失败...");
                            }
                        } catch (exp1) {
                            alert("服务繁忙，获取实时气温信息失败...");
                        }
                    } else {
                        alert("服务繁忙，获取实时气温信息失败...");
                    }
                }, error: function (err_data1) {

                }
            });

        } else {
            alert("服务繁忙，获取实时气温信息失败...");
        }
    } else {
        alert("服务繁忙，获取实时气温信息失败...");
    }
}

