//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var requests = require( '../../utils/request.js' );
const api = require('../../utils/api.js');
Page({
  data: {
    doctorList: [],
    departList:[],
    motto: 'Hello World wechat',
    userInfo: {},
    isShowDepart:false,
    isClickDepart:false,
    currentID:'',
    windowHeight:10,

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShareAppMessage: function () {
    return app.shareData;
  },

    getTokenAndUserId: function() {
    app.globalData.token = wx.getStorageSync('token');
    app.globalData.userid = wx.getStorageSync('userid');
    app.globalData.data = wx.getStorageSync('data');
    app.globalData.phone = wx.getStorageSync('phone');
    app.globalData.openid = wx.getStorageSync('openid');
  },

  onLoad: function () {

    this.getTokenAndUserId();
      

    // this.isToken();
       this.getAppData ();
     this.getWXDoctorInfo ();
    this.getDoctorDepartData();
  // this.getLocalTestData();
  },
  
  getAppData:function (){
     let that = this;
      wx.getSystemInfo({
        success: function(res) {
          
          console.log('屏幕的宽度'+res.windowWidth);
          that.setData ({
            windowWidth:res.windowWidth,
            windowHeight:res.windowHeight,
          });
        }
      })
  },

  isToken :function () {
    console.log('token',app.globalData.token)
    if (app.globalData.token==null || app.globalData.token == undefined || app.globalData.token == '') {
      console.log('is null')
      wx.redirectTo({
        url: '../auth/index'
      })
      return;
    } 
  },

  getLocalTestData:function(){
    var list = util.getDoctorList();
    console.log('list',list);
    this.setData({
      doctorList:list.data
    });
  },
   getDoctorDepartData:function(){
    var departList = util.getDoctorDepartList();
    console.log('departList',departList);
    this.setData({
      departList:departList.data
    });
  },

  getWXDoctorInfo:function() {
      console.log('请求网络数据');
      let  that = this;
      util.isLoading(true);
      requests.getWXDoctorInfo(that.data.currentID, ( res ) => {            
          const list = res.data;
          that.setData({
            doctorList: list,
          })
          console.log('医生列表请求网络数据成功');
          var dataInfo = JSON.stringify(res.data)
          // console.log('wen请求成功的订单信息：' + dataInfo +'wenwenwenwennwenewnnwen' );
        }, (err) => {
        console.log('请求订单信息失败')
        util.showToast('请求数据失败');

        }, () => {
        util.isLoading(false);
        console.log('请求网络数据完成');
      });
  },
   qusetionTap: function(e) {
     
      var id=e.currentTarget.dataset.id
      console.log('id = ',id);
      var item = this.data.doctorList[id]
       var str =JSON.stringify(item);
           wx.setStorage({
           key:"doctorInfo",
           data:str
           })
     console.log('医生列表页缓存数据tap = ',JSON.stringify(item));


     if(util.checkLogin()){
          wx.navigateTo({
              url: '../ask/index'
            })
      }else {
          wx.navigateTo({
              url: '../login/index'
          }) 
      }
   
  },

  bindItemTap: function(e) {

    var id=e.currentTarget.dataset.id
    console.log('id = ',id);
    var item = this.data.doctorList[id]
    var str =JSON.stringify(item);
    wx.setStorage({
      key:"doctorInfo",
     data:str
    })
    console.log('医生列表页缓存数据tap = ',JSON.stringify(item));
   wx.navigateTo({
      url: '../doctorDetail/index'
    })

    // wx.navigateTo({
    //   url: '../doctorDetail/index?info=' + encodeURI(JSON.stringify(item))
    // })
  },


  clickDepart:function(e){
	  var that = this;
	  console.log('点击科室,是否显示科室')
    var temp = !that.data.isShowDepart
	  that.setData({
		  isShowDepart:temp,
	  })
  },


   clickitem:function(e){
   
     var id=e.currentTarget.dataset.id
	   var that = this;
	   console.log('点击item')
     var temp = !that.data.isShowDepart
     var temDepart =!that.data.isClickDepart
     var tempList = that.data.departList

	  for(let i = 0;i<tempList.length;i++){
	   console.log('点击item'+i);
         if(tempList[i].id== id){           
            console.log('找到了');
            tempList[i].show=true;   
         }else
         {
            tempList[i].show=false;
         }
    }
  	 that.setData({
		     isShowDepart:temp,
         isClickDepart:temDepart,
         currentID:id,
          departList:tempList,
	  })
      console.log('有id,且currentid = ',id);
      that.getWXDoctorInfo();

  },
   imageError :function (){

     console.log('');
   }
  
  
  
})
