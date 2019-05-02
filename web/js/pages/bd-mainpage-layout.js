
var k = true, R = false;
var O = '93%', j = '500px', L = '5px';
var G = '93%', J = '500px', K = '5px';

//	获取url参数
function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

function initElements() {

    var curr_time = new Date();
    $("#starttime1").datebox("setValue",myformatter(curr_time));
    $("#endtime1").datebox("setValue",myformatter(curr_time));
    $("#starttime2").datebox("setValue",myformatter(curr_time));
    $("#endtime2").datebox("setValue",myformatter(curr_time));
}


function myformatter(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}

function myparser(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}

//	初始化右键菜单
function setRightMenu() {
	context.init({preventDoubleContext: false});
	context.attach('#mapContainer', test_menu);
	map.addEventListener('rightclick', function(e) {
		var pos = [e.point.lng, e.point.lat];
		mousePos = pos;
	});
}

//	勾选查询范围
function toChooseMapExtent(checkbox) {
	if(checkbox.checked) {
		$("#mapextentdone").show();
		alert('请在地图中勾画需要查询的范围!');
		mouseTool.open();
		// mouseTool.measureArea();

	} else {
		mouseTool.close();
        posadd.mapExtent = null;
		$("#mapextentdone")[0].innerHTML = "范围未定义";
		$("#mapextentdone").hide();
		map.removeOverlay(mouseTool.painting);
	}
}

//	对否要选择所在地区
function toChooseDist(checkbox) {
	if(checkbox.checked) {
		$("#distscheckboxes2").show();
	} else {
		$("#distscheckboxes2").hide();
	}
}

//	对否要选择所在地区
function toChooseDist2(checkbox) {
	if(checkbox.checked) {
		$("#distscheckboxes2").show();
	} else {
		$("#distscheckboxes2").hide();
	}
}

//	是否要选择时态叠加
function toChooseTime1(checkbox) {
	if(checkbox.checked) {
		$("#choosetense1").show();
	} else {
		$("#choosetense1").hide();
	}
}

//	是否要选择共位叠加
function toChooseColo1(checkbox) {
	if(checkbox.checked) {
		$("#chooseColo1").show();
	} else {
		$("#chooseColo1").hide();
	}
}

//	是否要选择时态叠加
function toChooseTime2(checkbox) {
	if(checkbox.checked) {
		$("#choosetense2").show();
	} else {
		$("#choosetense2").hide();
	}
}

//	是否要选择共位叠加
function toChooseColo2(checkbox) {
	if(checkbox.checked) {
		$("#chooseColo2").show();
	} else {
		$("#chooseColo2").hide();
	}
}

//	获取当前时间的标准格式
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var h = date.getHours();
	if(h < 9) {
		h = "0" + h;
	}
	var m = date.getMinutes();
	if(m < 9) {
		m = "0" + m;
	}
	var s = date.getSeconds();
	if(s < 9) {
		s = "0" + s;
	}
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + h + seperator2 + m + seperator2 + s;
	return currentdate;
}

// 最简单数组去重法
function unique1(array){
	var n = []; //一个新的临时数组
	//遍历当前数组
	for(var i = 0; i < array.length; i++){
		//如果当前数组的第i已经保存进了临时数组，那么跳过，否则把当前项push到临时数组里面
		if (n.indexOf(array[i]) == -1) {
			n.push(array[i]);
		}
	}
	return n;
}

//	右侧显示汇总结果
function toResStat() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", "检索汇总");
}

//	右侧显示地名结果
function toInfoRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", 1);
}

//	右侧显示政区结果
function toPosaddRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", 2);
}

//	右侧显示行政界线结果
function toEntityRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", 3);
}

//	右侧显示界桩结果
function toMassPointRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", 4);
}

//	简单查询（当前用随机结果代替）
function doSimpleSearch(value, name){
	// alert('You input: ' + value+'('+name+')');
	var range;
	if(name == "allsimplesearch") {
		range = "所有要素";
		$("#geonamecheckbox")[0].checked = true;
		$("#distcheckbox")[0].checked = true;
		$("#boundcheckbox")[0].checked = true;
		$("#boundmarkercheckbox")[0].checked = true;
	} else {
		$("#geonamecheckbox")[0].checked = false;
		$("#distcheckbox")[0].checked = false;
		$("#boundcheckbox")[0].checked = false;
		$("#boundmarkercheckbox")[0].checked = false;
		if(name == "placesimplesearch") {
			range = "地点";
			$("#geonamecheckbox")[0].checked = true;
		} else if(name == "distsimplesearch") {
			range = "区域";
			$("#distcheckbox")[0].checked = true;
		} else if(name == "boundsimplesearch") {
			range = "路线";
			$("#boundcheckbox")[0].checked = true;
		} else if(name == "bmsimplesearch") {
			range = "事件";
			$("#boundmarkercheckbox")[0].checked = true;
		}
	}
	var keyword = (value && ""!=value) ? value : "随机查询";
	var info = "查询方式：简单查询<br/>查询范围：" + range + "<br/>关键词：" + keyword +
		"<br/>查询时间:" + getNowFormatDate() +"<br/>";
	randomResults(info);

}

