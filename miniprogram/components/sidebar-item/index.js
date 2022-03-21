// components/sidebar-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: String,
    iconPath: {
      type: String,
      value: './images/allcard.png',
    },
    itemName: {
      type: String,
      value: '未命名',
    },
    isVip: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpRouter() {
      wx.navigateTo({
        url: this.data.url,
      })
    }
  }
})