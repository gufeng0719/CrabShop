var vm = new Vue({
    el: "#app",
    data: {
        address: {
            consignee: '',
            telphone: '',
            consex: '先生',
            province: '',
            city: '',
            district: '',
            details: '',
            firstPrice: 12,//首重价格,默认江浙沪
            fllowPrice: 2,//续重价格

        },//收货地址
        send: {
            person: '',//发件人
            telphone: ''//联系方式
        },//发货地址
        openId: '',//openid      
        cartPackageList: [], //购物车商品列表
        totalNumber: 1,//购买份数        
        windowHeight: null, //屏幕的高度
        user: {
            UserId: null,
            UserName: '',
            UserPhone: '',
            UserSex: '先生',

        },
        haveWeight: 0,//已经购买重量
        blHaveSend: false,//是否有发件人信息,
        blReceive: false,//是否有收件人信息
        prepayId: '',//预支付编号
        orderId: 0,//订单编号,
        finishPay: false,//是否完成支付
        isSubmit: false,
        isInvoice: false,//是否开票
        remarks: '',//订单备注
        imgBaseUrl: 'http://bw.gcdzxfu.cn/'
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            that.cartPackageList = JSON.parse(getStore("buyPackage"));//购买套餐列表
            if (that.cartPackageList == null || that.cartPackageList == undefined) {
                window.location.href = "packShop.html";
            }
            //根据openId获取本人信息
            if (that.openId) {
                $.ajax({
                    type: 'get',
                    url: 'http://bw.gcdzxfu.cn/api/WebApi/GetAddress',
                    data: { openId: that.openId },
                    success: function (msg) {
                        if (msg.status) {
                            //获取到用户信息
                            that.user.UserId = msg.user.UserId;
                            that.haveWeight = msg.user.TotalWight;
                            that.send.person = msg.user.UserName;
                            that.send.telphone = msg.user.UserPhone;
                            setStore("userid", msg.user.UserId);
                            //查看本地缓存中是否存在收件地址信息
                            let addressinfo = getStore("addressinfo");
                            if (addressinfo) {//存在
                                that.blReceive = true;//显示地址信息
                                that.address = JSON.parse(addressinfo)[0];
                            } else {//不存在，加载远程请求地址
                                //是否存在默认地址:
                                if (msg.addressList.length > 0) {//存在地址
                                    that.blReceive = true;
                                    let addressArr = msg.addressList[0].Details.split('&');
                                    that.address.firstPrice = msg.firstPrice;
                                    that.address.fllowPrice = msg.fllowPrice;
                                    that.address.consignee = msg.addressList[0].Consignee;
                                    that.address.consex = msg.addressList[0].ConSex;
                                    that.address.telphone = msg.addressList[0].TelPhone;
                                    that.address.province = addressArr[0];
                                    that.address.city = addressArr[1];
                                    that.address.district = addressArr[2];
                                    that.address.details = addressArr[3];
                                } else {
                                    that.blReceive = false;

                                }
                            }
                        } else {
                            that.blReceive = false;
                            //没有获取到用户信息，弹出注册用户框
                            //弹出注册用户框
                            var $promt = $('#myprompt').modal({
                                relatedTarget: this,
                                closeViaDimmer: 0
                            });
                        }
                    }
                });
            }
        },
        AddNumber: function () {
            var that = this;
            that.totalNumber++;
        },
        ResponseNumber: function () {
            var that = this;
            that.totalNumber--;
        },
        ChooseAddress: function () {
            window.location.href = "chooseAdd.html?type=2"
        }
    },
    computed: {
        //单份金额
        singlemoney: function () {
            var that = this;
            let price = 0;
            if (this.cartPackageList != null) {
                this.cartPackageList.forEach((n) => {
                    price += n.price * n.num;
                });
            }
            return Number(price.toFixed(2));
        },
        singleweight: function () {
            var that = this;
            let weight = 0;
            if (this.cartPackageList != null) {
                this.cartPackageList.forEach((n) => {
                    weight += n.weight * n.num;
                });
            }
            return Number(weight.toFixed(3));
        },
        //总金额 每个套件金额总和乘以份数
        totalmoney: function () {
            var that = this;
            let totalPrice = that.singlemoney * that.totalNumber;
            return Number(totalPrice.toFixed(2));
        },

        //实际总重量
        totalweight: function () {
            var that = this;
            let total = that.singleweight * that.totalNumber;
            return Number(total.toFixed(3));
        },
        //寄件重量
        sendweight: function () {
            let weight = Math.ceil(this.totalweight / 0.5) * 0.5;
            return weight;
        }
    },
    watch: {

    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
        //获取openId            
        this.openId = loadOpen();
        this.initData();
    }
});

