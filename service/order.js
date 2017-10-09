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
            firstPrice: 12,
            fllowPrice: 2
        },
        send: {
            person: '',
            telphone: ''
        },
        openId: '',
        partNumList: [],
        cartFoodList: [],
        partList: [],
        totalNumber: 1,
        windowHeight: null,
        user: {
            UserId: null,
            UserName: '',
            UserPhone: '',
            UserSex: '先生'
        },
        haveWeight: 0,
        blHaveSend: false,
        blReceive: false,
        prepayId: '',
        orderId: 0,
        finishPay: false,
        isSubmit: false,
        isInvoice: false,
        remarks: '',
        imgBaseUrl: 'http://bw.gcdzxfu.cn/'
    },
    methods: {
        initData: function () {
            var that = this;
            that.cartFoodList = JSON.parse(getStore("buyCart"));
            that.partNumList = JSON.parse(getStore("buyPart"));
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetPartList/1",
                complete: function (d) {
                    var obj = JSON.parse(d.responseText);
                    that.partList = obj;
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                    var index = _.findIndex(that.partNumList, { 'id': 10009 });
                    if (index >= 0) {
                        _.remove(that.partList, function (n) {
                            return n.PartId == 10004;
                        });
                    }
                }
            });
            if (that.openId) {
                $.ajax({
                    type: 'get',
                    url: 'http://bw.gcdzxfu.cn/api/WebApi/GetAddress',
                    data: { openId: that.openId },
                    success: function (msg) {
                        if (msg.status) {
                            that.user.UserId = msg.user.UserId;
                            that.haveWeight = msg.user.TotalWight;
                            that.send.person = msg.user.UserName;
                            that.send.telphone = msg.user.UserPhone;
                            setStore("userid", msg.user.UserId);
                            var addressinfo = getStore("addressinfo");
                            if (addressinfo) {
                                that.blReceive = true;
                                that.address = JSON.parse(addressinfo)[0];
                            } else {
                                if (msg.addressList.length > 0) {
                                    that.blReceive = true;
                                    var addressArr = msg.addressList[0].Details.split('&');
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
            window.location.href = "chooseAdd.html?type=1";
        }
    },
    computed: {
        totalNum: function () {
            var num = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach(function (n) {
                    num += n.num;
                });
            }
            return num;
        },
        totalProductWeight: function () {
            var weight = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach(function (n) {
                    weight += n.weight * n.num;
                });
            }
            return Number(weight.toFixed(2));
        },
        totalProductPrice: function () {
            var price = 0;
            if (this.cartFoodList != null) {
                this.cartFoodList.forEach(function (n) {
                    price += n.price * n.weight * 2 * n.num;
                });
            }
            return Number(price.toFixed(2));
        },
        totalPartWeight: function () {
            var $__4 = this;
            var weight = 0;
            if (this.partList != null) {
                this.partList.forEach(function (n) {
                    if (n.PartId != 10004) {
                        weight += n.PartWeight;
                    } else {
                        weight += n.PartWeight * $__4.totalNum;
                    }
                });
            }
            return Number(weight.toFixed(2));
        },
        totalPartPrice: function () {
            var $__4 = this;
            var price = 0;
            if (this.partList != null) {
                this.partList.forEach(function (n) {
                    if (n.PartId != 10004) {
                        price += n.PartPrice;
                    } else {
                        price += n.PartPrice * $__4.totalNum;
                    }
                });
            }
            return Number(price.toFixed(2));
        },
        totalPart1Weight: function () {
            var $__4 = this;
            var weight = 0;
            if (this.partNumList != null) {
                this.partNumList.forEach(function (n) {
                    if (n.id != 10009) {
                        weight += n.weight;
                    } else {
                        weight += n.weight * $__4.totalNum;
                    }
                });
            }
            return Number(weight.toFixed(2));
        },
        totalPart1Price: function () {
            var $__4 = this;
            var price = 0;
            if (this.partNumList != null) {
                this.partNumList.forEach(function (n) {
                    if (n.id != 10009) {
                        price += n.price;
                    } else {
                        price += n.price * $__4.totalNum;
                    }
                });
            }
            return Number(price.toFixed(2));
        },
        expressPrice: function () {
            var price = 0;
            var singleWeight = this.totalProductWeight + this.totalPartWeight + this.totalPart1Weight;
            if (singleWeight <= 1) {
                singleWeight = 1
            }
            var addWeightFloat = parseInt((singleWeight - 1).toFixed(2).split('.')[1])
            var addWeightInt = parseInt((singleWeight - 1).toFixed(2).split('.')[0])
            if (addWeightFloat == 0) {
                addWeightFloat = 0
            }
            else if (addWeightFloat > 0 && addWeightFloat <= 50) {
                addWeightFloat = 50
            } else {
                addWeightFloat = 100
            }

            price = (this.address.firstPrice + (addWeightInt + addWeightFloat / 100) * this.address.fllowPrice) * this.totalNumber;
            return Number(price.toFixed(2));
        },
        expressFinalPrice: function () {
            var price = this.expressPrice * 0.9;
            return Number(price.toFixed(2));
        },
        shopPrice: function () {
            var price = 0;
            var totalProWeight = this.totalProductWeight * this.totalNumber;
            price = totalProWeight * 5 * 2;
            return Number(price.toFixed(2));
        },
        totalmoney: function () {
            var totalPrice = (this.totalProductPrice + this.totalPart1Price + this.totalPartPrice) * this.totalNumber + this.expressFinalPrice + this.shopPrice;
            return Number(totalPrice.toFixed(2));
        },
        totalweight: function () {
            var total = (this.totalProductWeight + this.totalPartWeight + this.totalPart1Weight) * this.totalNumber;
            return Number(total.toFixed(2));
        },
        sendweight: function () {
            var weight = Math.ceil(this.totalweight / 0.5) * 0.5;
            return weight;
        }
    },
    watch: {},
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.openId = loadOpen();
        this.initData();
    }
});
function SubmitPlay() {
    var $loading = $("#my-modal-loading");
    if (!vm.isSubmit) {
        if (vm.orderId > 0) {
            vm.isSubmit = true;
            $loading.modal('close');
            Pay();
        } else {
            if (vm.address.consignee === "" || vm.address.telphone === "") {
                alert("请选择或填写收件者信息");
                return;
            }
            if (vm.totalNum < 6) {
                alert("请至少购买6只螃蟹才能下单");
                return;
            }
            vm.isSubmit = true;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/AddOrder",
                type: "post",
                data: {
                    userid: vm.user.UserId,
                    totalmoney: vm.totalmoney,
                    finalPrice: vm.totalmoney,
                    orderaddress: '$' + vm.address.consignee + '(' + vm.address.consex + ')$$' + vm.address.telphone + '$' + vm.address.province + ' ' + vm.address.city + ' ' + vm.address.district + ' ' + vm.address.details,
                    sendaddress: vm.send.person + '$' + vm.send.telphone,
                    totalnumber: vm.totalNumber,
                    totalweight: vm.totalweight,
                    sendweight: vm.sendweight,
                    cartFoodList: vm.cartFoodList,
                    partList: vm.partList,
                    partNumList: vm.partNumList,
                    expressmoney: vm.expressFinalPrice,
                    servicemoney: vm.shopPrice,
                    isInvoice: vm.isInvoice,
                    remarks: vm.remarks
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
                                var obj = JSON.parse(d.responseText);
                                if (obj.code === 1) {
                                    vm.prepayId = obj.data;
                                    $.post('http://bw.gcdzxfu.cn/api/WebApi/UpdatePrepaymentId', {
                                        OrderId: vm.orderId,
                                        PrepaymentId: obj.data
                                    }, function (msg) {
                                        if (msg && msg.status) {
                                            $loading.modal('close');
                                            setStore('addressinfo', '');
                                            Pay();
                                        }
                                    });
                                } else {
                                    $loading.modal('close');
                                    alert(obj.msg);
                                }
                            }
                        });
                    } else {
                        $loading.modal('close');
                        vm.isSubmit = false;
                        alert('对不起订单生成失败！');
                    }
                },
                error: function (d) {
                    $loading.modal('close');
                    vm.isSubmit = false;
                    alert('对不起订单生成失败！');
                }
            });
        }
    }
}
function Pay() {
    if (vm.finishPay) {
        alert('支付已经完成，无需再次支付');
    } else {
        if (vm.prepayId == "") {
            alert("没有预支付信息, 请检查代码,以及日志输入");
            return;
        } else {
            $.ajax({
                url: 'http://bw.gcdzxfu.cn/WeChatApi/GetBrandWcPay',
                type: 'post',
                data: { prepayId: vm.prepayId },
                complete: function (d) {
                    //console.log(d.responseText)
                    WeixinJSBridge.invoke('getBrandWCPayRequest',
                        JSON.parse(d.responseText)
                        , function (res) {
                            WeixinJSBridge.log(res.err_msg);
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                //alert("支付成功");
                                vm.finishPay = true;
                                vm.isSubmit = false;
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