
var posadd = {
    addr_overlays :[],
    coord_overlays: [],
    post_overlays:[],
    city_polygons: []

};


function extract_address() {
    
}

function extract_coords() {
    
}

function extract_postcode() {
    
}

function extract_phone_number() {
    
}

function extract_ip() {
    
}

function clear_address() {

}

function clear_coords() {

}

function clear_postcode() {

}

function clear_phone_number() {

}

function clear_ip() {

}

function clear_posadds() {
    
}

function gotoProtocolCases() {
    
}

function doSearchAll() {
    
}

var openFile = function(event, divName){
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        if(reader.result){
            var text = reader.result;
            alert(text);
            document.getElementById(divName).value = text;
            if(divName == "extrapostext") {
                relpos.text = text;
            } else if(divName == "addrtext") {

            }
        }
    };
    reader.readAsText(input.files[0]);
};

var openFileName = function (event, divName) {
    var input = event.target;
    var file = input.files[0];
    // var file = event.files[0];
    var url = getObjectURL(file);
    document.getElementById(divName).value = url;
    // var reader = new FileReader();
    // reader.onload = function(){
    //     if(reader.result){
    //         var text = reader.result;
    //         alert(text);
    //         document.getElementById(divName).value = text;
    //         if(divName == "extrapostext") {
    //             relpos.text = text;
    //         } else if(divName == "addrtext") {
    //
    //         }
    //     }
    // };
    // reader.readAsText(input.files[0]);
};

function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


