
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

var realtimeListener = function (e) {
    // var info = e.point.extData['name'];
    // alert(info);
    var _id = e.point.extData['id'];
    var _name = e.point.extData['name'];
    openContentWindow("download/jquery-easyui-1.7.0/demo/datagrid/air_table_page0.html?id="
        + _id + "&name=" + _name, "查看“" + _name + "”站点实时信息",500, 430, 30, 30);
};

function initRealtimeData() {
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
                posadd.realTimeDataInit = true;
            }

//            if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
//                var points = [];  // 添加海量点数据
//                for (var i = 0; i < data.length; i++) {
//                    var this_record = data[i];
//                    var point = new BMap.Point(data[i]["经度"], data[i]["纬度"]);
//                    point.extData = this_record;
//                    points.push(point);
//                }
//                var options = {
//                    size: BMAP_POINT_SIZE_NORMAL,
//                    shape: BMAP_POINT_SHAPE_WATERDROP,
//                    color: '#d340c3'
//                };
//                var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
//                pointCollection.addEventListener('click', function (e) {
////                     alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
//                    var info = JSON.stringify(e.point.extData);
//                    alert(info);
//                });
//                map.addOverlay(pointCollection);  // 添加Overlay
//            } else {
//                alert('浏览器暂不支持本示例');
//            }

        },
        error: function (err_data) {
            console.log(err_data);
        }
    });
}

function showRealtimeData() {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.addEventListener('click', realtimeListener);
        posadd.pointCollection.show();
        return;
    }
}

function hideRealtimeData() {
    if(posadd.pointCollection != null) {
        posadd.pointCollection.removeEventListener('click', realtimeListener);
        posadd.pointCollection.hide();
    }
}

function deleteRealtimeData() {
    hideRealtimeData();
    posadd.pointCollection.clear();
    posadd.pointCollection = null;
    posadd.realTimeDataInit = false;
}
