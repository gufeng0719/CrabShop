var vm = new Vue({
    el: "#app",
    data: {
        openId: '',//openId
        totalWeight: 0,//已经购买总重量
        weightWidth: 0//进度宽度
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            $.getJSON("http://test.osintell.cn/api/WebApi/GetUserInfo", { openId: that.openId }, function (msg) {
                //console.info(msg);
                if (msg.status) {
                    that.totalWeight = msg.user.TotalWight;
                    that.weightWidth = msg.user.TotalWight * 2 - 8;
                }
            });
        }
    },
    computed: {
    },
    mounted: function () {
        this.openId = loadOpen();
        this.initData();
        //初始化vue后,显示vue模板布局
        //document.getElementById("app").style.display = "block";
    }
});