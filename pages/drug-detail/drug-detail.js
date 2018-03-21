var app = getApp()
var util = require('../../utils/util.js')
var requests = require( '../../utils/request.js' );
const api = require('../../utils/api.js');

Page({
  data:{
    text:"Page drug-detail",
    drugDetailList: [],
     indicatorDots:true,
    autoplay:true,   //  banner 是否自动切换
    interval:2000,   //  自动切换时间间隔（毫秒）
    duration:500,    //  滑动动画时长
    imgUrls: [
    ],
    id:'',
    name:'暂无',
    price:'0',
    nameCommon:'暂无',
    efficacy:'暂无',
    useage:'暂无',
    specifications:'暂无',
    elements:'暂无',
    useageArray:[],
    drugInfo:{},
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options.id)
    that.setData({
      id:options.id,
      price:options.price,
      name:options.title,
      nameCommon:options.title,
    })
    this.getServerData();

  },
  dealDrugData:function (e){
     var  that = this;
     var imagesArray=[];
     var id,title,nameCommon;
      for(var k in e) {
         //遍历对象，k即为key，obj[k]为当前k对应的值
          imagesArray.push(e[k]);
        }
  },
  dealPriceData:function (e){
    if(!util.isNull(e)){
      var that = this;
      var subStr = e.substr(2);
      let length = subStr.length;
      var finllayStr = subStr.substr(0,length-3);
      console.log(finllayStr);
      that.setData({
        price:finllayStr,
        // price:'8.5',
      })
    }else {
        console.log('价格字符串为空');
    }
     
  },
  dealuseageData:function (e){
    if(!util.isNull(e)){
      var that = this;
      var arr =[];
      var str =e;
      arr=str.split(/[<p></p><br/>]/);
      var lastArr = [];
      for (var i in arr){
       var value = arr[i];
       if(!util.isNull(value)&&value!=" "){
             lastArr.push(value);
       }
     }
     console.log(lastArr);
     that.setData({
        useageArray:lastArr
     })
    }else {
       console.log('用法用量字符串为空');

    }
  },
  getServerData:function (){
  console.log('请求网络数据');
      let  that = this;
      util.isLoading(true);
      requests.getDrugDetailInfo(that.data.id, ( res ) => {   
         if(res.code == 10000){
             const list = res.data;
          if(!util.isNull(res.data.price)){
           var price = JSON.stringify(res.data.price)
        if( "暂无报价" == res.data.price){
            that.setData({
               price:'0'
              })
        }else{
              that.dealPriceData(price);
            }
        }
         if(!util.isNull(res.data.name)){
            that.setData({
              name:res.data.name
            })
          }
         if(!util.isNull(res.data.nameCommon)){
            that.setData({
              nameCommon:res.data.nameCommon
            })
          }
          if(!util.isNull(res.data.efficacy)){
            that.setData({
              efficacy:res.data.efficacy
            })
          }
          if(!util.isNull(res.data.useage)){
            that.setData({
              useage:res.data.useage
            })
          }
          if(!util.isNull(res.data.specifications)){
            that.setData({
              specifications:res.data.specifications
            })
          }
          if(!util.isNull(res.data.elements)){
            that.setData({
              elements:res.data.elements
            })
          }
          // that.dealImageData(res.data.images);
          // that.dealuseageData(res.data.useage);
          var imagesArray =  res.data.images.slice(0,5);
        console.log('111111'+ imagesArray.length)

           that.setData({
             drugDetailList:res.data,
              imgUrls:imagesArray,
           })
         }
        }, (err) => {
        util.showToast('请求数据失败');
        }, () => {
        util.isLoading(false);
        console.log('请求网络数据完成');
      });
  },
  getLocalTestData:function(){
    var list = util.getDoctorList();
    console.log('adressList',list);
    this.setData({
      introduceList:list.data
    });
  },
    recommondPharmacy:function(){
	  console.log('推荐药店')
     wx.navigateTo({
      url: '../doctorDetail/index'
    })
  },
     deliverDrug:function(){
	  console.log('极速送药')
     wx.navigateTo({
      url: '../doctorDetail/index'
    })
  },
    //  点击banner图
  clickBanner:function(e){
    console.log('点击的banner')
    console.log(e)

  },

})