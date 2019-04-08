
/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2005-2011 DAMIANI                                 */
/*                                                                  */
/*  This obfuscated code was created by Jasob 4.0 Trial Version.    */
/*  The code may be used for evaluation purposes only.              */
/*  To obtain full rights to the obfuscated code you have to        */
/*  purchase the license key (http://www.jasob.com/Purchase.html).  */
/*                                                                  */
/********************************************************************/

var k = true, R = false;
var O = '93%', j = '500px', L = '5px';
var G = '93%', J = '500px', K = '5px';

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

function delInstance(geocode,insnum) {
	var url="delInstance.action?geocode="+geocode+"&insnum="+insnum;
	window.location.href=url;
}

$(document).ready(function () {
	$("#searchStart").click(function(){ //检索
		$("#ClassCheckbox").submit();
//		$("#tabsDiv").tabs("select",2);
//		var getValue = document.getElementById("input_FLDM").value;
//		V(getValue);
	});
	$('#id_tree').tree({
		lines: true,
		animate: false,
		url: 'defInstanceJson.action',
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
//				V($('#id_tree').tree('getRoots')[0].id);
				k = false;
			}
		},
		onClick: function (node) {
			V(node.id,1);
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
		prompt: '请输入关键字',
		searcher: function(value,name){
			
			C(value);
		},
		width: '100%',
		height: '30px'
	});
	if("search"!=getQueryString("search")) {
		$('#id_searchresult').datagrid({
			fitColumns: true,
			striped: true,
			nowrap: true,
			width: '100%',
			height: '100%',
			url: 'totalinstances.action',
			columns:[[
				{field:'Geo_Code',title:'分类代码'},
				{field:'Name',title:'概念名称'},
				{field:'InstanceId',title:'范例序号'},
				{field:'Del',title:'删除',
					formatter:function(value,row,index){
						return  "<p href='"+row.Geo_Code+"' target='_blank'>删除</p>";
					} }
				]],
			singleSelect: true, method: 'get',
			rownumbers: true,
			pagination: false,
			pageSize: 20,
			loadMsg: '查询中,请稍后…',
			pagePosition: 'bottom',
			remoteSort: false,
			onLoadSuccess: function(data){
				$('#id_searchresult').datagrid("autoMergeCells");
	        },
			onClickCell: function (index, field, val) {
				var rows = $('#id_searchresult').datagrid('getRows');
				if(field!='Del'){
					R=false;
					V(rows[index].Geo_Code,rows[index].InstanceId);
				}else{
					$.messager.confirm('确认','确认删除？',function(row){
						if(row) {
							delInstance(rows[index].Geo_Code,rows[index].InstanceId);
						}
					})
				}
			}
		});
		$("#tabsDiv").tabs("select",2);
//		$("#tabsDiv").tabs("select",0);
	} else {		
		$('#id_searchresult').datagrid({
			fitColumns: true,
			striped: true,
			nowrap: true,
			width: '100%',
			height: '100%',
			url: 'getEasyInstances.action',
			columns:[[
			          {field:'Geo_Code',title:'分类代码'},
			          {field:'Name',title:'概念名称'},
			          {field:'InstanceId',title:'范例序号'},
			          {field:'Del',title:'删除',
			        	 formatter:function(value,row,index){
			        		return  "<p href='"+row.Geo_Code+"' target='_blank'>删除</p>";
			        	 } }
			          ]],
			singleSelect: true, method: 'get',
			rownumbers: true,
			pagination: false,
			pageSize: 20,
			loadMsg: '查询中,请稍后…',
			pagePosition: 'bottom',
			remoteSort: false,
			onLoadSuccess: function(data){
				$('#id_searchresult').datagrid("autoMergeCells");
	        },
			onClickCell: function (index, field, val) {
				var rows = $('#id_searchresult').datagrid('getRows');
				if(field!='Del'){
					R=false;
					V(rows[index].Geo_Code,rows[index].InstanceId);
				}else{
					$.messager.confirm('确认','确认删除？',function(row){
						if(row) {
							delInstance(rows[index].Geo_Code,rows[index].InstanceId);
						}
					})
				}
			}
		});
		$("#tabsDiv").tabs("select",2);
	}

	
//	var p = $('#id_searchresult').datagrid('getPager');
//	$(p).pagination({
//		pageList: [10, 20, 25, 35, 50, 100],
//		beforePageText: '第',
//		afterPageText: '页 共{pages}页',
//		displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
//	});
	window.addEventListener('resize', onWindowResize, false);
});



