;
(function($) {
    var options = {
        wrap: null, //包裹整个上传控件的元素
        width: -1, //预览图片的宽度
        height: -1, //预览图片的高度
        auto: false, //是否自动上传
        fileVal: "file", // [默认值：'file'] 设置文件上传域的name。
        method: "POST",//请求方式，默认post
        sendAsBlob: false,//是否以二进制流的形式发送
        viewImgHorizontal: true,//预览图是否水平垂直居中
        btns: {
            uploadBtn: null, //开始上传按钮
            retryBtn: null, //用户自定义"重新上传"按钮
            chooseBtn: null,// 指定选择文件的按钮容器，不指定则不创建按钮。选择器支持 id, class, dom。
            chooseBtnText: "点击选择图片"//选择文件按钮显示的文字
        },
        multiple: true, //是否支持多选能力
        swf: "Uploader.swf", //swf文件路径
        url: "upload.php", //图片上传的路径
        datas: null, //上传的参数
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！false为不压缩
        resize: false,
        //是否可以重复上传，即上传一张图片后还可以再次上传。默认是不可以的，false为不可以，true为可以
        duplicate: false,
        maxFileNum: 20, //最大上传文件个数
        maxFileTotalSize: 10485760, //最大上传文件大小，默认10M
        maxFileSize: 2097152, //单个文件最大大小，默认2M
        showToolBtn: true, //当鼠标放在图片上时是否显示工具按钮,
        onFileAdd: null, //当有图片进来后所处理函数
        onDelete: null, //当预览图销毁时所处理函数
        uploadFailTip: null, //当单个文件上传失败时执行的函数，会传入当前显示图片的包裹元素，以便用户操作这个元素
        onError: null, //上传出错时执行的函数
        notSupport: null, //当浏览器不支持该插件时所执行的函数
        onSuccess: null //当上传成功（此处的上传成功指的是上传图片请求成功，并非图片真正上传到服务器）后所执行的函数，会传入当前状态及上一个状态
    },
    supportTransition = (function() { //判断浏览器是否支持transition属性
        var s = document.createElement('p').style,
            r = 'transition' in s || 'WebkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;
        s = null;
        return r;
    })();
    /*判断元素是否是dom元素*/
    function isElement(obj){
        if(obj.nodeName && obj.nodeType){
            return true;
        }
        return false;
    }
    /* 当有文件添加进来时执行，负责view的创建 uploader为uploader对象，prevConfig为预览图的宽、高配置*/
    function addFile(file,uploader,$queue,percentages) {
        var $li = $('<li id="' + file.id + '">' + '<p class="title">' + file.name + '</p>' + '<p class="imgWrap"></p>' + '<p class="progress"><span></span></p>' + '</li>'),
            $btns = options.showToolBtn ? $('<div class="file-panel">' + '<span class="cancel">删除</span>' + '<span class="rotateRight">向右旋转</span>' + '<span class="rotateLeft">向左旋转</span></div>').appendTo($li) : null,
            $prgress = $li.find('p.progress span'), //上传进度条
            $wrap = $li.find('p.imgWrap'), //包裹图片的元素
            $info = $('<p class="error"></p>'), //上传错误信息
            showError = function(code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;
                    case 'interrupt':
                        text = '上传暂停';
                        break;
                    default:
                        text = '上传失败，<a href="javascript: void(0);" class="retry-this">重试</a>&nbsp;|&nbsp;<a href="javascript: void(0);" class="del-this">删除</a>';
                        break;
                }
                $info.html(text).appendTo($li);
                //单个文件重新上传
                $info.find(".retry-this").on("click", function (){
                    uploader.retry(file);
                });
                //从queue中删除当前文件，并且销毁当前视图
                $info.find(".del-this").on("click", function (){
                    removeFile(file, percentages);
                    uploader.removeFile(file, true);
                });
            };
        if (file.getStatus() === 'invalid') { //如果走到这里则说明上传的文件不是有效的图片文件
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function(error, src) {
                if (error) {
                    $wrap.text('不能预览');
                    return;
                }
                var img = $('<img src="' + src + '">');
                if(options.viewImgHorizontal){
                    img.one( 'load', function() {
                        var w = this.width,
                            h = this.height;
                        img.css({
                            "position": "absolute",
                            "top": "50%",
                            "left": "50%",
                            "margin-top": -h/2,
                            "margin-left": -w/2
                        });
                    });
                }
                $wrap.html("").append(img);
            }, options.width, options.height, $wrap);
            //将当前文件的大小，上传进度保存起来，以便后期使用
            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }
        file.on('statuschange', function(cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                /*如果文件正在排队上传，则移除图片的mouseenter、mouseleave事件。即文件正在上传时，当鼠标放在图片上不会显示任何效果*/
                $li.off('mouseenter mouseleave');
                options.showToolBtn && $btns.remove(); //移除旋转、删除按钮
            }
            // 成功
            if (cur === 'error' || cur === 'invalid') {
                showError(file.statusText);
                options.uploadFailTip && $.isFunction(options.uploadFailTip) && options.uploadFailTip.call(this, $li);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') { //上传中断
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
            }
            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        if (options.showToolBtn) {
            //如果options.showToolBtn为true，则当鼠标放在图片上时会有编辑按钮出现，可以操作图片
            toolBtnBindEvent($wrap,$li,$btns,file,uploader);
        }
        options.onFileAdd && $.isFunction(options.onFileAdd) && options.onFileAdd();
        $li.appendTo($queue);
    }
    /*给小的工具按钮添加事件*/
    function toolBtnBindEvent($wrap,$li,$btns,file,uploader){
        //如果options.showToolBtn为true，则当鼠标放在图片上时会有编辑按钮出现，可以操作图片
        $li.on('mouseenter', function() {
            $btns.stop().animate({
                height: 30
            });
        }).on('mouseleave', function() {
            $btns.stop().animate({
                height: 0
            });
        });
        $btns.on('click', 'span', function() {
            var index = $(this).index(),
                deg; //旋转角度
            switch (index) {
                case 0:
                    //removeFile方法可以将指定的文件标记为已取消状态，如果第二个参数为true则将当前要删除的文件从queue中移除
                    //uploader.removeFile(file);将当前要删除的文件从queue中移除
                    uploader.removeFile(file);
                    return;
                case 1:
                    file.rotation += 90;
                    break;
                case 2:
                    file.rotation -= 90;
                    break;
            }
            if (supportTransition) { //判断浏览器是否支持transform，如果支持则为w3c标准浏览器，否则为IE浏览器
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else { //IE低版本浏览器旋转
                //IE低版本浏览器旋转实现来自jquery animate的旋转
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
            }
        });
    }
    /*负责view的销毁*/
    function removeFile(file, percentages) {
        var $li = $('#' + file.id);
        delete percentages[file.id];
        $li.off().find('.file-panel').off().end().remove();
        options.onDelete && $.isFunction(options.onDelete) && options.onDelete();
    }
    /*设置上传状态*/
    function setState(val,$upload,$queue,uploader,state) {
        var file, stats;
        if (val === state.state) {
            return;
        }
        //移除"开始上传"按钮的 "state-状态" class。即表示移除旧的状态
        $upload.removeClass('state-' + state.state);
        //为"开始上传"按钮添加一个新的状态class
        $upload.addClass('state-' + val);
        state.state = val;
        switch (state.state) {
            case 'pedding': //还未选择图片
                $queue.parent().removeClass('filled');
                $queue.hide();
                uploader.refresh();
                break;
            case 'ready': //图片已选中，等待上传
                $queue.parent().addClass('filled');
                $queue.show();
                uploader.refresh();
                break;
            case 'uploading': //正在上传中
                $upload.text('暂停上传');
                $(options.btns.chooseBtn).hide();
                break;
            case 'paused': //上传暂停
                $upload.text('继续上传');
                $(options.btns.chooseBtn).hide();
                break;
            case 'confirm': //上传完成
                $upload.text('开始上传').addClass('disabled');
                $(options.btns.chooseBtn).hide();
                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState("finish",$upload,$queue,uploader,state);
                    return;
                }
                break;
            case 'finish': //上传结束
                stats = uploader.getStats();
                if (stats.successNum) {
                } else {
                    // 没有成功的图片，重设
                    state.state = 'done';
                    location.reload();
                }
                $(options.btns.chooseBtn).hide();
                break;
        }
    }
    function uploadImage(option) {
        if (!WebUploader.Uploader.support()) {
            if (options.notSupport && $.isFunction(options.notSupport)) {
                options.notSupport.call(this);
                return;
            } else {
                throw new Error('WebUploader does not support the browser you are using.');
            }
        }
        if (!option || !$.isPlainObject(option)) {
            throw new Error("必须传递一个包含上传文件必要参数的对象！");
        }
        $.extend(true, options, option);
        options.btns.uploadBtn = $(options.btns.uploadBtn);
        options.wrap = $(options.wrap);
        var $wrap = options.wrap, //包裹整个上传控件的容器
            $queue = $('<ul class="_filelist"></ul>').appendTo($wrap), // 预览图片容器
            // 开始上传按钮
            $upload = (options.btns.uploadBtn.size() > 0) ? options.btns.uploadBtn : $wrap.find('.uploadBtn'),
            fileCount = 0, // 添加的文件数量
            fileSize = 0, // 添加的文件总大小
            ratio = window.devicePixelRatio || 1, // 优化retina, 在retina下这个值是2
            //state = 'pedding', //上传状态。 可能有pedding, ready, uploading, confirm, done.
            state = {"state": "pedding"},
            percentages = {}, // 所有文件的上传进度信息，key为file id
            uploader, // WebUploader实例
            chooseBtn = options.btns.chooseBtn;
        //判断传递进来的选择文件按钮是否是一个jQuery对象
        if(typeof chooseBtn !== "string" && !isElement(chooseBtn) && chooseBtn[0] && isElement(chooseBtn[0])){
            chooseBtn = chooseBtn[0];
        }
        // 实例化uploader
        uploader = WebUploader.create({
            pick: { //指定选择文件的按钮容器，不指定则不创建按钮。
                id: chooseBtn, // 指定选择文件的按钮容器，不指定则不创建按钮。选择器支持 id, class, dom。
                label: options.btns.chooseBtnText || "",
                multiple: options.multiple || true //是否支持多选能力
            },
            accept: { //指定接受哪些类型的文件
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/png,image/gif,image/jpeg,image/jpg,image/bmp'
            },
            auto: options.auto, //是否自动上传
            swf: options.swf, // swf文件路径
            chunked: true, //是否要分片处理大文件上传。
            method: options.method.toUpperCase() || "POST",
            server: options.url,
            resize: options.resize,
            sendAsBlob: options.sendAsBlob,
            fileNumLimit: options.maxFileNum, //设置上传文件总数量, 超出则不允许加入队列
            fileSizeLimit: options.maxFileTotalSize, // 设置上传文件总大小, 超出则不允许加入队列
            fileSingleSizeLimit: options.maxFileSize // 设置单个上传文件大小, 超出则不允许加入队列
        });
        //uploader.refresh();//该方法可以重新渲染选择文件按钮
        //添加上传图片时所需的额外数据
        if (options.datas && $.isPlainObject(options.datas)) {
            uploader.option("formData", options.datas);
        }
        //缩略图大小
        options.width = !$.isNumeric(parseFloat(options.width)) ? (-1 * ratio) : (parseFloat(options.width) * ratio);
        options.height = !$.isNumeric(parseFloat(options.height)) ? (-1 * ratio) : (parseFloat(options.height) * ratio);

        /*如何判断文件是否上传成功。默认如果啥也不处理，只要有返回数据就认为是成功，就算返回的是错误信息，也认为是成功了。
        但是，在认为成功前会派送一个事件uploadAccept，这个事件是用来询问是否上传成功的。在这个事件中你可以拿到上传的是哪个文件，以及对应的服务端返回reponse*/
        uploader.on('uploadAccept', function(file, response) {
            if (options.onSuccess && $.isFunction(options.onSuccess)) {
                options.onSuccess.apply(this, arguments);
            }
        });
        /*当前文件正在上传时所处理业务*/
        uploader.onUploadProgress = function(file, percentage) {
             console.log("正在上传中");
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');
            $percent.css('width', percentage * 100 + '%');
            //设置当前文件的上传总进度
            percentages[file.id][1] = percentage;
        };
        /*当文件被添加到上传队列中执行的方法*/
        uploader.onFileQueued = function(file) {
            fileCount++;
            fileSize += file.size;
            // 当有文件添加进来时执行，负责view的创建
            addFile(file,uploader,$queue,percentages);
            setState("ready",$upload,$queue,uploader,state);
        };
        /*当文件被移出队列时执行的方法*/
        uploader.onFileDequeued = function(file) {
            fileCount--;
            fileSize -= file.size;
            if (!fileCount) {
                setState("pedding",$upload,$queue,uploader,state);
            }
            removeFile(file,percentages,uploader);
        };
        // 所有文件上传请求发送成功后调用        
        /*uploader.on('uploadFinished', function () {
            //清空队列
             uploader.reset();
        });*/
       // 局部设置，给每个独立的文件上传设置。通过绑定一个uploadBeforeSend事件来添加。
        uploader.on( 'uploadBeforeSend', function( block, data ) {
            /* block为分块数据。// file为分块对应的file对象。var file = block.file;修改data可以控制发送哪些携带数据。
            默认会传递当前这张图的旋转角度*/
            data.rotation = block.file.rotation;
            // 将存在file对象中的md5数据携带发送过去。// data.fileMd5 = file.md5;// 删除其他数据// delete data.key;
        });
        uploader.on('all', function(type) {
            var stats;
            switch (type) {
                case 'uploadFinished':
                    setState("confirm",$upload,$queue,uploader,state);
                    break;
                case 'startUpload':
                    setState("uploading",$upload,$queue,uploader,state);
                    break;
                case 'stopUpload':
                    setState("paused",$upload,$queue,uploader,state);
                    break;
            }
        });
        uploader.onError = function(code) {
            if (options.onError && $.isFunction(options.onError)) {
                var obj = {
                    msg: "",
                    code: code
                }
                if (code == "Q_EXCEED_SIZE_LIMIT") {
                    obj.msg = "单个文件大小超出限制";
                }else if(code == "Q_EXCEED_NUM_LIMIT"){
                    obj.msg = "上传文件数量超出总数量";
                }else if(code == "Q_TYPE_DENIED"){
                    obj.msg = "上传的文件类型不满足要求";
                }
                options.onError.call(this, obj);
            } else {
                alert('上传错误，错误代码: ' + code);
            }
        };
        //"开始上传"按钮点击后所处理业务
        $upload.on('click', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if (state.state === 'ready' || state.state === 'paused') {
                uploader.upload();
            } else if (state.state === 'uploading') {
                uploader.stop();
            }
        });
        //用户自定义"重新上传"按钮
        if (options.btns.retryBtn) {
            retryBtn = $(options.btns.retryBtn);
            retryBtn.on("click", function() {
                uploader.retry();
            });
        }
        $upload.addClass('state-' + state.state);
        return uploader;
    }
    window.uploadImage = uploadImage;
})(jQuery);