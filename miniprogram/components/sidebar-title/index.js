// components/sidebar-title/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    openVip() {
      const expireTime = new Date().getTime() + 24 * 60 * 60 * 1000
      let role = {
        role: 'vip',
        expire: expireTime
      }
      wx.setStorageSync('role', role)
    }
  }
})