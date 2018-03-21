
var app = getApp()
var md5 = require('../../utils/MD5.js') 
var util = require('../../utils/util.js')
var requests = require( '../../utils/request.js' );
var api = require('../../utils/api.js');

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 10000 * 0;

/* 毫秒级倒计时 */
function count_down(that) {
    console.log('渲染倒计时时钟');

  	// 渲染倒计时时钟
  	that.setData({
  		clock:date_format(total_micro_second)
  	});

  	if (total_micro_second <= 0) {
  		that.setData({
  			isTimeOut:true
  		});
  		// timeout则跳出递归
  		return ;
  	}    
  	setTimeout(function(){
    	// 放在最后--
		total_micro_second -= 10;
		count_down(that);
	}
	,10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  	// 秒数
  	var second = Math.floor(micro_second / 1000);
  	// 小时位
  	var hr = Math.floor(second / 3600);
  	// 分钟位
  	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  	// 秒位
	var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
	// 毫秒位，保留2位
	var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

	return  sec + " ";
}

// 位数不足补零
function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}

Page({

data:{
  text:"Page perfectPhone",
  isTimeOut:false,
  isShowCertifyView:false,
  inputPhoneValue:'',
  inputCertifyValue:'',  
  inputMessageValue:'',  
  imageUrl:"defaultImageUrl",
  certifiyFlag:"defaultFlag",
  timestamp:"123",
  clock: '',
  loading:false,
  windowWidth:10,

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
randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
},

getCertifiy (){
    //    this.setData({
    //                   isTimeOut:false,
    //     })
    let  that = this;
    util.isLoading(true);
    wx.getNetworkType({
    success: function(res) {
        if (res.networkType == 'fail'||res.networkType == 'none'){
            util.showToast('网络不给力,请稍后重试');
            util.isLoading(false);
        }else {
           util.isLoading(false);
        console.log('获取验证码图像'+that.data.inputPhoneValue)
        // if(util.isNull(that.data.inputPhoneValue) ) {
        if(that.data.inputPhoneValue.length == 11){
        
            let  flag = that.randomString(10);
            var timestamp = Date.parse(new Date()) / 1000;
            var basisUrl= api.API_BASE + "common/captcha/getCaptcha?source=xiaochengxu&os=wexin&api=1423&version=1.0&pro=xywyf32l24WmcqquqqTdhXaIkw"
            var  url =  basisUrl+'&flag='+flag+'&timestamp='+timestamp;
            that.setData({
                isShowCertifyView:true,
            imageUrl:url,
            certifiyFlag:flag,
            timestamp:timestamp,
            }) 
        }else {
         util.isLoading(false);
         util.showToast("请输入正确手机号");
       

        }
        }
    }
    
    })
 },

submitMessage :function (){
  var that = this;
  if(util.isNull(that.data.inputPhoneValue) ) 
  {
    util.showToast("请输入正确手机号"); 

  }
  else if(util.isNull(that.data.inputMessageValue) ) {

    util.showToast("请输入正确验证码"); 
  }
  else if (!util.isNull(that.data.inputMessageValue)&&!util.isNull(that.data.inputPhoneValue) )
  {
    util.isLoading(true);
           //参数:token,userid,code,phone,successCallback, errorCallback, completeCallback
         if(!util.isNull(app.globalData.token) && !util.isNull(app.globalData.userid)) {
        requests.checkMessageCode(app.globalData.token,app.globalData.userid,that.data.inputMessageValue,that.data.inputPhoneValue,( res )=>{      
            if(res.code == 10000) {
            console.log('短信提交成功')
            wx.setStorage({
                key: 'phone',
                data: that.data.inputPhoneValue
            })
            app.globalData.phone = that.data.inputPhoneValue;
            wx.navigateTo({
            url: '../ask/index'
            })
            }else {
                that.setData({
                    inputMessageValue:'',
                })
            
            switch (res.code){
    
                case 30000:
                case 31001:
                case 31002:
                case 31006:{
                    //未绑定成功
                    util.showToast('未绑定成功');
                }
                    break;
                case 31003:{
                    //手机号码不正确
                    util.showToast('手机号码不正确');
                }
                    break;
                case 31005:{
                    util.showToast('禁止重复发送(60秒内)');
                    //禁止重复发送(60秒内)
                }
                    break;
                case 31007:{
                    util.showToast('验证码为空');
                    //验证码为空
                }
                    break;
                case 31008:{
                    util.showToast('验证不通过');
                    //验证不通过
                }
                    break;
                case 31014:{
                    util.showToast('禁止重复绑定手机号');
                    //禁止重复绑定手机号
                }
                    break;
                case 31015:{
                    util.showToast('该手机号已被其他帐号绑定');
                    //该手机号已被其他帐号绑定

                }
                    break;
                case 31016:{
                    util.showToast('绑定失败');
                    //绑定失败
                }
                    break;
                case 31017:{
                    util.showToast('邮箱格式不正确');
                    //邮箱格式不正确

                }
                    break;
                case 31018:{
                    util.showToast('禁止重复绑定邮箱');
                    //禁止重复绑定邮箱

                }
                    break;
                case 31019:{
                    util.showToast('该邮箱已被其他帐号绑定');
                    //该邮箱已被其他帐号绑定
                }
                    break;
                case 31020:{
                    util.showToast('用户ID为空');
                    //用户ID为空
            
                    break;
                }
                default:
                    break;
            }
            }
        } ,(err) => {
            console.log('请求订单信息失败')
            util.showToast("请输入正确验证码");
        }, () => {
            util.isLoading(false);
            console.log('请求网络数据完成');
        }); 
        }
  }            
},

checkCertify:function () { 
    var  that = this;
    util.isLoading(true);
    //code= MD5( api_wws_ + pro参数+timestamp参数+flag参数 + 图片验证码 ）
        var  code = "api_wws_"+"xywyf32l24WmcqquqqTdhXaIkw"+that.data.timestamp+that.data.certifiyFlag+that.data.inputCertifyValue;
        console.log(code)
        var md5Code = md5.hexMD5(code);
        if(!util.isNull(that.data.inputCertifyValue) ) {
        requests.checkCertifyCode(md5Code,that.data.inputPhoneValue,that.data.certifiyFlag,that.data.timestamp,(res)=>{
            console.log('success'+res);
            if(res.code == 10000) {
                total_micro_second = 10000 * 6;
    count_down(that);
                that.setData({
                    isTimeOut:false,
                    isShowCertifyView:false,
                })
            }else{
                that.setData({
                    inputCertifyValue:'',
                })
            util.showToast("验证码输入错误，请重新输入");
            }

        }, (err) => {
            console.log('网络数据失败')
        util.showToast("没有网络");

        }, () => {
            util.isLoading(false);
            console.log('网络数据完成');
        });
    }else {
        util.showToast("验证码输入错误，请重新输入");    
    }
},
    bindPhoneInput:function(e){
    this.setData({
    inputPhoneValue:e.detail.value
    })

    console.log(e.detail.value);
    },
    phoneBlur :function(e) {
    console.log(e.detail.value);
    var value = e.detail.value;
        if(value.length<11){
                util.showToast("请输入正确手机号"); 

        }
    },

    bindCertifyInput:function(e){
        var tempInput = e.detail.value.toLowerCase()
        console.log('验证码：'+tempInput)
    this.setData({
    inputCertifyValue:tempInput
    })

    },
    bindMessageInput:function(e){
    this.setData({
    inputMessageValue:e.detail.value
    })
    console.log(e.detail.value);

    },
    closeCertify :function (){
    this.setData({
      isShowCertifyView:false,
      
      }) 
    },
    onLoad:function(options){
     this.getAppData ();
    // 页面初始化 options为页面跳转所带来的参数
    count_down(this);
        console.log('onload');
    //  this.getCertifiy();
    },


})
 