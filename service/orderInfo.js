var vm = new Vue({
    el: "#app",
    data: {
        order: {},//订单对象
        crabList: [],//订购螃蟹列表
        partMustList: [],//必选配件列表
        partOptList: [],//可选配件列表
        packList:[],//套餐列表
        address:{
            consignee:'',//联系人
            telphone:'',//联系电话
            province: '',//省
            city: '',//城市
            district: '',//区
            details: ''//详细地址
        }//配送地址
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            var url = location.search; //获取url中"?"符后的字串
            if (url.indexOf("?") !== -1) {
                let str = url.substr(1);
                let orderid = str.split('=')[1];
                $.getJSON('http://bw.gcdzxfu.cn/api/WebApi/GetOrderInfoByOrderId/'+orderid, function (msg) {
                    //console.info(msg);
                    that.order = msg.order;
                    that.crabList = msg.crabList;
                    that.partMustList = msg.partMustList;
                    that.partOptList = msg.partOptList;
                    that.packList = msg.packList;
                    let addressStr =msg.order.OrderAddress.split('$');
                    that.address.consignee =addressStr[1];
                    that.address.telphone =addressStr[3];
                    let addressInfo =addressStr[4].split(' ');
                    that.address.province =addressInfo[0];
                    that.address.city = addressInfo[1];
                    that.address.district =addressInfo[2];
                    that.address.details=addressInfo[3];
                });
            }
        }

    },
    computed: {
    },
    mounted: function () {
        this.initData();
        //初始化vue后,显示vue模板布局
        //document.getElementById("app").style.display = "block";
    }
});

