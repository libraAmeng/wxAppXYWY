var app = getApp()
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  // var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

var doctorList = require('../data/data_doctorlist.js')

function getDoctorList(){
  return doctorList.doctorList;
}

var questionList = require('../data/data_questionList.js')

function getQuestionList(){
  return questionList.question_list;
}

var questionDetail = require('../data/data_questionDetail.js')

function getQuestionDetail(){
  return  questionDetail.question_detail;
}

var doctorDepartList = require('../data/data_doctorDepartList.js')

function getDoctorDepartList(){
  return doctorDepartList.doctorDepartList;
}

var drugList = require('../data/data_drugList.js')

function getDrugList(){
  return drugList.drug_list;
}


/**
 * 判断目标是否是函数
 * @param {mixed} val
 * @returns {boolean}
 */
function isFunction( val ) {
  return typeof val === 'function';
}

/**
 * 检查string对象是否为空
 */
function isNull(val) {
  if (val!=null && val != undefined && val != '') {
    return false;
  } else {
    return true;
  }
}

function showToast (msg) {
  wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2500
          });

}

function isNetWork (successCallback, errorCallback){
   wx.getNetworkType({
   success: function(res) {
    var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
    if (networkType == 'fail' || networkType == 'none'){
          showToast('没有网络');
          isFunction( errorCallback ) && errorCallback();
    }else {
          isFunction( successCallback ) && successCallback();
    }
   },
    fail: function()
    {
          showToast('没有网络');
          isFunction( errorCallback ) && errorCallback();
    }
  })

}

function isLoading (e){
    if(e==true){
       wx.showToast({
         title: '加载中',
         icon: 'loading',
       duration: 10000
})
    }else {

      setTimeout(function(){
       wx.hideToast()
      },500)
    }
}

function convertHtmlToText(inputText) {
  var returnText = "" + inputText;
  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, ' * ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
 
  //-- remove P and A tags but preserve what's inside of them
  returnText=returnText.replace(/<p.*?>/gi, "\r\n");
  returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
 
  //-- remove all inside SCRIPT and STYLE tags
  returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText=returnText.replace(/<(?:.|\s)*?>/g, "");
 
  //-- get rid of more than 2 multiple line breaks:
  returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");
 
  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g,'');
 
  //-- get rid of html-encoded characters:
  returnText=returnText.replace(/ /gi," ");
  returnText=returnText.replace(/&/gi,"&");
  returnText=returnText.replace(/"/gi,'"');
  returnText=returnText.replace(/</gi,'<');
  returnText=returnText.replace(/>/gi,'>');
 
  return returnText;
}

//  隐藏部分用户名
function hidenFullname (inputText){
  var returnText = "" + inputText;
  var temp = ''
  if(returnText.length<4 && returnText.length >= 2){
    temp = returnText.substring(0,1);
    for(let i=0;i<returnText.length-1;i++){
      temp += '*';
    }

  }else{
    temp = returnText.substring(0,6);
    for(let i=0;i<returnText.length-6;i++){
      temp += '*';
    }

  }
  returnText = temp;

  return returnText;  
}


function changeNumberToSexText (inputText) {
  var returnText = "" + inputText;
  var temp = returnText == "1"?'女':(returnText == "2"?'男':'')
  return temp;
}


function checkLogin() {
  var logined = true;
  if(!isNull(app.globalData.token) && !isNull(app.globalData.userid)) {
      
    } else {
      
      logined = false;
    }
    return logined;
}


//  设置年龄
function setAgeFormat (inputText) {
  var returnText = "" + inputText;
  if(returnText != ""){
    returnText = returnText + '岁'
  }
  return returnText;

}


module.exports = {
  getDrugList :getDrugList,
  getDoctorList : getDoctorList,
  getQuestionList: getQuestionList,
  getDoctorDepartList: getDoctorDepartList,
  isFunction : isFunction,
  getQuestionDetail:getQuestionDetail,
  isNull : isNull,
  showToast : showToast,
  isNetWork : isNetWork,
  convertHtmlToText : convertHtmlToText,
  hidenFullname : hidenFullname,
  changeNumberToSexText : changeNumberToSexText,
  isLoading :isLoading,
  checkLogin : checkLogin,
  setAgeFormat :setAgeFormat,

}

