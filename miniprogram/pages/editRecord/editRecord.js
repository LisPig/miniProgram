const util = require("../../utils/util");
const api = require("../../config/api");

// miniprogram/pages/editRecord/editRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:{},
    array: ['支付宝', '微信', '银行卡'],
    index:'',
    type_icon:'',
    expend_type:'',
    classify_id:0,
    activeTab:'',
    icon_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(options.dataList)
    console.log(list);
  this.setData({
    datalist: list,
    type_icon:list.type_icon,
    expend_type:list.expend_type,
    classify_id:list.classify_id ,
    activeTab:list.activeTab,
    icon_name:list.type_icon
  })
  },

  walletAccount:function(){
    util.request(api.editRecord,tempList,'POST').then(function(res){
      console.log(res);
      wx.switchTab({
        url: "/pages/index/index"
      });
    })
  },

  bindPicker3Change: function(e) {
    console.log("账户"+e.detail.value);
    this.setData({
        index: e.detail.value
    })
    this.data.accountType = e.detail.value;
  },
  addIcon:function(){
    wx.navigateTo({
      url: '/pages/typeIcon_list/typeIcon_list?activeTab='+this.data.activeTab,
    })
  },

  submit:function(e){
    console.log(e.detail.value);
    console.log(this.data.activeTab)
    //表单数据
    var objData = e.detail.value;
    if(objData.expend_type=='' || objData.rmb==''){
      wx.showModal({
        title: '提示',
        content: '请完善信息',
        showCancel: false
      });
      return false;
    }
    let tempList = this.data.datalist;
    tempList.expend_type = objData.expend_type;
    tempList.rmb = objData.rmb
    tempList.user_id = wx.getStorageSync('userInfo').user_id
    tempList.type_icon = this.data.icon_name
    util.request(api.editRecord,tempList,'POST').then(function(res){
      console.log(res);
      wx.switchTab({
        url: "/pages/index/index"
      });
    })
  },
  delete:function(){
    console.log("删除信息："+this.data.datalist);
    util.request(api.delRecord,{
      user_id:this.data.datalist.user_id,
      record_id:this.data.datalist.record_id,
      rmb:this.data.datalist.rmb,
      expend_type:this.data.datalist.expend_type,
    },'GET').then(function(res){
      wx.switchTab({
        url: "/pages/index/index"
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //let type_icon = wx.getStorageSync('typename')
    //console.log(this.data.type_icon.name);
    // this.data.datalist.expend_type = type_icon.type;
    // this.data.datalist.type_icon = type_icon.name
    // this.setData({
    //   type_icon:type_icon.name,
    //   expend_type:type_icon.type
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})