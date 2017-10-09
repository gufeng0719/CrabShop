function loadOpen() {
    //获取本都缓存是否存在openid
    //var request = getRequest();
    var openid = getStore("openid");
    getRequest();
    if (openid == undefined || openid == 'undefined') {
        //console.info(req["openId"]);      
        if (req["openId"]) {
            openid = req["openId"];
            setStore('openid', req["openId"]);
        } else {
            // console.info('加载路径');
            window.open('http://bw.gcdzxfu.cn/WeChatApi/GetOpenId/?currentPage=' + window.location.href, '_self');
            //    getRequest();
            //    openid=req["openId"];
            //   console.info(openid);
            //    setStore('openid',openid);
        }
    }
    return openid;

};
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
req = getRequest();

/**
 * 存储localStorage
 */
var setStore = function (name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
var getStore = function (name) {
    if (!name) return;
    return window.localStorage.getItem(name);
}