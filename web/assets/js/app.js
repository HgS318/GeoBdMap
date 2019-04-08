$(function() {

    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
        $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });


    /*var dataType = $('body').attr('data-type');
    for (key in pageData) {
        if (key == dataType) {
            pageData[key]();
        }
    }*/

    $('.tpl-switch').find('.tpl-switch-btn-view').on('click', function() {
        $(this).prev('.tpl-switch-btn').prop("checked", function() {
            if ($(this).is(':checked')) {
                return false
            } else {
                return true
            }
        })
        // console.log('123123123')

    })

    initMap();
})


// 初始化地图
function initMap() {

    // 计算地图的高
    document.getElementById("map").style.height = document.documentElement.clientHeight-106+"px";
    var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
            maxZoom: 18,
            minZoom: 2
        }),
        normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
            maxZoom: 18,
            minZoom: 2
        }),
        imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            maxZoom: 18,
            minZoom: 2
        }),
        imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
            maxZoom: 18,
            minZoom: 2
        });

    var normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);

    var baseLayers = {
        "地图": normal,
        "影像": image,
    }

    var overlayLayers = {

    }
    // document.getElementById('map_out_div').innerHTML = "<div id='mymap'></div>";

    map = L.map("map", {
        center: [30.9, 110.7],
        zoom: 10,
        layers: [normal],
        zoomControl: false
    });

    map.addLayer(markersGroup);

    L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);
    query_adapt(find_type_point, find_type_line, "bigtype", "交通运输设施类");

    // var map = L.map("map").setView([30.901154,110.66997], 11);
    //基础底图
    // L.esri.basemapLayer("TianDiTuSat_A").addTo(map);
    // var baseLayer= L.esri.basemapLayer("TianDiTuSat");
    // var baseLabelLayer = L.esri.basemapLayer("TianDiTuSat_A");
    // map.addLayer(baseLayer);
    // map.addLayer(baseLabelLayer);

    // //加载动态地图
    // // var url = "http://maiserver:6080/arcgis/rest/services/wuhan/MapServer";
    // var url = "http://maiserver:6080/arcgis/rest/services/zg/MapServer";
    // var dynamicLayer = L.esri.dynamicMapLayer({
    //     url: url,
    //     //layers:[0,1,2,3,4],
    //     useCors: false
    // });
    // map.addLayer(dynamicLayer);


    // 网页变化重新计算地图控件的大小
    window.onresize=function(){
        document.getElementById("map").style.height = document.documentElement.clientHeight-106+"px";
    }
}

// 侧边导航下拉列表
$('.tpl-left-nav-link-list').on('click', function() {
    $(this).siblings('.tpl-left-nav-sub-menu').slideToggle(80)
        .end()
        .find('.tpl-left-nav-more-ico').toggleClass('tpl-left-nav-more-ico-rotate');
})

// 头部导航隐藏菜单
$('.tpl-header-nav-hover-ico').on('click', function() {
    $('.tpl-left-nav').toggle();
    $('.tpl-content-wrapper').toggleClass('tpl-content-wrapper-hover');
})
