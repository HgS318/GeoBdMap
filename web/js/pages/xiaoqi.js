
// var index = 0;//循环时的常量
// var myGeo = new BMap.Geocoder();//一个实例
// var adds = [];
// var wuqiyi=[];//无歧义地名+经纬度的字符串
// var arrTitle=[];//无歧义地名
// var arrLatL=[];//无歧义经纬度数组（字符串）
// var points3=[];//上面数组转换成百度的标准格式，但还需要提取才可以使用
// var points1=[];//从points3提取两个点
// var points1title=[];//上面数组的地名，主要用于标签
// var qiyi=[];//歧义地名
// var localsearchtitle = [];//歧义地名的所有名称
// var points2=[];//歧义地名的经纬度
// //以下是可视化要用的图标
// var label1 = new BMap.Label(points1[0],{offset:new BMap.Size(20,-10)});
// var label2 = new BMap.Label(points1[1],{offset:new BMap.Size(20,-10)});
// var blueIcon = new BMap.Icon("./images/markers/blue.png",new BMap.Size(60, 60));
// var yellowIcon = new BMap.Icon("./images/markers/yellow.png",new BMap.Size(60, 60));
// var greenIcon = new BMap.Icon("./images/markers/green.png",new BMap.Size(60, 60));
// var finalIcon = new BMap.Icon("./images/markers/brown.png",new BMap.Size(60, 60));
var xiaoqi_text = "早上九点我们来到了武汉大学。朋友先带我参观了一下樱花大道，樱花还在含苞待放，不过这里清新、浪漫而厚重的大学氛围还是十分惬意。随后我们参观了学校的万林艺术博物馆，博物馆造型很有特点，里面也展览了不少书画作品和艺术品。从武汉大学离开后，不知不觉到了中午十二点了，我们去海底捞吃了火锅。海底捞的服务真的很贴心，还送了我们明信片留作纪念。附近有地方上午失火了，有的地方还有些戒严，希望他们一切都好吧。下午两点多我们来到了武汉最具有代表性的著名景点——黄鹤楼。学生证半价，印着黄鹤楼图样的票面还可以免费邮寄。从楼上远眺滚滚长江，搭配着武汉的开阔市景，心情也变得舒畅。";

var xiaoqi = null;

function initXiaoqi() {
    if (xiaoqi != null) {
        hideXiaoqi();
    }
    xiaoqi = {
        index: 0, //循环时的常量
        myGeo: new BMap.Geocoder(), //一个实例
        adds: ["武汉大学", "樱花大道", "万林艺术博物馆", "海底捞", "黄鹤楼"],
        wuqiyi: [],//无歧义地名+经纬度的字符串
        arrTitle: [],//无歧义地名
        arrLatL: [],//无歧义经纬度数组（字符串）
        points3: [],//上面数组转换成百度的标准格式，但还需要提取才可以使用
        points1: [],//从points3提取两个点
        points1title: [],//上面数组的地名，主要用于标签
        qiyi: [],   //歧义地名
        localsearchtitle: [],//歧义地名的所有名称
        points2: [],//歧义地名的经纬度
        // label1: new BMap.Label(xiaoqi.points1[0],{offset:new BMap.Size(20,-10)}),
        // label2: BMap.Label(xiaoqi.points1[1],{offset:new BMap.Size(20,-10)}),
        blueIcon: new BMap.Icon("./images/markers/blue.png", new BMap.Size(60, 60)),
        yellowIcon: new BMap.Icon("./images/markers/yellow.png", new BMap.Size(60, 60)),
        greenIcon: new BMap.Icon("./images/markers/green.png", new BMap.Size(60, 60)),
        finalIcon: new BMap.Icon("./images/markers/brown.png", new BMap.Size(60, 60)),
        points_ppa: [],
        title_ppa: [],
        points_keda: [],
        title_keda: [],
        point_marker: {},
        polygons: []
    };
    openContentWindow('data/syn_data/fires0227/Contents/武大赏樱黄鹤楼-移动.html#text0', "地名消岐文本", 600, 500, 20, 300);
    bdGEO();
    console.log(xiaoqi.wuqiyi);
    getfeiqi();
    document.getElementById("xiaoqiText").value = "   " + xiaoqi_text;
    document.getElementById("test1").value = "  早上, 九点, 春分, 中午十二点, 两个小时, 两点";
    document.getElementById("test2").value = "  武汉大学, 樱花大道, 万林艺术博物馆, 海底捞, 黄鹤楼";
}

