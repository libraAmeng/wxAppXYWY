var app = getApp()

var util = require('../../utils/util.js')
var requests = require( '../../utils/request.js' );
const api = require('../../utils/api.js');

Page({
	data: {
		clock: '',
    qid:'',
    age:'',
    sex:'',
		isReadProtocol:false,
		    doctorInfo: {},

	},
	onLoad: function(options) {
		// count_down(this);
      this.setData({
			  qid: options.id,
        age: options.age,
        sex: options.sex
		  })

		 	 var that = this
       wx.getStorage({
          key: 'doctorInfo',
          success: function(res) {
          var info = JSON.parse(res.data)
  	      that.setData({
			      doctorInfo: info
		      })
        console.log('订单确认页读取缓存的医生信息：' + res.data );
  }     
})
    that.changeReadSate();
	},

  getWXPayInfo: function() {
		var that = this;
    console.log('openid = ' + app.globalData.openid)
    //检测openid
    if(util.isNull(app.globalData.openid)) {
      wx.navigateTo({
        url: '../auth/index',
      })
      return;
    }
    
    //微信支付
		if(that.data.isReadProtocol== true) {
      util.isLoading(true);
      requests.WXPay(app.globalData.openid,app.globalData.userid, that.data.qid, ( res ) => {
        util.isLoading(false);
        console.log('pay 返回信息：' + res );
        if(res.code == 10000) {
          //成功
          that.wxPay(res.data);
        } 
        else {
        //失败 todo
        }
      }, (err) => {
          console.log('pay fail')
          util.showToast('支付失败');
      }, ()=>{
        //complete
        util.isLoading(false);
      });
		}else{
		   util.showToast('请阅读并同意免责声明');
		}
  },


  wxPay:function(data) {
    var that = this
    console.log(data);
      wx.requestPayment({
          
        timeStamp: data.timeStamp+'',
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
          success: function(res){
            console.log('success' + res );
            // success
            wx.redirectTo({
              url: '../pay/pay-success/pay-success?give=' + that.data.doctorInfo.amount +'&is_pay=1&qid=' + that.data.qid + '&age=' + that.data.age + '&sex=' + that.data.sex
            })
          },
          fail: function(res) {
            console.log(res);
            // fail
            wx.redirectTo({
              url: '../pay/pay-success/pay-success?give=' + that.data.doctorInfo.amount +'&is_pay=0&qid=' + that.data.qid + '&age=' + that.data.age + '&sex=' + that.data.sex
            })
          },
          complete: function() {
            console.log('complete' );
            // complete
          }
        })
  },

  changeReadSate:function(){
	  var that = this;
	  console.log('点击阅读')
      var temp = !that.data.isReadProtocol
	  that.setData({
		  isReadProtocol:temp
	  })
  },
	clickDisclaimer :function() {
	
			  wx.navigateTo({
              url: '../disclaimer/disclaimer'
            })
	}
});