//	高级查询（当前用随机结果代替）
function doHighSearch() {
	var range = "";
	if($("#geonamecheckbox")[0].checked) {
		range += "地名 ";
	}
	if($("#distcheckbox")[0].checked) {
		range += "行政区 ";
	}
	if($("#boundcheckbox")[0].checked) {
		range += "行政界线 ";
	}
	if($("#boundmarkercheckbox")[0].checked) {
		range += "界桩界碑 ";
	}
	var info = "查询方式：高级查询<br/>查询范围：" + range + "<br/>地图范围：待完善<br/>所在地区：待完善<br/>时间范围：待完善<br/>" + "查询开始时间:" + getNowFormatDate() +"<br/>";
	// randomResults(info);

	//	查询示例  （2018.1.3）
	var geonameword = $("#geonameword")[0].value;
	$.ajax({
		url: 'tempHighSearch.action?geonameword=' + geonameword,
		type: 'get',
		dataType: 'json',
		success: function (place_data) {
			if($("#geonamecheckbox")[0].checked) {
				places = place_data;
			}
			// showGeonames(place_data);
			setResultItems(places, "placeresults", "geoname");
		},
		error: function (data) {
			places = data;
		},
	})
}


//	显示随机结果
function randomResults(info) {

	$.ajax({
		url: 'searchPrepare.action?searchinfo=' + info,
		type: 'get',
		dataType: 'text',
		success: function (data) {
			if("ok" != data) {
				return;
			}
			var places = "{}";
			var dists = "{}";
			var bounds = "{}";
			var bms = "{}";

			var randomurl = 'randomPlacesResults.action?id=0';
			if($("#geonamecheckbox")[0].checked) {
				randomurl += "&need=need";
			}
			if(admin) {
				randomurl += "&admin=admin";
			}
			var disturl = 'randomDistsResults.action';
			if($("#distcheckbox")[0].checked) {
				disturl += "?need=need";
			}
			var boundurl = 'randomBoundsResults.action';
			if($("#boundcheckbox")[0].checked) {
				boundurl += "?need=need";
			}
			var bmurl = 'randomBoundMarkersResults.action';
			if($("#boundmarkercheckbox")[0].checked) {
				bmurl += "?need=need";
			}

			$.when(
				$.ajax({
					url: randomurl,
					type: 'get',
					dataType: 'json',
					success: function (place_data) {
						if($("#geonamecheckbox")[0].checked) {
							places = place_data;
						}
						// showGeonames(place_data);
						setResultItems(places, "placeresults", "geoname");
					},
					error: function (place_data) {
						setResultItems(places, "placeresults", "geoname");
					}
				}), $.ajax({
					url: disturl,
					type: 'get',
					dataType: 'json',
					success: function (dist_data) {
						dists = dist_data;
						setResultItems(dists, "distresults", "dist");
					},
					error: function (dist_data) {
						setResultItems(dists, "distresults", "dist");
					}
				}), $.ajax({
					url: boundurl,
					type: 'get',
					dataType: 'json',
					success: function (bound_data) {
						bounds = bound_data;
						setResultItems(bounds, "boundresults", "bound");
					},
					error: function (bound_data) {
						setResultItems(bounds, "boundresults", "bound");
					}
				}), $.ajax({
					url: bmurl,
					type: 'get',
					dataType: 'json',
					success: function (bm_data) {
						bms = bm_data;
						setResultItems(bms, "boundmarkrsresults", "boundmarker");
					},
					error: function (bm_data) {
						setResultItems(bms, "boundmarkrsresults", "boundmarker");
					}
				})
			).done(function() {
				showOverlays(places, dists, bounds, bms);
				$("#eastTabsDiv").tabs("select", "信息列表");
				$("#resultsdiv").accordion("select", "地名");
			});

		}, error: function (data) {
			return;
		}
	});

}

