
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

//	初始化右键菜单
function setRightMenu() {
	context.init({preventDoubleContext: false});
	context.attach('#mapContainer', test_menu);
}

//	生成信息窗体的内容
function constructInfoWindow(title, content, height) {
	var info = document.createElement("div");
	info.className = "info";

	//可以通过下面的方式修改自定义窗体的宽高
	if(height) {
		info.style.width = height + "px";
	} else {
		info.style.width = "300px";
	}
	// info.style.width = "300px";
	// info.style.height = "200px";
	// 定义顶部标题
	var top = document.createElement("div");
	var titleD = document.createElement("div");
	var closeX = document.createElement("img");
	top.className = "info-top";
	titleD.innerHTML = title;
	closeX.src = "images/close2.gif";
	closeX.onclick = closeInfoWindow;
	top.appendChild(titleD);
	top.appendChild(closeX);
	info.appendChild(top);

	// 定义中部内容
	var middle = document.createElement("div");
	middle.className = "info-middle";
	middle.style.backgroundColor = 'white';
	middle.innerHTML = content;
	info.appendChild(middle);

	//	添加下部内容（搜索框）
	// info.appendChild(infoWinDown);

	// 定义底部内容
	var bottom = document.createElement("div");
	bottom.className = "info-bottom";
	bottom.style.position = 'relative';
	bottom.style.top = '0px';
	bottom.style.margin = '0 auto';
	var sharp = document.createElement("img");
	sharp.src = "images/sharp.png";
	bottom.appendChild(sharp);
	info.appendChild(bottom);

	return info;
}

//	生成信息创意下部（搜索框）的内容
function constructInfoDown() {
	//	定义下部内容
	var down = document.createElement("div");
	down.className = "amap-info-combo status-origin";
	down.setAttribute("id", "winbtm");
//			down.setAttribute("style", "background-color: #FFFFFF");
	var downstr = "" +
//			"<div class=\"amap-info-combo status-origin\" id=\"winbtm\">" +
			"<table><tbody>"+
			"<tr class=\"amap-info-tabs\">" +
			"<td class=\"tab\" id=\"findnear\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-around\"></i>在附近找</td>" +
			"<td class=\"tab selected\" id=\"fromhere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-start\"></i>这里出发</td>" +
			"<td class=\"tab\" id=\"tothere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-end\"></i>到这里去</td>" +
			"</tr></tbody>" +
			"</table>" +
			"<table cellpadding=\"0\"><tbody>" +
			"<tr>" +
			"<td class=\"input-label\" id=\"startorend\">终点</td>" +
			"<td>" +
			"<div class=\"keyword-input\"><input class=\"keyword\" type=\"text\" id=\"winsrhword\" /></div>" +
			"</td>" +
			"<td>" +
			"<div class=\"search-button hide\" id=\"poisrhbtn\" onclick=\"srhpoi();\">搜索</div>" +
			"<div class=\"nav-button\" id=\"navsrhdiv\">" +
			"<span class=\"nav-icon nav-drive\" id=\"drivesrhbtn\" onclick=\"srhdrive();\">驾车</span>" +
			"<span class=\"nav-icon nav-bus\" id=\"bussrhbtn\" onclick=\"srhbus();\">公交</span>" +
			"<span class=\"nav-icon nav-walk\" id=\"walksrhbtn\" onclick=\"srhwalk();\">步行</span>" +
			"</div>" +
			"</td>" +
			"</tr></tbody>" +
			"</table>"
//			 + "</div>"
		;
	down.innerHTML = downstr;
	return down;
}

