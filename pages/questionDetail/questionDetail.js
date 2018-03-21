
var util = require('../../utils/util.js')
var tiemFormatUtil = require('../../utils/timeFormatUtil.js')
var requests = require('../../utils/request.js');
var app = getApp()
var inputText = ''
Page({
  data:{
    text:"Page questionDetail",
    loading:true,
    payStatus:true,
    age:'',
    sex:'',
    give:'',
    picture:false,
    DoctorAnswer:true,

    showInput:false,
    isPull:true,
    question:{},
    pictureArray:['http://i1.w.hjfile.cn/doc/201111/m431435.jpg','http://www.3dmgame.com/uploads/allimg/140110/153_140110160017_1.jpg','/images/blue_heart.png'],
    doctorAnswerArray:[ ],
    
    questionID:'',
    focus:false,      //  输入框是否获得焦点
    inputContetn:'',  //  输入框里的内容
    currentRID:'',    //  回复id
    currentRUID:'',   //  回复人id
    currentUID:'',    //  用户id
    currentQID:'',    //  问题id

    askAgain:false,        //  追问
    askAgainAnswer:false,  //  追问的答复
    askAgainArray:[],

    clearContent:false,     //  是否需要清空输入框内容
    qstatus:''              //  问题状态
    
  },
  goToAsk:function(e){
    
    /*
    wx.navigateTo({
      url: '../pay/pay-success/pay-success?give=0&is_pay=1&qid=124780651',
    })
    */
    
    
    
    //  激活输入框
    var that = this;
    that.setData({
      showInput:true,
      focus:true
    });
   
  },

  //  发送追问内容 
  sendAskContent:function(e){
    var that = this;
    console.log('输入框的内容')
    console.log(that.data.inputContetn)
    console.log(e)
  
    that.setData({focus:false})
         
    that.continueAskQuestion(that.data.inputContetn);
   
  },


//  获取输入框的内容
  getInputContent:function(e){
    var that = this;
     console.log(e.detail.value)
     
     that.setData({
       inputContetn:e.detail.value,
     })   
     
  },
  
  //  输入框失去焦点时调用
  loseFocus:function(e){
    var that = this;
    console.log('|||||||||')
    console.log(e)
    console.log('失去焦点')
    e.detail.value =""
    

  },

 //  点击了键盘上的完成或者提交
 commit: function(e) {
    var that = this;
    that.sendAskContent();
 },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    console.log('全局用户信息：')
    console.log(app.globalData)
    
    that.setData({
      questionID:options.id,
      age:options.age,
      sex:options.sex,
      give:options.give,
      qstatus:options.qstatus,
      })
    console.log('页面跳转所带来的参数')
    console.log(options)

    //  var list = util.getQuestionDetail(options.id);
    //  console.log('-------------')
    //  console.log('list',list)
    //  console.log(list.data.question)
    //  console.log(list.data.answer)
    // 请求问题详情
    that.getQuestionDetail(options.id);

  },
  
   //  scrollview滚动时调用
  scroll: function(e) {
    var that = this;
    //  滚动时收起键盘
    that.setData({showInput:false});
  },

   //  下拉刷新
   onPullDownRefresh:function(){
     var that=this;
     // that.setData({isPull:true});
     console.log('下拉刷新')
     wx.showToast({
       title: '下拉刷新',
       icon: 'success',
       duration: 2000
    })
    
     //  重新获取问题详情数据
     that.getQuestionDetail(that.data.questionID)

    setTimeout(function(){
      // that.setData({isPull:false});
      wx.stopPullDownRefresh();
    },2000)
  },

  //  获取问题详情数据
  getQuestionDetail:function (item){

    var that = this;

    console.log('token -- ' + app.globalData.token);
    console.log('userid -- ' + app.globalData.userid);
    console.log('qid -- ' + item);

    requests.getQuestionDetail(app.globalData.token,app.globalData.userid,item,( res ) => {
      
        const listdata = res.data.data;
        console.log('问题详情请求网络数据成功');
        console.log(res)
        console.log(res.data)

        //  格式化问题提问时间
         var temptime =  tiemFormatUtil.formatTime(new Date(parseInt(res.data.question.intime * 1000)))
         res.data.question.intime = temptime;

        //  过滤空图片数组里面的的“”内容
        if(res.data.question.picture.length>0) {
          if(res.data.question.picture[0] == ""){
            res.data.question.picture.pop()
            console.log(' 过滤空图片数组里面的多余内容')
          }
        }
        
        //  有医生回复
        if(res.data.answer.length>0){
           //  格式化医生回复时间
           for(let i = 0;i<res.data.answer.length;i++){
	            var temptime2 =  tiemFormatUtil.formatTime(new Date(parseInt(res.data.answer[i].intime * 1000)))
              res.data.answer[i].intime = temptime2;
            }

           //  指导意见去html标签
           var tempcontent = util.convertHtmlToText(res.data.answer[0].content);
           res.data.answer[0].content = tempcontent;

        }
       
           var tempPayStatus = false;
           if(res.data.question.is_pay != 0){
             tempPayStatus = true;
           }

           //  只取第一个医生的回答
             var tempAnswerList = []
           if(res.data.answer.length > 0){
             
             tempAnswerList.push(res.data.answer[0])

             that.setData({
              loading:false,
              question:res.data.question,
              doctorAnswerArray:tempAnswerList,
              payStatus:tempPayStatus,
              currentQID:item,
              currentRID:res.data.answer[0].rid,
              currentRUID:res.data.answer[0].uid,//  跟晓龙确认是用医生id
              currentUID:res.data.question.pid,
              DoctorAnswer:true
             });

              that.getQuestionAnswer(res.data.question.pid,item,res.data.answer[0].rid,res.data.answer[0].uid);

           }else{
             that.setData({
                loading:false,
                question:res.data.question,
                doctorAnswerArray:tempAnswerList,
                payStatus:tempPayStatus,
                DoctorAnswer:false
             });
           }

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



  //  获取问题详情的回答详情
  getQuestionAnswer:function(uid,qid,rid,did){  

    var that = this;

    console.log('api info:')
    console.log(uid + '/' +qid+'/' + rid +'/'+ did )
    console.log('++++++++++++++++++----------+++++++++')


    requests.getQuestionAnswer(app.globalData.token,uid,qid,rid,did,( res ) => {
        console.log('请求回答详情成功')
        console.log(res)
        console.log('--===---:')
        // const listdata = res.data;
        console.log(res.data.answer.z_data)
        
        //  隐藏部分用户名
        for(let i=0;i<res.data.answer.z_data.length;i++){
          if(res.data.answer.z_data[i].q_ts == 1){
            var tempName = util.hidenFullname(res.data.answer.z_data[i].z_name);
            res.data.answer.z_data[i].z_name = tempName;
          }
          
        }
        //  是否有追问
        var tempaskAgain = false;
        if(res.data.answer.z_data){
          tempaskAgain = true;
        }

        that.setData({
            askAgain:tempaskAgain,        //  追问
            // askAgainAnswer:true,          //  追问的答复
            askAgainArray:res.data.answer.z_data,
        })

    },(err) => {
          console.log('请求问题详情的回答详情失败')
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


  //  追问
  continueAskQuestion:function(con){
    var that = this;
    console.log('追问的内容：' + con)
    console.log('rid'+that.data.currentRID+'ruid'+that.data.currentRUID+'uid'+that.data.currentUID+'qid'+that.data.currentQID)
    console.log('\\\\\\\\\\\\\\')

    requests.continueAskQuestion(app.globalData.token,that.data.currentRID,that.data.currentRUID,that.data.currentUID,that.data.currentQID,con,'db9873f381706b4bd2374e494f1a61b2',( res ) => {
      
        console.log('请求成功')
        console.log(res)
        if(res.code == 10000){
          console.log('追问成功')
          //  收起键盘
          that.setData({showInput:false});
          //  刷新追问详情
          that.getQuestionAnswer(that.data.currentUID,that.data.currentQID,that.data.currentRID,that.data.currentRUID);
        }else if(res.code == 20000){
          wx.showToast({
            title: '请输入追问内容',
            icon: 'default',
            duration: 2000
          })

        }

     },(err) => {
          console.log('追问失败')
          that.setData({loading:false});
         wx.showToast({
            title: '追问失败',
            icon: 'default',
            duration: 2000
          })
          
        }, () => {
          console.log('请求网络数据完成');

        });
    
  }



})