//	打开搜索结果页面
function openResultWindow() {
	var basicinfo = encodeURI("    " + $("#placeintotal")[0].innerText + "<br/>" +
		"    " + $("#distintotal")[0].innerText + "<br/>" +
		"    " + $("#boundintotal")[0].innerText + "<br/>" +
		"    " + $("#bmintotal")[0].innerText + "<br/>");
	// document.cookie = "basicinfo="+basicinfo;
	window.open("download/examplepage/easyui/basic.html");
}

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

//	地图前往某一覆盖物
function gotoOverlay(type, id) {
	var overlay, center;
	var zom = 11;
	if (type == "dist") {
		overlay = findOverlay(distPolygons, id);
		center = overlay.getBounds().getCenter();
	} else if (type == "bound") {
		overlay = findOverlay(boundPolylines, id);
		center = overlay.getBounds().getCenter();
	} else if (type == "bm") {
		overlay = findOverlay(boundMarkers, id);
		center = overlay.getPosition();
	} else if (type == "entity") {
		overlay = findOverlay(geoEntities, id);
		openInfoWin({target: overlay}, null, null, 225);
		return;
	} else if (type == "geoinfo") {
		overlay = findOverlay(geoInfos, id);
		openInfoWin({target: overlay}, null, null, 220);
		return;
	} else if (type == "relpos") {
		overlay = findOverlay(relpos.positions.concat(relpos.relPositions), id);
		openInfoWin({target: overlay});
		return;
	} else if (type == "baiduSearch") {
		var title = posadd.baiduSearch[id]['title'];
		var url = posadd.baiduSearch[id]['url'];
		var local = posadd.baiduSearch[id]['local'];
		var src = id;
		if(local === undefined || local == null || local == '') {
			if(url != undefined && url != null && url != '') {
				src = url;
			}
		} else {
			src = local;
		}
		openContentWindow(src, title, 650, 500, 30, 280);
		return;
	} else {
		overlay = findOverlay(showingMarkers, id);
		center = overlay.extData.spaType == 1 ? overlay.getPosition() : overlay.getBounds().getCenter();
		zom = 16;
	}
	overlay.show();
	map.setZoom(zom);
	map.panTo(center);
	if (type == "geoname") {
		openInfoWindow({target: overlay});
	} else {
		openSimpleInfoWindow({target: overlay, 'lnglat': center});
	}

}

//  在覆盖物数组中根据id查询某一覆盖物
function findOverlay(overlays, id) {
	for(var i = 0; i < overlays.length; i++) {
		var ov = overlays[i];
		if(id == ov.extData['id'] || id == ov.extData['Id'] || id == ov.extData['geid']|| id == ov.extData['uuid']) {
			return ov;
		}
	}
	try{
		var ov = overlays[id];
		if(ov === undefined) {
			return null;
		}
		return ov;
	} catch (e) {
		return null;
	}
}

//  在覆盖物数组中根据id查询某一覆盖物
function findOverlayByName(overlays, name, field) {
	if(field === undefined || field == null || field == "") {
		field = "name";
	}
	for(var i = 0; i < overlays.length; i++) {
		var ov = overlays[i];
		if(name == ov.extData[field]) {
			return ov;
		}
	}
	try{
		var ov = overlays[name];
		if(ov === undefined) {
			return null;
		}
		return ov;
	} catch (e) {
		return null;
	}
}

//	在右边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname, clas, append) {

	var parentDiv = document.getElementById(divname);
	parentDiv.style.display = "block";
	var num = 0;
	if (!muldata || "" == muldata || "{}" == muldata || !muldata.length || muldata.length < 1) {
		parentDiv.innerHTML = "";
	} else {
		num = muldata.length;
		var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
		for (var i = 0; i < muldata.length; i++) {
			var data = muldata[i];
			if (!data['g1m']) {
				data = data.extData;
			}
			var str;
			if (clas) {
				if (clas == "geoname") {
					str = consPlaceResult(data, i + 1);
				} else if (clas == "dist") {
					str = consDistResult(data, i + 1);
				} else if (clas == "bound") {
					str = consBoundResult(data, i + 1);
				} else if (clas == "boundmarker") {
					str = consBoundMarkerResult(data, i + 1);
				} else if (clas == "entity") {
					str = consGeoEntityResult(data, i + 1);
				} else if (clas == "geoinfo") {
					str = consGeoInfoResult(data);
				} else if (clas == "relpos") {
					str = consRelposResult(data, i + 1);
				}
			} else {
				str = consPlaceResult(data, i + 1);
			}
			midstr += str;
		}
		var totalstr = null;
		if(append === undefined || append == false || append == '' || append == 0) {
			totalstr = prestr + midstr + endstr;
		} else if(append == true || append == 'append' || append == 1) {
			var oldHtml = parentDiv.innerHTML.replace(prestr, '');
			var divIndex = oldHtml.lastIndexOf(endstr);
			if(divIndex > 0) {
				oldHtml = oldHtml.substring(0, divIndex);
			}
			totalstr = prestr + midstr + oldHtml + endstr;
		}
		parentDiv.innerHTML = totalstr;
		// document.getElementById("distinfo").style.display = "none";
	}
}

