var k = true, R = false;
var O = '45%', j = '500px', L = '20px';
var G = '93%', J = '500px', K = '20px';
$(document).ready(function () {
    $('#id_tree').tree({
        lines: true,
        animate: false,
        url: 'defJson.action',
        //queryParams: { id: '' },
        formatter: function (node) {
            var s = node.text + '(' + node.id + ')';
            if (s.replace('未定义分类', '').length < s.length) {
                s = '<span style=\'color:#c43a3a;\'>' + s + '</span>';
            } else if (node.exsit == false) {
                s = '<span style=\'color:#a79696;\'>' + s + '</span>';
            }
            return s;
        },
        onLoadSuccess: function () {
            if ($('#id_tree').tree('getRoots').length > 0 && k) {
                V($('#id_tree').tree('getRoots')[0].id);
                k = false;
            }
        },
        onClick: function (node) { 
        	V(node.id); 
        },
        onExpand: function (node) {
            if ($('#id_tree').tree('getParent', node.target) == null) {
                $.each($('#id_tree').tree('getRoots'), function (name, val) {
                    if (val.id != node.id) {
                        $('#id_tree').tree('collapseAll', val.target);
                    }
                });
            }
        }
    });
    $('#id_gjz').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            C();
        }
    });
    $('#id_search').searchbox({
        prompt: '请输入关键字', searcher: C, width: '100%', height: '30px'
    });
    $('#id_searchresult').datagrid({
        fitColumns: true,
        striped: true,
        nowrap: false,
        width: '100%',
        height: '100%',
        url: 'totalmodels.action',
        singleSelect: true,
        method: 'get',
        rownumbers: true,
        pagination: true,
        pageSize: 20,
        loadMsg: '查询中,请稍候…',
        pagePosition: 'bottom',
        remoteSort: false,
        onClickCell: function (index, field, val) {
            var rows = $('#id_searchresult').datagrid('getRows');
            var mid = rows[index].ModelID;
            var name = rows[index].Name;
            myShow(mid,name);
        }
    });
    var p = $('#id_searchresult').datagrid('getPager');
    $(p).pagination({
        pageList: [10, 20, 25, 35, 50, 100],
        beforePageText: '第', afterPageText: '页 共{pages}页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
    });
    window.addEventListener('resize', onWindowResize, false);
});
function onWindowResize() {
    if ($('#centerDiv').width() < 1000) {
    } else {
    }
};
function am()
{
    $('#divContainer').height($('#centerDiv').height() - $('#floatDiv').height());
};
function reloadTree() 
{
    $('#id_tree').tree('reload');
};
function ar(fldm) {
    $.ajax({
        crossDomain: true, type: "GET", async: true, contentType: "application/json;charset=utf-8",
        url: "../totalmodels.action",
        data: { fldm: fldm }, dataType: "jsonp", timeout: 5000, jsonpCallback: 'jsoncallback',
        error: function (x, t, e) { alert(t); },
        success: function (data) {
            ap(); var tmp = eval(data);
            var htmlstr = "", htmlstr1 = "";
            var num = 0, index = 0;
            if (tmp.length > 0) {
                $.each(tmp[0], function (name, val) {
                    index++;
                    if (val != "" && name != "分类代码") {
                        htmlstr += '<div class="mypanel" title="(' + (num + 1) +
                            ')" data-options="footer:\'#footer' + num + '\'"\>';
                        htmlstr += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + val;
                        htmlstr += '<div id="footer' + num + '" style="padding:5px;">【信息来源】'
                            + name + '</div>';
                        htmlstr += '</div>';
                        num++;
                        if (num == 1) {
                            htmlstr1 = '<div class="mypanel1" style="padding:5px;"><strong>相关定义：</strong>'
                                + val.substring(0, 40) +
                                '…&nbsp&nbsp<a href="#" id="linkbutton1" class="linkbutton1" data-options="plain:true,iconCls:\'icon-more\'">详情</a></div>';
                        }
                    }
                });
                if (index == 1) {
                    htmlstr1 = '<div class="mypanel1" style="padding:5px;">暂无相关定义。</div>';
                }
            } else {
                htmlstr1 = '<div class="mypanel1" style="padding:5px;">暂无相关定义。</div>';
            }
            F(htmlstr1);
            $('.mypanel1').panel({ width: '100%' });
            $('#linkbutton1').linkbutton();
            $('#linkbutton1').on('click', function (event) {
                $('#dlg_content').html(htmlstr);
                $('#dlg').dialog('open'); $('.mypanel').panel({ width: '100%' });
            });
        },
        complete: function () { R = false; }
    });
};
function myShow(mid,mname) {
	//if (R) {
	//	return;
	//}
	//R = true;
	$.ajax({
	    crossDomain: true, type: "GET", async: true, contentType: "application/json",
		url: "modeldetail.action?id="+mid,
		//url: "../Handler3.ashx/ProcessRequest?mid="+mid,
		//data: { mid: mid },
		dataType: "text",
		timeout: 5000,
		jsonpCallback: 'jsoncallback',
		error: function (x, t, e) {
			alert(t); 
		},
		success: function (data) {
			$('#labelContainer').html('');
			$('#divContainer').html('');
			$('#attrDiv').html('');
			$('#id_fldm').html('');
			$('#id_gnmc').html('');
			$('#id_fzdw').html('');
			//ar(fldm);
			$('#id_fldm').html(mid);
			$('#id_gnmc').html(mname);
			var l = $('<div class="griditem" style="width: ' + O + '; height: ' + j +
                '; float: left; margin:' + L + ';"></div>');
			var H = $('<div id=' + mid + ' title="' +
				mname + '" style="width:100%;height:100%;overflow:hidden;"></div>');
			var jsonData = eval(data);
			var index = 0;
			var tmpId = "data_div_" + index;
			if (jsonData.length > 0) {
			    var flag = false;
			    $.each(jsonData, function (idx, obj) {
			        $.each(obj, function (name, val) {
			            var div = $('<span>' + name + ':</span><a>' + (val == '' ? '暂无' : val) + '</a>');
			            div.appendTo($('#attrDiv'));
			        });
			        if (!flag && obj.Path0) {
			            var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/testLoadFar.html?fName='
                                    + obj.Path0 + '"></iframe>');
			            T.appendTo(H);
			            H.appendTo(l);
			            l.appendTo($("#divContainer"));
			            $(H).panel();
			            flag = true;
			        }
			    });
			}
			var name = "立体";
			var style = '_bold';
			var iconStr = 'iconCls:\'icon-lt-large\'';
			var testBool = false;
			iconStr += ',size:\'large\',iconAlign:\'top\',';
			var opt = 'data-options="' + iconStr + 'disabled:' + testBool + '"';
			var label = $('<a href="javascript:void(0)" ' + opt +
                ' class="linkbutton' + style + '")">' + name + '</a>');
			label.appendTo($('#labelContainer'));
			$(label).on('click', function (event) {
			    scrollTo('divContainer', tmpId);
			});
			if ($('#labelContainer').html() == '')
			    $('#labelContainer').html('<div class="nodata"><a>暂无</a></div>');
			$('.linkbutton').linkbutton();
			$('.linkbutton_bold').linkbutton();
			$('.linkbutton_noneed').linkbutton();

			//var jsonData = eval(data);

			//var index = 0;
			if (index > 0) {
			//if (jsonData.length > 0) {
				$.each(jsonData[0], function (name, val) {
					var tmpId = "data_div_" + index;
					index++;
					if (name == "分类代码") {
						$('#id_fldm').html(val);
					} else if (name == "概念名称") {
						$('#id_gnmc').html(val);
					} else if (name == "负责单位") {
						$('#id_fzdw').html(val);
					} else if (name == "属性") {
						$.each(val, function (name, val) {
							var div = $('<span>' + name + ':</span><a>' + (val == '' ? '暂无' : val) + '</a>');
							div.appendTo($('#attrDiv'));
						});
					} else {
						var style = '';
						iconStr = 'iconCls:\'icon-img-large\'';
						if (name == "三维图像") {
							iconStr = 'iconCls:\'icon-3d-large\'';
							name = "三维"; style = '_bold';
						} else if (name == "实景全景图像") {
							iconStr = 'iconCls:\'icon-qj-large\''; name = "全景"; style = '_bold';
						} if (name == "视频") {
							iconStr = 'iconCls:\'icon-sp-large\''; style = '_bold';
						} if (name == "立体图像") {
							iconStr = 'iconCls:\'icon-lt-large\''; name = "立体"; style = '_bold';
						} if (name !== "图式图像") {
							name = name.replace("图像", "");
						} if (!val.need) {
							style = '_noneed'; iconStr = 'iconCls:\'icon-cancel-large\'';
						}
						iconStr += ',size:\'large\',iconAlign:\'top\',';
						var opt = 'data-options="' + iconStr + 'disabled:' + !val.exsit + '"';
						var label = $('<a href="javascript:void(0)" ' + opt +
                            ' class="linkbutton' + style + '")">' + name + '</a>');
						label.appendTo($('#labelContainer'));
						if (val.exsit) {
							if (val.type == "TP") {
								ax(tmpId, name, val.urls);
							} else if (val.type == "3D") {
								az(tmpId, name, val.urls);
							} else if (val.type == "QJ") {
								bN(tmpId, name, val.urls);
							} else if (val.type == "SP") {
								bV(tmpId, name, val.urls);
							}
						}
						$(label).on('click', function (event) {
							scrollTo('divContainer', tmpId);
						});
					}
				});
				if ($('#labelContainer').html() == '')
					$('#labelContainer').html('<div class="nodata"><a>暂无</a></div>');
				$('.linkbutton').linkbutton(); $('.linkbutton_bold').linkbutton();
				$('.linkbutton_noneed').linkbutton();
			}
		},
		complete: function () { am(); }
	});
}

