const util = require('../../utils/util.js');
const api = require('../../config/api.js');

// miniprogram/pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletList:[],
    fictionAcc:[],//虚构账户
    cashAcc:[],//现金账户
    debtAcc:[],//负债账户
    investmentAcc:[],//投资账户
  },

  add:function(){
    wx.navigateTo({
      url: "/pages/addWallet/addWallet"
    });
  },
  edit:function(e){
    let dataList = JSON.stringify(e.currentTarget.dataset.item)
    console.log(dataList)
    wx.navigateTo({
      url: '/pages/editWallet/editWallet?dataList=' + dataList,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    // this.data.walletList = wx.getStorageSync('walletList');
    
    //   this.setData({
    //     walletList:this.data.walletList
    //   })
    //   console.log(this.data.walletList.length)
  },

  getList:function(){
    let that = this;
    var tempList0=[];
    var tempList1=[];
    var tempList2=[];
    var tempList3=[];
    const userInfo=wx.getStorageSync('userInfo')
    if(userInfo==null){

    }else{
      util.request(api.walletList,{
        user_id:userInfo.user_id
      },'GET').then(function(res){
        for(var i=0;i<res.length;i++){
          switch (res[i].account_type){
            case "0":
              tempList0.push(res[i]);
              break;
            case "1":
              tempList1.push(res[i]);
              break;
            case "2":
              tempList2.push(res[i]);
              break;
            case "3":
              tempList3.push(res[i]);
              break;
          }
        }
        // res.forEach(e => {
        //   switch (e.account_type){
        //     case "0":
        //       that.data.fictionAcc.push(e);
        //       break;
        //     case "1":
        //       that.data.cashAcc.push(e);
        //       break;
        //     case "2":
        //       that.data.debtAcc.push(e);
        //       break;
        //     case "3":
        //       that.data.investmentAcc.push(e);
        //       break;
        //   }
        // })
         that.setData({
           walletList: res,
           fictionAcc:tempList0,
           cashAcc:tempList1,
           debtAcc:tempList2,
           investmentAcc:tempList3
        })  
         console.log("现金账户："+that.data.walletList);
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.data.walletList = wx.getStorageSync('walletList');
    this.getList();
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