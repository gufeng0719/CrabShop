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
        proList1: [],
        proList2: [],
        proList3: [],
        proList4: [],
        partList: [],
        partList1: [],
        menuList: [],
        menuIndex: 0,
        partNumList: [],
        totalPrice: 0,
        totalNumber: 0,
        cartFoodList: [],
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
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetProductList",
                complete: function (d) {
                    var obj = JSON.parse(d.responseText);
                    that.proList1 = obj.proList1;
                    that.proList2 = obj.proList2;
                    that.proList3 = obj.proList3;
                    that.proList4 = obj.proList4;
                    that.partList = obj.partList;
                    that.partList1 = obj.partList1;
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                }
            });
        },
        chooseMenu: function (index) {
            var $this = $(this);
            var $t = $this.index();
            $li.removeClass();
            $this.addClass('current');
            $ul.css('display', 'none');
            $ul.eq($t).css('display', 'block');
        },
        addToCart: function (product, index) {
            if (product.ProductId < 10000) {
                product.number++;
                this.totalNumber++;
                this.totalPrice += product.ProductPrice * product.ProductWeight * 2;
            }
            var cart = this.cartFoodList;
            var item = _.find(cart, { 'id': product.ProductId });
            if (item) {
                item.num++;
            } else {
                item = {
                    "num": 1,
                    "id": product.ProductId,
                    "name": product.ProductName,
                    "price": product.ProductPrice,
                    "weight": product.ProductWeight,
                    "tname": product.TypeName,
                    "image": product.ProductImage,
                    "index": index
                };
                this.cartFoodList.push(item);
            }
            setStore('buyCart', this.cartFoodList);
        },
        addCart: function (cart) {
            cart.num++;
            this.totalNumber++;
            this.totalPrice += cart.price * cart.weight * 2;
            var proList = selectProList(cart.index);
            var item = _.find(proList, { 'ProductId': cart.id });
            if (item) {
                item.number++;
            }
            setStore('buyCart', this.cartFoodList);
        },
        removeOutCart: function (product) {
            if (product.ProductId < 10000) {
                product.number--;
                this.totalNumber--;
                this.totalPrice -= product.ProductPrice * product.ProductWeight * 2;
            }
            var cart = this.cartFoodList;
            var item = _.find(cart, { 'id': product.ProductId });
            if (item) {
                if (item.num > 1) {
                    item.num--;
                } else {
                    _.remove(this.cartFoodList, function (n) {
                        return n == item;
                    });
                    product.number = 0;
                }
            }
            setStore('buyCart', this.cartFoodList);
        },
        removeCart: function (cart) {
            this.totalNumber--;
            this.totalPrice -= cart.price * cart.weight * 2;
            var proList = selectProList(cart.index);
            var item = _.find(proList, { 'ProductId': cart.id });
            if (item) {
                item.number--;
            }
            if (cart.num > 1) {
                cart.num--;
            } else {
                _.remove(this.cartFoodList, function (n) {
                    return n == cart;
                });
            }
            setStore('buyCart', this.cartFoodList);
        },
        check: function (part) {
            var cart = this.partNumList;
            var index = _.findIndex(cart, { 'id': part.PartId });
            if (index >= 0) {
                _.remove(this.partNumList, function (n) {
                    return n.id == part.PartId;
                });
            } else {
                var num = 1;
                if (part.PartId == 10009) {
                    num = this.totalNumber;
                }
                var item = {
                    "id": part.PartId,
                    "num": num,
                    "name": part.PartName,
                    "price": part.PartPrice,
                    "weight": part.PartWeight,
                    "tname": part.TypeName
                };
                this.partNumList.push(item);
            }
            setStore('buyPart', this.partNumList);
        },
        showCart: function () {
            $('#my-confirm').modal({ relatedTarget: this });
        },
        clearCart: function () {
            this.cartFoodList = [];
            this.partNumList = [];
            this.totalNumber = 0;
            this.totalPrice = 0;
            this.proList1.forEach(function (n) {
                n.number = 0;
            });
            this.proList2.forEach(function (n) {
                n.number = 0;
            });
            this.proList3.forEach(function (n) {
                n.number = 0;
            });
            this.proList4.forEach(function (n) {
                n.number = 0;
            });
            this.partList.forEach(function (n) {
                n.number = 0;
            });
            window.localStorage.removeItem("buyCart");
            window.localStorage.removeItem("buyPart");
        }
    },
    computed: {
        totalNum: function () {
            var num = 0;
            for (var item in this.cartFoodList) {
                num += item[num];
            }
            return num;
        },
        cartPrice: function () {
            var price = 0;
            this.partList1.forEach(function (n) {
                price += n.PartPrice;
            });
            return price;
        }
    },
    watch: {},
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.clearCart();
        this.initData();
    }
});
function selectProList(index) {
    var proList = [];
    switch (index) {
        case 1:
            proList = vm.proList1;
            break;
        case 2:
            proList = vm.proList2;
            break;
        case 3:
            proList = vm.proList3;
            break;
        case 4:
            proList = vm.proList4;
            break;
    }
    return proList;
}
