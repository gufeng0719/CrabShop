Vue.component("ddladdress", {
    template:
    '<div>' +
    '   <select v-model="province">' +
    '      <option value="-1">-请选择-</option>' +
    '      <option v-for="(model,index) in provinceList" :value="model">{{model.Name}}</option>' +
    '   </select>' +
    '   <select v-model="city">' +
    '      <option selected v-for="(model,index) in cityList" :value="model">{{model.Name}}</option>' +
    '   </select>' +
    '   <select> v-model="district" v-show="district!=0">' +
    '      <option v-for="(model,index) in districtList" :value="model">{{model.Name}}</option>' +
    '   </select>' +
    '</div>',
    props: ["address"],
    data: function () {
        return {
            provinceList: [],//省会列表
            cityList: [],//城市列表，
            districtList: [],//行政区列表
            province: -1,
            city: -1,
            district: -1
        }
    },
    methods: {
        ChooseAddress: function (index, type) {
            var that = this;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetCityList",
                type: "get",
                data: { parentId: index },
                success: function (d) {
                    if (type == 0) {
                        that.provinceList = d;
                        that.province = d[10];
                        //that.city =  that.provinceList[0].Id
                         
                    }else if(type==1){
                        that.cityList =d;
                        Vue.nextTick(() => {
                            that.city = that.cityList[0];
                            that.$emit('input', that.info);
                        }); 
                    }else{
                        if(d.length==0){
                            that.district=0;
                            that.districtList=[];
                        }else{
                            that.districtList =d;
                            Vue.nextTick(() => {
                                that.district = that.districtList[0];
                                that.$emit('input', that.info);
                            }); 
                        }
                    }
                    
                }, error: function (d) {
                    console.log(d);
                }
            });
        }

    },
    watch: {
        province: function (newValue) {            
            var that = this;
            that.ChooseAddress(newValue.Id, 1);            
            this.province = newValue;
            that.address.province=newValue.Name;
            that.address.firstPrice =newValue.FirstPrice;
            that.address.fllowPrice =newValue.FllowPrice;
        },
        city: function (newValue) {
            var that = this;
            that.districtList = that.ChooseAddress(newValue.Id, 2);            
            that.city = newValue;
            that.address.city = newValue.Name;
        },
        district: function (newValue) {
            var that = this;
            this.district = newValue;
            Vue.nextTick(() => {
                that.$emit('input', that.info);
            });
            that.address.district =newValue.Name;
        }
    },
    
    mounted: function () {
        this.ChooseAddress(0, 0);
    }
});