//	打开信息窗体（地名）
function openInfoWindow(e) {
	markerHighlight(e);
	var extData = e.target.getExtData();
	extData["selected"] = true;
	var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['小类'] + '</span>';
	//var title = '华荣正街' + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + '街道' + '</span>';
	var content = [];
	var objdesc = extData['地理实体描述'], showobj = "";
	if(objdesc) {
		showobj = objdesc.replace("<br/>","：  ");
		if(showobj.length > 29) {
			showobj = showobj.substring(0, 27) + "...";
		}
	}
	// showobj = extData['desbrif'];
	// var mean = extData['所在跨行政区'], showmean = indist;

	content.push("<img src='images/contentdemopic.jpg'>"
		+ "<strong>地名含义：</strong>" + extData.brif);
	content.push("<strong>行政区：</strong>" + "<a href='html/placeContent.html?name=" + extData['所在跨行政区'] +
		"' target='_blank'>" + extData['所在跨行政区'] + "</a>");
	// content.push("<p></p>");
	content.push("<strong>使用时间：</strong>" + extData['使用时间']);
	if(admin) {
		content.push("<strong>地理实体描述：</strong>" + showobj +
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			"<a href='html/placeEdit.html?admin=admin&name=" + extData.spell + "' target='_blank'>审核地名</a>");
	} else {
		content.push("<strong>地理实体描述：</strong>" + showobj +
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			"<a href='html/placeContent.html?name=" + extData.spell + "' target='_blank'>详细信息</a>" +
			"&nbsp;&nbsp;&nbsp;&nbsp" +
			"<a href='html/placeEdit.html?name=" + extData.spell + "' target='_blank'>编辑地名</a>");
	}
	closeInfoWindow();
	infoWindow = new AMap.InfoWindow({
		isCustom: true,  //使用自定义窗体
		content: constructInfoWindow(title, content.join("<br>")),
		offset: new AMap.Pixel(14, -47)	//-113, -140
	});
	infoWindow.on('open', function () {
		windata = extData;
	});
	infoWindow.on('close', function () {
		hasAutoCom = false;
		markerUnhighlight(e);
//				var srhdiv = document.getElementById("winbtm");
//				srhdiv.setAttribute("id", "oldwinbtm");
//				srhdiv.innerHTML = " ";
	});
	infoWindow.on('change', function () {

	});

	infoWindow.open(map, extData.position);


}

//	打开信息窗体（行政区、界线、界桩）
function openSimpleInfoWindow(e) {
	overlayHighlight(e);
	var extData = e.target.getExtData();
	var type = extData['overlay'], tpname = type;
	var winheight = 220;
	extData["selected"] = true;
	var content = [];
	if("dist" == type) {
		tpname = "行政区域";
		winheight = 220;
		content.push("<strong>行政等级：</strong>" + extData['Grade']);
		content.push("<strong>上级行政区：</strong>" + extData['上级行政区']);
		var subdist = extData['下级行政区'] ? extData['下级行政区'] : '无';
		content.push("<strong>下级行政区：</strong>" + subdist);
		if(extData['政府驻地']) {
			content.push("<strong>政府驻地：</strong>" + extData['政府驻地']);
			content.push("<strong>总面积：</strong>" + extData['总面积'] +
				"&nbsp;&nbsp;&nbsp;&nbsp;" + "<strong>总人口：</strong>" + extData['总人口']);
			// content.push("<strong>总人口：</strong>" + extData['总人口']);
			content.push("<strong>地理位置：</strong>" + extData['地理位置']);
		}
		content.push("<a href='html/distEdit.html?id=" + extData['id'] +
			"' target='_blank'>行政区域详情</a>" + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			"<a href='html/boundEdit.html?distid=" + extData['id'] +
			"' target='_blank'>新增界线</a>");
	} else if("bound" == type) {
		tpname = "行政界线";
		winheight = 220;
		content.push("<strong>行政等级：</strong>" + extData['Grade']);
		content.push("<strong>相关行政区：</strong>" + extData['LeftName'] + ", " + extData['RightName']);
		content.push("<a href='html/boundEdit.html?id=" + extData['Id'] +
			"' target='_blank'>行政界线详情</a>" + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			"<a href='html/boundMarkerEdit.html?boundid=" + extData['Id'] +
			"&x=" + e.lnglat.lng + "&y="+ e.lnglat.lat +
			"' target='_blank'>新增界桩、界碑</a>"
		);
	} else if("boundmarker" == type) {
		tpname = "界桩";
		winheight = 300;
		content.push("<img src='images/boundmarkereg.jpg'>"
			+ "<strong>行政等级：</strong>" + extData['Grade']);
		// content.push("<p></p>");
		// content.push("<strong>行政等级：</strong>" + extData['Grade']);
		content.push("<strong>相关行政区：</strong>" + extData['relatedDists']);
		content.push("<strong>类型：</strong>" + extData['TypeName']);
		content.push("<a href='html/boundMarkerEdit.html?id=" + extData['Id'] +
			"' target='_blank'>详情</a>");
	}
	var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + tpname + '</span>';
	closeInfoWindow();
	infoWindow = new AMap.InfoWindow({
		isCustom: true,  //使用自定义窗体
		content: constructInfoWindow(title, content.join("<br>"), winheight),
		offset: new AMap.Pixel(14, -47)	//-113, -140
	});
	infoWindow.on('open', function () {
		windata = extData;
	});
	infoWindow.on('close', function () {
		hasAutoCom = false;
		overlayUnhighlight(e);
	});
	infoWindow.on('change', function () {});
	// infoWindow.open(map, extData.position);
	infoWindow.open(map, [e.lnglat.lng, e.lnglat.lat]);
}

