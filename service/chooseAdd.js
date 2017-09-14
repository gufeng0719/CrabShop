var vm = new Vue({
    el: "#app",
    data: {
        addressList: []//地址列表
    },
    methods: {
        getpage: function () {
            var that = this;
            let userid = getStore('userid');
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
                type:'post',
                data: { "": addressId },
                success: function (msg) {
                    if(msg.status){
                        that.getpage();
                    }
                }
            });
        },
        DeleteAddress: function (addressId) {
            var that = this;
            $.post("http://bw.gcdzxfu.cn/api/WebApi/DeleteAddress", { '': addressId }, function (msg) {
                if(msg){
                    this.getpage();
                }
            })
        },
        ChooseAddress:function(address){
            let addressinfo=[{                        
                firstPrice:address.FirstPrice,//首重单价
                fllowPrice:address.FllowPrice,//续重单价
                consignee:address.Consignee,//联系人
                telphone:address.TelPhone,//联系号码
                consex:address.ConSex,//性别
                province:address.Province,
                city:address.City,
                district:address.District,
                details:address.Detail//详细地址
            }];
            setStore('addressinfo',addressinfo);
            window.location.href="order.html"
        }
    },
    mounted: function () {
        this.getpage();
    }
});