/**
*=================================================================
*Name:			叶子js分页样式（ShowoPage Style With JS）
*RCSfile:		Cls_jsPage.js
*Revision:		0.06Beta
*Author:		Yehe(叶子)
*Released:		2005-04-26 13:11:42
*Description:	js分页样式，显示上一页下一页的翻页结果
*Contact:		QQ:311673,MSN:myehe@msn.com
*WebSite:		http://www.yehe.org,http://www.showo.com
*=================================================================
*/


function Cls_jsPage(iRecCount,iPageSize,iPageNum,sName){
	this.iRC=Cls_jsPage.fFormatNum(iRecCount,1,0,0,0);//总记录条数
	this.iPS=Cls_jsPage.fFormatNum(iPageSize,1,0,1,0);//每页记录数目
	this.iPN=Cls_jsPage.fFormatNum(iPageNum,0,0,0,0);//显示的前后页数,0为显示所有,负数为这么多页面一个跳转
	this.sN=sName;//实例对象名
	this.sTPage="{$Page}";//页数
	this.sTPageCount="{$PageCount}";//总页数
	this.sTRecCount="{$RecCount}";//总记录数
	this.sTPageSize="{$PageSize}";//每页记录数
	this.sTPageFrist="{$PageFrist}";//首页
	this.sTPagePrev="{$PagePrev}";//上页
	this.sTPageNext="{$PageNext}";//下页
	this.sTPageLast="{$PageLast}";//尾页
	this.sTPageText="{$PageText}";//数字跳转
	this.sTPageTextF="{$PageTextF}";//数字跳转框架
	this.sTPageInput="{$PageInput}";//输入框跳转
	this.sTPageSelect="{$PageSelect}";//下拉菜单跳转
	this.sTPageNum="{$PageNum}";//数字页数
	this.iPC=this.getPageCount();//得到页数
}
//输入 页数开始值，结尾值
Cls_jsPage.prototype.setPageSE=function(sPageStart,sPageEnd){
	var sPS=sPageStart,sPE=sPageEnd;
	this.sPS=(sPS.length>0)?sPS:"Page=";
	this.sPE=(sPE.length>0)?sPE:"";
}
//输入 网址
Cls_jsPage.prototype.setUrl=function(sUrl){
	var s=sUrl;
	this.Url=(s.length>0)?s:""+document.location;
}
//输入 输入框&下拉框name值
Cls_jsPage.prototype.setPageInput=function(sPageInput){
	var sPI=sPageInput;
	this.sPI=(sPI.length>0)?sPI:"Page";
}
//输入 语言 首页(Disable,Enale)
Cls_jsPage.prototype.setPageFrist=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PF_D=sD;
	this.PF_E=sE;
}
//输入 语言 上页
Cls_jsPage.prototype.setPagePrev=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PP_D=sD;
	this.PP_E=sE;
}
//输入 语言 下页
Cls_jsPage.prototype.setPageNext=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PN_D=sD;
	this.PN_E=sE;
}
//输入 语言 尾页
Cls_jsPage.prototype.setPageLast=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PL_D=sD;
	this.PL_E=sE;
}
//输入 语言 数字跳转
Cls_jsPage.prototype.setPageText=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PT_D=sD;//"[{$PageNum}]"
	this.PT_E=sE;//"第{$PageNum}页"
}
//输入 语言 数字跳转外围模板
Cls_jsPage.prototype.setPageTextF=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PTF_D=sD;//"&nbsp;{$PageTextF}&nbsp;"
	this.PTF_E=sE;//"&nbsp;{$PageTextF}&nbsp;"
}
//输入 语言 下拉菜单跳转
Cls_jsPage.prototype.setPageSelect=function(sDis,sEn){
	var sD=sDis,sE=sEn;
	this.PS_D=sD;//"[{$PageNum}]"
	this.PS_E=sE;//"第{$PageNum}页"
}
//输入 css
Cls_jsPage.prototype.setPageCss=function(sCssPageText,sCssPageInput,sCssPageSelect){
	var sCPT=sCssPageText,sCPI=sCssPageInput,sCPS=sCssPageSelect;
	this.CPT=sCPT;//数字跳转css
	this.CPI=sCPI;//输入框跳转css
	this.CPS=sCPS;//下拉菜单跳转css
}
//输入 Html模板
Cls_jsPage.prototype.setHtml=function(sHtml){
	var sH=sHtml;
	this.Html=sH;//Html模板
}

