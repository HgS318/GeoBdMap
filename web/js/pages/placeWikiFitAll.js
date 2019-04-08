/**
 * Created by Administrator on 2017/7/30 0030.
 */

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

$(function() {

    var placename = getQueryString("name");
    var url;
    if(placename && ""!= placename) {
        url = 'getGeonameByNickname.action?name=' + placename;
    } else {
        var idst = getQueryString("id");
        url = 'getGeonameFullById.action?id=' + idst;
    }

    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            placename = data.nickname;
            consMainContent(data);
            consPicsListContent(placename, data);
        },
        error: function (data) {
        }
    });


});

function consBasicCotent(data, attaname, divname) {
    if(data[attaname]) {
        document.getElementById(divname).innerHTML ="&nbsp;" + data[attaname];
    }
}

function consDetailedContent(data, attaname, divname) {
    if(data[attaname]) {
//			document.getElementById(divname).innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;" + data[attaname];
        var org = data[attaname];
        var str = org.replace(/\<br\/\>/g,"\r\n &nbsp;&nbsp;&nbsp;&nbsp;");
        document.getElementById(divname).innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + str;
    }

}

function consMainContent(data) {

    var name = data['name'];
    document.title = name + " - 地名百科";
    var bc = data['大类'],sc = data['小类'];
    document.getElementById("name0").setAttribute("value", name);
    document.getElementById("doctitle").innerHTML = name;
    document.getElementById("bigclass1").innerHTML = bc;
    document.getElementById("smallclass1").innerHTML = sc;
    document.getElementById("bigclass2").innerHTML = bc;
    document.getElementById("smallclass2").innerHTML = sc;
    document.getElementById("name2").innerHTML = name;
    document.getElementById("smallclass3").innerHTML = sc;

    // consBasicCotent(data, "标准名称","stdname");
    // consBasicCotent(data, "所在跨行政区","indist");
    // consBasicCotent(data, "比例尺","scale");
    // consBasicCotent(data, "图名图号年版","mapname");
    // consBasicCotent(data, "使用时间","usetime");
    // consBasicCotent(data, "普查状态","instate");
    // consBasicCotent(data, "设立年份","setyear");
    // consBasicCotent(data, "废止年份","endyear");
    // consBasicCotent(data, "东经","east");
    // consBasicCotent(data, "至东经","toeast");
    // consBasicCotent(data, "北纬","north");
    // consBasicCotent(data, "至北纬","tonorth");
    // consBasicCotent(data, "坐标系","coo");
    // consBasicCotent(data, "测量方法","method");
    consBasicCotent(data, "标准名称","stdname");
    consBasicCotent(data, "ChnSpell","ChnSpell");
    consBasicCotent(data, "geonamecode","gncode");
    consBasicCotent(data, "所在跨行政区","indist");
    consBasicCotent(data, "比例尺","scale");
    consBasicCotent(data, "图名图号年版","mapname");
    consBasicCotent(data, "使用时间","usetime");
    consBasicCotent(data, "oldname","oldname");
    consBasicCotent(data, "东经","east");
    consBasicCotent(data, "至东经","toeast");
    consBasicCotent(data, "北纬","north");
    consBasicCotent(data, "至北纬","tonorth");

    consDetailedContent(data, "地名含义","hanyi");
    consDetailedContent(data, "地名来历","laili");
    consDetailedContent(data, "历史沿革","yange");
    consDetailedContent(data, "地理实体描述","miaoshu");
    consDetailedContent(data, "资料来源及出处","ziliao");

}

