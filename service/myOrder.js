var vm = new Vue({
    el: "#dataList",
    data: {
        mescroll: null,
        orderList: []//订单列表
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            loadOpen();
        },
        //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
        upCallback: function (page) {
            console.log("page.num==" + page.num + ", page.size==" + page.size);
            //联网加载数据
            var self = this;
            getListDataFromNet(page.num, page.size, function (msg) {
                //data=[]; //打开本行注释,可演示列表无任何数据empty的配置
                //如果是第一页需手动制空列表
                if (page.num == 1) self.orderList = [];
                //更新列表数据
                self.orderList = self.orderList.concat(msg.list);
                console.log("self.orderList.length==" + self.orderList.length);
                //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                //传参:数据的总数; mescroll会自动判断列表是否有无下一页数据,如果数据不满一页则提示无更多数据;
                self.mescroll.endSuccess(msg.list.length);
            }, function () {
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                self.mescroll.endErr();
            });
        },
        Pay:function(order){
            var that = this;
            $.ajax({
                url: 'http://bw.gcdzxfu.cn/WeChatApi/GetBrandWcPay',
                type: 'post',
                data: {
                    prepayId: order.PrepaymentId
                },
                complete: function (d) {
                    console.log(d.responseText)
                    WeixinJSBridge.invoke('getBrandWCPayRequest',
                        JSON.parse(d.responseText)
                        , function (res) {
                            WeixinJSBridge.log(res.err_msg);
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                //alert("支付成功");
                                vm.finishPay = true;
                                $.post('http://bw.gcdaxfu.cn/api/WebApi/FinshOrder2', { '': order.OrderId}, function (msg) {
                                    if (msg && msg.status) {
                                       that.upCallback(1);
                                    }
                                });
                            }else{
                                // //支付失败
                                // $.post('http://bw.gcdaxfu.cn/api/WebApi/UpdateOrderState', { OrderId: order.OrderId,OrderState:0}, function (msg) {
                                //     if (msg && msg.status) {
                                //        that.upCallback(1);
                                //     }
                                // });
                            }
                        });
                }
            });
        }
    },
    computed: {
    },
    mounted: function () {
        this.initData();
        ////创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
        //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
        var self = this;
        self.mescroll = new MeScroll("mescroll", {
            up: {
                callback: self.upCallback, //上拉回调
                //以下参数可删除,不配置
                //page:{size:8}, //可配置每页8条数据,默认10
                toTop: { //配置回到顶部按钮
                    src: "../images/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                },
                empty: { //配置列表无任何数据的提示
                    warpId: "app",
                    icon: "../images/mescroll-empty.png",
                    
                }
            }
        });
        //初始化vue后,显示vue模板布局
        document.getElementById("dataList").style.display = "block";
    }
});

/*联网加载列表数据*/
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
    //分页加载数据
    $.getJSON('http://bw.gcdzxfu.cn/api/WebApi/GetCsOrderList', {
        openId: getStore('openid'),//openid
        num: pageNum,//页码
        size: pageSize //每页长度
    }, function (msg) {
        //var listData = msg.list;
        // vm.mescroll.endSuccess(msg.total);
        successCallback && successCallback(msg);//成功回调
    })


    //延时一秒,模拟联网
    //setTimeout(function () {

    //  var data = pdlist1; // 模拟数据: ../res/pdlist1.js
    //  var listData = [];//模拟分页数据
    //  for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
    //      if (i == data.length) break;
    //      listData.push(data[i]);
    //  }

    //				})
    //				.catch(function(error) {
    //					errorCallback&&errorCallback()//失败回调
    //				});
    // }, 500)
}

//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
//document.ondragstart = function () { return false; }