//计算页数
Cls_jsPage.prototype.getPageCount=function(){
	var iRC=this.iRC,iPS=this.iPS,i=0;
	i=(iRC%iPS==0)?(iRC/iPS):(Cls_jsPage.fFormatNum((iRC/iPS),1,0,0,0)+1);
	return (i);
}
//取得模板页数和当前页数
Cls_jsPage.prototype.getUrl=function(iType){
	var s=this.Url,sPS=this.sPS,sPE=this.sPE,sTP=this.sTPage,iPC=this.iPC;
	var iT=iType;
	var i,sPageIndex;
	if (s.indexOf(sPS)==-1) {	
		s+=(s.indexOf("?")==-1)?"?"+sPS+sTP:"&"+sPS+sTP;
		//s=Cls_jsPage.fReg(sU,"(&+)","&");
		//s=Cls_jsPage.fReg(sU,"(\?&)","\?");
		i=1;
	}
	else {
		sReg="(\\S.*)"+Cls_jsPage.fFormatReg(sPS)+"(\\d*)"+Cls_jsPage.fFormatReg(sPE)+"(\\S.*|\\S*)";
		sPageIndex=Cls_jsPage.fReg(s,sReg,"$3");
		s=s.replace(sPS+sPageIndex+sPE,sPS+sTP+sPE);
		i=Cls_jsPage.fFormatNum(sPageIndex,1,1,0,iPC);
	}
	return (iT==0?s:i)
}
//页面跳转
Cls_jsPage.prototype.PageJump=function(){
	var sPL,sPV,sP;
	var sU=this.getUrl(0),iPI=this.getUrl(1);
	var sPI=this.sPI,sTP=this.sTPage,iPC=this.iPC;
	eval("sPL=document.getElementsByName(\""+sPI+"\").length;");
	if (sPL>1) {
		for (i=0;i<sPL;i++)	{
			eval("sPV=document.all."+sPI+"[i].value;");
			sP=Cls_jsPage.fFormatNum(sPV,1,1,0,iPC);
			if (sP>0) {
				location.href(sU.replace(sTP,sP));
				break;
			}
		}
	}
	else {
		eval("sPV=document.all."+sPI+".value;");
		sP=Cls_jsPage.fFormatNum(sPV,1,1,0,iPC);
		if (sP>0&&(sP!=iPI)) {
			location.href(sU.replace(sTP,sP));
		}
	}
}
//输出
Cls_jsPage.prototype.Write=function(){
	var sU=this.getUrl(0),iPI=this.getUrl(1);
	var sN=this.sN,sPI=this.sPI;
	var iPC=this.iPC,iPN=this.iPN;;
	var iRC=this.iRC,iPS=this.iPS;
	var PF_D=this.PF_D,PF_E=this.PF_E;
	var PP_D=this.PP_D,PP_E=this.PP_E;
	var PN_D=this.PN_D,PN_E=this.PN_E;
	var PL_D=this.PL_D,PL_E=this.PL_E;
	var PT_D=this.PT_D,PT_E=this.PT_E;
	var PTF_D=this.PTF_D,PTF_E=this.PTF_E;
	var PS_D=this.PS_D,PS_E=this.PS_E;
	var CPT=this.CPT,CPI=this.CPI;
	var CPS=this.CPS,iPN=this.iPN;
	var s=this.Html;
	sTPage=this.sTPage;
	sTPageCount=this.sTPageCount;
	sTRecCount=this.sTRecCount;
	sTPageSize=this.sTPageSize;
	sTPFrist=this.sTPageFrist;
	sTPPrev=this.sTPagePrev;
	sTPNext=this.sTPageNext;
	sTPLast=this.sTPageLast;
	sTPText=this.sTPageText;
	sTPTextF=this.sTPageTextF;
	sTPInput=this.sTPageInput;
	sTPSelect=this.sTPageSelect;
	sTPageNum=this.sTPageNum;
	PrevP=Cls_jsPage.fFormatNum((iPI-1),1,1,1,iPC);
	NextP=Cls_jsPage.fFormatNum((iPI+1),1,1,1,iPC);
	if (iPI<=1&&iPC<=1) {
		FirstPU=PF_D;  
		PrevPU=PP_D;
		NextPU=PN_D;
		LastPU=PL_D;
	}
	else if (iPI==1&&iPC>1) {
		FirstPU=PF_D;  
		PrevPU=PP_D;
		NextPU="<A class='o' href=\""+sU.replace(sTPage,NextP)+"\">"+PN_E+"</A>";
		LastPU="<A class='o' href=\""+sU.replace(sTPage,iPC)+"\">"+PL_E+"</A>";
	}
	else if (iPI==iPC) {
		FirstPU="<A class='o' href=\""+sU.replace(sTPage,1)+"\">"+PF_E+"</A>";
		PrevPU="<A class='o' href=\""+sU.replace(sTPage,PrevP)+"\">"+PP_E+"</A>";
		NextPU=PN_D;
		LastPU=PL_D;
	}
	else {
		FirstPU="<A class='o' href=\""+sU.replace(sTPage,1)+"\">"+PF_E+"</A>";
		PrevPU="<A class='o' href=\""+sU.replace(sTPage,PrevP)+"\">"+PP_E+"</A>";
		NextPU="<A class='o' href=\""+sU.replace(sTPage,NextP)+"\">"+PN_E+"</A>";
		LastPU="<A class='o' href=\""+sU.replace(sTPage,iPC)+"\">"+PL_E+"</A>";
	}
	PageSelect="";
	PageText="";
	PageInput="";
	if (iPN<0) {
		iPN=Math.abs(iPN);
		PageStart=(iPI%iPN==0)?(iPI/iPN):(Cls_jsPage.fFormatNum((iPI/iPN),1,0,0,0));
		PageStart=(PageStart*iPN==iPI)?((PageStart-1)*iPN+1):(PageStart*iPN+1);
		PageEnd=Cls_jsPage.fFormatNum(PageStart+iPN,0,1,0,iPC)
	}
	else if (iPN==0) {
		PageStart=1;
		PageEnd=iPC;
	}
	else {
		PageStart=Cls_jsPage.fFormatNum((iPI-iPN),1,0,1,0);
		PageEnd=Cls_jsPage.fFormatNum((PageStart+iPN*2),0,1,0,iPC);
		PageStart=(PageEnd==iPC)?Cls_jsPage.fFormatNum((PageEnd-iPN*2),1,0,1,0):PageStart;
	}
	if (iPC>=1) {
		PageSelect="<Select class=\""+CPS+"\" name=\""+sPI+"\" onChange=\""+sN+".PageJump()\">";
		PageInput="<Input class=\""+CPI+"\" type=\"text\" name=\""+sPI+"\" size=\"5\" maxlength=\"10\" onkeydown=\"if (event.keyCode==13) "+sN+".PageJump()\">";
		for (i=PageStart;i<=PageEnd;i++) {
			if (i!=iPI) {
				XX="<A class=\""+CPT+"\" href=\""+sU.replace(sTPage,i)+"\">"+PT_E.replace(sTPageNum,i)+"</A>";
				PageText+=PTF_E.replace(sTPTextF,XX);
				PageSelect+="<Option value=\""+i+"\">"+PS_E.replace(sTPageNum,i)+"</Option>";
			}
			else {
				XX="<span class='obg'>"+PT_D.replace(sTPageNum,i)+"</span>";
				PageText+=PTF_D.replace(sTPTextF,XX);
				PageSelect+="<Option Selected=\"Selected\">"+PS_D.replace(sTPageNum,i)+"</Option>";
			}
		}
		PageSelect+="</Select>";
	}	
	s=s.replace(sTPage,iPI);
	s=s.replace(sTPageCount,iPC);
	s=s.replace(sTRecCount,iRC);
	s=s.replace(sTPageSize,iPS);
	s=s.replace(sTPFrist,FirstPU);
	s=s.replace(sTPPrev,PrevPU);
	s=s.replace(sTPNext,NextPU);
	s=s.replace(sTPLast,LastPU);
	s=s.replace(sTPText,PageText);
	s=s.replace(sTPInput,PageInput);
	s=s.replace(sTPSelect,PageSelect);
	document.write (s);
}