//	在左边结果栏显示若干条结果，items为html
function setResultsInDiv(items, divname) {
	var parentdiv = document.getElementById(divname);
	parentdiv.style.display="block";
	var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
	for(var i = 0; i < items.length; i++) {
		midstr += items[i];
	}
	var totalstr = prestr + midstr + endstr;
	parentdiv.innerHTML = totalstr;
}

//	产生右边结果栏的一条数据——名称，位置，起点/终点，最左序号，下方详情
function consResultItem(clas, name, id, type, order, content){
	var str = "<div class='list-group-item'" +"onclick=\"gotoOverlay('"+ clas + "', '" + id + "')\"" +
		"><div class='SearchResult_item_left' " + "><p><strong>" + order +
		"</strong></p></div><div class='SearchResult_item_content'>" + "<p><font color='#0B73EB'>" + name +
		"</font><span class='wikiTag'>" + type + "</span></p><p>" + content + "</p></div></div>";
	return str;
}

function consGeoInfoResult(info) {
	var content = '信息编号：' + info['infoId'];
	var text = info['text'];
	var texts = info['texts'];
	if(text != null && text != undefined && text.length > 0) {
		content = text;
		if(content.length > 36) {
			content = content.substring(0, 34) + '...';
		}
	} else if(texts != null && texts != undefined && texts.length > 0) {
		content = texts[0];
		if(content.length > 36) {
			content = content.substring(0, 34) + '...';
		}
	}
	return consResultItem("geoinfo" ,info['name'], info['infoId'], '位置信息', info['infoId'], content);
}

function consGeoEntityResult(entity, order) {
	var content = '实体编号：' + entity['geid'];
	// var texts = entity['texts'];
	// if(texts != null && texts != undefined && texts.length > 0) {
	// 	content = texts[0];
	// 	if(content.length > 36) {
	// 		content = content.substring(0, 34) + '...';
	// 	}
	// }
	var infoIds = entity['infoIds'];
	if(infoIds != null && infoIds != undefined && infoIds.length > 0) {
		content = '原信息编号：' + entity['infoIds'];
	}
	return consResultItem("entity" ,entity['name'], entity['id'], '地理位置实体', order, content);
}

function consRelposResult(pos, order) {
	var type = pos['rel'] == 0 ? '位置实体': '相对位置';
	var content = pos['coords'].replace(/\[/g, '').replace(/\]/g, '');
	var name = pos['addr'];
	if(name === undefined || name == null || name == "") {
		name = pos['name'];
	}
	return consResultItem("relpos", name, pos['uuid'], type, order, content);
}

//	产生右边结果栏的一条信息数据
function consPlaceResult(place, order) {
	return consResultItem("geoname" ,place.name, place.id, place['小类'], order,
		"区域代码：" + place.dist);
	// return consResultItem_old(place.name, place.position, place['小类'], order, "地域代码：" + place.dist);
}
//	产生右边结果栏的一条行政区域数据
function consDistResult(dist, order) {
	return consResultItem("dist" ,dist.name, dist.id, dist['Grade'], order,
		"区域代码：" + dist.id + "&nbsp;&nbsp;&nbsp;所属地域:" + dist['上级行政区']);
}
//	产生右边结果栏的一条行政界线数据
function consBoundResult(bound, order) {
	return consResultItem("bound" ,bound.name, bound.Id, bound['Grade'], order,
		"相关地域：" + bound.LeftName + ", " + bound.RightName);
}
//	产生右边结果栏的一条界桩数据
function consBoundMarkerResult(bm, order) {
	return consResultItem("bm" ,bm.name, bm.Id, bm['TypeName'], order,
		"相关地域：" + bm.relatedDists);
}
