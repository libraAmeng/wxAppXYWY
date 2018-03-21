var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:{
    text:"Page doc-detail",
    doctorInfo: {},

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    	 var that = this
       wx.getStorage({
          key: 'doctorInfo',
          success: function(res) {
          var info = JSON.parse(res.data)
  	      that.setData({
			      doctorInfo: info
		      })
        console.log('医生详情页读取缓存的医生信息：' + res.data );
  }     
})
  

  },
    bindItemTap: function(e) {
      console.log("app.globalData.phone"+app.globalData.phone)

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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})