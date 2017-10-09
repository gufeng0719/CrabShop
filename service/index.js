var vm = new Vue({
    el: "#app",
    data: {
        priceList1: '',
        priceList2: '',
        partsList: '',
        month: '',
        date: ''
    },
    methods: {
        getpage: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetIndex",
                complete: function (d) {
                    var obj = JSON.parse(d.responseJSON);
                    that.priceList1 = obj.priceList1;
                    that.priceList2 = obj.priceList2;
                    that.partsList = obj.partsList;
                    that.month = obj.priceDate.split('-')[0];
                    that.date = obj.priceDate.split('-')[1];
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                }
            });
        },
        showCart: function () {
            $('#sf_price').modal({ relatedTarget: this });
        },
        showCart1: function () {
            $('#fw_price').modal({ relatedTarget: this });
        }
    },
    mounted: function () {
        this.getpage(1);
    }
});