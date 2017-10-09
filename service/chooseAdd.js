var vm = new Vue({
    el: "#app",
    data: {
        addressList: [],
        type: 1
    },
    methods: {
        getpage: function () {
            var that = this;
            var userid = getStore('userid');
            var url = location.search;
            if (url.indexOf("?") !== -1) {
                var str = url.substr(1);
                var type = str.split('=')[1];
                that.type = type;
            }
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetAddressList",
                data: { userId: userid },
                success: function (msg) {
                    if (msg.status) {
                        that.addressList = msg.list;
                    }
                }
            });
            if (window.scrolled) {
                window.scrolled = false;
            }
        },
        ChooseDefault: function (addressId) {
            var that = this;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/ChooseDefault",
                type: 'post',
                data: { "": addressId },
                success: function (msg) {
                    if (msg.status) {
                        that.getpage();
                    }
                }
            });
        },
        DeleteAddress: function (addressId) {
            var that = this;
            $.post("http://bw.gcdzxfu.cn/api/WebApi/DeleteAddress", { '': addressId }, function (msg) {
                if (msg) {
                    that.getpage();
                }
            });
        },
        ChooseAddress: function (address) {
            var addressinfo = [{
                firstPrice: address.FirstPrice,
                fllowPrice: address.FllowPrice,
                consignee: address.Consignee,
                telphone: address.TelPhone,
                consex: address.ConSex,
                province: address.Province,
                city: address.City,
                district: address.District,
                details: address.Detail
            }];
            setStore('addressinfo', addressinfo);
            if (vm.type == 1) {
                window.location.href = "order.html";
            } else {
                window.location.href = "packOrder.html";
            }
        }
    },
    mounted: function () {
        this.getpage();
    }
});