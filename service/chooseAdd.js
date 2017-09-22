var vm = new Vue({
    el: "#app",
    data: {
        addressList: [],//地址列表
        type:1//采购类型
    },
    methods: {
        getpage: function () {
            var that = this;
            let userid = getStore('userid');
            var url = location.search; //获取url中"?"符后的字串
            if (url.indexOf("?") !== -1) {
                let str = url.substr(1);
                let type = str.split('=')[1];
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
                    that.getpage();
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
            if(vm.type==1){
                window.location.href="order.html"
            }else{
                window.location.href="packOrder.html";
            }
            
        }
    },
    mounted: function () {
        this.getpage();
    }
});