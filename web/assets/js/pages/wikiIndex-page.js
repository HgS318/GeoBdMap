
var items_per_page = 10;
var page_selects = 5;

function gotoPage(page) {
    //  根据页码得到相应的结果要素，并填充到左侧结果列表中
    close_popup();
    var num_result = result_features.length;
    var total_pages = Math.ceil(num_result / items_per_page);
    var start_fid = items_per_page * (page - 1);
    var end_fid = start_fid + items_per_page;
    if(end_fid >= num_result){
        end_fid = num_result;
    }
    var page_features = [];
    var page_point_features = [];
    var page_line_features = [];
    var pid = 0, lid = 0;
    for (var i = start_fid; i < end_fid; i++){
        var feature = result_features[i];
        page_features[i - start_fid] = feature;
        var feature_shape = feature.geometry.type;
        if(feature_shape =="折线" ||  feature_shape =="LineString") {
            page_line_features[lid++] = feature;
        } else if(feature_shape =="点" ||  feature_shape =="Point"){
            page_point_features[pid++] = feature;
        }
    }
    var point_query = create_search_query(page_point_features);
    var line_query = create_search_query(page_line_features);
    layer_Def["0"] = point_query;
    layer_Def["1"] = line_query;
    d_layer.setLayerDefs(layer_Def);
    d_layer.addTo(map);

    add_markers(page_features);
    setResultItems(page_features,"searchresults", start_fid);
    fit_features_bound(map, page_features);

    //  根据页码的情况，修改页面中分页控件（id="hm_Paginate"）的内容
    document.getElementById("kkpager").innerHTML = "";

    var pre_element;
    if(page > 1) {
        pre_element = create_element("a","href", "#","<");
        pre_element.setAttribute("onclick", "gotoPage("+ (page - 1) +")");
    } else {
        pre_element = create_customize("span", "class","disabled","<");
    }
    document.getElementById("kkpager").appendChild(pre_element);
    var half_page_selects = Math.floor(page_selects / 2);
    var start = page - half_page_selects;
    if (start < 1) {
        start = 1;
    }
    var end = start + page_selects;
    if (end > total_pages) {
        end = total_pages + 1;
        start = end - 5;
        if (start < 1) {
            start = 1;
        }
    }
    if(start > 1) {
        var first_element = create_page_element(1);
        document.getElementById("kkpager").appendChild(first_element);
        var span0 = document.createElement("span");
        span0.innerText = "...";
        document.getElementById("kkpager").appendChild(span0);
    }
    for(var pg = start;pg < end; pg++) {
        if(pg == page){
            var this_element = document.createElement("span");
            this_element.setAttribute("class", "curr");
            var node = document.createTextNode(page);
            this_element.appendChild(node);
            document.getElementById("kkpager").appendChild(this_element);
        }
        else {
            var page_element = create_page_element(pg);
            document.getElementById("kkpager").appendChild(page_element);
        }
    }
    if(end <= total_pages){
        var span1 = document.createElement("span");
        span1.innerText = "...";
        document.getElementById("kkpager").appendChild(span1);
        var last_element = create_page_element(total_pages);
        document.getElementById("kkpager").appendChild(last_element);
    }
    var next_element;
    if(page < total_pages) {
        next_element = create_element("a", "href", "#", ">");
        next_element.setAttribute("onclick", "gotoPage("+ (page + 1) +")");
    } else {
        next_element = create_customize("span", "class", "disabled", ">");
    }
    document.getElementById("kkpager").appendChild(next_element);
    var text = "<br>&nbsp;&nbsp;共" + total_pages + "页/" + num_result +"条数据";
    var text_element = create_customize("span", "class", "normalsize", text);
    document.getElementById("kkpager").appendChild(text_element);
}

function create_element(type, attr, val ,text_){
    var ele = document.createElement(type);
    ele.setAttribute(attr, val);
    var node = document.createTextNode(text_);
    ele.appendChild(node);
    return ele;
}

function create_customize(type, attr, val , inner_html){
    var ele = document.createElement(type);
    ele.setAttribute(attr, val);
    ele.innerHTML = inner_html;
    return ele;
}

function create_page_element(page) {
    var a = document.createElement("a");
    var str = "第" + page + "页";
    a.setAttribute("href","#");
    a.setAttribute("onclick", "gotoPage(" + page + ")");
    a.setAttribute("title","第" + page + "页");
    a.innerText = page;
    // var node = document.createTextNode(page);
    // a.appendChild(node);
    return a;
}