//	关闭地图中的信息窗体
function closeInfoWindow() {
	if(infoWindow) {
		infoWindow.close();
		map.clearInfoWindow();
		infoWindow = null;
	}
}

//	设置自动补全
function setAutoComplete() {
	infoWinDown = constructInfoDown();
	document.getElementById("hiddendiv").appendChild(infoWinDown);
	$("#winsrhword").autocomplete(placedata, {
		minChars: 1,
		width: 100,
		matchCase: false,//不区分大小写
//				matchContains: "word",
//				autoFill: true,
		formatItem: function(row, i, max) {
			return row.name;
		},
		formatMatch: function(row, i, max) {
			return row.ChnSpell + row.name;
		},
		formatResult: function(row) {
			return row.name;
		},
		reasultSearch:function(row,v) {//本场数据自定义查询语法 注意这是我自己新加的事件
			//自定义在code或spell中匹配
			if(row.data.ChnSpell.indexOf(v) == 0 || row.data.name.indexOf(v) == 0) {
				return row;
			}
			else {
				return false;
			}
		}
	});
	$("#winsrhword").keydown(function(e) {
		if(e.keyCode != 13){
			return;
		}
		if(!entered) {
			entered = true;
			return;
		}
		var navTxt = $("#startorend")[0].innerText;
		entered = false;
		if(navTxt =="起点" || navTxt =="终点") {
			if(navMethod == "trans") {
				srhbus();
			} else if(navMethod == "drive") {
				srhdrive();
			} else if(navMethod == "walk") {
				srhwalk();
			}
		} else {
			srhpoi();
		}
	});
}

var typeinited = false;	//	所有地名类型是否已初始化完毕

//	初始化所有地名类型和行政区，显示在左边树状列表中
function initTrees(show) {

	$("#searchStart").click(function(){ //检索
		$("#ClassCheckbox").submit();
	});

	//	初始化行政区域
	$('#id_tree_dist').tree({
		lines: true,
		animate: false,
		url: 'wholeDists.action?zg=zg',
		//queryParams: { id: '' },
		formatter: function (node) {
			var s = '<p style=\'color:#0000FF; font-size: 14px; line-height: 15px \'>'
				+ node.name + '(' + node.id + ')' + '</p>';
			if(!distsInited) {
				node['selected'] = false;
				if(admin) {

				} else {
					var polygon = createDistPolygon(node, distPolygons);
				}
			}
			return s;
		},
		onLoadSuccess: function (node, data) {
			distsInited = true;
			if(!admin) {
				showingDists = distPolygons;
			}
			setResultItems(data[0].children, "distresults", "dist");
			if(show) {
				showDists(distPolygons, false);
			}
			if ($('#id_tree_dist').tree('getRoots').length > 0 && k) {
//				V($('#id_tree').tree('getRoots')[0].id);
				k = false;
			}
		},
		onClick: function (node) {
			// V(node.id,1);
			gotoDist(node.id);
		},
		onExpand: function (node) {
			// if ($('#id_tree_dist').tree('getParent', node.target) == null) {
			// 	$.each($('#id_tree_dist').tree('getRoots'), function (name, val) {
			// 		if (val.id != node.id) {
			// 			$('#id_tree_dist').tree('collapseAll', val.target);
			// 		}
			// 	});
			// }
		}
	});

	if(typeinited) {
		return;
	}

	//	初始化地名类型
	$('#id_tree_type').tree({
		lines: true,
		animate: false,
		// url: 'wholeTypes.action',
		url: 'data/placetypes_treedata.json',
		//queryParams: { id: '' },
		formatter: function (node) {
			var s = '<p style=\'color:#0000FF; font-size: 14px; line-height: 15px \'>'
				+ node.name + '</p>';
			return s;
		},
		onLoadSuccess: function () {
			typeinited = true;
			if ($('#id_tree_type').tree('getRoots').length > 0 && k) {
//				V($('#id_tree').tree('getRoots')[0].id);
				k = false;
			}
		},
		onClick: function (node) {
			if(node.name == '全部类型') {
				gotoAllType();
			} else if(node.children) {
				gotoBigType(node.name);
			} else {
				gotoSmallType(node.parent, node.name);
			}
			// V(node.id,1);
		},
		onExpand: function (node) {
			// if ($('#id_tree_type').tree('getParent', node.target) == null) {
			// 	$.each($('#id_tree_type').tree('getRoots'), function (name, val) {
			// 		if (val.id != node.id) {
			// 			$('#id_tree_type').tree('collapseAll', val.target);
			// 		}
			// 	});
			// }
		}
	});

}

