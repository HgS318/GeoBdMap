<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/7/23 0023
  Time: 12:11
  To change this template use File | Settings | File Templates.
--%>

<%--<%@ page contentType="text/html;charset=UTF-8" language="java" %>--%>
<%--<html>--%>
    <%--<head>--%>
    <%--<title>$Title$</title>--%>
    <%--</head>--%>
    <%--<body>--%>
    <%--$END$--%>
    <%--</body>--%>

    <%--<head>--%>
    <%--<meta charset="utf-8">--%>
    <%--<meta http-equiv="X-UA-Compatible" content="IE=edge">--%>
    <%--<meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">--%>
    <%--<title>折线、多边形、圆</title>--%>
    <%--<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>--%>
    <%--<script src="http://webapi.amap.com/maps?v=1.3&key=8325164e247e15eea68b59e89200988b"></script>--%>
    <%--<script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>--%>
    <%--</head>--%>
    <%--<body>--%>
    <%--<div id="container"></div>--%>
    <%--<script>--%>
        <%--var map = new AMap.Map('container', {--%>
          <%--resizeEnable: true,--%>
        <%--//      center: [116.397428, 39.90923],--%>
          <%--center: [109.480907, 30.334029],--%>
          <%--zoom: 13--%>
        <%--});--%>
        <%--var lineArr = [--%>
            <%--[116.368904, 39.913423],--%>
            <%--[116.382122, 39.901176],--%>
            <%--[116.387271, 39.912501],--%>
            <%--[116.398258, 39.904600]--%>
        <%--];--%>
        <%--var polyline = new AMap.Polyline({--%>
            <%--path: lineArr,          //设置线覆盖物路径--%>
            <%--strokeColor: "#3366FF", //线颜色--%>
            <%--strokeOpacity: 1,       //线透明度--%>
            <%--strokeWeight: 5,        //线宽--%>
            <%--strokeStyle: "solid",   //线样式--%>
            <%--strokeDasharray: [10, 5] //补充线样式--%>
        <%--});--%>
        <%--polyline.setMap(map);--%>

        <%--var polygonArr = new Array();//多边形覆盖物节点坐标数组--%>
        <%--//    polygonArr.push([116.403322, 39.920255]);--%>
        <%--//    polygonArr.push([116.410703, 39.897555]);--%>
        <%--//    polygonArr.push([116.402292, 39.892353]);--%>
        <%--//    polygonArr.push([116.389846, 39.891365]);--%>
        <%--polygonArr.push([109.480886, 30.334992]);--%>
        <%--polygonArr.push([109.480907, 30.334029]);--%>
        <%--polygonArr.push([109.480457, 30.331213]);--%>
        <%--polygonArr.push([109.481015, 30.32662]);--%>
        <%--var  polygon = new AMap.Polygon({--%>
            <%--path: polygonArr,//设置多边形边界路径--%>
            <%--strokeColor: "#FF33FF", //线颜色--%>
            <%--strokeOpacity: 0.2, //线透明度--%>
            <%--strokeWeight: 3,    //线宽--%>
            <%--fillColor: "#1791fc", //填充色--%>
            <%--fillOpacity: 0.35//填充透明度--%>
        <%--});--%>
        <%--polygon.setMap(map);--%>

        <%--var circle = new AMap.Circle({--%>
            <%--center: new AMap.LngLat("116.403322", "39.920255"),// 圆心位置--%>
            <%--radius: 1000, //半径--%>
            <%--strokeColor: "#F33", //线颜色--%>
            <%--strokeOpacity: 1, //线透明度--%>
            <%--strokeWeight: 3, //线粗细度--%>
            <%--fillColor: "#ee2200", //填充颜色--%>
            <%--fillOpacity: 0.35//填充透明度--%>
        <%--});--%>
        <%--circle.setMap(map);--%>
    <%--</script>--%>
    <%--</body>--%>
<%--</html>--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>自定义右键菜单</title>
    <link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>
    <style>
        .context_menu {
            margin: 2px;
            padding: 2px;
            list-style-type: none;
            position: relative;
            background-color: rgb(255, 255, 255);
            border: 1px solid rgb(175, 175, 175);
            border-radius: 5px;
            box-shadow: rgb(153, 153, 153) 2px 2px 8px;
            white-space: nowrap;
            cursor: pointer;
        }
        .context_menu li {
            text-indent: 0.5em;
            color: blue;
            font-size: 13px;
            font-family: verdana;
            height: 20px;
            line-height: 20px;
            word-break: break-all;
            white-space: nowrap;
        }
        .context_menu li.split_line {
            border-bottom-color: rgb(204, 204, 204);
            border-bottom-style: solid;
            border-bottom-width: 1px;
        }
    </style>
    <script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=8325164e247e15eea68b59e89200988b&plugin=AMap.MouseTool"></script>
    <script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>
</head>
<body>
<div id="container"></div>
<div id="tip">地图上右击鼠标，弹出自定义样式的右键菜单</div>
<script type="text/javascript">
    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    var menu=new ContextMenu(map);
    function ContextMenu(map) {
        var me = this;
        this.mouseTool = new AMap.MouseTool(map); //地图中添加鼠标工具MouseTool插件
        this.contextMenuPositon = null;
        var content = [];
        content.push("<div>");
        content.push("    <ul class='context_menu'>");
        content.push("        <li onclick='menu.zoomMenu(0)'>缩小</li>");
        content.push("        <li class='split_line' onclick='menu.zoomMenu(1)'>放大</li>");
        content.push("        <li class='split_line' onclick='menu.distanceMeasureMenu()'>距离量测</li>");
        content.push("        <li onclick='menu.addMarkerMenu()'>添加标记</li>");
        content.push("    </ul>");
        content.push("</div>");
        this.contextMenu = new AMap.ContextMenu({isCustom: true, content: content.join('')});//通过content自定义右键菜单内容
        //地图绑定鼠标右击事件——弹出右键菜单
        map.on('rightclick', function(e) {
            me.contextMenu.open(map, e.lnglat);
            me.contextMenuPositon = e.lnglat; //右键菜单位置
        });
    }

    ContextMenu.prototype.zoomMenu = function zoomMenu(tag) {//右键菜单缩放地图
        if (tag === 0) {
            map.zoomOut();
        }
        if (tag === 1) {
            map.zoomIn();
        }
        this.contextMenu.close();
    }
    ContextMenu.prototype.distanceMeasureMenu=function () {  //右键菜单距离量测
        this.mouseTool.rule();
        this.contextMenu.close();
    }
    ContextMenu.prototype.addMarkerMenu=function () {  //右键菜单添加Marker标记
        this.mouseTool.close();
        var marker = new AMap.Marker({
            map: map,
            position: this.contextMenuPositon //基点位置
        });
        this.contextMenu.close();
    }
</script>
</body>
</html>