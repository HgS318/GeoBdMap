
var relpos = {
    restart: "",
    text: "",
    more: false,
    relMarkerIcon: new BMap.Icon("images/markers/boundmarker_blue.png", new BMap.Size(25 ,37)),
    positions: [],
    relPositions: [],
};

function extract_positions(text) {
    if(text === undefined || text === null || "" === text) {
        text = document.getElementById("extrapostext").value;
    }
    if("" === text) {
        alert("请输入文本...");
    }
    removeExtratOverlays();
    // removeAllOverlays();
    // $("#extraposinfo").html("位置信息提取中。。。");
    console.log("位置信息提取中。。。");
    // var url = 'http://localhost:5050/query_positions?text=' + text;
    var url = 'http://106.12.93.49:5050/query_positions?text=' + text;
    if(relpos.restart != null && "" != relpos.restart) {
        url = url + "&restart=1";
    }
    if(relpos.more == true) {
        url = url + "&more=1";
    }
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        // timeout: 10000,
        //dataType:"jsonp",  //数据格式设置为jsonp
        //jsonp:"callback",  //Jquery生成验证参数的名称
        success: function (re_data) {
            // $("#extraposinfo").html("位置信息提取完成：\n<br/>" + JSON.stringify(re_data));
            console.log(JSON.stringify(re_data));
            var data = re_data['positions'];
            createPositions(re_data['positions']);
            createRelatives(re_data['afters']);
            createRelatives(re_data['befores']);
            if(!$("#relative_checkbox")[0].checked) {
                hideRelatives();
            }
            setRelposResItem();
        },
        error: function (err_data) {
            console.log(err_data);
        }
    });

}

function createPositions(pos_data) {
    if(pos_data == null || pos_data.length < 1) {
        return;
    }
    var flag = true;
    for(var i = 0; i < pos_data.length; i++) {
        var pos = pos_data[i];
        try {
            var name = pos['name'];
            var coords_str = pos['coords'];
            pos['name'] = "地理位置实体";
            var uuid = generateUUID();
            pos['uuid'] = uuid;
            pos['addr'] = name;
            pos['rel'] = 0;
            pos['text'] = "<strong style='color: red'>" + name +
                "</strong><br/>位置估计：" + coords_str.replace(/\[/g, '').replace(/\]/g, '');
            pos['winwidth'] = 220;
            if (coords_str.length < 5) {
                continue;
            }
            var coords = JSON.parse(coords_str);
            if (coords.length == 1) {
                var x = coords[0][0];
                var y = coords[0][1];
                var bp = new BMap.Point(x, y);
                var marker = new BMap.Marker(bp);
                marker.spaType = 1;
                addOverlayAndWin(marker, pos, null, relpos.positions);
                // marker.title = "地理位置实体";
                // setRelposData(marker, pos);
                // addClickHandler(marker, "  &nbsp;&nbsp;" + name);
                // addExtratOverlay(marker);
                if (flag) {
                    map.centerAndZoom(bp, 10);
                    flag = false;
                }
            } else {

            }
        } catch (e) {

        }
    }
}

// function setRelposData(overlay, data) {
//     overlay.name = data.name;
//     data['winwidth'] = 150;
//     overlay.extData = data;
// }

