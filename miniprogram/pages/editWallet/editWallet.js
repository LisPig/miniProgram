// miniprogram/pages/editWallet/editWallet.js
const util = require("../../utils/util");
const api = require("../../config/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:{},
    array: ['虚拟账户', '现金账户', '负债账户','投资账户'],
    accountType:'',
    iconname:'',
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(options.dataList)
    console.log(list);
    this.setData({
      datalist: list,
      iconname:list.type_icon
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
    if(objData.account=='' || objData.sum_money==''){
      wx.showModal({
        title: '提示',
        content: '请完善信息',
        showCancel: false
      });
      return false;
    }
     let tempList = this.data.datalist;
    // tempList.expend_type = objData.expend_type;
    // tempList.rmb = objData.rmb
    tempList.user_id = wx.getStorageSync('userInfo').user_id
    tempList.type_icon = this.data.iconname.name
    tempList.account = objData.account;
    tempList.account_type = this.data.index;
    tempList.sum_money = objData.sum_money
    
    util.request(api.editWallet,tempList,'POST').then(function(res){
      console.log(res);
      wx.switchTab({
        url: "/pages/wallet/wallet"
      });
    })
  },
  delete:function(){
    util.request(api.delWallet,{
      user_id:this.data.datalist.user_id,
      wallet_id:this.data.datalist.wallet_id,
    },'GET').then(function(res){
      wx.switchTab({
        url: "/pages/wallet/wallet"
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
    //this.data.iconname = wx.getStorageSync('iconname')
    //console.log(this.data.iconname.name);
    this.setData({
      iconname:wx.getStorageSync('iconname'),
      index:this.data.datalist.account_type
    })
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