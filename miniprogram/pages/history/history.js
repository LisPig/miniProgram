// pages/history/history.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[],
    debtAccountList:[],
    popover: false,
    detail:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistoryList();
  },

  getHistoryList:function(){
    let that = this;
    const userInfo=wx.getStorageSync('userInfo')
    if(userInfo==null){
      wx.showModal({
        title: '提示',
        content: '用户信息获取失败',
        showCancel: false
      });
      return false;
    }else{
      util.request(api.sevenList,{
        user_id:userInfo.user_id
      },'GET').then(function(res){
        that.setData({
          historyList:res
        })

      })
    }
  },

  showDetail:function(e){
    let that = this;
    const userInfo=wx.getStorageSync('userInfo')
    util.request(api.historyDetail, {
      user_id:userInfo.user_id,
      createDate:e.currentTarget.dataset.item.create_date
    },"GET")
    .then(function(res) {
      console.log(res);
      that.setData({
        debtAccountList:res,
        popover: true,
        detail:false})
    })
  
    // this.setData({
    //   popover: true,
    //   detail:false
    // })
  },
  //弹窗隐藏
  hide: function (e) {
    this.setData({
      popover: false,
      detail:true,
      type_name:'',
      icon_name:'',
    })
  },
//弹窗关闭
  close: function () {
    this.setData({
      popover: false,
      detail:true,
      type_name:'',
      icon_name:'',
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