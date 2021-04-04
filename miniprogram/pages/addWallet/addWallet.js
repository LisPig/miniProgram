const util = require("../../utils/util");
const api = require('../../config/api.js');

// miniprogram/pages/addWallet/addWallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletList:[],
    array: ['虚拟账户', '现金账户', '负债账户','投资账户'],
    accountType:'',
    capitalType:['存款','负债'],
    iconname:''
  },


  bindPicker3Change: function(e) {
    console.log("账户"+e.detail.value);
    this.setData({
        index: e.detail.value
    })
    this.data.accountType = e.detail.value;
  },
  submit:function(e){
   if(e.detail.value.account=='' || e.detail.value.total=='' || e.detail.value.index==''){
    wx.showModal({
      title: '提示',
      content: '请完善信息',
      showCancel: false
    });
    return false;
   }

    util.request(api.addWallet,{
      account:e.detail.value.account,
      sum_money:e.detail.value.total,
      account_type:e.detail.value.index,
      type_icon:this.data.iconname.name,
      user_id:wx.getStorageSync('userInfo').user_id

    },'POST').then(function(res){
      console.log(res);
    })
    let data = e.detail.value
    let walletList = wx.getStorageSync('walletList')
    if(walletList==''){
      walletList = this.data.walletList
    }
    walletList.push(data);
    wx.setStorageSync('walletList', walletList)
    //data.accountType = this.data.accountType;
    wx.switchTab({
      url: "/pages/wallet/wallet"
    });
    console.log(data);
  },
  addIcon:function(){
    wx.navigateTo({
      url: '/pages/categoryIcon_list/categoryIcon_list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.data.iconname = wx.getStorageSync('iconname')
    console.log(this.data.iconname.name);
    this.setData({
      iconname:this.data.iconname
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