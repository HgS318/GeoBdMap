var sequences = [
    // "fuse1.html?seq=0&h1=上确共位叠加&h2=路段与道路&top1=富民路 路段1&top2=富民路 路段2&top3=叠加后的 富民路 路段&page1=html2/BMapFuse02.html?id=1&page2=html2/BMapFuse02.html?id=2&page3=html2/BMapFuse02.html?id=3",
    // "fuse1.html?seq=1&h1=上确共位叠加&h2=小区与建筑&top1=小区信息&top2=小区内的建筑&top3=叠加后的小区信息&page1=html2/BMapFuse04.html?id=1&page2=html2/BMapFuse04.html?id=2&page3=html2/BMapFuse04.html?id=3",
    // "fuse1-tb.html?seq=2&h1=下确共位叠加&h2=空气质量数据&top1=全国2000个站点空气质量数据&top2=北京23个站点空气质量数据&top3=下确共位叠加后11个共同站点数据&page1=html1/ChinaAir0.html&page2=html1/BeijingAir0.html&page3=html1/BeijingMixedAir0.html&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_china00.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_beijing00.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_coincide00.html",
    // "fuse1.html?seq=3&h1=结构共形叠加&h2=示例&top1=东方明珠 信息1&top2=东方明珠 信息2&top3=共形叠加 东方明珠&page1=html4/demo1.html&page2=html4/demo2.html&page3=html4/demo3.html",
    // "fuse1-tb.html?seq=4&h1=串联叠加&h2=轨迹按时间叠加&top1=轨迹1 (15:00-15:30)&top2=轨迹2 (15:30-16:00)&top3=叠加后的轨迹 (15:00-16:00)&page1=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_A_B&page2=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_B_C&page3=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_A_C&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track21.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track22.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track23.html",
    // "fuse1-tb.html?seq=5&h1=并联叠加&h2=空气质量数据并联叠加&top1=北京1日-10日空气质量&top2=全国6日-15日空气质量&top3=叠加后的空气质量 (全国6日-10日)&page1=html1/BeijingAir2.html&page2=html1/ChinaAir2.html&page3=html1/ChinaMixedAir2.html&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_beijing01to10.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_china06to15.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_coincide06to10.html",
    // "../download/mapv/examples/baidu-map-polyline-time1.html?seq=6"
    "fuse1.html?seq=0&h1=上确共位叠加&h2=路段与道路&top1=富民路 路段1&top2=富民路 路段2&top3=叠加后的 富民路 路段&page1=html2/BMapFuse02.html?id=1&page2=html2/BMapFuse02.html?id=2&page3=html2/BMapFuse02.html?id=3",
    "fuse1.html?seq=1&h1=上确共位叠加&h2=小区与建筑&top1=小区信息&top2=小区内的建筑&top3=叠加后的小区信息&page1=html2/BMapFuse04.html?id=1&page2=html2/BMapFuse04.html?id=2&page3=html2/BMapFuse04.html?id=3",
    "fuse1-tb.html?seq=2&h1=下确共位叠加&h2=空气质量数据&top1=全国2000个站点空气质量数据 (81.0KB)&top2=北京23个站点空气质量数据 (1.7KB)&top3=下确共位叠加后11个共同站点数据 (0.8KB)&page1=html1/ChinaAir0.html&page2=html1/BeijingAir0.html&page3=html1/BeijingMixedAir0.html&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_china00.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_beijing00.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_coincide00.html",
    "fuse1.html?seq=3&h1=下确共位叠加&h2=小区与建筑 (非匀质)&h22=非匀质，信息不可融合&top1=小区信息&top2=小区内的建筑&top3=叠加后的小区内建筑（非匀质，信息不可融合）&page1=html2/BMapFuse04.html?id=1&page2=html2/BMapFuse04.html?id=2&page3=html2/BMapFuse04.html?id=2",
    "fuse1.html?seq=4&h1=结构共形叠加&h2=示例&top1=东方明珠 信息1&top2=东方明珠 信息2&top3=共形叠加 东方明珠&page1=html4/demo1.html&page2=html4/demo2.html&page3=html4/demo3.html",
    "fuse1-tb.html?seq=5&h1=串联叠加&h2=轨迹按时间叠加&top1=轨迹1  (15:00-15:30, 23.9 KB)&top2=轨迹2  (15:30-16:00, 23.6 KB)&top3=叠加后的轨迹  (15:00-16:00, 47.5 KB)&page1=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_A_B&page2=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_B_C&page3=../download/mapv/examples/baidu-map-polyline-time2.html?file=bj_A_C&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track21.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track22.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_track23.html",
    "fuse1-tb.html?seq=6&h1=并联叠加&h2=空气质量数据并联叠加&h22=空气质量数据并联叠加（上确共位）&top1=北京1日-10日空气质量  (4.4 KB)&top2=全国6日-15日空气质量  (210 KB)&top3=叠加后的空气质量 (全国6日-10日, 141 KB)&page1=html1/BeijingAir2.html&page2=html1/ChinaAir2.html&page3=html1/ChinaMixedAir2.html&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_beijing01to10.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_china06to15.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_coincide06to10.html",
    "fuse1-tb.html?seq=7&h1=并联叠加&h2=空气质量数据并联叠加&h22=空气质量数据并联叠加（下确共位）&top1=北京1日-10日空气质量  (4.4 KB)&top2=全国6日-15日空气质量  (210 KB)&top3=叠加后的空气质量 (北京6日-10日, 1.2 KB)&page1=html1/BeijingAir2.html&page2=html1/ChinaAir2.html&page3=html1/BeijingMixedAir2.html&tb1=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_beijing01to10.html&tb2=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_china06to15.html&tb3=../download/jquery-easyui-1.7.0/demo/datagrid/basic_air_coincide_bj_06to10.html",
    "../download/mapv/examples/baidu-map-polyline-time1.html?seq=8"
];

function showPageBtns() {
    var seqStr = getQueryString("seq");
    if(seqStr == null || "" == seqStr) {
        return;
    }
    var seq = -1;
    var seqsLen = sequences.length;
    try {
        seq = parseInt(seqStr);
        if(seq < 0 || seq >= seqsLen) {
            return;
        }
    } catch (exp) {
        return;
    }
    if(seq == 0) {
        $("#prePage")[0].style.display = "none";
        $("#nextPage")[0].style.display = "block";
        var nextUrl = sequences[seq + 1];
        $("#nextPage")[0].onclick = function () {
            window.location.href = nextUrl;
        };
    } else if(seq == seqsLen - 1) {
        // $("#prePage")[0].style.display = "block";
        // $("#nextPage")[0].style.display = "none";
    } else {
        $("#prePage")[0].style.display = "block";
        var preUrl = sequences[seq - 1];
        $("#prePage")[0].onclick = function () {
            window.location.href = preUrl;
        };
        $("#nextPage")[0].style.display = "block";
        var nextUrl = sequences[seq + 1];
        $("#nextPage")[0].onclick = function () {
            window.location.href = nextUrl;
        };
    }

}

function hidePageButns() {
    var seqStr = getQueryString("seq");
    if(seqStr == null || "" == seqStr) {
        return;
    }
    var seq = -1;
    var seqsLen = sequences.length;
    try {
        seq = parseInt(seqStr);
        if(seq < 0 || seq >= seqsLen) {
            return;
        }
    } catch (exp) {
        return;
    }
    $("#prePage")[0].style.display = "none";
    $("#nextPage")[0].style.display = "none";
}

