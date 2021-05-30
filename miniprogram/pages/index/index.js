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
  },

  onLoad() {
    var that = this;
    that.authLogin();
    console.log(this.data.userInfo.sum_money )
    that.getTodayList();  
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
    // const days = this.data.day
    // //console.log(50>days>=31)
    // if(51<=days && days>=100){
    //   levelColor
    // }else if(31<=days && days<50){
    //   levelColor = "background-color:orange"
    // }else{
    //   levelColor = "background-color:red"
    // }
    
    this.setData({ 
      tabs,
      backColor: levelColor,
      sumcount:that.data.userInfo.sum_money,
      showSumcount:that.data.userInfo.sum_money,
    })
  },
  start: ()=> {
    var random = Math.floor(Math.random() * 900000 + 100000)
    that.setData({
      sumcount: random
    })
    change(random) 
  },


  getTodayList:function(){//获取今日记录列表
    let that = this;
    var outlaylist=[];
    util.request(api.recordList,{
      user_id:that.data.userInfo.user_id,
      classify_id:that.data.activeTab,
    },'GET')
    .then(function(res) {
      if(res.errno=='0'){
        outlaylist = res.data;
        that.setData({todayOutlayList: res.data})  
        console.log(that.data.todayOutlayList) 

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
    if(wx.getStorageSync('showDay')){
      day = wx.getStorageSync('showDay');     
    }else{
      day = 0;
    }
    for(var i=0;i<outlaylist.length;i++){
      total +=outlaylist[i].rmb;  
    }
    if(total!=0){
       day = parseInt(this.data.sumcount/total);
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
    this.getTodayList();
    //console.lot(e.currentTarget.dataset.text.name) 
    //this.data.type_icon = wx.getStorageSync('typename')
    this.setData({
      todayOutlayList:this.data.todayOutlayList,
      // type_icon:this.data.type_icon,
      // type_txt:this.data.type_icon.type
      //sumcount:this.data.userInfo.sum_money
    })
    //this.setTableHeight()
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
    let newArr 
    if(this.data.showSum==true){
      src = "/static/images/nosee.png"
      this.data.showSum = false
      this.setData({
        sumcount:this.data.hidesumcount
      })
    }else{
      src = "/static/images/see.png"
      this.data.showSum=true
      this.setData({
        sumcount:this.data.showSumcount
      })
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
    let dataList = JSON.stringify(e.currentTarget.dataset.item)
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
  //检查用户
  authLogin:function(){
    this.data.userInfo = wx.getStorageSync('userInfo');
    let userinfo = this.data.userInfo;
    // if(userinfo==null || userinfo==""){
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: api.userInfo,
              // method: 'POST',
              // header: {
              //   'content-type': 'application/json'
              // },
              data:{
                code:res.code
              },
              success:function(login_res){
                if (login_res.data.code == 0) {
                  console.log(login_res.data.userInfo)
                  wx.setStorageSync('userInfo', login_res.data.userInfo);
                }
                
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      this.setData({
        userInfo:wx.getStorageSync('userInfo')
      })
    //}
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
