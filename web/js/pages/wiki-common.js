

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return decodeURIComponent(result[1]);
}

function searchWord() {
    var srhname = document.getElementById("name0").value;
    if(srhname && "" != srhname) {
        // if(data && data.name && data.name == srhname) {
        //     return;
        // }
        // var newurl = "wikiContent_fitall.html?name=" + srhname;
        var newurl = "wiki-list.html?words=" + srhname;
        window.open(newurl);
    }
}

function srchkeypress(e) {
    var keynum = window.event ? e.keyCode : e.which;
    if(13 == keynum) {
        searchWord();
    }
}
