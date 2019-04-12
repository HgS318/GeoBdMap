<%--<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href='images/fav.ico' rel='icon' type='image/x-ico' />
    <title>“位置网”课题一演示测试平台</title>

	<link rel="stylesheet" type="text/css" href="download/jquery-easyui-1.7.0/themes/default/easyui.css">
	<!--<link rel="stylesheet" type="text/css" href="download/jquery-easyui-1.7.0/themes/icon.css">-->
	<link rel="stylesheet" type="text/css" href="download/jquery-easyui-1.7.0/demo/demo.css">
    <!--<link href="OntoSys/js/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css" />-->
    <link href="OntoSys/js/easyui/themes/icon.css" rel="stylesheet" type="text/css" />
    <link href="OntoSys/js/galleryview/css/jquery.galleryview-3.0-dev.css" rel="stylesheet" type="text/css" />
    <link href="OntoSys/js/main.css" rel="stylesheet" />
    <link href="OntoSys/css/easy-responsive-tabs.css" rel="stylesheet" />

    
    <!--<link href="js/bootstrap/css/bootstrap.min.css" rel="stylesheet">-->
	<link href="font-awesome/css/font-awesome.css" rel="stylesheet">
	<link href="css/plugins/social-buttons/social-buttons.css" rel="stylesheet">
	<link href="css/jquery-ui.min.css" rel="stylesheet" />
	<!--<link href="css/hummingmap.css" rel="stylesheet"/>-->
	<link href="css/kkpager.css" rel="stylesheet"/>
	<link href="css/search.css" rel="stylesheet"/>
	<!--<link href="js/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet"/>-->
	<link href="css/index.css" rel="stylesheet"/>
	<link href="css/spinkit.css" rel="stylesheet"/>
	<link href="css/jquery.autocomplete.css" rel="stylesheet"/>
	<link href="css/jquery.treeview.css" rel="stylesheet" />
	<link href="css/screen.css" rel="stylesheet" />
	<link href="css/pages/inline.style.sheet4.css" rel="stylesheet" />
	<link href="css/pages/g1m-mainpage.css" rel="stylesheet" />

	<link href="css/plugins/right-menu/context.standalone.css" rel="stylesheet" type="text/css" />

	<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
	<!--<script type="text/javascript" src="download/jquery-easyui-1.7.0/jquery.min.js"></script>-->
	<link rel="stylesheet" href="css/bmap-modify.css"/>
	<!--<link href="js/bootstrap/bootstrap-3.3.4.css" rel="stylesheet" type="text/css" />-->

	<!--<script src="OntoSys/js/easyui/jquery-1.44-min.js" type="text/javascript"></script>-->
	<!--<script src="js/jquery.js" type="text/javascript"></script>-->
    <!--<script src="js/jquery-1.10.2.min.js"></script>-->
	<script src="js/jquery-1.10.2.js"></script>
	<!--<script src="js/jquery-ui.min.js"></script>-->
	<!--<script src="js/jquery.cookie.js"></script>-->
	<!--<script src="js/jquery.treeview.js" type="text/javascript"></script>-->
	<script src="js/jquery.autocomplete.js" type="text/javascript"></script>
	<!--<script src='data/localdata.js' type='text/javascript'></script>-->
	<!--<script src="data/testdata.js" type="text/javascript" charset=”utf-8″></script>-->
	<!--<script src="js/jquery.treeview.edit.js" type="text/javascript"></script>-->
	<!--<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>-->


	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=SycUWXeBU9Z1tkvcNqmFxvo93cS4jbU7"></script>
	<script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>
    <!--  <script src="OntoSys/js/easyui/jquery-1.44-min.js" type="text/javascript"></script> -->

	<script type="text/javascript" src="download/jquery-easyui-1.7.0/jquery.easyui.min.js"></script>
	<!--<script src="OntoSys/js/easyui/jquery.easyui.min.js" type="text/javascript"></script>-->
	<script src="OntoSys/js/galleryview/jquery.timers-1.2.js" type="text/javascript"></script>
	<script src="OntoSys/js/galleryview/jquery.easing.1.3.js" type="text/javascript"></script>
	<script src="OntoSys/js/galleryview/jquery.galleryview-3.0-dev.js" type="text/javascript"></script>
	<script src="OntoSys/js/easyResponsiveTabs.js" type="text/javascript"></script>
	<!--<script src="OntoSys/js/easyui/jquery.iDialog.js"></script>-->
	<script src="js/pages/bd-mainpage-layout.js"></script>
	<script src="js/pages/bd-mainpage-map.js"></script>
	<script src="js/pages/bd-mainpage-infowin.js"></script>
	<script src="js/pages/relpos.js"></script>
	<script src="js/pages/posadd.js"></script>
	<!--<script src="OntoSys/js/my/instanceLoad.js" type="text/javascript" charset="utf-8"></script>-->

	<script src="http://www.jq22.com/jquery/bootstrap-3.3.4.js"></script>
	<!--<script src="../../../js/bootstrap/js/bootstrap.js" type="text/javascript"></script>-->
	<script src="js/plugins/right-menu/demo3.js"></script>
	<script src="js/plugins/right-menu/context.js"></script>
    