function showXiaoqi() {
    for(var i = 0; i < xiaoqi.polygons.length; i++) {
        var polygon = xiaoqi.polygons[i];
        polygon.show();
    }
    for(var i = 0; i < xiaoqi.points1.length; i++) {
        var marker = xiaoqi.points1[i].marker;
        if(marker != undefined && marker != null) {
            marker.show();
        }
    }
    for(var i = 0; i < xiaoqi.points2.length; i++) {
        var marker = xiaoqi.points2[i].marker;
        if(marker != undefined && marker != null) {
            marker.show();
        }
    }
}

function hideXiaoqi() {
    for(var i = 0; i < xiaoqi.polygons.length; i++) {
        var polygon = xiaoqi.polygons[i];
        polygon.hide();
    }
    for(var i = 0; i < xiaoqi.points1.length; i++) {
        var marker = xiaoqi.points1[i].marker;
        if(marker != undefined && marker != null) {
            marker.hide();
        }
    }
    for(var i = 0; i < xiaoqi.points2.length; i++) {
        var marker = xiaoqi.points2[i].marker;
        if(marker != undefined && marker != null) {
            marker.hide();
        }
    }
}

//------------数据准备阶段
//将所有地名转换成无歧义数组
function bdGEO(){
    var add = xiaoqi.adds[xiaoqi.index];
    geocodeSearch(add);
    xiaoqi.index++;
}

function geocodeSearch(add){
    if(xiaoqi.index < xiaoqi.adds.length){
        setTimeout(window.bdGEO, 40);
    }
    xiaoqi.myGeo.getPoint(add, function(point){
        if (point) {
            //document.getElementById("addr_result").innerHTML +=  index + "、" + add + ":" + point.lng + "," + point.lat + "</br>";
            var address = new BMap.Point(point.lng, point.lat);
            //addWuqiyiMarker(address,new BMap.Label(index+":"+add,{offset:new BMap.Size(20,-10)}));
            xiaoqi.wuqiyi.push(add + ":" + point.lng + "," + point.lat);
            //wuqiyi.push(point.lng + "," + point.lat );
        }
    }, "武昌区");
}

//通过延时才能接收到无歧义数组
function getfeiqi() {
    setTimeout(feiqi,1000);
}

//得到points1、points2这两个非常主要的数组
function feiqi() {
    for (var i = 0; i < xiaoqi.wuqiyi.length; i++) {
        xiaoqi.arrTitle.push(xiaoqi.wuqiyi[i].split("\:")[0]);
        xiaoqi.arrLatL.push(xiaoqi.wuqiyi[i].split("\:")[1]);
    }
    for (var j = 0; j < xiaoqi.arrLatL.length; j++) {
        var lng = xiaoqi.arrLatL[j].split("\,")[0];
        var lat = xiaoqi.arrLatL[j].split("\,")[1];
        xiaoqi.points3.push(new BMap.Point(lng, lat));

    }
    xiaoqi.points1[0] = xiaoqi.points3[0];
    xiaoqi.points1[1] = xiaoqi.points3[xiaoqi.points3.length - 1];
    xiaoqi.points1title[0] = xiaoqi.arrTitle[0];
    xiaoqi.points1title[1] = xiaoqi.arrTitle[xiaoqi.arrTitle.length - 1];
    xiaoqi.qiyi = diff(xiaoqi.adds, xiaoqi.arrTitle);

    var options = {
        renderOptions: {map: map, autoViewport: true},
        // onSearchComplete: function (results) {
        //     if (local.getStatus() == BMAP_STATUS_SUCCESS) {
        //         // 判断状态是否正确
        //         for (var i = 0; i < results.getCurrentNumPois(); i++) {
        //             //s.push(results.getPoi(i).title + ", " + results.getPoi(i).point.lng + ","+results.getPoi(i).point.lat);
        //             xiaoqi.localsearchtitle.push(results.getPoi(i).title);
        //             var qiyiPoint = new BMap.Point(results.getPoi(i).point.lng, results.getPoi(i).point.lat);
        //             xiaoqi.points2.push(qiyiPoint);
        //             // addWuqiyiMarker(qiyiPoint, );
        //         }
        //         //document.getElementById("bbr_result").innerHTML =localsearchtitle.join("<br>");
        //     }
        // },
        onMarkersSet: function (pois) {
            for (var i = 0; i < pois.length; i++) {
                var poi = pois[i];
                var marker = poi.marker;
                xiaoqi.localsearchtitle.push(poi.title);
                var qiyiPoint = poi.point;
                xiaoqi.points2.push(qiyiPoint);
                qiyiPoint.marker = marker;
                // xiaoqi.point_marker[qiyiPoint] = marker;
                // marker.setIcon();
            }
        }
    };
    var local = new BMap.LocalSearch(map, options);
    local.search(xiaoqi.qiyi[0]);

    console.log(xiaoqi.arrTitle);
    console.log(xiaoqi.arrLatL);
    console.log(xiaoqi.points3);
    console.log(xiaoqi.points1);
    console.log(xiaoqi.points1title);
    console.log(xiaoqi.qiyi);
    console.log(xiaoqi.localsearchtitle);
    console.log(xiaoqi.points2);

    addWuqiyiMarker(xiaoqi.points1[0], xiaoqi.points1title[0], xiaoqi.blueIcon);
    addWuqiyiMarker(xiaoqi.points1[1], xiaoqi.points1title[1], xiaoqi.blueIcon);

}

