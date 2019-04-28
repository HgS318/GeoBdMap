
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
    var city = document.getElementById("relposCity").value;
    removeExtratOverlays();
    // removeAllOverlays();
    // $("#extraposinfo").html("位置信息提取中。。。");
    console.log("位置信息提取中。。。");
    var url = python_service + 'query_positions?text=' + text;
    // var url = 'http://106.12.93.49:5050/query_positions?text=' + text;
    if(relpos.restart != null && "" != relpos.restart) {
        url = url + "&restart=1";
    }
    if(relpos.more == true) {
        url = url + "&more=1";
    }
    if(city != null && city != '' && city != '不设置' && city != '无' && city != '未设置') {
        url = url + '&city=' + city;
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

function createPositions(pos_data, big) {
    if(pos_data == null || pos_data.length < 1) {
        return;
    }
    var flag = true;
    for(var i = 0; i < pos_data.length; i++) {
        var pos = pos_data[i];
        try {
            var name = pos['name'];
            var coords_str = pos['coords'];
            var coords = JSON.parse(coords_str);
            if (coords.length == 1) {
                var x = coords[0][0];
                var y = coords[0][1];
                var x_round = x.toFixed(5);
                var y_round = y.toFixed(5);
                coords_str = x_round.toString() + ', ' + y_round.toString();
            }
            var uuid = generateUUID();
            pos['uuid'] = uuid;
            if(big == "big") {
                pos['rel'] = 0;
                pos['text'] = "位置估计：<strong style='color: red'>" + coords_str + "</strong>";
                pos['winwidth'] = 225;
            } else {
                pos['name'] = "地理位置实体";
                pos['addr'] = name;
                pos['rel'] = 0;
                pos['text'] = "<strong style='color: red'>" + name +
                    "</strong><br/>&nbsp;&nbsp;&nbsp;&nbsp;位置估计：" + coords_str.replace(/\[/g, '').replace(/\]/g, '');
                pos['winwidth'] = 220;
            }
            if (coords_str.length < 5) {
                continue;
            }
            if (coords.length == 1) {
                var x = coords[0][0];
                var y = coords[0][1];
                var conf = pos['confidence'];
                var bp = new BMap.Point(x, y);
                var overlay = null;
                overlay = new BMap.Marker(bp);
                overlay.spaType = 1;
                // if(conf === undefined  || conf == null || conf >=90) {
                //     overlay = new BMap.Marker(bp);
                //     overlay.spaType = 1;
                // } else {
                //     var buffer = getBufferFromConfidence(conf);
                //     var overlay = new BMap.Circle(bp, buffer, {
                //         strokeColor: "blue",
                //         strokeWeight: 2,
                //         strokeOpacity: 0.5
                //     });
                //     overlay.spaType = 5;
                // }
                addOverlayAndWin(overlay, pos, null, relpos.positions);
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

function createRelatives(rel_data, big) {
    if(rel_data == null || rel_data.length < 1) {
        return;
    }
    for(var i = 0; i < rel_data.length; i++) {
        var pos = rel_data[i];
        try {
            var name = pos['name'];
            var coords_str = pos['coords'];
            var coords = JSON.parse(coords_str);
            if (coords.length == 1) {
                var x = coords[0][0];
                var y = coords[0][1];
                var x_round = x.toFixed(5);
                var y_round = y.toFixed(5);
                coords_str = x_round.toString() + ', ' + y_round.toString();
            }
            var uuid = generateUUID();
            pos['uuid'] = uuid;
            if(big == 'big') {
                pos['rel'] = 1;
                pos['text'] = "位置估计：<strong style='color: red'>" + coords_str + "</strong>";
                pos['winwidth'] = 225;
            } else {
                pos['name'] = "相对位置";
                pos['rel'] = 1;
                pos['addr'] = name;
                pos['text'] = "<strong style='color: red'>" + name +
                    "</strong><br/>&nbsp;&nbsp;&nbsp;&nbsp;位置估计：" + coords_str.replace(/\[/g, '').replace(/\]/g, '');
                pos['winwidth'] = 220;
            }
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

function getBufferFromConfidence(confidence) {
    if (confidence == 100) {
        return 20;
    } else if (confidence >= 90) {
        return 50;
    } else if (confidence >= 80) {
        return 100;
    } else if (confidence >= 75) {
        return 200;
    } else if (confidence >= 70) {
        return 300;
    } else if (confidence >= 60) {
        return 500;
    } else if (confidence >= 50) {
        return 1000;
    } else if (confidence >= 40) {
        return 2000;
    } else if (confidence >= 30) {
        return 5000;
    } else if (confidence >= 25) {
        return 8000;
    } else if (confidence >= 20) {
        return 10000;
    }
    return 10000;
}
