var api = require( './api.js' );
var util = require( './util.js' );

var app = getApp();

/**
 * 网络请求方法 get
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestDataGet( url, data, successCallback, errorCallback, completeCallback ) {
    if( app.debug ) {
        console.log( 'requestData url: ', url );
    }

    util.isNetWork(( res )=>{
        //success
        wx.request( {
            url: url,
            data: data,
            header: { 'Content-Type': 'application/json' },
            success: function( res ) {
                if( app.debug ) {
                    console.log( 'response data: ', res );
                }
                if( res.statusCode == 200 ) {
                    if(checkToken(res)) {
                        return;
                    }
                    util.isFunction( successCallback ) && successCallback( res.data );
                }  
                else
                    util.isFunction( errorCallback ) && errorCallback();
            },
            error: function() {
                util.isFunction( errorCallback ) && errorCallback();
            },
            complete: function() {
                util.isFunction( completeCallback ) && completeCallback();
            }
        });
    },( res )=>{
        //failed
        util.isFunction( errorCallback ) && errorCallback();
        util.isFunction( completeCallback ) && completeCallback();
    })


}

/**
 * 网络请求方法 post
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestDataPost( url, data, successCallback, errorCallback, completeCallback ) {
    if( app.debug ) {
        console.log( 'requestData url: ', url );
    }
    util.isNetWork(( res )=>{
        //success
            wx.request( {
            url: url,
            data: data,
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function( res ) {
                if( app.debug ) {
                    console.log( 'response data: ', res );
                }
                if( res.statusCode == 200 ){
                    if(checkToken(res)) {
                        return;
                    }
                    util.isFunction( successCallback ) && successCallback( res.data );
                } 
                else
                    util.isFunction( errorCallback ) && errorCallback();
            },
            error: function() {
                util.isFunction( errorCallback ) && errorCallback();
            },
            complete: function() {
                util.isFunction( completeCallback ) && completeCallback();
            }
        });
    },( res )=>{
        //failed
        util.isFunction( errorCallback ) && errorCallback();
        util.isFunction( completeCallback ) && completeCallback();
    })

}

/**
 * 网络请求方法 post file
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestDataPostFile( url, data, imageList, successCallback, errorCallback, completeCallback ) {
    if( app.debug ) {
        console.log( 'requestData url: ', url );
        console.log( 'requestData imageList: ', imageList );
        console.log( 'requestData data: ', data );
    }
    
    util.isNetWork(()=>{
        //success
            wx.uploadFile( {
            url: url,
            header: { 'Content-Type': 'multipart/form-data' },
            filePath: imageList[0],
            name: 'imgfile',
            formData: data,
            success: function( res ) {
                if( app.debug ) {
                    console.log( 'response data: ', res );
                }
                if( res.statusCode == 200 ){
                    if(checkToken(res)) {
                        return;
                    }
                    var json = res.data;
                    var isObject = typeof res.data == "object"
                    if(!isObject){
                        json = JSON.parse(res.data); 
                        console.log( 'response json: ', json );
                    } 
                    util.isFunction( successCallback ) && successCallback( json );
                } 
                else{
                    util.isFunction( errorCallback ) && errorCallback();
                } 
            },
            fail: function(res) {
                console.log( 'response data: ', res );
                util.isFunction( errorCallback ) && errorCallback();
            },
            complete: function() {
                util.isFunction( completeCallback ) && completeCallback();
            }
        });
    },( res )=>{
        //failed
        util.isFunction( errorCallback ) && errorCallback();
        util.isFunction( completeCallback ) && completeCallback();
    })

}

function checkToken(res) {
    var tokenError = false;
    if(res.data.code >=10288 && res.data.code <=10293) {
        tokenError = true;
        wx.setStorageSync('token', '')
        wx.setStorageSync('userid', '')
        util.showToast('登录信息已实效，请重新授权')

        wx.switchTab({
            url: '../main/index',
            complete: function() {
                wx.redirectTo({
                        url: '../login/index'
                    });
            }
        })
    }
    return tokenError;
}

function login(openid, nickname, gender, header, successCallback, errorCallback, completeCallback ) {
    var postData = app.requestData;
    postData["usersource"] = "wxapp_xywy";
    postData["channelnum"] = "wxapp_xywy";
    postData["act"] = "oauth_can_auto_reg_login";
    postData["photo"] = header;
    // postData["version"] = "1.0";
    postData["openid"] = openid;
    requestDataPost( api.login(), postData, successCallback, errorCallback, completeCallback );
}

function getWXDoctorInfo(id, successCallback, errorCallback, completeCallback ) {
    var getData = app.requestData;
    getData["api"] = "1504";
    getData["version"] = "1.0";
    getData["id"] = id;
    requestDataGet( api.getWXDoctorInfo(), getData, successCallback, errorCallback, completeCallback );
}

function submitQuestion(did,sick, content, money, age, sex, phone, imageList,successCallback, errorCallback, completeCallback ) {
    var getData = {};
    getData["uid"] = app.globalData.userid;
    getData["sick"] = encodeURI(sick);
    getData["title"] = encodeURI(content.substr(0,10));//内容的前10个字
    getData["con"] = encodeURI(content);//输入的内容
    getData["money"] = money;//医生诊金金额
    getData["age"] = encodeURI(age);//患者年龄
    getData["sex"] = sex;
    getData["phone"] = phone;
    getData["did"]=did;
    getData["ques_fromurl"] ="wxxcx";
    console.log('imageList:'+api.submitQuestion(app.globalData.token));
    console.log('userid-----------:'+app.globalData.userid);

    if(imageList.length > 0)
    {
        console.log(imageList);
        requestDataPostFile( api.submitQuestion(app.globalData.token), getData,imageList,  successCallback, errorCallback, completeCallback );
    }
    else
    {
        console.log('no image');
        requestDataPost( api.submitQuestion(app.globalData.token), getData, successCallback, errorCallback, completeCallback );
    }
}


function checkCertifyCode (code,phone,flag,timestamp,successCallback, errorCallback, completeCallback) {
    var postData = app.requestData;

    postData["api"] = "1501";
    postData["version"] = "1.0";

    postData["project"] = "WXAPP_XYWY_LOGIN";
    postData["act"] = "userSMS_send";
    postData["code"] = code;
    postData["phone"] = phone;
    postData["flag"] = flag;
    postData["timestamp"] = timestamp;

    console.log(postData)

   requestDataPost( api.checkCertifyCode(app.globalData.token), postData, successCallback, errorCallback, completeCallback );

}



 function checkMessageCode (token,userid,code,phone,successCallback, errorCallback, completeCallback){
    var postData = {};
    postData["userid"] = userid;
    postData["code"] = code;
    postData["phone"] = phone;
    postData["project"] = "WXAPP_XYWY_LOGIN";
   
   requestDataPost( api.checkMessageCode(token), postData, successCallback, errorCallback, completeCallback );

 }

function WXPay(openid,user_id, order, successCallback, errorCallback, completeCallback ) {
    var getData = app.requestData;
        getData["api"] = "1057";
        getData["version"] = "1.0";
        getData["service_code"] = "wechat_app_pay_reward";
        getData["user_id"] = user_id;
        getData["order"] = order;
        getData["openid"] = openid;
        requestDataGet( api.WXPay(), getData, successCallback, errorCallback, completeCallback );
}

function getQuestionList (token,uid,page,pagesize,successCallback, errorCallback, completeCallback){
      var postData = app.requestData;

    postData["uid"] = uid;
    postData["page"] = page;
    postData["pagesize"] = pagesize;
   
  
   requestDataPost( api.getQuestionList(token) , postData, successCallback, errorCallback, completeCallback );


 }

 function getQuestionDetail (token,uid,qid,successCallback, errorCallback, completeCallback){
      var postData = {};

    postData["uid"] = uid;
    postData["qid"] = qid;

   requestDataPost( api.getQuestionDetail(token) , postData, successCallback, errorCallback, completeCallback );

 }

   function getQuestionAnswer (token,uid,qid,rid,did,successCallback, errorCallback, completeCallback) {
        var postData = {};

        postData["uid"] = uid;
        postData["qid"] = qid;
        postData["rid"] = rid;
        postData["did"] = did;

   requestDataPost( api.getQuestionAnswer(token) , postData, successCallback, errorCallback, completeCallback );
   }

   function continueAskQuestion (token,rid,ruid,uid,qid,con,sign,successCallback, errorCallback, completeCallback) {
        var postData = {};

        postData["rid"] = rid;
        postData["ruid"] = ruid;
        postData["uid"] = uid;
        postData["qid"] = qid;
        postData["con"] = con;
        postData["sign"] = sign;

   requestDataPost( api.continueAskQuestion(token) , postData, successCallback, errorCallback, completeCallback );
   }

   function loginQuickly(phone, code, successCallback, errorCallback, completeCallback) {
        var postData = {};

        postData["project"] = 'WXAPP_XYWY_LOGIN';
        postData["phone"] = phone;
        postData["code"] = code;

        requestDataPost( api.loginQuickly() , postData, successCallback, errorCallback, completeCallback );
   }


function getDrugDetailInfo(id, successCallback, errorCallback, completeCallback ) {
    var getData = app.requestData;
    getData["api"] = "1514";
    getData["version"] = "1.0";
    getData["id"] =id;
    requestDataGet( api.getDrugDetailInfo(), getData, successCallback, errorCallback, completeCallback );
}

   function getDrugHomepage(successCallback, errorCallback, completeCallback) {
       var getData = {};

       requestDataGet( api.getDrugHomepage(), getData, successCallback, errorCallback, completeCallback );

   }



module.exports = {
    login : login,
    getWXDoctorInfo : getWXDoctorInfo,
    submitQuestion : submitQuestion,
    checkCertifyCode : checkCertifyCode,
    WXPay : WXPay,
    checkMessageCode : checkMessageCode,
    getQuestionList : getQuestionList,
    getQuestionDetail : getQuestionDetail,
    getQuestionAnswer : getQuestionAnswer,
    continueAskQuestion : continueAskQuestion,
    loginQuickly : loginQuickly,
    getDrugDetailInfo:getDrugDetailInfo,
    getDrugHomepage : getDrugHomepage
};