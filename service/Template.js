'use strict';

Vue.component("ddladdress", {
    template: '<div>' + '   <select v-model="selectedProvince">' + '      <option value="-1">-请选择-</option>' + '      <option v-for="(model,index) in provinceList" :value="model">{{model.Name}}</option>' + '   </select>' + '   <select v-model="selectedCity" v-show="cityList.length>0">' + '      <option v-for="(model,index) in cityList" :value="model">{{model.Name}}</option>' + '   </select>' + '   <select v-model="selectedDistrict" v-show="districtList.length>0">' + '      <option v-for="model in districtList" :value="model" >{{model.Name}}</option>' + '   </select>' + '</div>',
    props: ["address"],
    data: function data() {
        return {
            provinceList: [], //省会列表
            cityList: [], //城市列表，
            districtList: [], //行政区列表
            // province:-1,
            // city:-1,
            // district:-1,
            selectedProvince: 0,
            selectedCity: 0,
            selectedDistrict: 0
        };
    },
    methods: {
        ChooseAddress: function ChooseAddress(index, type) {
            var that = this;
            $.ajax({
                url: "http://bw.gcdzxfu.cn/api/WebApi/GetCityList",
                type: "get",
                data: { parentId: index },
                success: function success(d) {
                    if (type == 0) {
                        that.provinceList = d;
                        that.selectedProvince = d[10];
                        //that.city =  that.provinceList[0].Id
                    } else if (type == 1) {
                        that.cityList = d;
                        Vue.nextTick(function() {
                            that.selectedCity = that.cityList[0];
                            that.$emit('input', that.info);
                        });
                    } else if (type == 2) {
                        if (d.length == 0) {
                            that.selectedDistrict = 0;
                            that.districtList = [];
                        } else {
                            that.districtList = d;
                            Vue.nextTick(function() {
                                that.selectedDistrict = that.districtList[0];
                                that.$emit('input', that.info);
                            });
                        }
                    }
                }, error: function error(d) {
                    console.log(d);
                }
            });
        }
    },
    watch: {
        selectedProvince: function selectedProvince(newValue) {
            var that = this;
            //四个直辖市只有两级加上港澳台
            if (newValue.Id === 1 || newValue.Id === 2 || newValue.Id === 3 || newValue.Id === 4 || newValue.Id === 33 || newValue.Id === 34) {
                that.ChooseAddress(newValue.Id, 2);
                that.cityList = [];
                that.address.province = "";
                that.address.city = newValue.Name;
            } else {
                that.ChooseAddress(newValue.Id, 1);
            }
            that.address.province = newValue.Name;
            that.address.firstPrice = newValue.FirstPrice;
            that.address.fllowPrice = newValue.FllowPrice;
        },
        selectedCity: function selectedCity(newValue) {
            var that = this;
            if (newValue.Id === 337 || newValue.Id === 338 || newValue.Id === 357 || newValue.Id === 358) {
                that.address.district = "";
                that.districtList = [];
                //四个不设区的城市
            } else {
                that.ChooseAddress(newValue.Id, 2);
            }
            // that.city = newValue;
            that.address.city = newValue.Name;
        },
        selectedDistrict: function selectedDistrict(newValue) {
            //console.info(newValue);
            var that = this;
            //that.district = newValue;
            Vue.nextTick(function() {
                that.$emit('input', that.info);
            });
            that.address.district = newValue.Name;
            //that.distr= newValue.Name;
        }
    },
    mounted: function mounted() {
        this.ChooseAddress(0, 0);
    }
});