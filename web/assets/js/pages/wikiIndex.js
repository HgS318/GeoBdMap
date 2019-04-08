
var infoWindow, map, level = 12;
var markers=[]  ;	//	所有点标注
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html

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

//	在左边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname, startid) {
    if (startid ===undefined || startid == null) {
        startid = 0;
    }

    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group' style='margin-bottom:0px' >", endstr = "</div>", midstr = "";
    for(var i = 0; i < muldata.length; i++) {
        var data = muldata[i].properties;
        var str = consPlaceResult(data, startid + i + 1);
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
function consResultItem(name, fid, shape, type, order, content){
    // var posstr = pos[0] +"," + pos[1];
    // str = "<div class='list-group-item'" +"onclick=\"gotoPlace('"+ posstr + "', '" + name + "')\"" +
    var str = "";
    // if(name.length < )
    var str = "<div class='list-group-item'" +"onclick=\"gotoPlace('"+ fid + "', '" + shape + "')\"" +
        "><div class='SearchResult_item_left' " +
        "><p><strong>" + order +
        "</strong></p></div><div class='SearchResult_item_content'>" +
        "<p><font color='#0B73EB'>&nbsp;" + name +
        "</font><span class='wikiTag'>" + type +
        "</span></p><p>" + content + "</p></div></div>";
    return str;
}

function consPlaceResult(place, order) {
    // return consResultItem(place.name, place.position, place['小类'], order, "地名代码：" + place['geonamecode']);
    return consResultItem(place['name'], place['FID'], place['Shape'], place['type'], order, "地名代码：" + place['placecode']);
}

//	全部行政区域显示在左边栏相应位置
function setDists() {
    var wholetree = document.getElementById("tree1");
    var temp = document.getElementById("folder1");
    var inner1 = "<li class='collapsable'>";
    var inner2 = "</li>";
    var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
        "<a href='#' onclick=\"gotoDist('420527000', '秭归县')\">秭归县</a><ul id='clist'></ul>" + inner2).appendTo("#folder1");
    var branchdom =$('#clist')[0];

    var subDistricts = distdata.children;
    for (var k = 0; k < subDistricts.length; k++) {	//	区县内各街道
        var street = subDistricts[k];
        var streetname = street.name;
        var streetnode = document.createElement("li");
        var streeta = document.createElement("a");
        streeta.setAttribute("href", "#");
        // streeta.setAttribute("onclick", "gotoDist('" + street.id + "')");
        streeta.setAttribute("onclick", "gotoDist('" + street.id + "', '" + streetname +"')");
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
        "<a href='#' onclick='gotoBigType(\"所有分类\");'>所有分类</a><ul id='dlist'></ul>" + inner2).appendTo("#folder2");
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
        citya.setAttribute("onclick", "gotoBigType('" + cityname + "');");
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

//生成分页
function genPaginate(showingPlaces){
    // var totalRecords = 0;
    // var showNum = 5;
    // var pageNo = 1;
    //
    // var pageDiv = $("#hm_Paginate");
    // pageDiv.html('<div id="kkpager"></div>');
    //
    // // 获取搜索总数
    // // totalRecords = getSearchResultCount(dtOpt); 暂时
    // totalRecords=5;
    // var totalPage = Math.ceil(totalRecords/showNum);
    // // 显示第一页的请求
    // showingPlaces.from = pageNo-1;
    // showingPlaces.limit = showNum;
    // (srType != "HMSpaSearch") ? search(showingPlaces) : spaSearch(showingPlaces) ;
    //
    // // 生成分页显示，有些参数是可选的，比如lang，若不传有默认值
    // var cfg = {
    //     pno 				: pageNo,
    //     total 				: totalPage,
    //     totalRecords 		: totalRecords,	//总数据条数
    //     isShowFirstPageBtn	: false, 		//是否显示首页按钮
    //     isShowLastPageBtn	: false, 		//是否显示尾页按钮
    //     isGoPage 			: false,		//是否显示页码跳转输入框
    //     mode 				: 'click',		//默认值是link，可选link或者click
    //     lang : {
    //         prePageText				: '<<',
    //         nextPageText			: '>>',
    //         totalPageBeforeText	: '<br/>&nbsp;&nbsp;共',
    //         totalRecordsAfterText : '条数据'
    //     },
    //     // click : function(n){
    //     //     var key = $("#autocomplete").val();
    //     //     dtOpt.word = key;
    //     //     dtOpt.from = (n-1)*showNum;
    //     //     dtOpt.limit = showNum;
    //     //     if (srType != "HMSpaSearch")
    //     //     {
    //     //         search(dtOpt);
    //     //     }
    //     //     else
    //     //     {
    //     //         var bounds = _map.getBounds();
    //     //         var sw = bounds.getSouthWest();
    //     //         var ne = bounds.getNorthEast();
    //     //         var ltPt = sw.getLng() + ',' + ne.getLat();
    //     //         var rbPt = ne.getLng() + ',' + sw.getLat();
    //     //         dtOpt.lt = ltPt;
    //     //         dtOpt.rb = rbPt;
    //     //         spaSearch(dtOpt) ;
    //     //     }
    //     //
    //     //     cfg.pno = n;
    //     //     this.generPageHtml(cfg,true);
    //     // }
    // };
    // kkpager.generPageHtml(cfg, true);
}

function setmaxheight() {
    var totalheight=$("#hm_sidebar").height();
    // alert(totalheight);
    var finalheight=totalheight*0.95-120;
    var finalheight2=totalheight*0.95-70;


    $("#searchresults").css("max-height", finalheight);
    $("#hm_wikiClass").css("max-height", finalheight2);

}

$(function() {

    setDists();
    setTypes();
    setmaxheight()
    // genPaginate();
});


