// pay.js
var requests = require( '../../utils/request.js' );
var util = require('../../utils/util.js')
var app = getApp()


Page({
  data:{
     userInfo:{},
     pictureArray:['http://i1.w.hjfile.cn/doc/201111/m431435.jpg','http://www.3dmgame.com/uploads/allimg/140110/153_140110160017_1.jpg','/images/blue_heart.png'],
     picture : true,
     question:{},
     loading:true,
     questionID: '',
     age:'',
     sex:''
  },

  getWXPayInfo:function() {
    var that = this;

    //检测openid
    if(util.isNull(app.globalData.openid)) {
      wx.navigateTo({
        url: '../auth/index',
      })
      return;
    }

    requests.WXPay(app.globalData.openid,app.globalData.userid, this.data.question.id, ( res ) => {
          console.log('pay 返回信息：' + res );
          if(res.code == 10000) {
            //成功
            that.wxPay(res.data);
          } else {
            //失败 todo
          }
        }, (err) => {
          console.log('pay fail')
        }, null);
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
              url: '../pay/pay-success/pay-success?give=' + that.data.question.give + '&is_pay=1&qid=' + that.data.questionID + '&age=' + that.data.age + '&sex=' + that.data.sex
            })
          },
          fail: function(res) {
            console.log(res);
            // fail
            wx.redirectTo({
              url: '../pay/pay-success/pay-success?give=' + that.data.question.give + '&is_pay=0&qid=' + that.data.questionID + '&age=' + that.data.age + '&sex=' + that.data.sex
            })
          },
          complete: function() {
            console.log('complete' );
            // complete
          }
        })
  },

  

  //  获取问题详情数据
  getQuestionDetail:function (item){

    var that = this;

    requests.getQuestionDetail(app.globalData.token,app.globalData.userid,item,( res ) => {
      
         const listdata = res.data.data;
        console.log('问题详情请求网络数据成功');
        console.log(res)
        console.log(res.data)

         that.setData({
           loading:false,
           question:res.data.question
         
         });

        },(err) => {
          console.log('请求问题详情失败')
          that.setData({loading:false});
         wx.showToast({
            title: '请求数据失败',
            icon: 'default',
            duration: 2000
          })
          
        }, () => {
          console.log('请求网络数据完成');
        });

    
  },


  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that = this;
    that.getQuestionDetail(options.id);
    that.setData({
      questionID: options.id,
      age: options.age,
      sex: options.sex
    })
  },
  
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
     
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
     
  }
})