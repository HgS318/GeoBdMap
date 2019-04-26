!function(t,e){"function"==typeof define&&define.amd?define([],e):t.CountryCode=e()}(this,function(){function buildUrl(){var t=util.getEnv(),e="prd"===t?"https:":"https:"==document.location.protocol?"https:":"http:",n=DOMAIN_CONFIG[t],i=e+"//"+n+SOA_SERVICE_PATH;return totalSOARequestError>=2&&(e="https:"==document.location.protocol?"https:":"http:",i=document.location.protocol+STATIC_DATA_URL),TRACE_INFO.requestUrl=i,i}function loadStyle(){var t=$('<style id="'+STYLE_ID+'">'+PAGE_STYLE+"</style>");return els.$head.append(t),isLoadStyle=!0,t}function removeStyle(){$("#"+STYLE_ID).remove()}var PLUGIN_NAME="CountryCode",PLUGIN_VERSION="1.1.5",PAGE_URL=location.href,extendFnName="selectCountryCode",$=window.jQuery?window.jQuery:{};if(!$.fn||$.fn[extendFnName])throw"Error: "+extendFnName+" 组件依赖 jQuery，请先引入jQuery";!function(){Function.prototype.bind=Function.prototype.bind||function(){var t=this,e=[].slice.call(arguments),n=e.shift();return function(){return t.apply(n,e.concat([].slice.call(arguments)))}}}();var DOMAIN_CONFIG={dev:"gateway.m.fws.qa.nt.ctripcorp.com",fat:"gateway.m.fws.qa.nt.ctripcorp.com",uat:"gateway.m.uat.qa.nt.ctripcorp.com",prd:"sec-m.ctrip.com"},SOA_SERVICE_PATH="/restapi/soa2/12687/json/getCountryCode",STATIC_DATA_URL="//webresource.c-ctrip.com/ares/basebiz/countryCode/%5E1.0.0/default/data/countryCode.json",totalSOARequestError=0,PAGE_STYLE=".biz_country-select *{-webkit-box-sizing:content-box;box-sizing:content-box}.biz_country-select li,.biz_country-select ul{list-style:none;padding:0;margin:0}.biz_country-select a{color:#06c;text-decoration:none}.biz_country-select{position: relative;width:430px;padding:10px;border:1px solid #999;background-color:#fff;font-size:12px; z-index: 3001;}.biz_country-select .biz_close{float:right;width:20px;height:20px;color:#666;text-align:center;font:700 16px/20px Simsun}.biz_country-select .biz_close:hover{text-decoration:none;color:#ffa800}.biz_country-select .biz_tab_box{width:100%;height:22px;margin:0 0 6px 0;border-bottom:2px solid #ccc;padding-left:0;clear:both}.biz_country-select .biz_tab_box li{list-style-type:none;float:left;margin-right:2px;line-height:22px;cursor:pointer}.biz_country-select .biz_tab_box li span{padding:0 8px}.biz_country-select .biz_tab_box li:hover span{color:#06c}.biz_country-select .biz_tab_box .biz_hot_selected{border-bottom:2px solid #06c;font-weight:700;color:#06c}.biz_country-select .biz_item{overflow:hidden}.biz_country-select .biz_item li{float:left;width:23%;height:24px;margin-bottom:2px;padding-left:8px}.biz_country-select .biz_item li a{color:#333;max-width:60%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;vertical-align:middle;height:24px;line-height:24px}.biz_country-select .biz_item li.hover, .biz_country-select .biz_item li.active{background-color:#2577e3;cursor:pointer}.biz_country-select .biz_item li.hover a, .biz_country-select .biz_item li.active a{color:#fff;text-decoration:none}.biz_country-select .biz_item li a+span{color:#999;margin-left:5px;display:inline-block;vertical-align:middle;height:24px;line-height:24px}.biz_country-select .biz_item li.hover a+span, .biz_country-select .biz_item li.active a+span{color:#fff}.biz_country-select .biz_item_in{overflow:hidden}.biz_country-select .biz_item_letter{float:left;width:30px;height:22px;line-height:22px;text-align:center;color:#e56700}.biz_country-select.biz_has-area-country{width:600px}.biz_loadfail,.biz_loading{padding:20px 0;text-align:center}.biz_loading img{margin-right:10px;vertical-align:middle}.biz_loadfail .biz_ico_warn{display:inline-block;width:32px;height:32px;margin-right:10px;vertical-align:middle;background-image:url(//pic.c-ctrip.com/myctripv2/un_32x32.png?120831.png);background-repeat:no-repeat;background-position:0 -935px}",util={isSupportJSON:!!window.JSON,noop:function(){},getEnv:function(){var t="prd",e=location.host;return e.match(/^(localhost|127\.0\.0\.1)/i)?t="dev":e.match(/^(\S*\.fat\d*\.qa\.nt\.ctripcorp\.com|webresource\.fws\.qa\.nt\.ctripcorp\.com)/i)?t="fat":e.match(/^(\S*\.uat\.qa\.nt\.ctripcorp\.com|webresource\.uat\.qa\.nt\.ctripcorp\.com)/i)&&(t="uat"),t},strToJson:function(data){if("string"!=typeof data)return data;var ret;return ret=this.isSupportJSON?JSON.parse(data):eval("("+data+")")}},traceLog={init:function(){"undefined"==typeof window.__bfi&&(window.__bfi=[])},_getDefaultData:function(){return{UID:"${duid}",page_id:"${page_id}"}},_formatData:function(t){if("object"!=typeof t)return t;var e="",n="&",i=0;for(var o in t)0===i?e=o+"="+t[o]:e+=n+o+"="+t[o],i++;return e},trace:function(t,e){"function"!=typeof e&&(e=function(){});var n=$.extend({},t,this._getDefaultData()),i=this._formatData(n);window.__bfi.push(["_tracklog","100670",i,e])}};traceLog.init();var TRACE_INFO={pluginName:PLUGIN_NAME,pluginVersion:PLUGIN_VERSION,pageUrl:PAGE_URL,channel:"online",error:""};traceLog.trace(TRACE_INFO);var isLoadStyle=!1,STYLE_ID="_country_code_style",isRequesting=!1,els={$body:$("body"),$head:$("head")},tpls={loading:'<div class="biz_loading"><img src="//pic.c-ctrip.com/myctripv2/loading_50.gif">加载中，请稍候...</div>',loadFailed:'<div class="biz_loadfail"><i class="biz_ico_warn"></i>加载失败，<a href="javascript:;" class="reload">点击重新加载</a></div>',closeBtn:'<a href="javascript:;" class="biz_close">×</a>'},model={__originData:null,__parseData:null,__specialData:null,handles:{},on:function(t,e){return"undefined"==typeof this.handles[t]&&(this.handles[t]=[]),this.handles[t].push(e),this},fire:function(t,e){if(this.handles[t]instanceof Array)for(var n=this.handles[t],i=0,o=n.length;o>i;i++)"function"==typeof n[i]&&n[i](e)},get:function(t){return t?this.__parseData[t]:this.__parseData},getOriginData:function(){return this.__originData},getSpecialData:function(t){return t?this.__specialData[t]:this.__specialData},set:function(t){if(!t||this.__originData!==t){var e=this.parse(t);this.__originData=t,this.__parseData=e.parseData,this.__specialData=e.specialData,this.fire("change",t)}return this},parse:function(t){if(t){for(var e=util.strToJson(t),n=this.parseHotCountries(e),i=$.extend({},n),o=$.extend({},n),a=e.sort(this.comparePy.bind(this)),r=0,c=a.length;c>r;r++){var l=a[r].py.substr(0,1).toUpperCase();1===a[r].open&&(o[l]?o[l].push(a[r]):o[l]=[a[r]]),i[l]?i[l].push(a[r]):i[l]=[a[r]]}return{parseData:i,specialData:o}}return{parseData:null,specialData:null}},parseHotCountries:function(t){for(var e=[],n=0,i=t.length;i>n;n++)t[n].heat&&t[n].heat>0&&e.push(t[n]);var o=e.sort(this.compareHeat);return{hot:o}},compareHeat:function(t,e){return e.heat-t.heat},comparePy:function(t,e){for(var n=this.getPyInitial(t.py),i=this.getPyInitial(e.py),o=n.length>i.length?n.length:i.length,a=0;o>a;a++){var r=n.charCodeAt(a)-i.charCodeAt(a);if(0!=r)return"_"==n.charAt(a)?-1:r}return a==o?n.length-i.length:void 0},getPyInitial:function(t){if("string"!=typeof t)return t;for(var e=t.split(" "),n="",i=0,o=e.length;o>i;i++)n+=e[i].substr(0,1);return n}},loadState="loading";return $.fn[extendFnName]=function(t){function e(){n()?loadState="done":(model.on("change",r),!isRequesting&&i()),r()}function n(e){return 1===t.needSMS?model.getSpecialData(e):model.get(e)}function i(){return isRequesting=!0,$.ajax({url:buildUrl(),dataType:"json"}).done(o).fail(a)}function o(t){var t=util.strToJson(t);t.ResponseStatus&&t.ResponseStatus.Ack&&"Success"===t.ResponseStatus.Ack&&t.countryInfoList&&t.countryInfoList.length>0?(isRequesting=!1,loadState="done",model.set(t.countryInfoList)):a()}function a(t){totalSOARequestError++,isRequesting=!1,loadState="loadFailed",model.set(null),t&&t.status&&t.statusText&&(TRACE_INFO.errStatus=t.status,TRACE_INFO.errStatusText=t.statusText,TRACE_INFO.userAgent=navigator.userAgent),TRACE_INFO.totalSOARequestError=totalSOARequestError,traceLog.trace(TRACE_INFO),2>totalSOARequestError&&g()}function r(){A?(c(),u(),h(),w.append(k)):c()}function c(){var e="";if("loading"===loadState?e+=tpls.loading:"loadFailed"===loadState?e+=tpls.loadFailed:"done"===loadState&&(e+=s()),A){A=!1;var n="";n+=tpls.closeBtn,n+='<div class="'+N+'"></div>',n+='<div class="'+D+'">',n+=e,n+="</div>",k.append(n)}else k.find("."+D).html(e);"done"===loadState&&(k.find("."+N).html(l()),m(t.countryCode,t.countryName),y(t.countryCode,t.countryName),v())}function l(){function t(t){return"hot"===t?"热门":t}var e="";e+='<ul class="biz_tab_box">';for(var n=0,i=E.length;i>n;n++)e+='<li data-index="'+n+'"><span>'+t(E[n])+"</span></li>";return e+="</ul>"}function s(){for(var t="",e=0,i=E.length;i>e;e++){if(t+='<div class="biz_tab_container_bd" data-index="'+e+'">',"hot"===E[e]){var o=n(E[e]);if(o){t+='<ul class="biz_item">';for(var a=0,r=o.length;r>a;a++)t+='<li title="'+o[a].cn+'" data-alphabet="'+E[e]+'" data-alphabet-index="'+a+'" data-code="'+o[a].code+'"><a href="javascript:;">'+o[a].cn+"</a><span>"+o[a].code+"</span></li>";t+="</ul>"}}else for(var c=E[e],a=0,r=c.length;r>a;a++){var l=c.substr(a,1);if(o=n(l)){t+='<div class="biz_item"><span class="biz_item_letter">'+l+'</span><ul class="biz_item_in">';for(var s=0,u=o.length;u>s;s++)t+='<li title="'+o[s].cn+'" data-alphabet="'+l+'" data-alphabet-index="'+s+'" data-code="'+o[s].code+'"><a href="javascript:;">'+o[s].cn+"</a><span>"+o[s].code+"</span></li>";t+="</ul></div>"}}t+="</div>"}return t}function u(){p(),k.hide()}function d(){return C.get(0).tagName.toLowerCase()}function p(){var t=d();"input"===t||"textarea"===t?C.attr({autocomplete:"off",readonly:!0}):C.attr("contenteditable")&&C.attr("contenteditable","false")}function f(){var t=C.offset(),e=C.outerHeight?C.outerHeight():C.height();k.css({position:"absolute",top:t.top+e+"px",left:t.left+"px"})}function h(){var e=k.find("."+N),i=k.find("."+D),o=k.find(".biz_close"),a=d();"input"===a||"textarea"===a?C.on("focus",function(){z()}).on("blur",function(){T?$(this).focus():S()}).on("click",function(){z()}):(C.on("click",function(t){t.stopPropagation(),z()}),$(document).on("click",function(){S()})),k.on("click",function(t){t.stopPropagation(),C.focus()}).on("mousedown",function(t){T=!0,t.stopPropagation(),C.focus()}).on("touchstart",function(t){T=!0,t.stopPropagation(),C.focus()}),$(document).on("mouseup",function(){T=!1}).on("touchend",function(){T=!1}),o.on("click",function(t){t.stopPropagation(),"input"===a||"textarea"===a?C.blur():S()}),e.on("click","li",function(){var t=$(this);t.hasClass(I)||(L=parseInt(t.attr("data-index"),10),v())}),i.on("click","li",function(e){e.stopPropagation();var i=$(e.currentTarget),o=i.attr("data-alphabet"),r=i.attr("data-alphabet-index"),c=n(o)[r];m(c.code,c.cn),b(_(c)),"input"===a||"textarea"===a?C.blur():S(),t.onSelect(c)}).on("click",".reload",function(){g()}).on("mouseover","li",function(t){$(t.currentTarget).addClass(O)}).on("mouseout","li",function(t){$(t.currentTarget).removeClass(O)})}function _(e){var n;return"function"==typeof t.inputText&&(n=t.inputText(e)),n&&"string"==typeof n||(n=x(e)),n}function b(t){var e=C.get(0).tagName.toLowerCase();"input"===e||"textarea"===e?C.val(t):C.text&&C.text(t)}function g(){loadState="loading",model.set(null),!isRequesting&&i()}function v(){var t=k.find(".biz_tab_box"),e=t.find("li"),n=k.find("."+D),i=n.find(".biz_tab_container_bd");0!==L?k.addClass(F):k.removeClass(F),t.find("."+I).removeClass(I),e.eq(L).addClass(I),i.length>0&&i.hide().eq(L).show()}function m(t,e){$tabContainer=k.find(".biz_tab_container"),$tabContainer.find("li").each(function(n,i){var o=$(i),a=o.attr("title"),r=o.attr("data-code");r==t&&a==e?o.addClass(R):o.removeClass(R)})}function y(t,e){for(var i=!1,o=0,a=E.length;a>o&&!i;o++)if("hot"===E[o]){var r=n(E[o]);if(r)for(var c=0,l=r.length;l>c;c++)if(r[c].code==t&&r[c].cn==e){L=o,i=!0;break}}else for(var s=E[o],u=0,d=s.length;d>u&&!i;u++){var p=s.substr(u,1),r=n(p);if(r)for(var c=0,l=r.length;l>c;c++)if(r[c].code==t&&r[c].cn==e){L=o,i=!0;break}}}function x(t){return t.cn+" "+t.code}function z(){clearTimeout(q),k.is(":visible")||(f(),k.show(),t.onFocus(),P=!0)}function S(){clearTimeout(q),q=setTimeout(function(){k.hide(),P&&t.onBlur(),P=!1},100)}var C=$(this);if(1!==C.length)throw extendFnName+" Error: 绑定对象过多 或 无当前对象，仅支持单个对象进行绑定，请遍历每个元素调用";t=t||{},t.needSMS=t.needSMS||0,t.countryCode=t.countryCode||"",t.countryName=t.countryName||"",t.onSelect="function"==typeof t.onSelect?t.onSelect:function(){},t.onFocus="function"==typeof t.onFocus?t.onFocus:function(){},t.onBlur="function"==typeof t.onBlur?t.onBlur:function(){};var w=("function"==typeof t.inputText?t.inputText:x,els.$body),A=!0,T=!1,E=["hot","ABCDEF","GHIJ","KLMN","PQRSTUVW","XYZ"],N="biz_tab_header",D="biz_tab_container",I="biz_hot_selected",R="active",O="hover",F="biz_has-area-country",L=0,k=$('<div class="biz_country-select"></div>');isLoadStyle||loadStyle(),e();var q=null,P=!1},null});
//# sourceMappingURL=country.online.js.d2c3401a.map