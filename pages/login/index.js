
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
        var that = this;
        util.isNetWork(( res )=>{//success
            if(that.isPhoneCorrect()){
                let flag = that.randomString(10);
                var timestamp = Date.parse(new Date()) / 1000;
                var basisUrl = api.getCaptcha();
                var url = basisUrl+'&flag='+flag+'&timestamp='+timestamp;
                that.setData({
                    isShowCertifyView:true,
                    imageUrl:url,
                    certifiyFlag:flag,
                    timestamp:timestamp,
                }) 
            }
            else {
            }    
        })
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
   
    isPhoneCorrect : function (){
        var that = this;
            //var partten = /^1[3,5,8]\d{9}$/;
        var tel = that.data.inputPhoneValue;
        console.log("that.data.inputPhoneValue"+that.data.inputPhoneValue)
        var MOBILE = /^1(3[0-9]|7[0-9]|5[0-35-9]|8[0235-9])\d{8}$/;
        /**
         10         * 中国移动：China Mobile
        11         * 134[0-8],135,136,137,138,139,150,151,157,158,159,182,187,188
        12         */
        var CM = /^1(34[0-8]|(3[5-9]|5[017-9]|8[2378])\d)\d{7}$/;
        /**
         15         * 中国联通：China Unicom
        16         * 130,131,132,152,155,156,185,186
        17         */
        var CU = /^1(3[0-2]|5[256]|8[56])\d{8}$/;
        /**
         20         * 中国电信：China Telecom
        21         * 133,1349,153,180,189
        22         */
        var  CT = /^1((33|53|8[09])[0-9]|349)\d{7}$/;

        var PHS = /^0(10|2[0-5789]|\d{3})\d{7,8}$/;
        var fl1 = MOBILE.test(tel);
        var fl2 = CM.test(tel);
        var fl3 = CU.test(tel);
        var fl4 = CT.test(tel);
        var fl5 = PHS.test(tel);

        if(fl1 || fl2 || fl3 || fl4 || fl5)
        {
            
                console.log('是手机号码');
                return true;
        } else {
                console.log('不是手机号码');
                util.showToast("请输入正确手机号");

                return false;
        }

    }
    ,
    submitMessage :function (){
        var that = this;
        if(!that.isPhoneCorrect()) {
        }else if(util.isNull(that.data.inputMessageValue) ) {
            util.showToast("请输入正确验证码"); 
        }else if (!util.isNull(that.data.inputMessageValue)&&!util.isNull(that.data.inputPhoneValue) ){
            util.isLoading(true);
        // loginQuickly(phone, code, successCallback, errorCallback, completeCallback) 
            requests.loginQuickly(that.data.inputPhoneValue,that.data.inputMessageValue,( res )=>{  
                //success    
                if(res.code == 10000) {
                    that.saveLoginData(res);
                    wx.navigateBack({
                    delta: 1
                    })
                }
                else{
                    util.showToast("登录失败, 请检查网络");
                    that.setData({
                        inputMessageValue:'',
                    })
                }
            } ,(err) => {
                //failed
                util.showToast("登录失败, 请检查网络");
            }, () => {
                //complete
                util.isLoading(false);
                console.log('请求网络数据完成');
            }); 
        }      
          
    },

    checkCertify:function () {
        var that = this;
        util.isLoading(true);
        //code= MD5( api_wws_ + pro参数+timestamp参数+flag参数 + 图片验证码 ）
        var code = "api_wws_"+"xywyf32l24WmcqquqqTdhXaIkw"+that.data.timestamp+that.data.certifiyFlag+that.data.inputCertifyValue;
        console.log(code)
        var md5Code = md5.hexMD5(code);
        if(!util.isNull(that.data.inputCertifyValue) ) {
            requests.checkCertifyCode(md5Code,that.data.inputPhoneValue,that.data.certifiyFlag,that.data.timestamp,
            (res)=>{
                util.isLoading(false);
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
                console.log('网络数据完成');
            });
        }else {
            util.isLoading(false);
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
       var value = e.detail.value;
       if(value.length<11){
            util.showToast("请输入正确手机号"); 
            console.log('手机号码不足11位');

        }
    },

    bindCertifyInput:function(e){
        //  将验证码统一改为小写字母
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
    

    onUnload:function() {
        total_micro_second = 0;
    }


})
 