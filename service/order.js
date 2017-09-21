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
        partNumList: [], //以选择配件列表
        cartFoodList: [], //购物车商品列表
        partList: [],//必选配件
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
        imgBaseUrl: 'http://bw.gcdzxfu.cn/'
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            that.cartFoodList = JSON.parse(getStore("buyCart"));//购买螃蟹数量
            that.partNumList = JSON.parse(getStore("buyPart"));//购买可选配件
            //获取必选配件
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetPartList/1",
                complete: function (d) {
                    var obj = JSON.parse(d.responseText);
                    that.partList = obj;
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                    let index = _.findIndex(that.partNumList, { 'id': 10009 });
                    if (index >= 0) {
                        _.remove(that.partList, function (n) {
                            return n.PartId == 10004;
                        });

                    }
                }
            });

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
            window.location.href = "chooseAdd.html?type=1"
        }
    },
    computed: {
        //购买螃蟹数量
        totalNum: function () {
            let num = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach((n) => {
                    num += n.num;
                });
            }
            return num;
        },
        //购买螃蟹总重量
        totalProductWeight: function () {
            let weight = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach((n) => {
                    weight += n.weight * n.num;
                });
            }
            return Number(weight.toFixed(2));
        },
        //购买螃蟹总价
        totalProductPrice: function () {
            let price = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach((n) => {
                    price += n.price * n.weight * 2 * n.num;
                });
            }
            return Number(price.toFixed(2));
        },
        //购买必选配件总重量
        totalPartWeight: function () {
            let weight = 0;
            if (this.partList != null) {
                this.partList.forEach((n) => {
                    if (n.PartId != 10004) {
                        weight += n.PartWeight;
                    } else {
                        weight += n.PartWeight * this.totalNum;
                    }
                });
            }
            return Number(weight.toFixed(2));
        },
        //购买必选配件总价
        totalPartPrice: function () {
            let price = 0;
            if (this.partList != null) {
                this.partList.forEach((n) => {
                    if (n.PartId != 10004) {
                        price += n.PartPrice;
                    } else {
                        price += n.PartPrice * this.totalNum;
                    }
                });
            }
            return Number(price.toFixed(2));
        },
        //购买可选配件总重量
        totalPart1Weight: function () {
            let weight = 0;
            if (this.partNumList != null) {
                this.partNumList.forEach((n) => {
                    if (n.id != 10009) {
                        weight += n.weight;
                    } else {
                        weight += n.weight * this.totalNum;
                    }
                });
            }
            return Number(weight.toFixed(2));
        },
        //购买可选配件总价
        totalPart1Price: function () {
            let price = 0;
            if (this.partNumList != null) {
                this.partNumList.forEach((n) => {
                    if (n.id != 10009) {
                        price += n.price;
                    } else {
                        price += n.price * this.totalNum;
                    }
                });
            }
            return Number(price.toFixed(2));
        },

        //快递费用
        expressPrice: function () {
            let price = 0;
            //  let totalWeight =sendweight;
            price = this.address.firstPrice + (this.sendweight - 1) * this.address.fllowPrice;
            return Number(price.toFixed(2));
        },
        //快递优惠后费用
        expressFinalPrice: function () {
            let price = this.expressPrice * 0.9;
            return Number(price.toFixed(2));
        },
        //商城服务费
        shopPrice: function () {
            let price = 0;
            //螃蟹总重量
            let totalProWeight = this.totalProductWeight * this.totalNumber;//每单重量乘以份数
            //电商服务费方案：累计购买在20斤(含20斤)收20元/斤收取，累计超过20斤按5元/斤收取
            //重量单位为千克，所以费用需要乘以2，重量需要除以2
            // if (this.haveWeight <= 10) {
            //     price = totalProWeight * 20 * 2;
            // } else {
            price = totalProWeight * 5 * 2;
            // }
            return Number(price.toFixed(2));
        },
        // //返利金额
        // balancePrice: function () {
        //     let totalWeight = this.totalProductWeight * this.totalNumber;
        //     let price = 0;
        //     if (totalWeight <= 10) {
        //         price = 0;
        //     }
        //     else if (totalWeight > 10 && totalWeight <= 30) {
        //         price = 10 * totalWeight;
        //     } else if (totalWeight > 30 && totalWeight <= 100) {
        //         price = 20 * totalWeight;
        //     } else if (totalWeight > 100 && totalWeight < 1000) {
        //         price = 26 * totalWeight;
        //     } else {
        //         price = 30 * totalWeight;
        //     }
        //     return parseFloat(price.toFixed(2));

        // },
        //总金额
        totalmoney: function () {
            //购买螃蟹金额+配件金额+快递费(带有份数)+服务费(带有份数)
            let totalPrice = (this.totalProductPrice + this.totalPart1Price + this.totalPartPrice) * this.totalNumber + this.expressFinalPrice + this.shopPrice
            return Number(totalPrice.toFixed(2));
        },
        // //最终付款费用
        // finalPrice: function () {
        //     //let price = 0;
        //     let finalmoney = 0;
        //     if (this.blChoseBalance) {
        //         if (this.totalmoney >= this.balance) {
        //             finalmoney = this.totalmoney - this.balance;
        //             this.useBalance = this.balance;
        //         } else {
        //             finalmoney = 0;
        //             this.UserBalance = this.balance - this.totalmoney;
        //         }
        //     } else {
        //         finalmoney = this.totalmoney
        //         this.useBalance = 0;
        //     }
        //     return Number(finalmoney.toFixed(2));
        // },
        //实际总重量
        totalweight: function () {
            let total = (this.totalProductWeight + this.totalPartWeight + this.totalPart1Weight) * this.totalNumber;
            return Number(total.toFixed(2));
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

    if (vm.orderId > 0) {
        Pay();
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
        if (!vm.isSubmit) {
            vm.isSubmit=true;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/AddOrder",
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
                    cartFoodList: vm.cartFoodList,//购买螃蟹列表
                    partList: vm.partList,//必须配件列表
                    partNumList: vm.partNumList,//可选配件列表
                    expressmoney: vm.expressFinalPrice,//运费
                    servicemoney: vm.shopPrice//商城服务费
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
                        alert('对不起订单生成失败！');
                    }

                    // window.open("index.html", "_self");
                }, error: function (d) {
                    //console.log(d);
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
                                vm.finishPay = true;
                                vm.isSubmit=false;
                                $.post('http://bw.gcdzxfu.cn/api/WebApi/FinshOrder', { OrderId: vm.orderId, UserId: vm.user.UserId, TotalWeight: vm.totalProductWeight, OrderCopies: vm.totalNumber }, function (msg) {
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