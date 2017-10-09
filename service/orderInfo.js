var vm = new Vue({
    el: "#app",
    data: {
        order: {},
        crabList: [],
        partMustList: [],
        partOptList: [],
        packList: [],
        address: {
            consignee: '',
            telphone: '',
            province: '',
            city: '',
            district: '',
            details: ''
        }
    },
    methods: {
        initData: function () {
            var that = this;
            var url = location.search;
            if (url.indexOf("?") !== -1) {
                var str = url.substr(1);
                var orderid = str.split('=')[1];
                $.getJSON('http://bw.gcdzxfu.cn/api/WebApi/GetOrderInfoByOrderId/' + orderid, function (msg) {
                    that.order = msg.order;
                    that.crabList = msg.crabList;
                    that.partMustList = msg.partMustList;
                    that.partOptList = msg.partOptList;
                    that.packList = msg.packList;
                    var addressStr = msg.order.OrderAddress.split('$');
                    that.address.consignee = addressStr[1];
                    that.address.telphone = addressStr[3];
                    var addressInfo = addressStr[4].split(' ');
                    that.address.province = addressInfo[0];
                    that.address.city = addressInfo[1];
                    that.address.district = addressInfo[2];
                    that.address.details = addressInfo[3];
                });
            }
        }
    },
    computed: {},
    mounted: function () {
        this.initData();
    }
});