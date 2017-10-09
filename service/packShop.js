var setStore = function (name, content) {
    if (!name)
        return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
};
var getStore = function (name) {
    if (!name)
        return;
    return window.localStorage.getItem(name);
};
var vm = new Vue({
    el: "#app",
    data: {
        packageList: [],
        totalPrice: 0,
        totalNumber: 0,
        cartPackageList: [],
        showCartList: false,
        preventRepeatRequest: false,
        choosedFoods: null,
        showDeleteTip: false,
        windowHeight: null,
        imgBaseUrl: 'http://bw.gcdzxfu.cn/'
    },
    methods: {
        initData: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetPackageList",
                success: function (d) {
                    console.info(d.status);
                    if (d.status) {
                        that.packageList = d.packagelist;
                    }
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                }
            });
        },
        addToCart: function (packages) {
            var that = this;
            that.totalNumber++;
            packages.number++;
            that.totalPrice += packages.PackagePrice;
            var cart = that.cartPackageList;
            var item = _.find(cart, { 'id': packages.PackageId });
            if (item) {
                item.num++;
            } else {
                item = {
                    "num": 1,
                    "id": packages.PackageId,
                    "name": packages.PackageName,
                    "price": packages.PackagePrice,
                    "weight": packages.PackageWeight,
                    "tname": packages.TypeName,
                    "image": packages.PackageImage
                };
                that.cartPackageList.push(item);
            }
            setStore('buyPackage', that.cartPackageList);
        },
        addCart: function (cart) {
            var that = this;
            cart.num++;
            this.totalNumber++;
            var plist = that.packageList;
            var item = _.find(plist, { 'PackageId': cart.id });
            if (item) {
                item.number++;
            }
            this.totalPrice += cart.price;
            setStore('buyPackage', this.cartPackageList);
        },
        removeOutCart: function (packages) {
            var that = this;
            packages.number--;
            that.totalNumber--;
            that.totalPrice -= packages.PackagePrice;
            var cart = that.cartPackageList;
            var item = _.find(cart, { 'id': packages.PackageId });
            if (item) {
                if (item.num > 1) {
                    item.num--;
                } else {
                    _.remove(that.cartPackageList, function (n) {
                        return n == item;
                    });
                    packages.number = 0;
                }
            }
            setStore('buyPackage', that.cartPackageList);
        },
        removeCart: function (cart) {
            var that = this;
            that.totalNumber--;
            that.totalPrice -= cart.price;
            var plist = that.packageList;
            var item = _.find(plist, { 'PackageId': cart.id });
            if (item) {
                item.number--;
            }
            if (cart.num > 1) {
                cart.num--;
            } else {
                _.remove(that.cartPackageList, function (n) {
                    return n == cart;
                });
            }
            setStore('buyPackage', that.cartPackageList);
        },
        showCart: function () {
            $('#my-confirm').modal({ relatedTarget: this });
        },
        clearCart: function () {
            this.cartPackageList = [];
            this.totalPrice = 0;
            this.totalNumber = 0;
            this.packageList.forEach(function (n) {
                n.number = 0;
            });
            window.localStorage.removeItem("buyPackage");
        }
    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.clearCart();
        this.initData();
    }
});