var vm = new Vue({
    el: "#app",
    data: {
        address:{
            province:'',
            city:'',
            district:'',
            firstPrice:0,
            fllowPrice:0
        },
        consignee:'',//联系人
        telphone:'',//联系号码
        consex:'先生',//性别
        details:''//详细地址

    },
    method: {},
    watch: {

    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
    }
});

function submitClick(){
    var length = $("#app :invalid").length;
    if(length==0){
        $.ajax({
            type:'post',
            url:'http://bw.gcdzxfu.cn/api/WebApi/AddAddress',
            data:{
                UserId:getStore('userid'),
                Consignee:vm.consignee,
                Details:vm.address.province+"&"+vm.address.city+"&"+vm.address.district+"&"+vm.details,
                TelPhone:vm.telphone,
                ConSex:vm.consex
            },
            success:function(msg){
                if(msg&&msg.status){                    
                    let addressinfo=[{                        
                        firstPrice:vm.address.firstPrice,//首重单价
                        fllowPrice:vm.address.fllowPrice,//续重单价
                        consignee:vm.consignee,//联系人
                        telphone:vm.telphone,//联系号码
                        consex:vm.consex,//性别
                        province:vm.address.province,
                        city:vm.address.city,
                        district:vm.address.district,
                        details:vm.details//详细地址
                    }];
                    setStore('addressinfo',addressinfo);
                    window.location.href="order.html";
                }
            }
        });   

    }else{
        return false;
    }
}