//  页面跳转必带参数 editType(编辑类型):   false：新增地址  | true：编辑地址（修改地址）
//  如果editType 类型是 编辑，
Page({
  data:{
    editType:false,                    //  编辑类型  false：新增  | true：编辑（修改）
    userNamePlaceholder:'请输入姓名',
    phonePlaceholder:'请输入手机号',
    addressPlaceholder:'街道等详细地址',
    isSetDefautlAddress:false ,        //  是否设置为默认地址
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    if(!options.editType){ 
      //  新增地址类型
      that.setData({
        userNamePlaceholder:'请输入姓名',
        phonePlaceholder:'请输入手机号',
        addressPlaceholder:'街道等详细地址',
      })
    }else{
      //  编辑地址类型

    }
    
  },
  onShow:function(){
    // 页面显示
  },
  //  获取收货人输入框内容
  getUserNameInputContent:function(e){

  },
  
  //  收货人输入框-点击键盘的完成按钮
  userNameCommit:function(){

  },
  
  //  获取联系方式输入框内容
  getUserPhoneInputContent:function(e){

  },

  //  联系方式输入框-点击键盘的完成按钮
  userPhoneCommit:function(){

  },

  //  改变是否设置为默认地址icon状态
  changeSetSate:function(){
    var that = this
    var tempStatus = that.data.isSetDefautlAddress
    that.setData({isSetDefautlAddress:!tempStatus})

  },

  //  保存地址
  saveSetupContent:function(){

  },

  //  删除地址
  deleteAddress:function(){

  },

})