//提交支付,先生成订单，后发起支付
function SubmitPlay() {
    var $loading = $("#my-modal-loading");
    if (!vm.isSubmit) {//监视是否已经提交过按钮
        if (vm.orderId > 0) {
            Pay();
            vm.isSubmit = true;
        } else {
            //发货人信息
            // if (vm.send.person === "" || vm.send.telphone === "") {
            //     alert("请选择或者填写发货者信息"); return;
            // }
            //收货人信息
            if (vm.address.consignee === "" || vm.address.telphone === "") {
                alert("请选择或填写收件者信息"); return;
            }
            //采购螃蟹信息
            if (vm.totalNum < 6) {
                alert("请至少购买6只螃蟹才能下单"); return;
            }
            vm.isSubmit = true;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/AddPackageOrder",
                type: "post",
                data: {
                    userid: vm.user.UserId,//下单用户
                    totalmoney: vm.totalmoney,//总金额
                    finalPrice: vm.totalmoney,//实际支付金额
                    orderaddress: '$' + vm.address.consignee + '(' + vm.address.consex + ')$$' + vm.address.telphone + '$' + vm.address.province + ' ' + vm.address.city + ' ' + vm.address.district + ' ' + vm.address.details,//订单地址
                    sendaddress: vm.send.person + '$' + vm.send.telphone,//寄件人地址
                    totalnumber: vm.totalNumber,//份数
                    totalweight: vm.totalweight,//实际重量
                    sendweight: vm.sendweight,//寄件总量
                    cartFoodList: vm.cartPackageList,//购买螃蟹列表
                    partList: '',//必须配件列表
                    partNumList: '',//可选配件列表
                    expressmoney: 0,//运费
                    servicemoney: 0,//商城服务费
                    isInvoice: vm.isInvoice,//是否开票
                    remarks: vm.remarks//备注
                },
                success: function (d) {
                    if (d.status) {
                        vm.orderId = d.orderid;
                        $.ajax({
                            url: 'http://bw.gcdzxfu.cn/WeChatApi/GetPrepayId',
                            type: 'post',
                            data: {
                                body: '购买大闸蟹支付',
                                orderNumber: d.orderNumber,
                                total: (vm.totalmoney * 100).toFixed(),
                                notify: 'http://dzx.gcdzxfu.cn/myOrder.html',
                                openId: vm.openId
                            },
                            complete: function (d) {
                                var obj = JSON.parse(d.responseText)
                                //console.info(obj);
                                if (obj.code === 1) {
                                    vm.prepayId = obj.data;
                                    $.post('http://bw.gcdzxfu.cn/api/WebApi/UpdatePrepaymentId', { OrderId: vm.orderId, PrepaymentId: obj.data }, function (msg) {
                                        if (msg && msg.status) {
                                            $loading.modal('close');
                                            setStore('addressinfo', '');
                                            Pay();
                                        }
                                    });

                                } else {
                                    // console.log(d.responseText)
                                    alert(obj.msg)
                                }
                            }
                        });

                    } else {
                        $loading.modal('close');
                        vm.isSubmit = false;
                        alert('对不起订单生成失败！');
                    }

                    // window.open("index.html", "_self");
                }, error: function (d) {
                    //console.log(d);
                    $loading.modal('close');
                    vm.isSubmit = false;
                    alert('对不起订单生成失败！');
                }
            });
        }
    }
}

//发起支付
function Pay() {
    if (vm.finishPay) {//完成支付
        alert('支付已经完成，无需再次支付');
    } else {
        if (vm.prepayId == "") {
            alert("没有预支付信息, 请检查代码,以及日志输入");
            return;
        } else {
            $.ajax({
                url: 'http://bw.gcdzxfu.cn/WeChatApi/GetBrandWcPay',
                type: 'post',
                data: {
                    prepayId: vm.prepayId
                },
                complete: function (d) {
                    console.log(d.responseText)
                    WeixinJSBridge.invoke('getBrandWCPayRequest',
                        JSON.parse(d.responseText)
                        , function (res) {
                            WeixinJSBridge.log(res.err_msg);
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                //alert("支付成功");
                                vm.isSubmit = false;
                                vm.finishPay = true;
                                $.post('http://bw.gcdzxfu.cn/api/WebApi/FinshPackageOrder', { "": vm.orderId }, function (msg) {
                                    if (msg && msg.status) {
                                        window.location.href = "myOrder.html";
                                    }
                                });
                            }
                        });
                }
            });
        }
    }
}