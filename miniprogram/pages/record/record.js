// miniprogram/pages/record/record.js
var wxCharts = require('../../utils/wxcharts.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
let pieCanvas = null;
var windowW=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pirChartData:[],
    lineChartData:[],
    radarChartData:[]
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },        
  onLoad: function (e) {
    this.getChartDataList();
      // 屏幕宽度
    this.setData({
        imageWidth: wx.getSystemInfoSync().windowWidth
      }) ;
      console.log(this.data.imageWidth) ;
   
      //计算屏幕宽度比列
      windowW = this.data.imageWidth/375;
      console.log(windowW);
      
      //this.onShow();
    // var windowWidth = 375;
    // try {
    //     var res = wx.getSystemInfoSync();
    //     windowWidth = res.windowWidth;
    // } catch (e) {
    //     console.error('getSystemInfoSync failed!');
    // }

    // pieChart = new wxCharts({
    //     animation: true,
    //     canvasId: 'pieCanvas',
    //     type: 'pie',
    //     series:this.data.pirChartData,
    //     // series: [{
    //     //     name: '成交量1',
    //     //     data: 15,
    //     // }, {
    //     //     name: '成交量2',
    //     //     data: 35,
    //     // }, {
    //     //     name: '成交量3',
    //     //     data: 78,
    //     // }],
    //     width: windowWidth,
    //     height: 300,
    //     dataLabel: true,
    // });
},
onRefresh(){
  //在当前页面显示导航条加载动画
  wx.showNavigationBarLoading(); 
  //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
  wx.showLoading({
    title: '刷新中...',
  })
  this.getChartDataList();
},

getChartDataList:function(){
  let that = this;
  util.request(api.userChartList,{
    user_id:wx.getStorageSync('userInfo').user_id
  },'GET').then(function(res){
    //隐藏loading 提示框
    wx.hideLoading();
    //隐藏导航条加载动画
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
    that.setData({
      pirChartData:res.pieList,
      lineChartData:res.lineList,
      radarChartData:res.radarList,
      columnChartData:res.columnList
    })
    that.loadchart();
    //console.log(that.data.pirChartData);
  })
},
onPullDownRefresh: function () {
  //调用刷新时将执行的方法
this.onRefresh();
},
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){},
  loadchart: function () {
    let that = this;
    let list = that.data.pirChartData
    let lineList = that.data.lineChartData;
    let radarList = that.data.radarChartData;
    let columnList = that.data.columnChartData;
    console.log(lineList)
    console.log(list)
    // pieCanvas
     pieCanvas = new wxCharts({
        animation: true, //是否有动画
        canvasId: 'pieCanvas',
        type: 'pie',
        series:list,
        width: (375 * windowW),
        height: (250 * windowW),
        dataLabel: true,
      });
   
   
      //lineCanvas
      new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: lineList.categories,
        animation: true,
        background: '#f5f5f5',
        series:lineList.main,
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '金额 (元)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: (375 * windowW),
        height: (200 * windowW),
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
   
      //columnCanvas
      new wxCharts({
        canvasId: 'columnCanvas',
        type: 'column',
        animation: true,
        categories: columnList.categories,
        series: columnList.main,
        yAxis: {
          format: function (val) {
            return val + '';
          },
          title: '金额(元)',
          min: 0
        },
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        extra: {
          column: {
            width: 15
          }
        },
        width: (375 * windowW),
        height: (200 * windowW),
      });

      //radarCanvas
    new wxCharts({
        canvasId: 'radarCanvas',
        type: 'radar',
        categories: radarList.categories,
        series: [{
          name: '消费支出',
          data: radarList.main
        }],
        width: (375 * windowW),
        height: (200 * windowW),
        extra: {
          radar: {
            max: 50
          }
        }
      });
   
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