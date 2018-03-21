// pages/consult/index.js
var app = getApp()

//模拟数据
// var data = require('../data/data_questionList.js').questionList.list;
var util = require('../../utils/util.js')
var data = util.getQuestionList().list;
var requests = require('../../utils/request.js');
var state = true;
Page({
  data: {
    motto: 'I\' m a greener ,and learn weChat applcaiton  design in the future for a period time',
    userInfo: {},
    haveData:false,
    questionList:[],
    currentPage:'1',
    pageSize:'10',
    isPull:false,         //  是否正在下拉刷新
    showPullRefresh:false,//  是否显示下拉刷新
    notAnswerTip:''
  },

  onLoad:function(){
  var that = this;
    //模拟数据
    // var list =that.getQuestionList();
    // console.log('list',list);
    // console.log('list data',list.data);
    // console.log('list data.list',list.data.list);
  },

  onShow:function() {
    console.log('onShow')
    if(!util.checkLogin()) {
      console.log('checkLogin fail')
      wx.switchTab({
        url: '../main/index',
        complete: function() {
          wx.navigateTo({
            url: '../login/index'
          })
        }
      })
      return;
    }
    // 请求数据
    console.log('全局获取koken'+app.globalData.token)
    this.getQuestionList();
  },

  //  上拉加载更多
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    var that = this;
    var tempPage = parseInt(that.data.currentPage)
    tempPage++;
    this.setData({
      currentPage: tempPage
    })
     that.getQuestionListAgain();
  },

  //  下拉刷新
  onPullDownRefresh:function(){
    console.log('下拉刷新')
    var that = this;
    this.setData ({
      currentPage:1,
      isPull:true
    })
    
    //  重新获取问题列表
    that.getQuestionListAgain();
  },

  //  首次进入，获取问题列表
   getQuestionList:function(){
    let  that = this;
    this.setData ({
      currentPage:1
    })
    
    requests.getQuestionList(app.globalData.token,app.globalData.userid,that.data.currentPage,that.data.pageSize,( res ) => {
      const listdata = res.data;
      util.isLoading(true);
      var tempPage = parseInt(that.data.currentPage)
      if(res.code == 10000){
        if(res.data.list.length > 0){
          that.setData({
            questionList:res.data.list,
            haveData:true,
            currentPage:tempPage,
            isPull:false,
            showPullRefresh:true
          });

        }else{
          that.setData({
            notAnswerTip:'您还没有提问过，快去提问吧~'        
          });
        }
      }       
      console.log('问题列表请求网络数据成功');
    },(err) => {
      console.log('请求问题列表失败')
      wx.showToast({
        title: '请求数据失败',
        icon: 'default',
        duration: 2000
      })
    }, () => {
      util.isLoading(false);
      console.log('请求网络数据完成');
    });
  },

  //  下拉刷新和上拉加载更多，获取问题列表
  getQuestionListAgain:function(){
    let  that = this;
    
    requests.getQuestionList(app.globalData.token,app.globalData.userid,that.data.currentPage,that.data.pageSize,( res ) => {
      
      const listdata = res.data;
      var tempQuestionList = that.data.questionList;
      var tempPage = parseInt(that.data.currentPage)

      if(res.code == 10000){
        console.log('当前的page：'+tempPage)
        if(that.data.isPull){  //  是否正在下拉刷新
          wx.stopPullDownRefresh();
          that.setData({
            isPull:false,
            questionList:res.data.list
          })
          wx.showToast({                 
            title: '刷新成功',
            icon: 'success',
            duration: 2000
          })
        }
        else{ //  正在上拉加载更多
          //  请求更多数据，并且已经没有更多数据
          if(res.data.list.length == 0 && tempPage > 1){
            var tempPage = parseInt(that.data.currentPage)
            tempPage = tempPage >=1 ? tempPage-1 : 0;
            this.setData({
              currentPage: tempPage
            })
            wx.showToast({
              title: '没有更多数据了',
              icon: 'default',
              duration: 2000
            })
            return;
          }
          if(res.data.list.length > 0){
            tempQuestionList = tempQuestionList.concat(res.data.list)
            //tempPage++
            that.setData({               
              questionList:tempQuestionList,
              haveData:true,
              showPullRefresh:true
            });
          }
        }
      }   
      console.log('问题列表请求网络数据成功');
    },(err) => {
      console.log('请求问题列表失败')
      wx.showToast({
        title: '请求数据失败',
        icon: 'default',
        duration: 2000
      })
      
    }, () => {
      console.log('请求网络数据完成');
    });
  },
})