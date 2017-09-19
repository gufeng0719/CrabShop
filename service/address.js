var vm = new Vue({
    el: "#app",
    data: {
        address: {
            province: '',
            city: '',
            district: '',
            firstPrice: 0,
            fllowPrice: 0
        },
        consignee: '',//联系人
        telphone: '',//联系号码
        consex: '先生',//性别
        details: '',//详细地址
        type: 1

    },
    methods: {
        //初始化数据
        initType: function () {
            var that = this;
            var url = location.search; //获取url中"?"符后的字串
            if (url.indexOf("?") !== -1) {
                let str = url.substr(1);
                let type = str.split('=')[1];
                that.type = type;
            }
        }
    },
    watch: {

    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.initType();
    }
});

function submitClick() {
    var length = $("#app :invalid").length;
    if (length == 0) {
        $.ajax({
            type: 'post',
            url: 'http://bw.gcdzxfu.cn/api/WebApi/AddAddress',
            data: {
                UserId: getStore('userid'),
                Consignee: vm.consignee,
                Details: vm.address.province + "&" + vm.address.city + "&" + vm.address.district + "&" + vm.details,
                TelPhone: vm.telphone,
                ConSex: vm.consex
            },
            success: function (msg) {
                if (msg && msg.status) {
                    let addressinfo = [{
                        firstPrice: vm.address.firstPrice,//首重单价
                        fllowPrice: vm.address.fllowPrice,//续重单价
                        consignee: vm.consignee,//联系人
                        telphone: vm.telphone,//联系号码
                        consex: vm.consex,//性别
                        province: vm.address.province,
                        city: vm.address.city,
                        district: vm.address.district,
                        details: vm.details//详细地址
                    }];
                    setStore('addressinfo', addressinfo);
                    if (vm.type == 1) {
                        window.location.href = "order.html";
                    } else {
                        window.location.href = "packOrder.html";
                    }

                }
            }
        });

    } else {
        return false;
    }
}