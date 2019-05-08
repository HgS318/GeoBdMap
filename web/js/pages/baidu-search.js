
function openDemoWebWindow() {
    var word = $("#posGeneral")[0].value;
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
            openContentWindow(site, "新闻", 650, 500, 20, 300);
        }, error: function (err) {
            console.log(err);
        }

    });
}

function isDefaultSearch(searchText) {
    var list = [['武汉', '大东门', '火灾'], ['武汉', '火灾', '2月27']];
    for(var i = 0; i < list.length; i++) {
        var words = list[i];
        var flag = true;
        for(var j = 0; j < words.length; j++) {
            var word = words[j];
            if(searchText.indexOf(word) < 0) {
                flag = false;
                break;
            }
        }
        if(flag) {
            return true;
        }
    }
    return false;
}

//	在右边结果栏显示若干条结果，muldata为json
function setBaiduResultItems(searchData, divname) {

    var parentDiv = document.getElementById(divname);
    parentDiv.style.display = "block";
    if (searchData === undefined || searchData == null || "" == searchData || "{}" == searchData ) {
        parentDiv.innerHTML = "";
    } else {
        var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
        var i = 0;
        for(var oUrl in searchData) {
            var title = searchData[oUrl]['title'];
            var url = searchData[oUrl]['url'];
            var name = title;
            if(title.length > 20) {
                name = title.substring(0, 18) + '...';
            }
            var showUrl = oUrl;
            if(url != undefined && url != null && url != '') {
                showUrl = url;
            }
            if(showUrl.length > 31) {
                showUrl = showUrl.substring(0, 28) + '...';
            }
            var itemStr = "<div class='list-group-item'" + "onclick=\"gotoOverlay('baiduSearch', '" + oUrl + "')\"" +
                "><div class='SearchResult_item_left' " +
                "><p><strong>" + (i + 1) +
                "</strong></p></div><div class='SearchResult_item_content'>" +
                "<p><font color='#0B73EB'>" + name +
                "</font></p><p>" + showUrl + "</p></div></div>";
            // var itemStr = consResultItem("baiduSearch", name, oUrl, '搜索结果', i + 1, url);
            midstr += itemStr;
            i++;
        }
        var totalstr = prestr + midstr + endstr;
        parentDiv.innerHTML = totalstr;
    }

}