function diff(arr1, arr2) {
    var newArr=[] ;
    var arr3 = [];
    for (var i=0;i<arr1.length;i++) {
        if(arr2.indexOf(arr1[i]) === -1)
            arr3.push(arr1[i]);
    }
    var arr4 = [];
    for (var j=0;j<arr2.length;j++) {
        if(arr1.indexOf(arr2[j]) === -1)
            arr4.push(arr2[j]);
    }
    newArr = arr3.concat(arr4);
    return newArr;
}

// 编写自定义函数,创建标注
function addWuqiyiMarker(point, label, icon){
    var marker = new BMap.Marker(point, {icon: icon});
    // marker.setLabel(label);
    // xiaoqi.point_marker[point] = marker;
    point.marker = marker;
    addOverlayAndWin(marker, {'text': '&nbsp;&nbsp;无歧义地名', 'name': label, 'spaType': 1});
    // map.addOverlay(marker);
}

//------------消歧阶段
//PPA的加载
function jia_ellipse(){
    var V_max = 2800;
    var t = 5;
    var ellipse = new BMap.Polygon(add_ellipse(xiaoqi.points1[0], xiaoqi.points1[1], V_max*t),
        {strokeColor:"pink", strokeWeight:2, strokeOpacity:0.5,fillColor:"purple",fillOpacity:0.3});
    xiaoqi.polygons.push(ellipse);
    map.addOverlay(ellipse);
}

