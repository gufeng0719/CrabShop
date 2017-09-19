
/**
 * 存储localStorage
 */
var setStore = function (name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
var getStore = function (name) {
    if (!name) return;
    return window.localStorage.getItem(name);
}

var vm = new Vue({
    el: "#app",
    data: {
        packageList: [], //套餐列表
        totalPrice: 0, //总共价格
        totalNumber: 0,//总共购买份数
        cartPackageList: [], //购物车套餐列表
        showCartList: false,//显示购物车列表        
        preventRepeatRequest: false,// 防止多次触发数据请求
        choosedFoods: null, //当前选中食品数据
        showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
        windowHeight: null, //屏幕的高度
        imgBaseUrl: 'http://bw.gcdzxfu.cn/'
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetPackageList",
                success: function (d) {
                    console.info(d.status)
                    if (d.status) {
                        that.packageList = d.packagelist;
                    }
                    if (window.scrolled) {
                        window.scrolled = false;
                    }
                }
            });
        },
        //从套餐列表中添加        
        addToCart(package) {
            var that = this;
            that.totalNumber++; //总购买件数
            package.number++;//本套餐购买件数
            that.totalPrice += package.PackagePrice;
            let cart = that.cartPackageList;//获取已经购买列表
            let item = _.find(cart, { 'id': package.PackageId });
            if (item) {
                item.num++;
            } else {
                item = {
                    "num": 1,
                    "id": package.PackageId,
                    "name": package.PackageName,
                    "price": package.PackagePrice,
                    "weight": package.PackageWeight,
                    "tname": package.TypeName,
                    "image": package.PackageImage
                }
                that.cartPackageList.push(item);
            }
            //存入localStorage
            setStore('buyPackage', that.cartPackageList);
        },
        //购物车中添加
        addCart(cart) {
            var that = this;
            cart.num++;
            this.totalNumber++;
            var plist = that.packageList;
            let item = _.find(plist, { 'PackageId': cart.id });
            if (item) {
                item.number++;
            }
            this.totalPrice += cart.price;
            //存入localStorage
            setStore('buyPackage', this.cartPackageList);
        },
        //从套餐列表中移出
        removeOutCart(package) {
            var that = this;
            package.number--;
            that.totalNumber--;
            that.totalPrice -= package.PackagePrice;
            let cart = that.cartPackageList;
            let item = _.find(cart, { 'id': package.PackageId });
            if (item) {
                if (item.num > 1) {
                    item.num--;
                } else {
                    //商品数量为0，则清空当前商品的信息
                    _.remove(that.cartPackageList, function (n) {
                        return n == item;
                    });
                    // console.info(this.cartFoodList);
                    // this.cartFoodList.remove(item);
                    package.number = 0;
                }
            }
            setStore('buyPackage', that.cartPackageList);
        },
        //从购物车中移出
        removeCart(cart) {
            var that = this;
            that.totalNumber--;
            that.totalPrice -= cart.price;
            let plist = that.packageList;
            let item = _.find(plist, { 'PackageId': cart.id });
            if (item) {
                item.number--;
            }
            if (cart.num > 1) {
                cart.num--;
            } else {
                //商品数量为0，则清空当前商品的信息
                _.remove(that.cartPackageList, function (n) {
                    return n == cart;
                });
            }
            setStore('buyPackage', that.cartPackageList);
        },
        showCart() {
            $('#my-confirm').modal({
                relatedTarget: this
            });
        },
        //清空购物车
        clearCart() {
            this.cartPackageList = [];//清除已购买的物品            
            this.totalPrice = 0;//清楚已购买总金额
            this.totalNumber = 0;//清楚已购买的数量
            //清楚螃蟹数量
            this.packageList.forEach((n) => {
                n.number = 0;
            });
            window.localStorage.removeItem("buyPackage");
        }
    },
    computed: {
        /*
        totalNum: function () {
            let num = 0;
           for(var item in this.cartFoodList){
               num+=item[num];
           }
            return num;
        },
        cartPrice:function(){
            let price=0;
            this.partList1.forEach((n)=>{
                price +=n.PartPrice
            });
            return price;
        }*/

    },
    watch: {

    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.clearCart();
        this.initData();
    }
});