//输出Html代码
Cls_jsPage.prototype.GetHtml=function(){
	var sU=this.getUrl(0),iPI=this.getUrl(1);
	var sN=this.sN,sPI=this.sPI;
	var iPC=this.iPC,iPN=this.iPN;;
	var iRC=this.iRC,iPS=this.iPS;
	var PF_D=this.PF_D,PF_E=this.PF_E;
	var PP_D=this.PP_D,PP_E=this.PP_E;
	var PN_D=this.PN_D,PN_E=this.PN_E;
	var PL_D=this.PL_D,PL_E=this.PL_E;
	var PT_D=this.PT_D,PT_E=this.PT_E;
	var PTF_D=this.PTF_D,PTF_E=this.PTF_E;
	var PS_D=this.PS_D,PS_E=this.PS_E;
	var CPT=this.CPT,CPI=this.CPI;
	var CPS=this.CPS,iPN=this.iPN;
	var s=this.Html;
	sTPage=this.sTPage;
	sTPageCount=this.sTPageCount;
	sTRecCount=this.sTRecCount;
	sTPageSize=this.sTPageSize;
	sTPFrist=this.sTPageFrist;
	sTPPrev=this.sTPagePrev;
	sTPNext=this.sTPageNext;
	sTPLast=this.sTPageLast;
	sTPText=this.sTPageText;
	sTPTextF=this.sTPageTextF;
	sTPInput=this.sTPageInput;
	sTPSelect=this.sTPageSelect;
	sTPageNum=this.sTPageNum;
	PrevP=Cls_jsPage.fFormatNum((iPI-1),1,1,1,iPC);
	NextP=Cls_jsPage.fFormatNum((iPI+1),1,1,1,iPC);
	if (iPI<=1&&iPC<=1) {
		FirstPU=PF_D;  
		PrevPU=PP_D;
		NextPU=PN_D;
		LastPU=PL_D;
	}
	else if (iPI==1&&iPC>1) {
		FirstPU=PF_D;  
		PrevPU=PP_D;
		NextPU="<A class='o' href=\""+sU.replace(sTPage,NextP)+"\">"+PN_E+"</A>";
		LastPU="<A class='o' href=\""+sU.replace(sTPage,iPC)+"\">"+PL_E+"</A>";
	}
	else if (iPI==iPC) {
		FirstPU="<A class='o' href=\""+sU.replace(sTPage,1)+"\">"+PF_E+"</A>";
		PrevPU="<A class='o' href=\""+sU.replace(sTPage,PrevP)+"\">"+PP_E+"</A>";
		NextPU=PN_D;
		LastPU=PL_D;
	}
	else {
		FirstPU="<A class='o' href=\""+sU.replace(sTPage,1)+"\">"+PF_E+"</A>";
		PrevPU="<A class='o' href=\""+sU.replace(sTPage,PrevP)+"\">"+PP_E+"</A>";
		NextPU="<A class='o' href=\""+sU.replace(sTPage,NextP)+"\">"+PN_E+"</A>";
		LastPU="<A class='o' href=\""+sU.replace(sTPage,iPC)+"\">"+PL_E+"</A>";
	}
	PageSelect="";
	PageText="";
	PageInput="";
	if (iPN<0) {
		iPN=Math.abs(iPN);
		PageStart=(iPI%iPN==0)?(iPI/iPN):(Cls_jsPage.fFormatNum((iPI/iPN),1,0,0,0));
		PageStart=(PageStart*iPN==iPI)?((PageStart-1)*iPN+1):(PageStart*iPN+1);
		PageEnd=Cls_jsPage.fFormatNum(PageStart+iPN,0,1,0,iPC)
	}
	else if (iPN==0) {
		PageStart=1;
		PageEnd=iPC;
	}
	else {
		PageStart=Cls_jsPage.fFormatNum((iPI-iPN),1,0,1,0);
		PageEnd=Cls_jsPage.fFormatNum((PageStart+iPN*2),0,1,0,iPC);
		PageStart=(PageEnd==iPC)?Cls_jsPage.fFormatNum((PageEnd-iPN*2),1,0,1,0):PageStart;
	}
	if (iPC>=1) {
		PageSelect="<Select class=\""+CPS+"\" name=\""+sPI+"\" onChange=\""+sN+".PageJump()\">";
		PageInput="<Input class=\""+CPI+"\" type=\"text\" name=\""+sPI+"\" size=\"5\" maxlength=\"10\" onkeydown=\"if (event.keyCode==13) "+sN+".PageJump()\">";
		for (i=PageStart;i<=PageEnd;i++) {
			if (i!=iPI) {
				XX="<A class=\""+CPT+"\" href=\""+sU.replace(sTPage,i)+"\">"+PT_E.replace(sTPageNum,i)+"</A>";
				PageText+=PTF_E.replace(sTPTextF,XX);
				PageSelect+="<Option value=\""+i+"\">"+PS_E.replace(sTPageNum,i)+"</Option>";
			}
			else {
				XX="<span class='obg'>"+PT_D.replace(sTPageNum,i)+"</span>";
				PageText+=PTF_D.replace(sTPTextF,XX);
				PageSelect+="<Option Selected=\"Selected\">"+PS_D.replace(sTPageNum,i)+"</Option>";
			}
		}
		PageSelect+="</Select>";
	}	
	s=s.replace(sTPage,iPI);
	s=s.replace(sTPageCount,iPC);
	s=s.replace(sTRecCount,iRC);
	s=s.replace(sTPageSize,iPS);
	s=s.replace(sTPFrist,FirstPU);
	s=s.replace(sTPPrev,PrevPU);
	s=s.replace(sTPNext,NextPU);
	s=s.replace(sTPLast,LastPU);
	s=s.replace(sTPText,PageText);
	s=s.replace(sTPInput,PageInput);
	s=s.replace(sTPSelect,PageSelect);
	return s;
}