function getRoadConditions() {
    var url = "getFireTraffics.action";
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        // timeout: 60000,
        success: function (re_data) {
            posadd.road_conditions = re_data;
            for(var i = 0; i < posadd.road_conditions.length; i++) {
                var lineData = posadd.road_conditions[i];
                var polyline = getFigureJson(lineData['shape'], lineData['spaType'], true);
                polyline.setStrokeWeight(4);
                polyline.extData = lineData;
                polyline.hide();
                posadd.traffic_lines.push(polyline);
                map.addOverlay(polyline);
                // polyline.hide();
            }
            $("#trafficDiv")[0].style.display = 'block';
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

function gotoTrafficTime(radio) {
    var timeStr = radio.value;
    try {
        var time = parseInt(timeStr);
        if(time < 0) {
            for(var i = 0; i < posadd.traffic_lines.length; i++) {
                var line = posadd.traffic_lines[i];
                line.hide();
            }
        } else {
            var fieldName = "status" + timeStr;
            for(var i = 0; i < posadd.traffic_lines.length; i++) {
                var line = posadd.traffic_lines[i];
                var condition = line.extData[fieldName];
                var color = "#50D27E";
                switch(condition) {
                    case 0: color = "#50D27E";break;
                    case 1: color = "#50D27E";break;
                    case 2: color = "#FFD046";break;
                    case 3: color = "#E80F0F";break;
                    case 4: color = "#B50000";break;
                    default: color = "#50D27E";
                }
                line.setStrokeColor(color);
                line.show();
            }

        }
    } catch (e) {
        alert("路况数据有误!");
    }

}

function lowerAddClick(radio) {
    if(radio.checked == true) {
        alert('下确共位叠加很可能导致结果为空，请谨慎选择！');
    }
}

function testSearchToMap0(searchAdds) {
    // searchAdds = [{
    //     "images": ["data/syn_data/fires0227/images/11.jpg", "data/syn_data/fires0227/images/111.jpg", "data/syn_data/fires0227/images/1111.jpg"],
    //     "name": "武昌区中山路400号一居民楼4楼",
    //     "position": "114.32392283964214,30.54320062851014",
    //     "text": ["2月27日10时11分，武昌警方接到报警：武昌区中山路400号一居民楼4楼发生起火事件。接警后周边消防、交管等多路警力迅速到场救援处置，10时40分左右处置完毕，现场救出一名受伤群众，已送医院救治。具体原因正在进一步调查。"],
    //     "link": "http://hb.sina.com.cn/news/b/2019-02-27/detail-ihsxncvf8277887.shtml",
    // }];
    var dataJson = searchAdds;
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
        var lineStr = entity['line'];
        if(lineStr != null && lineStr != undefined) {
            var polyline = getFigureJson(lineStr, "line", geoEntities);
            polyline.spaType = 3;
            addOverlayAndInfowin(polyline, entity, content, geoEntities);
        }
        var polygonStr = entity['polygon'];
        if(polygonStr != null && polygonStr != undefined) {
            var polygon = getFigureJson(polygonStr, "polygon");
            polygon.spaType = 5;
            addOverlayAndInfowin(polygon, entity, content, geoEntities);
        }
        var shapes = entity['shapes'];
        if(shapes != null && shapes != undefined && shapes.length > 0) {
            for(var j = 0; j < shapes.length; j++) {
                var shapeJson = shapes[j];
                var spaType = shapeJson['spaType'];
                var shape = shapeJson['shape'];
                var overlay = getFigureByStr(shape, spaType);
                addOverlayAndInfowin(polygon, entity, content, geoEntities);
            }
        }
        if((entity['shapes'] == null || entity['shapes'] == "") && (entity['position'] == null || entity['position'] == "")
            && (entity['line'] == null || entity['line'] == "") && (entity['polygon'] == null || entity['polygon'] == "")
            && entity['name'] != null && entity['name'] != undefined && entity['name'] != "") {
            var name = entity['name'];
            var bdary = new BMap.Boundary();
            bdary.get(name, function(rs){       //获取行政区域
                var count = rs.boundaries.length; //行政区域的点有多少个
                for(var i = 0; i < count; i++){
                    console.log(rs.boundaries[i]);
                    var distPolygon = new BMap.Polygon(rs.boundaries[i]);
                    distPolygon.spaType = 5;
                    addOverlayAndInfowin(distPolygon, entity, content, geoEntities);
                }
            });
            // var distPolygon = getDistBaiduPolygon(entity['name']);
            // distPolygon.spaType = 5;
            // addOverlayAndInfowin(distPolygon, entity, content, geoEntities);
        }
    }
}

function baiduSearch() {
    var word = $("#baiduSearchInput")[0].value;
    if(word == null || word == "") {
        word = "武汉 火灾 2月27日";
        // $("#baiduSearchInput")[0].innerText = word;
    }
    posadd.baiduSeachWord = word;
    var url = python_service + 'baidu_crawl?word=' + word;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        timeout: 60000,
        //dataType:"jsonp",  //数据格式设置为jsonp
        //jsonp:"callback",  //Jquery生成验证参数的名称
        success: function (re_data) {
            var searchText = word;
            if(re_data['status'] != 0) {
                alert('搜索出现错误，请重试');
                return;
            }
            posadd.baiduSearch = re_data['results'];
            $("#trafficDiv")[0].style.display = 'none';
            setBaiduResultItems(posadd.baiduSearch, "bdSearchResults");
            $("#seachAddDiv")[0].style.display = 'block';
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

//  将百度搜索结果中得网页文本位置显示在地图中（按钮调用）
function addSearchToMap() {
    clearBaiduSearchOverlay();
    if(isDefaultSearch(posadd.baiduSeachWord)) {    //  默认搜索结果
        showDeaultBdSearchPoses();
    } else {    //  一般搜索结果，待完成
        showBdSearchPoses();
    }
    console.log("extract website positions done.");
    // showBdSearchPoses();

}

//  显示默认的百度搜索结果中的网页文本位置（武汉 火灾 2月27日）
function showDeaultBdSearchPoses() {
    var url = python_service + "default_search_geos";
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function (re_data) {
            posadd.baiduSearch = re_data;
            var searchPoses = posadd.baiduSearch;
            if(searchPoses  === null || searchPoses == {}) {
                return;
            }
            setTimeout("showOneDefaultPos(0)", 2500);
            toPosaddRes();
            getRoadConditions();
            // if(isDefaultSearch(searchText)) {  //  默认搜索
            // } else {
            // }
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

//  显示一个默认结果的地点（其他地点一段时间后加载）
function showOneDefaultPos(index) {
    simpleTextLen = 32;
    var searchPoses = posadd.baiduSearch;
    createPositions([searchPoses['positions'][index]], 'big');
    // setRelposResItem();
    var length = searchPoses['positions'].length;
    if(index == length - 1) {
        createRelatives(searchPoses['afters'], 'big');
        createRelatives(searchPoses['befores'], 'big');
        // setRelposResItem();
        simpleTextLen = 48;
        return;
    }
    var timeout = Math.random() * 1600;
    setTimeout("showOneDefaultPos(" + (index + 1) + ")", timeout);
    simpleTextLen = 48;
}

//  显示一般的百度搜索结果中的网页文本位置
function showBdSearchPoses() {
    var searches = posadd.baiduSearch;
    if(searches  === null || searches == {}) {
        return;
    }
    toPosaddRes();
    var urls = [];
    for(var _key in searches) {
        var url = searches[_key]['url'];
        urls.push(url);
    }
    posadd.baiduSearchUrls = urls;
    showBaiduSearchPos(0);
}

//  显示一个百度搜索网页中的位置(先调用java提取正文接口，再调用python提取正文接口)
function showBaiduSearchPos(index) {
    var urls = posadd.baiduSearchUrls;
    if(index >= urls.length) {
        return;
    }
    var url = urls[index];
    if(url === undefined || url == null || url == "") {
        showBaiduSearchPos(index + 1);
        return;
    }
    var java_ext_service = "extractContentSimple.action?url=" + url;
    var python_ext_service = python_service + "extract_content?url=" + url;
    $.ajax({
        url: java_ext_service,
        // url: python_ext_service,
        type: 'get',
        dataType: 'text',
        // timeout: 60000,
        success: function (extract) {
            if(extract != null && extract.length > 0) {
                extract_search_positions(extract, url, index);
            } else {
                showBaiduSearchPosByPython(url, index);
                // showBaiduSearchPosByJava(url);
            }
        },
        error: function (err) {
            console.log("java extraxt failed: " + url);
            // showBaiduSearchPosByPython(url, index);
            // console.log("python extraxt failed: " + url);
            // showBaiduSearchPosByJava(url);
        }
    });
    setTimeout("showBaiduSearchPos(" + (index + 1) + ")", 5000);
}

//  显示一个百度搜索网页中的位置(调用python提取正文接口)
function showBaiduSearchPosByJava(url, index) {
    if(url === undefined || url == null || url == "") {
        return;
    }
    var java_ext_service = "extractContentSimple.action?url=" + url;
    $.ajax({
        url: java_ext_service,
        type: 'get',
        dataType: 'text',
        // timeout: 60000,
        success: function (extract) {
            if(extract != null && extract.length > 0) {
                extract_search_positions(extract, url, index);
            }
        },
        error: function (err) {
            console.log("python extraxt failed: " + url);
        }
    });
}

//  显示一个百度搜索网页中的位置(调用python提取正文接口)
function showBaiduSearchPosByPython(url, index) {
    if(url === undefined || url == null || url == "") {
        return;
    }
    var python_ext_service = python_service + "extract_content?url=" + url;
    $.ajax({
        url: python_ext_service,
        type: 'get',
        dataType: 'text',
        // timeout: 60000,
        success: function (extract) {
            if(extract != null && extract.length > 0) {
                extract_search_positions(extract, url, index);
            }
        },
        error: function (err) {
            console.log("python extraxt failed: " + url);
            // showBaiduSearchPos(index + 1);
        }
    });
}

function clearBaiduSearch() {
    clearBaiduSearchOverlay();
    $("#bdSearchResults")[0].innerHTML = "";
    document.getElementById("seachAddDiv").style.display = 'none';
    document.getElementById("trafficDiv").style.display = 'none';
}

function clearBaiduSearchOverlay() {
    removeExtratOverlays();
    setRelposResItem();
}

