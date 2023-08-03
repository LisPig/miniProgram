// components/expendTypeIcon/expendTypeIcon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeTab: { type: Number, value: 0 },
    icon_name:{ type: String },
    type_name:{type:String}
  },

  /**
   * 组件的初始数据
   */
  data: {
    //activeTab
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkIcon:function(e){
      this.triggerEvent('checkIcon', e.currentTarget.dataset)
      // console.log(e.currentTarget.dataset)
       let iconname = e.currentTarget.dataset
      //wx.setStorageSync('typename', iconname)
      // console.log(iconname)
      // this.triggerEvent('changeName', {
      //   name: iconname
      // })
      // wx.navigateBack({
      //   delta: 1,
      // })
    }

    
  }
})
