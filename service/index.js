
var vm = new Vue({
    el: "#app",
    data: {
       priceDate:'',
        priceList1:'',
        priceList2:'',
        partsList:''
    },
    methods: {
        getpage: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://test.osintell.cn/api/WebApi/GetIndex",               
                complete: function (d) {
                   // console.info(d);
                    var obj = JSON.parse(d.responseJSON);
                    //console.info(obj);
                    that.priceDate = obj.priceDate;
                    that.priceList1 = obj.priceList1;
                    that.priceList2 = obj.priceList2;
                    that.partsList=obj.partsList;
                    // if (obj.list.length < 1) {
                    //     that.isNotMore = true
                    // } else {
                    //     that.isNotMore = falseget
                    // }
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                }
            });
        }
    },
    mounted: function () {
        this.getpage(1);
    }
});