var app = getApp()
var util = require('../../utils/util.js')
var requests = require( '../../utils/request.js' );
const api = require('../../utils/api.js');

Page({
  data:{
    text:"Page recevie-goods-adress",
    adressList: [],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocalTestData();

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
  },
  getLocalTestData:function(){
    var list = util.getDoctorList();
    console.log('adressList',list);
    this.setData({
      adressList:list.data
    });
  },
  addAdress:function(){
	  console.log('新建收货地址')
     wx.navigateTo({
      url: '../doctorDetail/index'
    })
  },
  deleteAdress:function(e){
	  var that = this;
    var id=e.currentTarget.dataset.id
	  console.log('删除地址'+id)
  
  },
  
})