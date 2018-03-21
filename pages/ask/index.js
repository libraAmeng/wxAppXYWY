var request = require( '../../utils/request.js' );
var util = require( '../../utils/util.js' );
var app = getApp()

Page({
  data:{
    text:"Page form",
    evaContent  : '',
    title : "",
    subdisabled:true,
    imageList:[],
    array:["男","女"],
    index:5,
    // date:"1897-01-01",
    date:"1987-01-01",
    pastDate:"1897-01-01",
    nowDate:"2017-01-16",
    age:'30',
    ageType:'岁',
    isShowText:true,
    isShowAddPhoto:true,
    doctorInfo: {},
    isSelectSex:false,
  },

  onLoad:function(options){
  // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setAgeSelectedDate();
    wx.getStorage({
      key: 'doctorInfo',
      success: function(res) {
        var info = JSON.parse(res.data)
        that.setData({
          doctorInfo: info
        })
        console.log('医生问答页读取缓存的医生信息：' + res.data );
      }     
    })
  },
  onReady:function(){
  // 页面渲染完成
  },
  onShow:function(){
  // 页面显示
    if(!util.checkLogin()) {
      return;
    }
  },
  onHide:function(){
  // 页面隐藏
  },
  onUnload:function(){
  // 页面关闭
  },
  setAgeSelectedDate:function() {//选择器的年龄范围
    var that = this
    var myDate = new Date();
    var nowYear = myDate.getFullYear();  
    var month   = myDate.getMonth()+1;
    var maxDay  = that.getDays(nowYear,month)
    var nowDate = nowYear+'-'+month+'-'+maxDay
  
    var pastYear = myDate.getFullYear()-120;
    var pastDate = pastYear+'-'+month+'-'+1
    console.log('nowDate'+nowDate)
    console.log('nowDate'+pastDate)
    that.setData({
      nowDate:nowDate,
      pastDate:pastDate
    })
  },
  // 计算指定年月的天数
  getDays:function(year, month){

    // month 取自然值，从 1-12 而不是从 0 开始
    return new Date(year, month, 0).getDate()

    // 如果 month 按 javascript 的定义从 0 开始的话就是
    // return new Date(year, month + 1, 0).getDate()
  },
  ages:function(str) {  
        var   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);  
        if(r==null)return   false;     
        var   d=   new   Date(r[1],   r[3]-1,   r[4]);   
        if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])   
        {   
              var   Y   =   new   Date().getFullYear();  
              // console.log("年龄wen   =   "+   (Y-r[1])   +"   周岁");   
              return(Y-r[1]);
        }   
        return("输入的日期格式错误！");   
  }  ,
bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      isSelectSex:true,
    })
  },

  bindDateChange:function(e){
    var that = this
     var startDate = e.detail.value;
    var date = new Date();
    startDate = new Date(startDate);
    var newDate = date.getTime() - startDate.getTime();
    if(newDate >0){
         var age = Math.floor(newDate / 1000 / 60 / 60 / 24 );
    if(age >=365){
        var year =   that.ages(e.detail.value) ;
        that.setData ({
          age:year,
          ageType:'岁',
        })
    }else {
      if (age >=31) {
        var month = parseInt(age/30) ;
        console.log(month);
        that.setData ({
          age:month,
          ageType:'个月',
        })
      }else {
        var day =parseInt(age);
        that.setData ({
          age:day,
          ageType:'天',
        })
      }
    }
    }
   
  },
 valueChange: function(e){
   var that = this;
   if(e.detail&&e.detail.value.length>0)
   {
      if(e.detail.value.length<25||e.detail.value.length>500){
      //set submit disable
        that.setData({
          subdisabled : true
        });
      }
      else
      {
        //set submit enable
        var content = e.detail.value;

      let title =  content.substring(0,10) 
        that.setData({
          subdisabled : false,
          evaContent : e.detail.value,
          title:title,
        });
      console.log('title:'+that.data.title+"evaContent"+that.data.evaContent)

    }
   }
   else
   {
    that.setData({
      evaContent : ''
    });
   }
 },

clickSubmitButton: function() {
   var that = this
   util.isLoading(true);
   //submitQuestion(sick,content,money,age,sex,phone,imageList,successCallback, errorCallback, completeCallback ) 
    var sex = ''
    if(that.data.index==0) {//1女2男
      sex = 2;
    }else if (that.data.index==1) {
      sex = 1;
    }
    console.log('sex-------'+sex)
    var res = wx.getStorageSync('doctorInfo');  
    var doctor = JSON.parse(res)
    console.log(doctor)
    var age =this.data.age+this.data.ageType
    console.log('age-------'+age)
    request.submitQuestion(doctor.docid,doctor.subject,this.data.evaContent,doctor.amount,age,sex,app.globalData.phone,this.data.imageList,
    (res)=> {//success
        console.log(res)
        console.log('res code ------' + res.code)
        if(res.code == 10000) {
          console.log('success-------'+res)
          var price = that.data.doctorInfo.amount
          var qid = res.data.qid;
          if (price == 0) {
              console.log("doctor.amount"+price);
              wx.redirectTo({
                url: '../pay/pay-success/pay-success?give='+price+'&qid='+qid+'&age='+age+'&sex='+sex
              })
          }else {
              wx.redirectTo({
                url: '../orderConfirm/index?id='+qid+'&age='+age+'&sex='+sex
              })
          }
        }
        else {
            util.showToast(res.msg);
        }
    }, (err)=> {//failed
          console.log('failed--------'+res)
          util.showToast('提交失败');
    }, (res)=> {//complete
        // console.log('complete-------'+res)
        util.isLoading(false);
    }) 
  },

  deletetImage :function (e) {
     var that = this;
     var deleteArray = [];
     that.setData({
          imageList:deleteArray,
           isShowAddPhoto:true,
           isShowText:true,
     })
      
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'] ,
      count: 1,
      success: function (res) {
        console.log(res)
        var tempArray = that.data.imageList;
        var i = 0;
        for(i<0; i<res.tempFilePaths.length; i++){
            tempArray.push(res.tempFilePaths[i]);
        }
        
        console.log(tempArray)
        that.setData({

          imageList:tempArray
        })
      
         if(that.data.imageList.length>0){
           that.setData({

          isShowText:false
        })
         }
        if(that.data.imageList.length>=1){
           that.setData({

          isShowAddPhoto:false
        })
        }

      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    
    console.log('tap:'+current)
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  
})