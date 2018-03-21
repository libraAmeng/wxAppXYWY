var requests = require( '../../utils/request.js' );
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    nickname:'',
    userHeader:'',
    gender:0,
  },

  getTokenAndUserId: function() {
    app.globalData.token = wx.getStorageSync('token');
    app.globalData.userid = wx.getStorageSync('userid');
    app.globalData.data = wx.getStorageSync('data');
    app.globalData.phone = wx.getStorageSync('phone');
  },

  navigateToStart: function() {
  },

saveData: function(data) {
    wx.setStorage({
      key: 'data',
      data: data
    })
  },
  saveToken: function(token) {
    wx.setStorage({
      key: 'token',
      data: token
    })
  },

  saveUserId: function(userId) {
    wx.setStorage({
          key: 'userid',
          data: userId
        })
  },

  saveLoginData:function(res){
      app.globalData.token = res.data.token;  
      app.globalData.userid = res.data.userid;
      app.globalData.data = res.data;
      app.globalData.phone = res.data.userphone;
      this.saveToken(res.data.token);  
      this.saveUserId(res.data.userid);
      this.saveData(res.data); 
      wx.setStorage({
          key: 'phone',
          data: app.globalData.phone,
        })
     
  },

  saveWeixinData:function(res) {
    this.data.nickname = res.nickName;
    this.data.gender = res.gender;
    this.data.userHeader = res.avatarUrl;
  },

  onLoad: function () {
    this.navigateToStart();
    
  },

  getOpenId: function(code) {
      /*var tempurl = "https://api.weixin.qq.com/sns/jscode2session?appid=wx4dbfc6ec08d6bf19&secret=7d6066d6e1e987790603974be126b9c9&js_code="
      + code
      + "&grant_type=authorization_code";*/
      var tempurl = "https://api.wws.xywy.com/api.php/xiaochengxu/weixin_auth/index?appid=wx4dbfc6ec08d6bf19&secret=7d6066d6e1e987790603974be126b9c9&js_code="+  code+"&grant_type=authorization_code";

      if(app.debug) {
        console.log( 'url data: ', tempurl );
      }
      var that = this;

      wx.request( {
          url: tempurl,
          success: function( res ) {
           util.isLoading(false);
            if(app.debug) {
              console.log( 'response data: ' , res.data );
            }

            if(util.isNull(res.data.openid))
            {
              util.isLoading(false);
              util.showToast('授权失败, 请重试!');
              return;
            }
            wx.setStorageSync('openid', res.data.openid);
            app.globalData.openid = wx.getStorageSync('openid');
            wx.navigateBack({
              delta: 1
            })
          }
            
      });

      //       //第三方登录
      //       requests.login(res.data.openid, that.data.nickname, that.data.gender, that.data.userHeader, ( res ) => {
      //              util.isLoading(false);
      //             console.log( 'login response data: success', res );
      //             if(res.code == 10000) {
      //                 if(!util.isNull(res.data.token) && !util.isNull(res.data.token)) 
      //                 {
      //                   console.log(res.data);
      //                   that.saveLoginData(res);

      //                   wx.switchTab({
      //                           url: '../main/index'
      //                         })
      //                 }
      //             } else {
      //               //错误
      //               util.isLoading(false);
      //               util.showToast('授权失败, 请重试!');
      //             }
      //           }, (err) => {
      //            util.isLoading(false);
      //             console.log( 'login response data: err', err );
      //        util.showToast('授权失败, 请重试!');
      //           }, null);

      //     },
      //     fail: function(err) {
      //         util.isLoading(false);
      //         console.log( 'response data: error', err );
      //       util.showToast('授权失败, 请重试!');
      //     }
      // })
    },

  login: function () {
    var that = this
    wx.login({
      success: function (res) {
         util.isLoading(true);
        if(app.debug) {
          console.log( 'response data: ', res.code );
        }
        // that.getUserInfo(res.code);
        that.getOpenId(res.code);
      },
      fail:function(){
         util.showToast('授权失败, 请重试!');
      }
    })
  },

  getUserInfo: function (code) {
    var that = this;
    wx.getUserInfo({
        success: function (res) {
          that.saveWeixinData(res);
          that.getOpenId(code);
          if(app.debug) {
            console.log( 'getUserInfo data: ', res );
          }
        },
      fail:function(){
         util.isLoading(false);
         util.showToast('授权失败, 请重试!');
      }
      })
  },

  clickAuthButton: function(e) {
    if(app.debug) {
      console.log(e);
    }
    var that = this
      wx.getNetworkType({
        success: function(res) {
          if (res.networkType == 'fail'||res.networkType == 'none'){
            util.showToast('网络不给力,请稍后重试');
          }else {
            //获取code
            that.login();
          }
         }
      }
    )
  },
  
})