</head>
<body class="easyui-layout">
    <div id="northDiv" data-options="region:'north',border:false">
		<div id="logos" class="logos">
			<span><img id="icon" src="OntoSys/img/knowledge.png" /></span>
			<span>“位置网”课题一 演示测试平台</span>
			<span id="staticsDiv" class="statics"></span>
		</div>
    </div>

    <div id="westDiv" data-options="region:'west',split:true,collapsed:false,title:'功能目录'" style="width: 350px; padding: 2px;">
        <div id="tabsDiv" class="easyui-tabs" data-options="fit:true" style="cursor:pointer">

			<!--<div title="区域" data-options="iconCls:'icon-category'">-->
				<!--<ul id="id_tree_dist" style="margin-top: 10px;"></ul>-->
            <!--</div>-->

			<div title="位置叠加" data-options="iconCls:'icon-category'">
				<!--<ul id="id_tree_type" style="margin-top: 10px;"></ul>-->

				<div id="searchAllDiv" class="datagrid-toolbar" style="margin-bottom: 10px; padding:8px 4px 4px 5px;">
					<input class="easyui-searchbox" style="width: 100%; height: 30px; line-height: 30px"
						   data-options="prompt:'显示位置信息',menu:'#simplesearchtabsdiv',searcher:doSearchAll" />
					<div id="simplesearchtabsdiv">
						<div data-options="name:'allsimplesearch',iconCls:'icon-ok'">自动识别</div>
						<div data-options="name:'coordsearch'">坐标</div>
						<div data-options="name:'postcodesearch'">邮政编码</div>
						<div data-options="name:'phonesearch'">固定电话</div>
						<div data-options="name:'ipesearch'">固定IP</div>
					</div>
				</div>

				<!--融合-->
				<div id="fuseDiv" class="searchDiv">
					<div id="ClassCheckbox2" class="ClassCheckbox">
						<div id="highsearch2">
							<div id="feature2" class="nextTab" >
								<h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位置信息提取与叠加</h3>
							</div>
							<!--<br/>-->
							<!--<p style="line-height: 1px; height: 1px; font-size: 1px"></p>-->
							<div id="addrDiv" class="nextTab" >
								<!--<br/>-->
								<h3>&nbsp;&nbsp;地名/地址
									<!--&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="coordfile" name="uploadFile" accept="text/plain"-->
															  <!--onchange="openFile(event, 'addrtext')" />-->
								</h3>
								<textarea id="addrtext" rows="4" cols="32"></textarea>
								<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<!--<input type="file" id="addrfile" name="uploadFile" accept="text/plain"-->
										   <!--onchange="openFile(event, 'addrtext')" />-->
								<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="显示地名/地址" class="srhbtn" onclick="extract_address()">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="清除" class="srhbtn" onclick="clear_address()">
								</p>

							</div>

							<div id="coordDiv" class="nextTab" >
								<h3>&nbsp;&nbsp;坐标
									<!--&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="coordfile" name="uploadFile" accept="text/plain"-->
									<!--onchange="openFile(event, 'addrtext')" />-->
								</h3>
								<form method="post" action="/GeoBdMap/UploadShpServlet.do1" enctype="multipart/form-data">
									<!--<textarea id="coordtext" rows="4" cols="35"></textarea>-->
									<p>输入坐标：<input id="coordtext" class="innerWord"/></p>
									<p>坐标系：<select id="coordSys">
										<option value ="wgs">WGS 84</option>
										<option value ="gcj">火星坐标系</option>
										<option value="bd">百度坐标系</option>
									</select></p>
									<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<input type="file" id="coordfile" name="uploadFile" accept="text/plain"
											   onchange="openFileName(event, 'coordtext')" /></p>

									<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<input type="submit" value="显示坐标位置" class="srhbtn" onclick="extract_coords()">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<input type="button" value="清除" class="srhbtn" onclick="clear_coords()">
									</p>

								</form>
								</div>
							<div id="postDiv" class="nextTab" >
								<h3>&nbsp;&nbsp;邮政编码
									<!--&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="coordfile" name="uploadFile" accept="text/plain"-->
									<!--onchange="openFile(event, 'addrtext')" />-->
								</h3>
								<!--<textarea id="coordtext" rows="4" cols="35"></textarea>-->
								<p>输入邮编：<input id="posttext" class="innerWord"/></p>
								<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="显示邮编范围" class="srhbtn" onclick="extract_postcode()">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="清除" class="srhbtn" onclick="clear_postcode()">
								</p>
							</div>

							<div id="phoneDiv" class="nextTab" >
								<h3>&nbsp;&nbsp;固定电话
									<!--&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="coordfile" name="uploadFile" accept="text/plain"-->
									<!--onchange="openFile(event, 'addrtext')" />-->
								</h3>
								<textarea id="phonetext" rows="3" cols="32"></textarea>
								<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<!--<input type="file" id="phonefile" name="uploadFile" accept="text/plain"-->
										   <!--onchange="openFile(event, 'phonetext')" />-->
								<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="号码归属地" class="srhbtn" onclick="extract_phone_number()">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="清除" class="srhbtn" onclick="clear_phone_number()">
								</p>
							</div>

							<div id="ipDiv" class="nextTab" >
								<h3>&nbsp;&nbsp;固定IP
									<!--&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="coordfile" name="uploadFile" accept="text/plain"-->
									<!--onchange="openFile(event, 'addrtext')" />-->
								</h3>
								<textarea id="iptext" rows="3" cols="32"></textarea>
								<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<!--<input type="file" id="ipfile" name="uploadFile" accept="text/plain"-->
										   <!--onchange="openFile(event, 'iptext')" />-->
								<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="IP归属地" class="srhbtn" onclick="extract_ip()">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" value="清除" class="srhbtn" onclick="clear_ip()">
								</p>
							</div>

							<!--<div id="choosedists2" class="nextTab" >-->
								<!--<h3><input type="checkbox" id="distscheckbox2" checked onclick="toChooseDist(this)"/>&nbsp;全部区域</h3>-->
								<!--<div id="distscheckboxes2" class="nextTab">-->
									<!--<input type="checkbox" id="acheckbox" checked onclick=""/>区域A &nbsp;-->
									<!--<input type="checkbox" id="bcheckbox" checked onclick=""/>区域B &nbsp;-->
									<!--<input type="checkbox" id="ccheckbox" checked onclick=""/>区域C<br/>-->
									<!--<input type="checkbox" id="dcheckbox" checked onclick=""/>区域D &nbsp;-->
									<!--<input type="checkbox" id="echeckbox" checked onclick=""/>区域E &nbsp;-->
									<!--<input type="checkbox" id="fcheckbox" checked onclick=""/>区域F &nbsp;<br/>-->
									<!--<input type="checkbox" id="gcheckbox" checked onclick=""/>区域G &nbsp;-->
									<!--<input type="checkbox" id="hcheckbox" checked onclick=""/>区域H &nbsp;-->
									<!--<input type="checkbox" id="icheckbox" checked onclick=""/>区域I<br/>-->
									<!--<input type="checkbox" id="jcheckbox" checked onclick=""/>区域J &nbsp;-->
									<!--<input type="checkbox" id="kcheckbox" checked onclick=""/>区域K &nbsp;-->
									<!--<input type="checkbox" id="lcheckbox" checked onclick=""/>区域L<br/>-->
								<!--</div>-->
							<!--</div>-->

							<!--<div id="choosetime2" class="nextTab">-->
								<!--<h3><input type="checkbox" id="timecheckbox2" onclick="toChooseTime2(this)"/>&nbsp;时间</h3>-->
								<!--<div id="choosetimeitmes2" class="nextTab" style="display: none">-->
									<!--<p>起始时间 <input id="starttime2" type="text" class="easyui-datebox" style="width: 170px"></p>-->
									<!--<p>截止时间 <input id="endtime2" type="text" class="easyui-datebox" style="width: 170px"></p>-->
								<!--</div>-->
							<!--</div>-->

							<!--<div id="placesearch" class="nextTab">-->
								<!--<h3><input type="checkbox" id="placecheckbox" onclick="toSearchDists(this)"/>&nbsp;关键词</h3>-->
								<!--<div id="placeitems" class="nextTab">-->
									<!--<p>包含词：<input id="placeword" class="innerWord"/></p>-->
									<!--<p><input type="checkbox" id="placemmcheckbox" onclick=""/>包含多媒体信息</p>-->
								<!--</div>-->
							<!--</div>-->

						</div>

					</div>
					<br/> &nbsp;&nbsp;&nbsp;&nbsp;
					<button id="clearPosaddsBtn" class="srhbtn" onclick="clear_posadds()">清除叠加信息</button>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<button id="gotoProCaseBtn" class="srhbtn" onclick="gotoProtocolCases()">叠加协议案例演示</button> <p></p>
				</div>

			</div>

			<div title="位置感知" data-options="iconCls:'icon-mini-edit'">
				<!--<div id="boundmarkersall"></div>-->
				<!-- 简单查询 -->
				<div id="simpleSearchDiv" class="datagrid-toolbar" style="margin-bottom: 10px; padding:8px 4px 4px 5px;">

					<div id="abstractDiv" class="searchDiv">

						<br/><h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;文本的信息位置提取</h2>
						<p></p>
						<div class="ClassCheckbox">
							&nbsp;&nbsp;&nbsp;
							<textarea id="extrapostext" rows="6" cols="35"></textarea><br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<!--<input type="file" id="relposefile" name="uploadFile" accept="text/plain"-->
								   <!--onchange="openFile(event, 'extrapostext')" />-->
							<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<!--<input type="submit" value="提取位置信息" />-->&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="button" value="提取位置信息" class="srhbtn" onclick="extract_positions()">
							<br/><br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="checkbox" id="relative_checkbox" onclick="toShowRelatives(this)"/>显示相对位置

							<br/>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="showRelposOverlays()" value="显示提取的位置">
							&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="hideRelposOverlays()" value="隐藏提取的位置">
							&nbsp;&nbsp;&nbsp;&nbsp;<div id="extraposinfo"></div>
						</div>

					</div>
				</div>
			</div>

			<div id="listTab" title="用户分析" data-options="iconCls:'icon-search'">
				<br/>
				<div id="searchDiv" class="searchDiv">
					<div id="ClassCheckbox1" class="ClassCheckbox" action="searchInstance.action">
						<div id="highsearch">
							<div id="mapextent" class="nextTab" >
								<h3>&nbsp; 用户属性分析 / 地名消歧 等</h3>
								<p>建设中，详情请见：...</p>
							</div>
						</div>
					</div>
				</div>

			</div>

        </div>
    </div>

	<div id="eastDiv" data-options="region:'east',split:true" title="位置信息" style="width: 350px; padding: 2px;overflow-x: hidden">

		<div id="eastTabsDiv" class="easyui-tabs" data-options="fit:true" style="cursor:pointer;">

			<div title="信息列表" data-options="iconCls:'icon-more'">


				<div id="resultsdiv" class="easyui-accordion" style="width:100%;height:100%; float: right;">

					<div id="searchstat" title="信息汇总" selected="true" style="overflow:auto;">
						<h3 style="color:#0099FF; text-align: center">信息条目汇总</h3>
						<!--<div id="distinfo" style="display: none">-->
							<!--<p id="distname" style="text-align: center" onclick="toPlaceRes()">行政区名称：</p>-->
							<!--<p id="numval" style="text-align: center" onclick="toPlaceRes()">乡村数：</p>-->
							<!--<p id="numcomu" style="text-align: center" onclick="toPlaceRes()">社区数：</p>-->
							<!--<p id="subcom" style="text-align: center" onclick="toPlaceRes()">下属村、居委会：</p>-->
						<!--</div>-->
						<p id="placeintotal" style="text-align: center" onclick="toPlaceRes()">地点：0条记录</p>
						<p id="distintotal" style="text-align: center" onclick="toDistRes()">区域：0条记录</p>
						<p id="boundintotal" style="text-align: center" onclick="toBoundRes()">路线：0条记录</p>
						<p id="bmintotal" style="text-align: center" onclick="toBmRes()">事件：0条记录</p>

						<br/>
						<p style="text-align: center">
							<button id="outputbtn" class="srhbtn" onclick="openResultWindow()">
								查询结果详情</button></p>
					</div>

					<div title="地点" id="placeresultsdiv" >
						<div id="placeresults"></div>
						<div id="hm_Paginate_places"></div>
					</div>

					<div title="区域" id="distresultsdiv">
						<div id="distresults"></div>
						<div id="hm_Paginate_dists"></div>
					</div>

					<div title="路线" id="boundresultsdiv">
						<div id="boundresults"></div>
						<div id="hm_Paginate_bounds"></div>
					</div>

					<div title="事件" id="bmresultsdiv">
						<div id="boundmarkrsresults"></div>
						<div id="hm_Paginate_boundmarkers"></div>
					</div>

				</div>

				<div id="hiddendiv" class="hiddendiv"></div>

			</div>

			<div id="manageTab" title="功能列表" data-options="iconCls:'icon-man'">

				<div id="manageDiv" class="searchDiv">

					<div id="manageAll">

						<div id="geonamemag" class="nextTab" >
							<h3>案例1</h3>
							<div class="nextTab tab260">
								<p>1. 介绍；</p>
								<p>2. 方法。</p>
							</div>
						</div>

						<div id="distmag" class="nextTab" >
							<h3>案例2</h3>
							<div class="nextTab tab260">
								<p>1. 介绍；</p>
								<p>2. 方法。</p>
							</div>
						</div>

						<div id="boundmag" class="nextTab" >
							<h3>案例3</h3>
							<div class="nextTab tab260">
								<p>1. 介绍；</p>
								<p>2. 方法。</p>
							</div>
						</div>

						<div id="bmmag" class="nextTab" >
							<h3>案例...</h3>
							<div class="nextTab tab260">
								<p>1. 介绍；</p>
								<p>2. 方法。</p>
							</div>
						</div>

					</div>
					<div id="y" class="easyui-window" title="Basic Window" data-options="iconCls:'icon-save',closed:true" style="width:500px;height:500px;padding:10px;"></div>


				</div>

			</div>

		</div>

	</div>

	<div id="centerDiv" data-options="region:'center',title:'图示'" style="padding: 6px; overflow-y: scroll">
        <div class="floatDiv" id="floatDiv">
        </div>
        
        <div id="mapContainer" style="width:100%; height: 100%"></div>
		<div class='button-group' style="background-color: #0d9bf2;right: 20px">
			<input type="checkbox" id="toolbarPlaces" checked onclick="placesCheckBox(this)"/>地点
			<input type="checkbox" id="toolbarDists" checked onclick="distsCheckBox(this)"/>区域
			<input type="checkbox" id="toolbarBounds" checked onclick="boundsCheckBox(this)"/>路线
			<input type="checkbox" id="toolbarBoundMarkers" checked onclick="boundMarksCheckBox(this)"/>事件
			<!--<input type="checkbox" id="overview" disabled/>鹰眼-->
			<!--<input type="checkbox" id="overviewOpen" disabled />展开鹰眼-->
		</div>
      <!--  <div id="divContainer">  -->  
        <!--<div id="divContainer1">-->
        	<!---->
          <!--<ul id=tabs class="resp-tabs-list tabContainer tab1"></ul>-->
          <!--<div id="AllContainer" class="resp-tabs-container tab1"></div>-->
         <!--&lt;!&ndash; <div id="divContainer"></div> &ndash;&gt;   -->
    	<!--</div>-->


	</div>
    

    


</body>

</html>