//输入：欲格式化字符，是否有最小值（0表示没有,1表示有），是否有最大值，最小值（默认值），最大值
Cls_jsPage.fFormatNum=function(sNum,bMin,bMax,iMinNum,iMaxNum){
	var i,iN,iTMin,iTMax,sN=""+sNum,bMi=bMin,bMa=bMax,iMin=iMinNum,iMax=iMaxNum;
	if (sN.length>0) {
		iN=parseInt(sN,10);
		i=(isNaN(iN))?iMin:iN;
		i=(i<iMin&&bMi==1)?iMin:i;
		i=(i>iMax&&bMa==1)?iMax:i;
	}
	else {
		i=iMin;
	}
	return (i);
}
//输入：欲正则字符，正则表达式，替换后字符
Cls_jsPage.fReg=function(sStr,sReg,sRe){
	var s="",sS=sStr,sR=sReg,sRe=sRe;
	if ((sS.length>0)&&(sR.length>0)) {
		eval("re=/"+sR+"/gim;");
		s=sS.replace(re,sRe);
	}
	return (s);
}
//格式化正则中的特殊字符
Cls_jsPage.fFormatReg=function(sReg){
	var s="",sR=sReg;
	var sF=new Array ("/",".","+","[","]","{","}","$","^","?","*");
	if (sR.length>0) {
		for (i=0;i<=sF.length;i++) {
			sR=sR.replace(sF[i],"\\"+sF[i]);
		}
		s="("+sR+")";
	}
	return (s);
}