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
        consignee: '',
        telphone: '',
        consex: '先生',
        details: '',
        type: 1
    },
    methods: {
        initType: function () {
            var that = this;
            var url = location.search;
            if (url.indexOf("?") !== -1) {
                var str = url.substr(1);
                var type = str.split('=')[1];
                that.type = type;
            }
        }
    },
    watch: {},
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
                    var addressinfo = [{
                        firstPrice: vm.address.firstPrice,
                        fllowPrice: vm.address.fllowPrice,
                        consignee: vm.consignee,
                        telphone: vm.telphone,
                        consex: vm.consex,
                        province: vm.address.province,
                        city: vm.address.city,
                        district: vm.address.district,
                        details: vm.details
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