/*$(document).ready(function(){  //标签
    $('#divContainer1').easyResponsiveTabs({
        type: 'default',
        width: 'auto',
        fit: true, // 100% fit in a container
        closed: 'accordion', // Start closed if in accordion view
        tabidentify: 'tab1',
        });
    });*/
    
function onWindowResize() {	//	不管
    if ($('#centerDiv').width() < 1000) { } else { }
};
function am() {	//	设置、调整divContainer的高度
    $('#divContainer').height($('#centerDiv').height() - $('#floatDiv').height());
};
function reloadTree() {	//	重新加载树结构
    $('#id_tree').tree('reload');
}; 
function ar(fldm) {	//暂不清楚
	$.ajax({
		crossDomain: true, 
		type: "GET", 
		async: true, 
		contentType: "application/json;charset=utf-8",
		url: "http://localhost/btk/s.asmx/getDefine?jsoncallback=?",
		data: { fldm: fldm },
		dataType: "jsonp",
		timeout: 5000,
		jsonpCallback: 'jsoncallback',
		error: function (x, t, e) { 
			//alert(t); 
		}, 
		success: function (data) { 
			ap(); 
			var tmp = eval(data); 
			var htmlstr = "", htmlstr1 = "";
			var num = 0, index = 0;
			if (tmp.length > 0) {
				$.each(tmp[0], function (name, val) {
					index++;
					if (val != "" && name != "分类代码") {
						htmlstr += '<div class="mypanel" title="(' + (num + 1) +
							')" data-options="footer:\'#footer' + num + '\'"\>';
						htmlstr += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + val;
						htmlstr += '<div id="footer' + num + '" style="padding:5px;">【信息来源】' + name + '</div>';
						htmlstr += '</div>';
						num++;
						if (num == 1) { 
							htmlstr1 = '<div class="mypanel1" style="padding:5px;"><strong>相关定义：</strong>' + val.substring(0, 40) +
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
				$('#dlg').dialog('open');
				$('.mypanel').panel({ width: '100%' });
			});
		},
		complete: function () { R = false; }
	});
};
function V(fldm, flbh) {	//根据分类代码查看范例的全部内容
	if (R) {
		return;
	} 
	R = true;
	$.ajax({
		crossDomain: true,
		type: "GET",
		async: true,
		contentType: "application/json",
		url: "instancedetail.action?geocode="+fldm+"&insnum="+flbh,
		//url: "testEJson.action",
		dataType: "text",
		timeout: 5000,
		jsonpCallback: 'jsoncallback',
		error: function (x, t, e) { 
			alert(t); 
		},
		success: function (data) {
		//	$('#labelContainer').html('');
		//	$('#divContainer').html('');
		//	$('#tabContainer').html('');		
		//	$('#AllContainer').html('');
			$('#tabs').html('');
			$('#AllContainer').html('');
		//	$('#QJingContainer').html('');
		//	$('#SJHRaoContainer').html('');
		//	$('#SJCGuiContainer').html('');
		//	$('#SPinContainer').html('');
		//	$('#SJDSXiangContainer').html('');
		//	$('#SYiContainer').html('');
		//	$('#SJDJDuContainer').html('');
		//	$('#YGCGuiContainer').html('');
		//	$('#LTiContainer').html('');
		//	$('#DXTuContainer').html('');
		//	$('#SWeiContainer').html('');
		//	$('#TSTXiangContainer').html('');
		//	$('#YGDSXiangContainer').html('');
			$('#attrDiv').html('');
			$('#id_fldm').html('');
			$('#id_gnmc').html('');
			$('#id_fzdw').html('');
			ar(fldm); 
			var jsonData = eval(data);
			if(jsonData==null) {
				alert("没有范例..."); 
				R=false;
				return;
			}
			//alert(data);
			var index = 0;
			if (jsonData.length > 0) { 
				var showExistData = "";
				
				$.each(jsonData[0], function (name, val) {
					var tmpId = "data_div_" + index;
					index++;
					if (name == "分类代码") {
						$('#id_fldm').html(val);
					} else if (name == "概念名称") {
						$('#id_gnmc').html(val);
					} else if (name == "范例名称") {
						$('#id_flmc').html(val);
					} else if (name == "属性") {
						$.each(val, function (name, val) {
							var div = $('<span>' + name + ':</span><a>' + (val==null || val == ''? '暂无' : val) + '</a>');
							div.appendTo($('#attrDiv'));
						});
					} else {
  						   if(val.exsit){
  						//     alert(name);
  						//	 alert(val.exsit);
  							showExistData = name + "," + showExistData;  							
							var div_id = '';
						//	var addInfoTab = '';
						//	var addInfoDiv = '';
							if(name == "实景全景图像"){ 
								var addInfoTab = $('<li id="QJtab">全景</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="QJingContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								div_id = 'QJingContainer';
								bN1(tmpId, val.urls,div_id);
							}else
							if(name == "实景环绕图像"){
								var addInfoTab = $('<li id="SJtab">实景环绕</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJHRaoContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJHRaoContainer').html('');
								div_id = 'SJHRaoContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJtab');
								button.onclick=function(){
//									$('#SJHRaoContainer').html('');
//									div_id = 'SJHRaoContainer';
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "实景常规图像"){
								var addInfoTab = $('<li id="SJCGtab">实景常规</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJCGuiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJCGuiContainer').html('');
								div_id = 'SJCGuiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJCGtab');
								button.onclick=function(){
//									$('#SJCGuiContainer').html('');
//									div_id = 'SJCGuiContainer';
//									ax1(tmpId, val.urls,div_id);
								}
									
							}else
							if(name == "视频"){
								var addInfoTab = $('<li id="SPtab">视频</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SPinContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
//						    	$('#SPinContainer').html('');
//								div_id = 'SPinContainer';	
//								bV1(tmpId, val.urls,div_id);
								var button=document.getElementById('SPtab');
								button.onclick=function(){
									$('#SPinContainer').html('');
									div_id = 'SPinContainer';	
									bV1(tmpId, val.urls,div_id);
								}
							//	div_id = 'SPinContainer';	
							//	bV1(tmpId, val.urls,div_id);
							}else
							if(name == "三维图像"){
								var addInfoTab = $('<li id="SWtab">三维</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SWeiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								div_id = 'SWeiContainer';
								az1(tmpId, val.urls,div_id);
							}else
							if(name == "实景多时相图像"){
								var addInfoTab = $('<li id="SJDStab">实景多时相</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJDSXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#SJDSXiangContainer').html('');
								div_id = 'SJDSXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJDStab');
								button.onclick=function(){
//									$('#SJDSXiangContainer').html('');
//									div_id = 'SJDSXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "示意图像"){
								var addInfoTab = $('<li id="SYtab">示意</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SYiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								$('#SYiContainer').html('');
								div_id = 'SYiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SYtab');
								button.onclick=function(){
//									$('#SYiContainer').html('');
//									div_id = 'SYiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "实景多角度图像"){
								var addInfoTab = $('<li id="SJDJDtab">实景多角度</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="SJDJDuContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
								$('#SJDJDuContainer').html('');
								div_id = 'SJDJDuContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('SJDJDtab');
								button.onclick=function(){
//									$('#SJDJDuContainer').html('');
//									div_id = 'SJDJDuContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "遥感常规图像"){
								var addInfoTab = $('<li id="YGCGtab">遥感常规</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="YGCGuiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#YGCGuiContainer').html('');
								div_id = 'YGCGuiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('YGCGtab');
								button.onclick=function(){
//									$('#YGCGuiContainer').html('');
//									div_id = 'YGCGuiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "立体图像"){
								var addInfoTab = $('<li id="LTtab">立体</li> ');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="LTiContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#LTiContainer').html('');
								div_id = 'LTiContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('LTtab');
								button.onclick=function(){
//									$('#LTiContainer').html('');
//									div_id = 'LTiContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "地形图"){
								var addInfoTab = $('<li id="DXTtab">地形图</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="DXTuContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#DXTuContainer').html('');
								div_id = 'DXTuContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('DXTtab');
								button.onclick=function(){
//									$('#DXTuContainer').html('');
//									div_id = 'DXTuContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "图式图像"){
								var addInfoTab = $('<li id="TSTXtab">图式图像</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="TSTXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#TSTXiangContainer').html('');
								div_id = 'TSTXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('TSTXtab');
								button.onclick=function(){
//									$('#TSTXiangContainer').html('');
//									div_id = 'TSTXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}else
							if(name == "遥感多时相图像"){
								var addInfoTab = $('<li id="YGDSXtab">遥感多时相</li>');
								addInfoTab.appendTo($("#tabs"));
								var addInfoDiv = $('<div id="YGDSXiangContainer"></div>');
						    	addInfoDiv.appendTo($("#AllContainer"));
						    	$('#YGDSXiangContainer').html('');
								div_id = 'YGDSXiangContainer';
								ax1(tmpId, val.urls,div_id);
								var button=document.getElementById('YGDSXtab');
								button.onclick=function(){
//									$('#YGDSXiangContainer').html('');
//									div_id = 'YGDSXiangContainer';
//									ax1(tmpId, val.urls,div_id);
//									ax1(tmpId, val.urls,div_id);
								}
								
							}
							
						}			
						
						/*
						
						var style = '';
						iconStr = 'iconCls:\'icon-img-large\''; 
						if (name == "三维图像") { 
							iconStr = 'iconCls:\'icon-3d-large\'';
							name = "三维";
							style = '_bold';
						} else if (name == "实景全景图像") {
							iconStr = 'iconCls:\'icon-qj-large\'';
							name = "全景";
							style = '_bold';
						} if (name == "视频") {
							iconStr = 'iconCls:\'icon-sp-large\'';
							style = '_bold';
						} if (name == "立体图像") {
							iconStr = 'iconCls:\'icon-lt-large\'';
							name = "立体";
							style = '_bold';
						} if (name !== "图式图像") {
							name = name.replace("图像", "");
						}
						if (!val.need) {
							style = '_noneed';
							iconStr = 'iconCls:\'icon-cancel-large\'';
						}
						iconStr += ',size:\'large\',iconAlign:\'top\',';
						var opt = 'data-options="' + iconStr + 'disabled:' + !val.exsit + '"';
						var label = $('<a href="javascript:void(0)" ' + opt +
							' class="linkbutton' + style + '")">' + name + '</a>');
						label.appendTo($('#labelContainer'));
						if (val.exsit) {
							if (val.type == "TP") {
							//	ax(tmpId, name, val.urls);
								div_id = 'DXTuContainer';
								ax1(tmpId, name, val.urls,div_id);
							} else if (val.type == "3D") {
							//	az(tmpId, name, val.urls);
								div_id = 'SWeiContainer';
								az1(tmpId, name, val.urls,div_id);
							} else if (val.type == "QJ") {
							//	bN(tmpId, name, val.urls);
								div_id = 'QJingContainer';
							    bN1(tmpId, name, val.urls,div_id);
							} else if (val.type == "SP") {
							//	bV(tmpId, name, val.urls);
								div_id = 'SPinContainer';
								bV1(tmpId, name, val.urls,div_id);
							}
						}
						$(label).on('click', function (event) {	//	设置范例种类图标的链接
							scrollTo('divContainer', tmpId);
						}); */
  						   
  						   
  						 $(document).ready(function(){  //标签
  						    $('#divContainer1').easyResponsiveTabs({
  						        type: 'default',
  						        width: 'auto',
  						        fit: true, // 100% fit in a container
  						        closed: 'accordion', // Start closed if in accordion view
  						        tabidentify: 'tab1',
  						        });
  						    });
					}
					
				} );
				var pShow = "该范例存在的数据类型有："+showExistData;
			    alert(pShow);
			/*	if ($('#labelContainer').html() == '')
					$('#labelContainer').html('<div class="nodata"><a>暂无</a></div>');
				$('.linkbutton').linkbutton();
				$('.linkbutton_bold').linkbutton();
				$('.linkbutton_noneed').linkbutton();*/
			}
		}, complete: function () { am(); }
	});
	R = false;
};
function F(htmlStr) {	//	向divContainer添加相关信息
	var div = $('<div id="id_define" style="width: ' + G + ';">');
	div.html(htmlStr); 
	div.prependTo($("#divContainer"));
}; 
/*
function ax(id, title, jsonData) {	//展示图片 id:对应的范例种类标号, title：范例种类, jsonData：各图像的url
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
		j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id + ' title="' + title +
		'"style="cursor:pointer;width:100%;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var htmlstr = '<ul>';
		for (i = 0; i < jsonData.length; i++) {
			htmlstr += '<li class="' + id + '_' + i + '"><img src="Instance/' + jsonData[i].url +
				'" alt="样例' + (i + 1) + '" /></li>';
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
}; */

function ax1(id,jsonData,div_id) {	//展示图片 id:对应的范例种类标号, title：范例种类, jsonData：各图像的url
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
			j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id + 
		'"style="cursor:pointer;width:100%;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var htmlstr = '<ul>';
		for (i = 0; i < jsonData.length; i++) {
			htmlstr += '<li class="' + id + '_' + i + '"><img src="Instance/' + jsonData[i].url +
				'" alt="样例' + (i + 1) + '" /></li>';
		}
		htmlstr += '</ul>';
		var T = $(htmlstr);
		T.appendTo(H);
		H.appendTo(l);
		var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
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
/*	
function az(id, title, jsonData) {	//	展示三维
	var u3ds = '1', umtl = '1', uobj = '1';
	for (i = 0; i < jsonData.length; i++) {
		if (u3ds == '1') {
			u3ds = jsonData[i].u3ds == undefined ? '1' : jsonData[i].u3ds;
		}
		if (umtl == '1') {
			umtl = jsonData[i].umtl == undefined ? '1' : jsonData[i].umtl;
		}
		if (uobj == '1') {
			uobj = jsonData[i].uobj == undefined ? '1' : jsonData[i].uobj;
		}
	}
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
		j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id + ' title="' + title +
		'" style="width:100%;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var url=jsonData[0].url;
		//var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/a_loader_collada.html?url=../Instance/' +
		var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/testlt01.html?url=../Instance/' +
			url + '"></iframe>');
		T.appendTo(H);
		H.appendTo(l);
		l.appendTo($("#divContainer"));
		$(H).panel();
	}
}; */
function az1(id, jsonData,div_id) {	//	展示三维
	var u3ds = '1', umtl = '1', uobj = '1';
	for (i = 0; i < jsonData.length; i++) {
		if (u3ds == '1') {
			u3ds = jsonData[i].u3ds == undefined ? '1' : jsonData[i].u3ds;
		}
		if (umtl == '1') {
			umtl = jsonData[i].umtl == undefined ? '1' : jsonData[i].umtl;
		}
		if (uobj == '1') {
			uobj = jsonData[i].uobj == undefined ? '1' : jsonData[i].uobj;
		}
	}
	var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
		j + '; float: left; margin:' + L + ';"></div>');
	var H = $('<div id=' + id +
		'" style="width:1045pt;height:100%;overflow:hidden;"></div>');
	if (jsonData.length > 0) {
		var url=jsonData[0].url;
		//var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/a_loader_collada.html?url=../Instance/' +
		var T = $('<iframe style="width:100%; height:100%;" src = "./threedtest/testlt01.html?url=../Instance/' +
			url + '"></iframe>');
		T.appendTo(H);
		H.appendTo(l);
		var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
		$(H).panel();
	}
};
/*
function bN(id, title, jsonData) {	//	展示全景
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        J + '; float: left; margin:' + K + ';"></div>');
    var H = $('<div id=' + id + ' title="' + title +
        '" style="width:100%;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "qj.html?url=Instance/' 
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
    }
};  */
function bN1(id,jsonData,div_id) {	//	展示全景
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        J + '; float: left; margin:' + K + ';"></div>');
  //  var H = $('<div id=' + id + ' title="' + title +
  //      '" style="width:1000pt;height:100%;overflow:hidden;"></div>');
    var H = $('<div id=' + id + 
        '" style="width:1045pt;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "qj.html?url=Instance/' 
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
        $(H).panel();
    }
};

function bV1(id, jsonData,div_id) {	//	展示视频
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        j + '; float: left; margin:' + L + ';"></div>');
    var H = $('<div id=' + id +
        '" style="width:1045px;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "sp.html?url=Instance/'
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        var div_id1 = '#'+div_id;
        l.appendTo($(div_id1));
        $(H).panel();
    }
};  /*
function bV(id, title, jsonData) {	//	展示视频
    var l = $('<div class="griditem" style="width: ' + O + '; height: ' +
        j + '; float: left; margin:' + L + ';"></div>');
    var H = $('<div id=' + id + ' title="' + title +
        '" style="width:1000pt;height:100%;overflow:hidden;"></div>');
    if (jsonData.length > 0) {
        var T = $('<iframe style="width:100%; height:100%;" src = "sp.html?url=Instance/'
            + jsonData[0].url + '"></iframe>');
        T.appendTo(H);
        H.appendTo(l);
        l.appendTo($("#divContainer"));
        $(H).panel();
    }
}; */

function C() {	//	搜索函数
	var word=$('#id_search').val();
    if (word != '') {
//        $('#id_searchresult').datagrid('load', { gjz: $('#id_search').val() });
    	var url="searchInstanceEasy.action?word="+word;
    	window.location.href=url;
    }
};

function scrollTo(be, h) {	//	转到不同的范例种类.be:放置范例的父容器(divContainer),h:放置范例的父容器
    var mainContainer = $('#' + be), scrollToContainer = $('#' + h);
    mainContainer.animate({
        scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop() - 60
    }, 500);
};
function ap() {	//	展示总采集情况
    $.ajax({
        crossDomain: true,
        type: "GET",
        async: true, 
        contentType: "application/json;charset=utf-8",
        url: "http://localhost/btk/s.asmx/getStatics?jsoncallback=?",
        data: { v: 0 },
        dataType: "jsonp",
        timeout: 5000, 
        jsonpCallback: 'jsoncallback',
        error: function (x, t, e) {
        	//alert(t); 
        },
        success: function (data) {
            var jsonData = eval(data);
            $('#staticsDiv').html("总数" + jsonData[0].total + "个（" + jsonData[0].noneed +
                "个不需要采集），已采集" + jsonData[0].done + "个");
        },
        complete: function () { }
    });
}

$.extend($.fn.datagrid.methods, {
    autoMergeCells : function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,
            j = 0,
            temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;
                    
                    if (group.length > 1) {
                        var before,
                        after,
                        megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index : megerIndex,
                                    field : field,
                                    rowspan : rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});

