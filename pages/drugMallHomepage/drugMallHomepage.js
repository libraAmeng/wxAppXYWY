var util = require('../../utils/util.js')
var requests = require('../../utils/request.js');

Page({
  data:{
    text:"Page drugMallHomepage",
    windowWidth:0,
    iconWidth:0,
    indicatorDots:true,
    autoplay:true,   //  banner 是否自动切换
    interval:2000,   //  自动切换时间间隔（毫秒）
    duration:500,    //  滑动动画时长
    
    banners:[],      //  存储轮播图里面药品广告所带的药品id
    imgUrls: [
    ],
    lunbo_data:[],
    drugTypes:[],
    drugList:[],      //  具体某个类型的药品
    allDrugList:[],   //  所有药品列表
    currentSelectedBtnId:0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.getDrugList();
  },
  
  onShow:function(){
    // 页面显示
  },

  //  获取屏幕的宽高
  getAppData:function (){
     let that = this;
      wx.getSystemInfo({
        success: function(res) {  
          that.setData ({
            windowWidth:res.windowWidth,
            // windowHeight:res.windowHeight,
            iconWidth:res.windowWidth * 0.35
          });
        }
      })
  },

  //  点击banner图
  clickBanner:function(e){
    console.log('点击的banner')
    console.log(e)
    var id=e.currentTarget.dataset.id
      console.log('id = ',id);
      wx.navigateTo({
       url: '../drug-detail/drug-detail?id=' + id,
    })

  },

  //  药品类型-点击
  drugTypeClick:function(e){
    var that = this
    console.log('点击button')
    var id=e.currentTarget.dataset.id
    console.log('button index id = ',id);
    
    that.setData({
      currentSelectedBtnId:id,
      drugList:that.data.allDrugList[id]
      })

  },

  //  获取药品列表
  getDrugList:function(item){

    var that = this
    util.isLoading(true);
    requests.getDrugHomepage((res)=>{
      if(res.code == 10000){
        const listdata = res.data;
        console.log('药品列表：')
        console.log(listdata)
        that.setData({
          lunbo_data:listdata.lunbo_data
        })
        //  设置轮播图数据
        var tempImgUrl = [];
        var tempBanner = [];
        for (let i = 0;i < listdata.lunbo_data.length;i ++){
          var obj = listdata.lunbo_data[i];
          tempImgUrl.push(obj.img);
          tempBanner.push(obj.id);
        }
        that.setData({
          imgUrls:tempImgUrl,
          banners:tempBanner
          })

       //  设置药品类型
       var tempdrugTypes =[];
       for (let i=0;i<listdata.yao_data.length;i++){
         var obj = listdata.yao_data[i];
         tempdrugTypes.push(obj.title);
       }
       that.setData({drugTypes:tempdrugTypes})

       //  获取所有类型的药品列表
       var tempAllDrugList = [];
       for (let i=0;i<listdata.yao_data.length;i++){
         var obj = listdata.yao_data[i];
         var tempObj = [];
         tempObj = that.setDrugListDataFormat(obj.info)
         tempAllDrugList.push(tempObj);
        }

       that.setData({
         allDrugList:tempAllDrugList,
         drugList:tempAllDrugList[0],
         currentSelectedBtnId:0
         })

       console.log('所有药品列表')
       console.log(that.data.allDrugList)
      
       }
       
     },(err) => {
       console.log('请求药品列表失败')
       wx.showToast({
        title: '请求数据失败',
        icon: 'default',
        duration: 2000
      })
     }, () => {
       util.isLoading(false);
       console.log('请求网络数据完成');
       wx.stopPullDownRefresh();  //  结束下拉刷新状态
    });

  },


 //  设置药品列表数据格式
  setDrugListDataFormat:function(list){
    var that = this
    var resultArray =[];
    var tempArray =[];
    for(let i=0;i<list.length;i++){

      tempArray.push(list[i])
      console.log('元素：')
      console.log(list[i])
      //  已经是最后一个元素了
      if(i+1 == list.length){
        resultArray.push(tempArray)       
      }else if(i%2 != 0){
        resultArray.push(tempArray)
        tempArray = []
      }
    }

    return resultArray;
   
  },
  
  //  点击药品item,跳转到药品详情页
  goToDrugDetail:function(e){
    var id =e.currentTarget.dataset.id;
    var  title = e.currentTarget.dataset.title;
    var  price = e.currentTarget.dataset.price;
    wx.navigateTo({
       url: '../drug-detail/drug-detail?id='+id+'&title='+title+'&price='+price,
    })
  },

   //  下拉刷新
   onPullDownRefresh:function(){
     var that=this;
    
     console.log('下拉刷新')
    
     //  重新获取问药首页数据
     that.getDrugList(1)

  },

  
})