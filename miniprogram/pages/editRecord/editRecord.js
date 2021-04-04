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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(options.dataList)
    console.log(list);
  this.setData({
    datalist: list,
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
      url: '/pages/categoryIcon_list/categoryIcon_list',
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
    util.request(api.editRecord,tempList,'POST').then(function(res){
      console.log(res);
      wx.switchTab({
        url: "/pages/index/index"
      });
    })
  },
  delete:function(){
    util.request(api.delRecord,{
      user_id:this.data.datalist.user_id,
      record_id:this.data.datalist.record_id,
      rmb:this.data.datalist.rmb,
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