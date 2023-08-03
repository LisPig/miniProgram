//index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const { userInfo } = require('../../config/api.js');
const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: 'tabs'
    }
  },
  data: {
    
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    popover: false,
    add:true,
    sumcount:0,
    showSumcount:0,
    hidesumcount:"*****",
    day:0,
    remainDay:'',
    tabs:[],
    outlaylist:[],
    todayOutlayList:[],//今日支出
    todayIncomList:[],//今日收入
    todayTransferList:[],//今日转账
    todayPayList:[],//今日还款
    activeTab:0,
    backColor:"#10aeff",
    showSum:true,
    seeIcon:"/static/images/see.png",
    expendType:'',
    money:'',
    todayTotal:0.0,

    tabHeiaght:'',//页面高度

    swiperHeight: "",
    scrollLeft: 0,

    showTotalDay:false,
    

    debtAccountList:[],//负债列表
    debtAccount:'',//负债账户

    icon_name:'',
    type_name:'',
    hidden:false,
  },

  onLoad() {
    var that = this;
    that.default_show();
    that.authLogin();
    // app.getOpenID().then(function(userinfo){
    //   that.setData({
    //     userInfo:userinfo
    // })
    // })
    
    //that.getTodayList();  
    //that.getTodayTotal();
    const tabs = [
      {
        title: '支出',
        // todayOutlayList:wx.getStorageSync('todayOutlayList'),
        todayOutlayList:this.data.todayOutlayList
      },
      {
        title: '收入',
        // todayOutlayList:wx.getStorageSync('todayIncomList')
        todayOutlayList:this.data.todayOutlayList
      },
      {
        title: '转账',
        // todayOutlayList:wx.getStorageSync('todayTransferList')
        todayOutlayList:this.data.todayOutlayList
      },
      {
        title: '还款',
        // todayOutlayList:wx.getStorageSync('todayPayList')
        todayOutlayList:this.data.todayOutlayList
      }
    ];
    //console.log(tabs)
     let levelColor = "background-color:#10aeff"
     
     
      
    this.setData({ 
      tabs,
      backColor: levelColor,
      //sumcount:that.data.userInfo.sum_money,
      //showSumcount:tempsum,
      userInfo:wx.getStorageSync('userInfo'),
    })
  },

  //检查用户
  authLogin:function(){
    //开启loading框
    wx.showLoading({
      title: '正在登录...',
      mask: true
    });
    var that = this;
    //console.log("执行1")
    this.data.userInfo = wx.getStorageSync('userInfo');
    
    
    //let userinfo = this.data.userInfo;
    // if(userinfo==null || userinfo==""){
      // wx.login({
      //   success (res) {
      //     if (res.code) {
        app.getOpenID().then(function(openid){
            util.request(api.userInfo,{code:openid},'GET').then(function(login_res) {
              if (login_res.code == 0) {
                console.log("赋值"+login_res.userInfo)
                //1.存用户信息到本地存储
                wx.setStorageSync('userInfo', login_res.userInfo)
                //2.存用户信息到全局变量
                var app = getApp();
                app.globalData.userInfo = login_res.userInfo
                that.data.sumcount = login_res.userInfo.sum_money
                that.data.showSumcount = login_res.userInfo.sum_money;//总资产
                that.data.remainDay  = login_res.remainDay;//剩余天数
                let tempsum;
                //隐藏loading框
                wx.hideLoading();
                that.getTodayList(); 
              }
              
          })
        })
      //   }  else {
      //     console.log('登录失败！' + res.errMsg)
      //   }
      // } 
      // })

    //}
  },


  getTodayList:function(){//获取今日记录列表
    //console.log("执行2")
    let that = this;
    var outlaylist=[];
    const userInfo=wx.getStorageSync('userInfo')
    util.request(api.recordList,{
      user_id:userInfo.user_id,
      classify_id:that.data.activeTab,
    },'GET')
    .then(function(res) {
      if(res.errno=='0'){
        outlaylist = res.data;
        that.setData({todayOutlayList: res.data})  
        console.log("列表"+that.data.todayOutlayList) 

        if(that.data.activeTab=="0"){//目前只计算支出
          that.getTodayTotal(outlaylist)
        }else{
          return false;
        }
    
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'error',
        })
      }
    })
    
  },
  getTodayTotal:function(outlaylist){//头部更新数据
    let total = 0;//总资产
    let day; //剩余天数
    //let dayss = wx.getStorageSync('showDay')  
    if(this.data.remainDay<0){ 
      if(wx.getStorageSync('showDay')){
        day = wx.getStorageSync('showDay');     
      }else{
        day = 0;
      }
      
      // if(total!=0){
      //   day = parseInt(this.data.sumcount/total);
      // }
    }else{
      day = this.data.remainDay;
    }
    for(var i=0;i<outlaylist.length;i++){
      total +=outlaylist[i].rmb;  
    }
    
    let levelColor = "background-color:#10aeff"
    const days = day
    if(51<=days && days>=100){
      levelColor
    }else if(31<=days && days<50){
      levelColor = "background-color:orange"
    }else{
      levelColor = "background-color:red"
    }

    wx.setStorageSync('showDay', day);
    this.setData({
      todayTotal:total,
      day:day,
      backColor: levelColor,
    })
  },

  bindtap: function (e) {
    this.setData({
      activeTab: e.currentTarget.id
    });
  },
  bindChange: function (e) {
    var that = this;
    
    wx.createSelectorQuery().select('.nav-item-' + e.detail.current).boundingClientRect(
      function (rect) {
        wx.getSystemInfo({
          success: function (res) {
            wx.createSelectorQuery().select('.nav-scroll').scrollOffset(function (scroll) {
              that.setData({
                scrollLeft: scroll.scrollLeft + rect.width / 2 + rect.left - res.windowWidth / 2,
                activeTab: e.detail.current
              });
              that.getTodayList();
            }).exec()
          }
        })
      }
    ).exec()
    // that.onShow();
  },
  onReady: function () {
    var obj = this;
    wx.getSystemInfo({ 
      success: function (res) {
        obj.setData({
          swiperHeight: (res.windowHeight * res.pixelRatio - 30)
        });
      }
    })
  },
  scrolltopfun(e){
    let that = this;
    that.top = e.detail.scrolltop;
  },


  onShow(e){
    this.authLogin();
    //this.default_show();
    this.setData({
      todayOutlayList:this.data.todayOutlayList,
      //sumcount:this.data.userInfo.sum_money
    })
    //this.setTableHeight()
  },

   /**是否隐藏金额 */
  default_show:function(){
    let that = this;
    let showMoney  = wx.getStorageSync('showSum')
    if(showMoney ==false){
      //that.data.seeIcon = "/static/images/nosee.png"
      that.data.showSum = true
      that.setData({
        sumcount:that.data.hidesumcount,
        seeIcon:"/static/images/nosee.png",
      })
      //that.data.sumcount = that.data.hidesumcount
      wx.setStorageSync('showSum',that.data.showSum)
      }else{
        //that.data.seeIcon = "/static/images/see.png"
        that.data.showSum=false
        that.setData({
          sumcount:wx.getStorageSync('userInfo').sum_money,
          seeIcon:"/static/images/see.png"
        })
        //that.data.sumcount = that.data.showSumcount;
        wx.setStorageSync('showSum',that.data.showSum)
      }
  },


  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },

  onChange(e) {
    const index = e.detail.index
    var that = this;
    var outlaylist = this.data.todayOutlayList;
    that.getTodayList();
    this.setData({ 
      activeTab: index ,

    })
    this.onShow();
  },
  handleClick(e) {
    wx.navigateTo({
      url: './webview',
    })
  },

  showNum:function(){
    let src = this.data.seeIcon
    
    if(this.data.showSum==true){
      src = "/static/images/nosee.png"
      this.data.showSum = false
      this.setData({
        sumcount:this.data.hidesumcount
      })
      wx.setStorageSync('showSum',this.data.showSum)
    }else{
      src = "/static/images/see.png"
      this.data.showSum=true
      this.setData({
        sumcount:wx.getStorageSync('userInfo').sum_money,
      })
      wx.setStorageSync('showSum',this.data.showSum)
    }
      this.setData({
        seeIcon:src,
      })
  },

  //添加按钮触发事件
  show: function (e) {
    let that = this;
    if(this.data.activeTab == 3){
      util.request(api.debtAccountList, {
        user_id:this.data.userInfo.user_id,
        
      },"GET")
      .then(function(res) {
        console.log(res);
        if(res.erron == 400){
          wx.showModal({
            title: '提示',
            content: res.errmsg,
            showCancel: false
          });
          return false;
        }else{
          
          let temp =[];
          for(var i=0;i<res.data.length;i++){
            //temp.push(res.data[i].wallet_id,res.data[i].account);
            temp.push(res.data[i].account);
          }
          that.setData({debtAccountList:temp})
          console.log(that.data.debtAccountList)
        }
      })
    }
    this.setData({
      popover: true,
      add:false
    })
  },
 
  //弹窗隐藏
  hide: function (e) {
    this.setData({
      popover: false,
      add:true,
      type_name:'',
      icon_name:'',
    })
  },