//F1、F2:椭圆的两个焦点,Len:到两个焦点的固定长度
function add_ellipse(F1, F2, Len) {
    var point1_lng = (F1.lng + F2.lng) / 2;
    var pointF_lat = (F1.lat + F2.lat) / 2;
    var point1 = new BMap.Point(point1_lng, pointF_lat);//椭圆中心点
    var point_fuzhu = new BMap.Point(F1.lng, F2.lat);//辅助点
    //根据当前位置把长度距离转换成经纬度
    var ellipse_a = Len / 2;
    var ellipse_c = (map.getDistance(F1, F2).toFixed(2)) / 2;
    var ellipse_b = Math.sqrt(ellipse_a * ellipse_a - ellipse_c * ellipse_c);
    var d_lat = Math.abs(F1.lat - F2.lat);
    var d_lng = Math.abs(F1.lng - F2.lng);
    var d_zong = map.getDistance(F1, point_fuzhu).toFixed(2);
    var d_heng = map.getDistance(F2, point_fuzhu).toFixed(2);
    var d_x = d_lat / d_zong;
    var d_y = d_lng / d_heng;
    var A = ellipse_a * d_y;
    var B = ellipse_b * d_x;
    //添加矩形区域
    function bounds() {
        var bounds = map.getBounds(new BMap.Point(point1.lng - A * 2, point1.lat - A * 2), new BMap.Point(point1.lng + A * 2, point1.lat + A * 2));
        var bssw = new BMap.Point(point1.lng - A * 2, point1.lat - A * 2);		//获取西南角的经纬度(左下端点)
        var bsne = new BMap.Point(point1.lng + A * 2, point1.lat + A * 2);		//获取东北角的经纬度(右上端点)
        return {'x1': bssw.lng, 'y1': bssw.lat, 'x2': bsne.lng, 'y2': bsne.lat};
    }

    //添加椭圆
    var XY = bounds();
    console.log(XY);
    var r = 20;//改变r的值可调整多边形的平滑度，r的值越小，多边形越平滑
    var assemble = new Array();
    for (var i = XY.x1; i < XY.x2; i = i + (d_y * r * 2)) {
        for (var j = XY.y2; j > XY.y1; j = j - (d_x * r * 2)) {
            if (map.getDistance(new BMap.Point(i, j), F1).toFixed(2) < Len - map.getDistance(new BMap.Point(i, j), F2).toFixed(2) &&
                map.getDistance(new BMap.Point(i, j), F1).toFixed(2) > (Len - 2 * r) - map.getDistance(new BMap.Point(i, j), F2).toFixed(2)) {
                assemble.push(new BMap.Point(i, j));
            }
            else {
                continue;
            }
        }
    }
    //对数组进行排序
    return assemble.sort(function (P1, P2) {
        if (Math.atan2((P1.lat - point1.lat), (P1.lng - point1.lng)) > Math.atan2((P2.lat - point1.lat), (P2.lng - point1.lng))) return 1;
        else if (Math.atan2((P1.lat - point1.lat), (P1.lng - point1.lng)) < Math.atan2((P2.lat - point1.lat), (P2.lng - point1.lng)))   return -1;
        else return 0;
    });
}

//是否在PPA中
function inTuoYuan() {
    for (var z = 0; z < xiaoqi.points2.length; z++) {
        var t = 5;
        var V = 2800;
        var distance_a = map.getDistance(xiaoqi.points1[0], xiaoqi.points2[z]).toFixed(2);
        var distance_b = map.getDistance(xiaoqi.points1[1], xiaoqi.points2[z]).toFixed(2);
        var distance = Number(distance_a) + Number(distance_b);
        if (distance <= V * t) {//this 4000 need to change
            //alert( points2[z].lng + "," + points2[z].lat + 'In this potienal path area');
            document.getElementById("JingWei_result").value += xiaoqi.points2[z].lng + "," + xiaoqi.points2[z].lat + "\n";
            document.getElementById("diMing_result").value += xiaoqi.localsearchtitle[z] + "\n";
            // xiaoqi.points_ppa.push(new BMap.Point(xiaoqi.points2[z].lng, xiaoqi.points2[z].lat));
            xiaoqi.points_ppa.push(xiaoqi.points2[z]);
            xiaoqi.title_ppa.push(xiaoqi.localsearchtitle[z]);
        }
    }
    for (var i = 0; i < xiaoqi.points_ppa.length; i++) {
        // var marker = new BMap.Marker(xiaoqi.points_ppa[i], {icon: xiaoqi.yellowIcon});
        // map.addOverlay(marker);
        // var marker = xiaoqi.point_marker[xiaoqi.points_ppa[i]];
        var marker = xiaoqi.points_ppa[i].marker;
        marker.setIcon(xiaoqi.yellowIcon);
    }
    console.log(xiaoqi.points_ppa);
    console.log(xiaoqi.title_ppa);
}