function createRelatives(rel_data) {
    if(rel_data == null || rel_data.length < 1) {
        return;
    }
    for(var i = 0; i < rel_data.length; i++) {
        var pos = rel_data[i];
        try {
            var name = pos['name'];
            var coords_str = pos['coords'];
            pos['name'] = "相对位置";
            var uuid = generateUUID();
            pos['uuid'] = uuid;
            pos['rel'] = 1;
            pos['addr'] = name;
            pos['text'] = "<strong style='color: red'>" + name +
                "</strong><br/>位置估计：" + coords_str.replace(/\[/g, '').replace(/\]/g, '');
            pos['winwidth'] = 220;
            var coords = JSON.parse(coords_str);
            if (coords_str.length < 5) {
                continue;
            }
            if (coords.length == 1) {
                var x = coords[0][0];
                var y = coords[0][1];
                var overlay = null;
                if (pos.hasOwnProperty('buffer') && pos.hasOwnProperty('shape')) {
                    var buffer = pos['buffer'];
                    var shape = pos['shape'];
                    if (shape == 'circle') {
                        var bp = new BMap.Point(x, y);
                        var circle = new BMap.Circle(bp, buffer * 140000, {
                            strokeColor: "blue",
                            strokeWeight: 2,
                            strokeOpacity: 0.5
                        }); //创建圆
                        circle.spaType = 5;
                        overlay = circle;
                        // circle.title = "相对位置";
                        // setRelposData(circle, pos);
                        // addClickHandler(circle, "  &nbsp;&nbsp;" + name);
                        // addExtratOverlay(circle, true);
                    } else if (shape == 'rect') {
                        var polygon = new BMap.Polygon([
                            new BMap.Point(x - buffer, y - buffer),
                            new BMap.Point(x + buffer, y - buffer),
                            new BMap.Point(x + buffer, y + buffer),
                            new BMap.Point(x - buffer, y + buffer),
                            new BMap.Point(x - buffer, y - buffer)
                        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
                        polygon.spaType = 5;
                        overlay = polygon;
                        // polygon.title = "相对位置";
                        // setRelposData(polygon, pos);
                        // addClickHandler("  &nbsp;&nbsp;" + name);
                        // addExtratOverlay(polygon, true);
                    }
                } else {
                    var bp = new BMap.Point(x, y);
                    var marker = new BMap.Marker(bp, {icon: relpos.relMarkerIcon});
                    marker.spaType = 1;
                    overlay = marker;
                    // marker.title = "相对位置";
                    // marker.name = name;
                    //marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                    // setRelposData(marker, pos);
                    // addClickHandler(marker, "  &nbsp;&nbsp;" + name);
                    // addExtratOverlay(marker, true);
                }
                addOverlayAndWin(overlay, pos, null, relpos.relPositions);
            } else {

            }
        } catch (e) {

        }
    }
}

function initRelpos() {
    relpos.restart = getQueryString("restart");
    relpos.text = getQueryString("text");
    document.getElementById("extrapostext").value = relpos.text;
}

function toShowRelatives(checkbox) {
    if(checkbox.checked) {
        showRelatives();
    } else {
        hideRelatives();
    }
}

function relativeMore(checkbox) {
    if(checkbox.checked) {
        relpos.more = true;
    } else {
        relpos.more = false;
    }
}

function showRelatives() {
    for(var i = 0; i < relpos.relPositions.length; i++) {
        relpos.relPositions[i].show();
    }
}

function hideRelatives() {
    for(var i = 0; i < relpos.relPositions.length; i++) {
        relpos.relPositions[i].hide();
    }
}

function addExtratOverlay(overlay, relative) {
    if(relative == true) {
        relpos.relPositions.push(overlay);
    } else{
        relpos.positions.push(overlay);
    }
    map.addOverlay(overlay);
}

function showRelposOverlays() {
    for(var i = 0; i < relpos.positions.length; i++) {
        relpos.positions[i].show();
    }
    showRelatives();
}

function hideRelposOverlays() {
    for(var i = 0; i < relpos.positions.length; i++) {
        relpos.positions[i].hide();
    }
    hideRelatives();
}

function removeExtratOverlays() {
    for(var i = 0; i < relpos.positions.length; i++) {
        relpos.positions[i].hide();
        map.removeOverlay(relpos.positions[i]);
    }
    for(var i = 0; i < relpos.relPositions.length; i++) {
        relpos.relPositions[i].hide();
        map.removeOverlay(relpos.relPositions[i]);
    }
    // positions = [];
    relpos.positions.splice(0, relpos.positions.length);
    relpos.relPositions.splice(0, relpos.relPositions.length);
}

function setRelposResItem() {
    var total_data = relpos.positions.concat(relpos.relPositions);
    setResultItems(total_data, "distresults", "relpos");
    $("#distintotal")[0].innerHTML = "接入信息：" + total_data.length + "条记录";
}
