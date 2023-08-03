var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: (res)=> {

        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/index/index'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
          
        }

      },
      fail: function(err) {
        reject(err)
        wx.showToast({
          title: '服务器异常',
          icon:'error'
        })
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}



  function change(number) {
  var random = Math.floor(Math.random() * 900000 + 100000)
  console.log('====new number====',number)
  var that = this;
  var baseNumber = number //原数字
  var difference = random - number //与原数字的差
  var absDifferent = Math.abs(difference) //差取绝对值
  var changeTimes = absDifferent < 6 ? absDifferent : 6 //最多变化6次
  var changeUnit = absDifferent < 6 ? 1 : Math.floor(difference / 6)  //绝对差除以变化次数
  // 依次变化
  for (var i = 0; i < changeTimes; i += 1){
    // 使用闭包传入i值，用来判断是不是最后一次变化
    (function(i){
      setTimeout(()=>{
        that.setData({
          sumcount: number += changeUnit
        })        
        // 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
        if (i == changeTimes - 1 ){
          that.setData({
            sumcount: baseNumber + difference          
          })        
        }
      },100*(i+1))
    })(i)
  }
}  


module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
}