//可达域显示
function addke() {
    var V=2800;
    var t=5;
    var tp=3;
    var dis1=V*tp;
    console.log(dis1);
    var dis2=V*(t-tp);
    console.log(dis2);
    var circle1 = new BMap.Circle(xiaoqi.points1[0],dis1,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
    var circle2 = new BMap.Circle(xiaoqi.points1[1],dis2,{strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});
    xiaoqi.polygons.push(circle1);
    xiaoqi.polygons.push(circle2);
    map.addOverlay(circle1);
    map.addOverlay(circle2);
}

//可达域判断
function inKeDaYu() {
    var V = 2800;
    var t = 5;
    var tp = 3;
    var dis1 = V * tp;
    console.log(dis1);
    var dis2 = V * (t - tp);
    console.log(dis2);
    for (var z = 0; z < xiaoqi.points2.length; z++) {
        var distance_a = map.getDistance(xiaoqi.points1[0], xiaoqi.points_ppa[z]);
        var distance_b = map.getDistance(xiaoqi.points1[1], xiaoqi.points_ppa[z]);
        if ((distance_a < dis1) && (distance_b < dis2)) {//this 4000 need to change
            document.getElementById("JingWei_result").value += xiaoqi.points_ppa[z].lng + "," + xiaoqi.points_ppa[z].lat + "\n";
            document.getElementById("diMing_result").value += xiaoqi.title_ppa[z] + "\n";
            // xiaoqi.points_keda.push(new BMap.Point(xiaoqi.points_ppa[z].lng, xiaoqi.points_ppa[z].lat));
            xiaoqi.points_keda.push(xiaoqi.points_ppa[z]);
            xiaoqi.title_keda.push(xiaoqi.title_ppa[z]);
        }
    }
    for (var i = 0; i < xiaoqi.points_keda.length; i++) {
        // var marker = new BMap.Marker(xiaoqi.points_keda[i], {icon: xiaoqi.greenIcon});
        // map.addOverlay(marker);
        // var marker = xiaoqi.point_marker[xiaoqi.points_keda[i]];
        var marker = xiaoqi.points_keda[i].marker;
        marker.setIcon(xiaoqi.greenIcon);
    }
    console.log(xiaoqi.points_keda);
    console.log(xiaoqi.title_keda);
}

function rset(){
    document.getElementById("JingWei_result").value = "";
    document.getElementById("diMing_result").value="";
}

// 概率判断
function gailv() {
    var t = 5;
    var tp = 3;
    var distance_c = map.getDistance(xiaoqi.points1[0], xiaoqi.points1[1]);
    var v = parseFloat(distance_c) / t;
    var dp = v * tp;
    lng_p = (dp * (xiaoqi.points1[1].lng - xiaoqi.points1[0].lng)) / distance_c + xiaoqi.points1[0].lng;
    lat_p = (dp * (xiaoqi.points1[1].lat - xiaoqi.points1[0].lat)) / distance_c + xiaoqi.points1[0].lat;
    var point_p = new BMap.Point(lng_p, lat_p);
    //计算概率总和
    function compare() {
        var s = 0; //概率之和
        for (var i = 0; i < xiaoqi.points_keda.length; i++) {
            var x = 1 / Number(map.getDistance(point_p, xiaoqi.points_keda[i]));
            s = s + x;
        }
        return s;
    }

    var sum = compare();
    console.log(sum);
    //计算单个概率
    function compare_pro() {
        var pro = new Array();//概率数组
        for (var j = 0; j < xiaoqi.points_keda.length; j++) {
            var x_j = 1 / Number(map.getDistance(point_p, xiaoqi.points_keda[j]));
            var p = (x_j / sum);
            pro.push(p);
        }
        return pro.sort(function (Pro1, Pro2) {//概率降序排列
            if (Pro1 < Pro2) return 1;
            else if (Pro1 > Pro2)   return -1;
            else return 0;
        });
    }

    var point_zuizhong = compare_pro();  //排序后的概率数组
    console.log(point_zuizhong);
    var maxPro = point_zuizhong[0];
    var index;
    //查找最大概率对应位置点的索引
    for (var k = 0; k < xiaoqi.points2.length; k++) {
        var x_k = 1 / Number(map.getDistance(point_p, xiaoqi.points_keda[k]));
        var p = (x_k / sum);
        if (p == maxPro) {
            index = k;
            break;
        }
    }
    document.getElementById("JingWei_result").value = xiaoqi.points_keda[index].lng + ","
        + xiaoqi.points_keda[index].lat + "\n";
    document.getElementById("diMing_result").value = xiaoqi.title_keda[index] + "\n";
    // var marker = new BMap.Marker(xiaoqi.points_keda[index], {icon: xiaoqi.finalIcon});
    // map.addOverlay(marker);
    // var marker = xiaoqi.point_marker[xiaoqi.points_keda[index]];
    var marker = xiaoqi.points_keda[index].marker;
    marker.setIcon(xiaoqi.finalIcon);
    marker.show();

}
