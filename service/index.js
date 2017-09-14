
var vm = new Vue({
    el: "#app",
    data: {
      // priceDate:'',
        priceList1:'',
        priceList2:'',
        partsList:'',
        month:'',
        date:''
    },
    methods: {
        getpage: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetIndex",               
                complete: function (d) {
                   // console.info(d);
                    var obj = JSON.parse(d.responseJSON);
                    //console.info(obj);
                   // that.priceDate = obj.priceDate;
                    that.priceList1 = obj.priceList1;
                    that.priceList2 = obj.priceList2;
                    that.partsList=obj.partsList;
                    that.month =obj.priceDate.split('-')[0];
                    that.date=obj.priceDate.split('-')[1];
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
        },
        showCart() {
            $('#sf_price').modal({
                relatedTarget: this
            });
        },
        showCart1() {
            $('#fw_price').modal({
                relatedTarget: this
            });
        }
    },
    mounted: function () {
        this.getpage(1);
    }
});