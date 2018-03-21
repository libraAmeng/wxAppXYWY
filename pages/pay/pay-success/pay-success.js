//  pay-success 跳转必带参数 1.give（金额）| is_pay(是否付款成功)  2.qid（问题id） 
//  3.age(年龄)  4.sex  性别
 
Page({
  data:{
    text:"Page pay-success",
    pageText:'支付成功',
    is_pay:true,               //  是否支付成功
    currentQID:''              //  当前的问题id
  },
  onLoad:function(options){
    console.log('页面初始化 options为页面跳转所带来的参数')
    console.log(options)
    //  转化性别
    var tempSex = options.sex;
    if(tempSex==1){
      tempSex = '女'
    }else if(tempSex == 2){
      tempSex = '男'
    }
    options.sex = tempSex;


    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    if(options.give == 0){
      wx.setNavigationBarTitle({
      title: '提问成功',
      success: function(res) {
        // success
      }
    })
     that.setData({
       pageText:'提问成功',
       is_pay:true,
       currentQID:options.qid,
       age:options.age,
       sex:options.sex,
       give:options.give
     })
    }else{
      if(options.is_pay == 1){  //  支付成功的case
      console.log('----==支付成功的case==------')
      wx.setNavigationBarTitle({
        title: '支付成功',
        success: function(res) {
          // success
        }
      })
       that.setData({
       pageText:'支付成功',
       is_pay:true,
       currentQID:options.qid,
       age:options.age,
       sex:options.sex,
       give: options.give
     })

    }else{
      console.log('----==支付失败的case==------')
       wx.setNavigationBarTitle({
        title: '支付失败',
        success: function(res) {
          // success
        }
      })
       that.setData({
       pageText:'支付失败',
       is_pay:false,
       currentQID:options.qid,
       age:options.age,
       sex:options.sex,
       give: options.give
     })

    }  

    }

    
  },

//  查看详情
checkoutDetail:function(){
  var that = this;
  wx.redirectTo({
  url: '/pages/questionDetail/questionDetail?id=' + that.data.currentQID +'&age=' + that.data.age +'&sex=' + that.data.sex+'&give='+that.data.give
})

}
  
  
})