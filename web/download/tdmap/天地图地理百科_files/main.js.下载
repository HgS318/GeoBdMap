"use strict";

require.config({
    paths: {
        'jquery': "jquery-1.10.2.min",
        "bootstrap": "bootstrap/js/bootstrap",
        "jquery.metisMenu": "plugins/metisMenu/jquery.metisMenu",
        "sb.admin": "sb-admin",
        "hummingMap": "hummingMap"
    },
    shim: {
        "bootstrap":{
            deps: [ "jquery" ]
        },
        "jquery.metisMenu": {
            deps: [ "bootstrap" ]
        },
        "sb.admin": {
            deps: [ "bootstrap", "jquery.metisMenu" ]
        }
    }
});

require([
    'hummingMap',
    'jquery',
    'bootstrap',
    'jquery.metisMenu',
    'sb.admin'], function(HMMap){

    jQuery.support.cors = true;
    HMMap.initmap();
});
