
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
        proList1: [],
        proList2: [],
        proList3: [],
        proList4: [],
        partList: [],
        partList1:[],
        menuList: [], //食品列表
        menuIndex: 0, //已选菜单索引值，默认为0
        partNumList: [], //以选择配件列表
        totalPrice: 0, //总共价格
        totalNumber: 0,
        cartFoodList: [], //购物车商品列表
        showCartList: false,//显示购物车列表        
        preventRepeatRequest: false,// 防止多次触发数据请求
        choosedFoods: null, //当前选中食品数据
        showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
        windowHeight: null, //屏幕的高度
        imgBaseUrl: 'http://test.osintell.cn/'
    },
    methods: {
        //初始化数据
        initData: function () {
            var that = this;
            $.ajax({
                type: "get",
                url: "http://test.osintell.cn/api/WebApi/GetProductList",
                complete: function (d) {
                    var obj = JSON.parse(d.responseText);
                    //console.info(obj);
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
        //点击左侧食品列表标题，相应列表移动到最顶层
        chooseMenu(index) {
            var $this = $(this);
            var $t = $this.index();
            $li.removeClass();
            $this.addClass('current');
            $ul.css('display', 'none');
            $ul.eq($t).css('display', 'block');
        },
        //添加到购物车
        addToCart(product) {
            if (product.ProductId < 10000) {
                product.number++;
                this.totalNumber++;
                this.totalPrice += product.ProductPrice * product.ProductWeight * 2;
            }
            let cart = this.cartFoodList;
            let item = _.find(cart, { 'id': product.ProductId });
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
                    "image":product.ProductImage
                }
                this.cartFoodList.push(item);
            }
            //存入localStorage
            setStore('buyCart', this.cartFoodList);
        },
        addCart(cart){
            cart.num++;
            this.totalNumber++;
            this.totalPrice += cart.price * cart.weight * 2;
             //存入localStorage
             setStore('buyCart', this.cartFoodList);
        },
        //从购物车移出
        removeOutCart(product) {
            if (product.ProductId < 10000) {
                product.number--;
                this.totalNumber--;
                this.totalPrice -= product.ProductPrice * product.ProductWeight * 2;
            }
            let cart = this.cartFoodList;
            let item = _.find(cart, { 'id': product.ProductId });
            if (item) {
                if (item.num > 1) {
                    item.num--;
                } else {
                    //商品数量为0，则清空当前商品的信息
                    _.remove(this.cartFoodList, function (n) {
                        return n==item;
                    });
                    // console.info(this.cartFoodList);
                    // this.cartFoodList.remove(item);
                    product.number = 0;
                }
            }
            setStore('buyCart', this.cartFoodList);
        },
        removeCart(cart)
        {
             this.totalNumber--;
             this.totalPrice -= cart.price * cart.weight * 2;
           // let item = _.find(this.cartFoodList, { 'id': cart.id });
            if(cart.num>1){
                cart.num--;
            }else{
                //商品数量为0，则清空当前商品的信息
                _.remove(this.cartFoodList, function (n) {
                    return n==cart;
                });
            }
            setStore('buyCart', this.cartFoodList);
        },

        check(part) {
            let cart = this.partNumList;
            let index = _.findIndex(cart, { 'id': part.PartId });
            console.info(index);
            if (index >= 0) {
                //商品数量为0，则清空当前商品的信息
                _.remove(this.partNumList, function (n) {
                    return n.id == part.PartId;
                });
            }
            else {
                let num=1;
                if(part.PartId==10009)
                {
                        num =this.totalNumber;
                }
                let item={
                    "id":part.PartId,
                    "num": num,
                    "name": part.PartName,
                    "price": part.PartPrice,
                    "weight": part.PartWeight,
                    "tname": part.TypeName
                }
                this.partNumList.push(item);
            }
            //存入localStorage
            setStore('buyPart', this.partNumList);
        },
        showCart(){
            $('#my-confirm').modal({
		        relatedTarget: this
		      });
        },
        //清空购物车
        clearCart(){
            this.cartFoodList=[];//清除已购买的物品
            this.partNumList=[];//清除已购买的配件
            this.totalNumber=0;//清除已购买数量
            this.totalPrice=0;//清楚已购买总金额
            //清楚螃蟹数量
            this.proList1.forEach((n)=>{
                n.number=0;
            });
            this.proList2.forEach((n)=>{
                n.number=0;
            });
            this.proList3.forEach((n)=>{n.number=0});
            this.proList4.forEach((n)=>{n.number=0});
            this.partList.forEach((n)=>{n.number=0});
            window.localStorage.removeItem("buyCart"); 
            window.localStorage.removeItem("buyPart"); 
        }
    },
    computed: {
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
        }

    },
    watch: {

    },
    mounted: function () {
        this.windowHeight = window.innerHeight;
        this.clearCart();
        this.initData();        
    }
});