function V(fldm)
{
    if (R) {
        return;
    }
    R = true;
    $.ajax({
        crossDomain: true, type: "GET", async: true, contentType: "application/json;charset=utf-8",
        url: "../modeldetail.action",
        data: { fldm: fldm },
        dataType: "jsonp",
        timeout: 5000,
        jsonpCallback: 'jsoncallback',
        error: function (x, t, e) { alert(t); },
        success: function (data) {
            $('#labelContainer').html('');
            $('#divContainer').html('');
            $('#attrDiv').html('');
            $('#id_fldm').html('');
            $('#id_gnmc').html('');
            $('#id_fzdw').html('');
            ar(fldm);
            var jsonData = eval(data);
            var index = 0;
            if (jsonData.length > 0) {
                $.each(jsonData[0], function (name, val) {
                    var tmpId = "data_div_" + index;
                    index++; 
                    if (name == "分类代码") {
                        $('#id_fldm').html(val);
                    } else if (name == "概念名称") {
                        $('#id_gnmc').html(val);
                    } else if (name == "负责单位") {
                        $('#id_fzdw').html(val);
                    } else if (name == "属性") {
                        $.each(val, function (name, val) {
                            var div = $('<span>' + name + ':</span><a>' + (val == '' ? '暂无' : val) + '</a>');
                            div.appendTo($('#attrDiv'));
                        });
                    } else {
                        var style = '';
                        iconStr = 'iconCls:\'icon-img-large\'';
                        if (name == "三维图像") {
                            iconStr = 'iconCls:\'icon-3d-large\'';
                            name = "三维"; style = '_bold';
                        } else if (name == "实景全景图像") {
                            iconStr = 'iconCls:\'icon-qj-large\''; name = "全景"; style = '_bold';
                        } if (name == "视频") {
                            iconStr = 'iconCls:\'icon-sp-large\''; style = '_bold';
                        } if (name == "立体图像") {
                            iconStr = 'iconCls:\'icon-lt-large\''; name = "立体"; style = '_bold';
                        } if (name !== "图式图像") {
                            name = name.replace("图像", "");
                        } if (!val.need) {
                            style = '_noneed'; iconStr = 'iconCls:\'icon-cancel-large\'';
                        }
                        iconStr += ',size:\'large\',iconAlign:\'top\',';
                        var opt = 'data-options="' + iconStr + 'disabled:' + !val.exsit + '"';
                        var label = $('<a href="javascript:void(0)" ' + opt +
                            ' class="linkbutton' + style + '")">' + name + '</a>');
                        label.appendTo($('#labelContainer'));
                        if (val.exsit) {
                            if (val.type == "TP") {
                                ax(tmpId, name, val.urls);
                            } else if (val.type == "3D") {
                                az(tmpId, name, val.urls);
                            } else if (val.type == "QJ") {
                                bN(tmpId, name, val.urls);
                            } else if (val.type == "SP") {
                                bV(tmpId, name, val.urls);
                            }
                        }
                        $(label).on('click', function (event) {
                            scrollTo('divContainer', tmpId);
                        });
                    }
                });
                if ($('#labelContainer').html() == '')
                    $('#labelContainer').html('<div class="nodata"><a>暂无</a></div>');
                $('.linkbutton').linkbutton(); $('.linkbutton_bold').linkbutton();
                $('.linkbutton_noneed').linkbutton();
            }
        },
        complete: function () { am(); }
    });
};
function F(htmlStr) 
{
    var div = $('<div id="id_define" style="width: ' + G + ';">');
    div.html(htmlStr);
    div.prependTo($("#divContainer"));
};
function ax(id, title, jsonData) {
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' + j +
        '; float: left; margin:' + L + ';"></div>');
    var H = $('<div id=' + id + ' title="' + title +
        '" style="cursor:pointer;width:100%;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var htmlstr = '<ul>';
        for (i = 0; i < jsonData.length; i++) {
            htmlstr += '<li class="' + id + '_' + i + '"><img src="' +
                jsonData[i].url + '" alt="样例' + (i + 1) + '" /></li>';
        }
        htmlstr += '</ul>';
        var T = $(htmlstr);
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
        $(T).galleryView({
            transition_speed: 200,
            transition_interval: 500,
            easing: 'swing',
            show_panels: true,
            show_panel_nav: true,
            enable_overlays: false,
            panel_width: $(l).width() - 13,
            panel_height: $(l).height() - 140,
            panel_animation: 'fade',
            panel_scale: 'fit',
            overlay_position: 'bottom',
            pan_images: true,
            pan_style: 'drag',
            pan_smoothness: 15,
            start_frame: 1,
            show_filmstrip: true,
            show_filmstrip_nav: true,
            enable_slideshow: false,
            autoplay: false,
            show_captions: true,
            filmstrip_size: 3,
            filmstrip_style: 'scroll',
            filmstrip_position: 'bottom',
            frame_width: 100,
            frame_height: 60,
            frame_opacity: 0.5,
            frame_scale: 'crop',
            frame_gap: 5,
            show_infobar: true,
            infobar_opacity: 1
        });
    }
};
function az(id, title, jsonData) {
    var u3ds = '1', umtl = '1', uobj = '1';
    for (i = 0; i < jsonData.length; i++) {
        if (u3ds == '1') {
            u3ds = jsonData[i].u3ds == undefined ? '1' : jsonData[i].u3ds;
        } if (umtl == '1') {
            umtl = jsonData[i].umtl == undefined ? '1' : jsonData[i].umtl;
        } if (uobj == '1') {
            uobj = jsonData[i].uobj == undefined ? '1' : jsonData[i].uobj;
        }
    }
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' + j +
        '; float: left; margin:' + L + ';"></div>'); 
	var H = $('<div id=' + id + ' title="' +
        title + '" style="width:100%;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "sw.html?uobj=' +
            uobj + '&u3ds=' + u3ds + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
    }
};
function bN(id, title, jsonData) {
    var l = $('<div class="griditem" style="width: ' + G + '; height: ' + J +
        '; float: left; margin:' + K + ';"></div>');
    var H = $('<div id=' + id + ' title="' + title +
        '" style="width:100%;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "qj.html?url='
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
    }
};
function bV(id, title, jsonData) {
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' + j
        + '; float: left; margin:' + L + ';"></div>');
    var H = $('<div id=' + id + ' title="' + title +
        '" style="width:100%;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "sp.html?url=' +
            jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
    }
};
function C() {
    if ($('#id_search').val() != '') {
        $('#id_searchresult').datagrid('load', {
            gjz: $('#id_search').val()
        });
    }
};
function scrollTo(be, h) {
    var mainContainer = $('#' + be), scrollToContainer = $('#' + h);
    mainContainer.animate({
        scrollTop: scrollToContainer.offset().top - mainContainer.offset().top
            + mainContainer.scrollTop() - 60
    }, 500);
};
function ap() {
    $.ajax({
        crossDomain: true,
        type: "GET",
        async: true,
        contentType: "application/json;charset=utf-8",
        url: "../totalmodels.action",
        data: { v: 0 },
        dataType: "jsonp",
        timeout: 5000,
        jsonpCallback: 'jsoncallback',
        error: function (x, t, e) { alert(t); },
        success: function (data) {
            var jsonData = eval(data);
            $('#staticsDiv').html("总数" + jsonData[0].total + "个（" +
                jsonData[0].noneed + "个不需要采集），已采集" + jsonData[0].done + "个");
        }, complete: function () { }
    });
}