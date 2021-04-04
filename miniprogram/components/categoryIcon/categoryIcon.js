// components/categoryIcon/categoryIcon.js
Component({
  externalClasses: ['iconList-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    iconname:{
      type:String,
      value:'default value'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconList:[{"name":"weixin","textname":"微信"},
              {"name":"zhifubao","textname":"支付宝"},
              {"name":"weibiaoti-","textname":"银行卡"}
              ],
    test:{"name":"weixin","textname":"微信"}
              
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    checkIcon:function(e){
      console.log(e.currentTarget.dataset)
      let iconname = e.currentTarget.dataset
      wx.setStorageSync('iconname', iconname)
      console.log(iconname)
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
