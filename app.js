//app.js
App({
    systemInfo: null,
  onLaunch: function () {

    //获取userindo和tokentoken
    var that = this
    wx.getStorage({
      key: 'token',
      success: function(res){
        that.globalData.token = res.data;
      }
    })
    const self = this;
    wx.getSystemInfo({
      success(res) {
        self.systemInfo = res;
        console.log(res.model)        
        console.log(res.pixelRatio)
        console.log('屏幕的宽：',res.windowWidth)
        console.log('屏幕的高：',res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      },
    })
  },

  globalData:{
    token:'',
    userid:'',
    data:'',
    phone:'',
    openid:'',
  },

  shareData: {
     title: '寻医问药＋',
     desc: '随时随地问医生',
     path: '/pages/auth/index'
  },

  requestData: {
          'os':'weixin',
          'pro':'xywyf32l24WmcqquqqTdhXaIkw',
          'source':'xiaochengxu'
        },
  debug:true
})