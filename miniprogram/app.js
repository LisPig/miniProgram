//app.js
var util = require('./utils/util.js');
var api = require('./config/api.js');
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  // authLogin:function(){
  //   //开启loading框
  //   wx.showLoading({
  //     title: '正在登录...',
  //     mask: true
  //   });
  //   var that = this;
  //   console.log("执行1")
  //   this.data.userInfo = wx.getStorageSync('userInfo');
  //   //let userinfo = this.data.userInfo;
  //   // if(userinfo==null || userinfo==""){
  //      wx.login({
  //       success (res) {
  //         if (res.code) {
        
  //           util.request(api.userInfo,{code:openid},'GET').then(function(login_res) {
  //             if (login_res.code == 0) {
  //               console.log("赋值"+login_res.userInfo)
  //               //1.存用户信息到本地存储
  //               wx.setStorageSync('userInfo', login_res.userInfo)
  //               //2.存用户信息到全局变量
  //               var app = getApp();
  //               app.globalData.userInfo = login_res.userInfo
  //               that.data.sumcount = login_res.userInfo.sum_money
  //               that.data.showSumcount = login_res.userInfo.sum_money
  //               //隐藏loading框
  //               wx.hideLoading();

  //               that.getTodayList(); 
  //             }
              
  //         })
  //       }
  //       }
      
  //   })

  // },
  afterLogin(that, call) {
    //this.loading(that);//菊花图loading组件
    if (wx.getStorageSync('userInfo')) {
      
        call()
    } else {
        var count = 0;
        var t = setInterval(() => {
        if (wx.getStorageSync('userInfo')) {
            clearInterval(t)
            
            call();
        } else {
            if (count >= 300) { // 30s未成功则登录失败
                clearInterval(t)
                //this.loading(that);//菊花图loading组件
                //提示框方法
                this.msg.showToast(that, "获取登录信息失败")
            }
            count++;
        }
        }, 100)
    }
  },
  getOpenID: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (loginCode) {
        //   util.request(api.userInfo,{code:loginCode.code},'GET').then(function(login_res) {
        //     if (login_res.code == 0) {
        //       console.log("赋值"+login_res.userInfo)
        //       // that.setData({
        //       //   userInfo:login_res.userInfo
        //       // })
        //       resolve(login_res.userInfo)
        //       wx.setStorageSync('userInfo', login_res.userInfo);
        //     }
            
        // })
          // wx.request({
          // //内容同上
          //   success: function (res) {
          //     console.log("getOpenid"+res.data);
          //     //添加片段
              resolve(loginCode.code);
              
          //   }
          // })
        }
      })
    })
  },
})
