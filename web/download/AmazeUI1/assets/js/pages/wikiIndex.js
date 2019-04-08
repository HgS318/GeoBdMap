
var infoWindow, map, level = 12;
var markers=[]  ;	//	所有点标注
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html

function constructInfoWindow(title, content) {

}

//	打开信息窗体
function openInfoWindow1(data){

}

function closeInfoWindow(){
}

//	在所有地名中按属性查询
function findPlaceByAttr(attr, _name) {
    var pla = null;
    for(var i = 0; i < placedata.length; i++) {
        var testplace = placedata[i];
        if(testplace[attr] == _name) {
            pla = testplace;
            break;
        }
    }
    return pla;
}

//	显示某大类的所有地名
function gotoBigType(bigtype) {
    var tmpdata = [];
    if(!bigtype) {
        tmpdata = placedata;
    }
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        if(data['大类'] == bigtype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        if(bigtype) {
            alert("暂无 " + bigtype + " 相关数据...");
        } else {
            alert("暂无数据...");
        }
    }
}

//	显示某小类的所有地名
function gotoSmallType(bigtype, smalltype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var flag = false;
        if(data['大类'] == bigtype && data['小类'] == smalltype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        alert("暂无 " + bigtype +"-" + smalltype + " 相关数据...");
    }
}

//	显示某地区的所有地名
function gotoDist(dictcode) {

    var tmpdata = [];
    if(!dictcode) {
        tmpdata = placedata;
    }
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var thiscode = data['dist'];
        if (distIn(thiscode, dictcode)) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        if(dictcode) {
            alert("暂无 " + dictcode + " 地区相关数据...");
        } else {
            alert("暂无数据...");
        }
    }
}

//	地图前往某一坐标点
function gotoPlace(posStr, name) {

}

//	地区代码是否位于某地区
function distIn(sub, par) {
    var i = 0;
    for(i = 0; i < sub.length; i++) {
        var c1 = sub.charCodeAt(i), c2 = par.charCodeAt(i);
        if(c1 != c2) {
            break;
        }
    }
    for( ;i < par.length; i++) {
        var c = par.charCodeAt(i);
        if(c != 48) {
            return false;
        }
    }
    return true;
}

function setNewMarkers(newdata){

}

//	在左边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname) {

    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
    for(var i = 0; i < muldata.length; i++) {
        var data = muldata[i];
        var str = consPlaceResult(data, i + 1);
        midstr += str;
    }
    var totalstr = prestr + midstr + endstr;
    parentdiv.innerHTML = totalstr;
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

//	产生左边结果栏的一条数据——名称，位置，起点/终点，最左序号，下方详情
function consResultItem(name, pos, type, order, content){
    var posstr = pos[0] +"," + pos[1];
    str = "<div class='list-group-item'" +"onclick=\"gotoPlace('"+ posstr + "', '" + name + "')\"" +
        "><div class='SearchResult_item_left' " +
        "><p><strong>" + order +
        "</strong></p></div><div class='SearchResult_item_content'>" +
        "<p><font color='#0B73EB'>" + name +
        "</font><span class='wikiTag'>" + type +
        "</span></p><p>" + content + "</p></div></div>";
    return str;
}

function consPlaceResult(place, order) {
    return consResultItem(place.name, place.position, place['小类'], order, "地名代码：" + place['geonamecode']);
}

//	全部行政区域显示在左边栏相应位置
function setDists() {
    var wholetree = document.getElementById("tree1");
    var temp = document.getElementById("folder1");
    var inner1 = "<li class='collapsable'>";
    var inner2 = "</li>";
    var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
        "<a href='#' onclick=\"gotoDist('420527000')\">秭归县</a><ul id='clist'></ul>" + inner2).appendTo("#folder1");
    var branchdom =$('#clist')[0];

    var subDistricts = distdata.children;
    for (var k = 0; k < subDistricts.length; k++) {	//	区县内各街道
        var street = subDistricts[k];
        var streetname = street.name;
        var streetnode = document.createElement("li");
        var streeta = document.createElement("a");
        streeta.setAttribute("href", "#");
        streeta.setAttribute("onclick", "gotoDist('" + street.id + "')");
        var streettext = document.createTextNode(streetname);
        streeta.appendChild(streettext);
        streetnode.appendChild(streeta);
        if(k == subDistricts.length - 1) {
            streetnode.className = "last";
        }
        branchdom.appendChild(streetnode);
    }


    var htm = branches.html();
    wholetree.innerHTML = inner1 + htm + inner2;

    $("#tree1").treeview({
//				add: branches,
//				remove: branches,
        collapsed: true,
        animated: "fast",
        control:"#sidetreecontrol1",
        prerendered: true,
//				persist: "location"
    });
}

//	全部地名类型显示在左边栏相应位置
function setTypes() {
    var wholetree = document.getElementById("tree2");
    var temp = document.getElementById("folder2");
    var inner1 = "<li class='collapsable'>";
    var inner2 = "</li>";
    var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
        "<a href='#' onclick='gotoBigType()'>所有分类</a><ul id='dlist'></ul>" + inner2).appendTo("#folder2");
    var branchdom =$('#dlist')[0];
    var subDistricts = typedata.subclasses;
    for (var i = 0; i < subDistricts.length; i += 1) {	//	省内各城市
        var city = subDistricts[i];
        var cityname = city.name;
        var citynode = document.createElement("li");
        var $cn = $(citynode);
//				if(i == subDistricts.length - 1) {
//					citynode.setAttribute("class", "last");
//				} else {
//					citynode.setAttribute("class", "expandable");
//				}
        citynode.setAttribute("class", "expandable");
        var citydiv = document.createElement("div");
        citydiv.setAttribute("class", "hitarea expandable-hitarea");
        var citya = document.createElement("a");
        citya.setAttribute("href", "#");
//				citya.setAttribute("class", "");
        citya.setAttribute("onclick", "gotoBigType('" + cityname + "')");
        var citytext = document.createTextNode(cityname);
        citya.appendChild(citytext);
        citynode.appendChild(citydiv);
        citynode.appendChild(citya);
        if (!city.subclasses) {
            branchdom.appendChild(citynode);
            continue;
        }
        var streetlist = document.createElement("ul");
        streetlist.setAttribute("style", "display: none;");
        for (var k = 0; k < city.subclasses.length; k++) {	//	区县内各街道
            var street = city.subclasses[k];
            var streetname = street.name;
            var streetnode = document.createElement("li");
            var streeta = document.createElement("a");
            streeta.setAttribute("href", "#");
            streeta.setAttribute("onclick", "gotoSmallType('"+cityname+"', '"+streetname+"')");
            var streettext = document.createTextNode(streetname);
            streeta.appendChild(streettext);
            streetnode.appendChild(streeta);
            if(k == city.subclasses.length - 1) {
                streetnode.className = "last";
            }
            streetlist.appendChild(streetnode);
        }
        citynode.appendChild(streetlist);
        branchdom.appendChild(citynode);
    }
    var htm = branches.html();
    wholetree.innerHTML = inner1 + htm + inner2;

    $("#tree2").treeview({
//				add: branches,
//				remove: branches,
        collapsed: true,
        animated: "fast",
        control:"#sidetreecontrol2",
        prerendered: true,
//				persist: "location"
    });
}


$(function() {

    setDists();
    setTypes();
    setAutoComplete();

});


