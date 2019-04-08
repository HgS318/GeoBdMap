/*
 abstract: 本模块主要定义一些全局函数及属性等，同时汇集一些通用的函数
 author: cwj
 date: 2014/6/16
 */

// 全局基础函数
//string.format
String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                   // var reg = new RegExp("{" + i + "}", "g");
                    result = result.replace('{' + i + '}', arguments[i]);
                }
            }
        }
        return result;
    } else {
        return this;
    }
}

// trim 空格
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}

String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery'], function($){
    "use strict";

    var G_GeoCatalog = [
        {
            "concept":"水系",
            "key":"water",
            "GB":"200000"
        },
        {
            "concept":"河流",
            "key":"river",
            "GB":"210000"
        },
        {
            "concept":"湖泊",
            "key":"lake",
            "GB":"230000"
        },
        {
            "concept":"居民地",
            "key":"residents",
            "GB":"310000"
        },
        {
            "concept":"山",
            "key":"mountain",
            "GB":"751300"
        },
        {
            "concept":"道路",
            "key":"road",
            "GB":"440000"
        },
        {
            "concept":"山谷",
            "key":"valley",
            "GB":"751403"
        },
        {
            "concept":"山脊",
            "key":"ridge",
            "GB":"751402"
        },
        {
            "concept":"流域",
            "key":"basin",
            "GB":"262100"
        },
        {
            "concept":"河流",
            "key":"rivers",
            "GB":"210000"
        },
        {
            "concept":"湖泊",
            "key":"lakes",
            "GB":"230000"
        },
        {
            "concept":"道路",
            "key":"roads",
            "GB":"420000"
        }
    ];

    // 系统中用到的服务地址，通过变量统一管理
    var G_HMOWLUrl = 'http://www.rsteq.com:58879/GISOntApp/service';
    var G_HMSearchUrl = 'http://www.rsteq.com:9191/HummingSearch/SearchManage';
    var G_TDTSearchUrl = 'http://lbs.tianditu.com/api-new/query.do';
    var G_WIKISearchUrl = 'http://www.rsteq.com/geowiki/index.php?';
    var G_TDTVecMapUrl = "http://t0.tianditu.com/DataServer?T=vec_c&";
    var G_TDTVecAnnotationUrl = "http://t0.tianditu.com/DataServer?T=cva_c&";
    var G_TDTSatMapUrl = "http://t0.tianditu.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&";
    var G_TDTSatAnnotationUrl = "http://t0.tianditu.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&";
    //通过ajax获取Json格式数据
    function getDataByAjaxUrl(url, deal,jsonCallBack) {
        $.ajax({
            type: "get",
            async:false,
            cache:false,
            url: url ,//+ "?jsoncallback=?",
            contentType: "text/json;charset=utf8",
            dataType: "jsonp",
            jsonp: 'jsoncallback',
            jsonpCallback:jsonCallBack,
            processData: false,
            success: function (resultJson){
                deal(resultJson);
            },
            error: function (error){
                alert("调用出错" + error.responseText);
            }
        });
    }

    /**
     * Decode a "Google-encoded" polyline
     *
     * @param encodedString
     *            ...
     * @param precision
     *            1 for a 6 digits encoding, 10 for a 5 digits encoding.
     * @return the polyline.
     */
    function decode(encodedString, precision){
        var polyline = new Array();
        var index = 0;
        var len = encodedString.length;
        var lat = 0, lng = 0;


        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encodedString.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encodedString.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            var p = [lng * precision, lat * precision];
            polyline.push(p);
        }
        return polyline;
    }

    return{
        G_GeoCatalog: G_GeoCatalog,
        G_HMOWLUrl: G_HMOWLUrl,
        G_HMSearchUrl: G_HMSearchUrl,
        G_TDTSearchUrl: G_TDTSearchUrl,
        G_WIKISearchUrl: G_WIKISearchUrl,
        G_TDTVecMapUrl: G_TDTVecMapUrl,
        G_TDTVecAnnotationUrl: G_TDTVecAnnotationUrl,
        G_TDTSatMapUrl: G_TDTSatMapUrl,
        G_TDTSatAnnotationUrl: G_TDTSatAnnotationUrl,

        getDataByAjaxUrl: getDataByAjaxUrl,
        decode: decode
    };
});