function reloadTree() {	//	重新加载树结构
    $('#id_tree_dist').tree('reload');
	$('#id_tree_type').tree('reload');
}; 

//	勾选查询范围
function toChooseMapExtent(checkbox) {
	if(checkbox.checked) {
		$("#mapextentdone").show();
		alert('请在地图中勾画需要查询的范围!');
		mouseTool.polygon();
		mouseTool.measureArea();
	} else {
		mouseTool.close(true);
		$("#mapextentdone")[0].innerHTML = "范围未选择";
		$("#mapextentdone").hide();
	}

}

//	是否要选择行政级别
function toChooseGrade(checkbox) {
	if(checkbox.checked) {
		$("#gradecheckboxes").show();
	} else {
		$("#gradecheckboxes").hide();
	}
}

//	对否要选择所在地区
function toChooseDist(checkbox) {
	if(checkbox.checked) {
		$("#distscheckboxes").show();
	} else {
		$("#distscheckboxes").hide();
	}
}

//	是否要选择时间
function toChooseTime(checkbox) {
	if(checkbox.checked) {
		$("#choosetimeitmes").show();
	} else {
		$("#choosetimeitmes").hide();
	}
}

//	是否要选择地名类型
function toSearchGeonames(checkbox) {
	if (checkbox.checked) {
		$("#geoitems").show();
	} else {
		$("#geoitems").hide();
	}
}

//	是否要搜索行政区域
function toSearchDists(checkbox) {
	if(checkbox.checked) {
		$("#distitems").show();
	} else {
		$("#distitems").hide();
	}
}

//	是否要搜索行政界线
function toSearchBounds(checkbox) {
	if(checkbox.checked) {
		$("#bounditems").show();
	} else {
		$("#bounditems").hide();
	}
}

//	是否要搜索界桩
function toSearchBoundMarkers(checkbox) {
	if(checkbox.checked) {
		$("#boundmarkeritems").show();
	} else {
		$("#boundmarkeritems").hide();
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
		//如果当前数组的第i已经保存进了临时数组，那么跳过，
		//否则把当前项push到临时数组里面
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
function toPlaceRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", "地名");
}

//	右侧显示政区结果
function toDistRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", "行政区");
}

//	右侧显示行政界线结果
function toBoundRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", "行政界线");
}

//	右侧显示界桩结果
function toBmRes() {
	$("#eastTabsDiv").tabs("select", "信息列表");
	$("#resultsdiv").accordion("select", "界桩");
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
			range = "地名";
			$("#geonamecheckbox")[0].checked = true;
		} else if(name == "distsimplesearch") {
			range = "行政区";
			$("#distcheckbox")[0].checked = true;
		} else if(name == "boundsimplesearch") {
			range = "行政界线";
			$("#boundcheckbox")[0].checked = true;
		} else if(name == "bmsimplesearch") {
			range = "界桩、界碑";
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