//弹窗关闭
  close: function () {
    this.setData({
      popover: false,
      add:true,
      type_name:'',
      icon_name:'',
    })
  },
  //选择账户
  bindPicker3Change: function(e) {
    console.log("账户"+this.data.debtAccountList[e.detail.value]);
    this.setData({
      index: e.detail.value
    })
    this.data.debtAccount = this.data.debtAccountList[e.detail.value];
  },
  //提交
  submit:function(e){
    console.log(e.detail.value);
    console.log(this.data.activeTab)
    //表单数据
    var objData = e.detail.value;
    if(objData.expend_Type=='' || objData.RMB==''){
      wx.showModal({
        title: '提示',
        content: '请完善信息',
        showCancel: false
      });
      return false;
    }
    let todayRecord = [];
    todayRecord = objData

    switch (this.data.activeTab) {
      case 0:
        this.data.todayOutlayList.push(todayRecord);
        wx.setStorageSync('todayOutlayList', this.data.todayOutlayList)
        break;
      case 1:
        this.data.todayIncomList.push(todayRecord);
        wx.setStorageSync('todayIncomList', this.data.todayIncomList)
        break;
      case 2:
        this.data.todayTransferList.push(todayRecord);
        wx.setStorageSync('todayTransferList', this.data.todayTransferList)
        break;
      case 3:
        this.data.todayPayList.push(todayRecord);
        wx.setStorageSync('todayPayList', this.data.todayPayList)
        break;
    }

     util.request(api.addRecord, {
       
      expend_type:objData.expend_Type?objData.expend_Type:this.data.debtAccount,
      user_id:this.data.userInfo.user_id,
      rmb:parseFloat(objData.RMB),
      classify_id:parseInt(this.data.activeTab),
      type_icon:this.data.icon_name,
      debtAccount:this.data.debtAccount,
      
    },"POST")
    .then(function(res) {
      if(res.errno=="400"){
        wx.showModal({
          title: '提示',
          content: res.errmsg,
          showCancel: false
        });
        return false;
      }else{
        console.log("添加成功"+res.data)
      }
      
    }),
    this.setData({
      popover: false,
      add:true
    })
    this.onShow();
  },
  //打开编辑记录页面
  edit:function(e){
    //console.log(e.currentTarget.dataset.item);
    var dataList = e.currentTarget.dataset.item
    let activeTab=this.data.activeTab;
    dataList['activeTab']=activeTab;
    dataList = JSON.stringify(dataList);
    wx.navigateTo({
      url: '/pages/editRecord/editRecord?dataList=' + dataList,
    })
  },
  //添加图标跳转到图标页面
  addIcon:function(){
    wx.navigateTo({
      url: '/pages/typeIcon_list/typeIcon_list?activeTab='+this.data.activeTab,
    })
  },
  
  // setTableHeight() {
  //   const query = wx.createSelectorQuery().in(this)
  //   query.select('#tabsSwiper').boundingClientRect(rect => {
  //     this.setData({
  //       tabHeiaght: rect.height
  //     })
  //   }).exec();
  // },
  onCheckIcon:function(e){
    console.log(e.detail);
  }

})


var change = number => {
  console.log('====new number====',number)
  var baseNumber = that.data.userInfo.sum_money //原数字
  var difference = number - that.data.userInfo.sum_money//与原数字的差
  var absDifferent = Math.abs(difference) //差取绝对值
  var changeTimes = absDifferent < 6 ? absDifferent : 6 //最多变化6次
  var changeUnit = absDifferent < 6 ? 1 : Math.floor(difference / 6)  //绝对差除以变化次数
  // 依次变化
  for (var i = 0; i < changeTimes; i += 1){
    // 使用闭包传入i值，用来判断是不是最后一次变化
    (function(i){
      setTimeout(()=>{
        that.setData({
          number: that.data.userInfo.sum_money += changeUnit
        })        
        // 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
        if (i == changeTimes - 1 ){
          that.setData({
            number: baseNumber + difference          
          })        
        }
      },100*(i+1))
    })(i)
  }  
}