function consPicsListContent(placename, data) {

    var sharp = 7;

    if(data.DXCG) {
        consListContent(placename, ++sharp, "地形图", 455);
    }
    if(data.TSCG) {
        consListContent(placename, ++sharp, "图式图像", 160);
    }
    if(data.SJCG) {
        consListContent(placename, ++sharp, "实景图片", 564);
    }
    if(data.SJQJ) {
        consListContent(placename, ++sharp, "实景全景", 800);
    }
    if(data.SJHR) {
        consListContent(placename, ++sharp, "实景环绕", 700);
    }
    if(data.SJDJ) {
        consListMultiContent(placename, ++sharp, "实景多角度", 700, 2);
    }
    if(data.SJDS) {
        consListMultiContent(placename, ++sharp, "实景多时相", 219, 2);
    }
    if(data.YGCG) {
        consListContent(placename, ++sharp, "遥感图像", 700);
    }
    if(data.YGDS) {
        consListMultiContent(placename, ++sharp, "遥感多时相", 720, 2);
    }
    if(data.LTCG) {
        consListContent(placename, ++sharp, "立体图像", 700);
    }
    if(data.SYCG) {
        consListContent(placename, ++sharp, "示意图像", 700);
    }

}

function consListContent(nickname, sharp, typename, fwitdh) {
    var lis = consListItem(sharp, typename);
    document.getElementById("hidesection").innerHTML += lis;
    var cont = consPicCont(nickname, sharp, typename, fwitdh);
    document.getElementById("details").innerHTML += cont;
}

function consListMultiContent(nickname, sharp, typename, fwitdh, numStr) {
    var lis = consListItem(sharp, typename);
    document.getElementById("hidesection").innerHTML += lis;
    var cont = consMultiPicCont(nickname, sharp, typename, fwitdh, numStr);
    document.getElementById("details").innerHTML += cont;
}

function consListItem(sharp, typename) {
    var str = "<li style=\"display:none\">&#8226; <a href=\"#" + sharp +"\">" + typename + "</a></li>";
    return str;
}

function consPicCont(nickname, sharp, typename, fwitdh) {

    var url1 = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + ".jpg";
    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
    var str3 =	"<div class='content_topp'><p></p><p></p>" + "<div class='img img_l' style='width: " + fwitdh +"px;'>";
    var reg1 = new RegExp("typename","g"); //创建正则RegExp对象
    var reg2 = new RegExp("url1","g"); //创建正则RegExp对象
    var str4tmp = "<a title='typename' href='url1' target='_blank'><img title='typename' alt='typename' src='url1' /></a>";
    var str4tmp1 = str4tmp.replace(reg1, typename);
    var str4 = str4tmp1.replace(reg2, url1);
    var str5 = "<span style='clear: both; display: block; padding-top: 10px; color: rgb(51, 51, 51);'>"
        +typename+"</span></div></div>";

    var recon = str1 + str2 + str3 + str4 + str5;
    return recon;
}

function consMultiPicCont(nickname, sharp, typename, fwitdh, numStr) {

    var str1 = "<h3><span class='texts'>"+ typename + "</span>";
    var str2 =	"<a name='" + sharp + "'></a> <a href='#section'>回目录</a></h3>";
    var str3 =	"<div class='content_topp'><p></p><p></p>";
    var reg1 = new RegExp("typename","g"); //创建正则RegExp对象
    var mul = "";
    var num = parseInt(numStr);
    for(var i = 0; i < num; i++) {
        var url = "../data/wikiContent/place/" + nickname + "/" + nickname + typename + (i+1) + ".jpg";
        var reg = new RegExp("url","g"); //创建正则RegExp对象
        var s1 = "<div class='img img_l' style='width: " + fwitdh +"px;'>";
        var s2tmp = "<a title='typename' href='url' target='_blank'><img title='typename' alt='typename' src='url' /></a>";
        var s2tmp1 = s2tmp.replace(reg1, typename);
        var s2 = s2tmp1.replace(reg, url);
        var s3 = "<span style='clear: both; display: block; padding-top: 10px; color: rgb(51, 51, 51);'>"
            +typename+"</span></div>";
        mul += (s1 + s2 + s3);
    }
    var str5 = "</div>";
    var recon = str1 + str2 + str3 + mul + str5;
    return recon;
}

function partsection(){
    $('#fullsection').css('display','block');
    $('#partsection').css('display','none');
    $("#hidesection > li:gt(3)").css('display','none');
}

function fullsection(){
    $('#fullsection').css('display','none');
    $('#partsection').css('display','block');
    $("#hidesection > li:gt(3)").css('display','block');
}