/**
 * Created by Administrator on 2017/8/2 0002.
 */

$(function() {

    // var basicinfo = getCookie('basicinfo');
    
    $.ajax({
        url: 'getSessionAttribute.action?type=searchinfo',
        type: 'get',
        dataType: 'text',
        success: function (data) {
            var info = data + "当前时间：" + getNowFormatDate() + "<br/>";
            $("#infodiv")[0].innerHTML = info;

            var addplace = false;
            $('#placedatadiv').datagrid({
                url: 'getSessionAttribute.action?type=placeresult',
                fitColumns: true,
                onLoadSuccess: function (data) {
                    if(addplace) {
                        return;
                    }
                    if(data && data.rows && data.rows.length) {
                        $("#infodiv")[0].innerHTML += "地名：" + data.rows.length + "条记录<br/>";
                    } else {
                        $("#infodiv")[0].innerHTML += "地名：0条记录<br/>";
                    }
                    addplace = true;
                }
            });

            var adddist = false;
            $('#distdatadiv').datagrid({
                url: 'getSessionAttribute.action?type=distresult',
                //	url: 'getSearchResult.action?type=boundresult',
                //	url: 'getSearchResult.action?type=boundmarkerresult',
                fitColumns: true,
                onLoadSuccess: function (data) {
                    if(adddist) {
                        return;
                    }
                    if(data && data.rows && data.rows.length) {
                        $("#infodiv")[0].innerHTML += "行政区：" + data.rows.length + "条记录<br/>";
                    } else {
                        $("#infodiv")[0].innerHTML += "行政区：0条记录<br/>";
                    }
                    adddist = true;
                }
            });

            var addbound = false;
            $('#bounddatadiv').datagrid({
                url: 'getSessionAttribute.action?type=boundresult',
                fitColumns: true,
                onLoadSuccess: function (data) {
                    if(addbound) {
                        return;
                    }
                    if(data && data.rows && data.rows.length) {
                        $("#infodiv")[0].innerHTML += "行政界线：" + data.rows.length + "条记录<br/>";
                    } else {
                        $("#infodiv")[0].innerHTML += "行政界线：0条记录<br/>";
                    }
                    addbound = true;
                }
            });

            var addbm = false;
            $('#boundmarkerdatadiv').datagrid({
                url: 'getSessionAttribute.action?type=boundmarkerresult',
                fitColumns: true,
                onLoadSuccess: function (data) {
                    if(addbm) {
                        return;
                    }
                    if(data && data.rows && data.rows.length) {
                        $("#infodiv")[0].innerHTML += "界桩界碑：" + data.rows.length + "条记录<br/>";
                    } else {
                        $("#infodiv")[0].innerHTML += "界桩界碑：0条记录<br/>";
                    }
                    addbm = true;
                }
            });

        }, error: function (data) { }
    });


});

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    if(h < 9) {
        h = "0" + h;
    }
    var m = date.getMinutes();
    if(m < 9) {
        m = "0" + m;
    }
    var s = date.getSeconds();
    if(s < 9) {
        s = "0" + s;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + h + seperator2 + m + seperator2 + s;
    return currentdate;
}

function getCookie(name)
{
    //document.cookie.setPath("/");
    var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    {
        return unescape(arr[2]);
    }
    else
    {
        return null;
    }
}
