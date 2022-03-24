// components/navigationBar/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    showBottomShadow: Boolean,
    title: String,
    bgColor: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    navigationBarHeight: 0,
    searchBarTop: 0,
    searchBarHeight: 0,
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        navigationBarHeight: app.globalData.navigationBarHeight,
        searchBarTop: app.globalData.searchBarTop,
        searchBarHeight: app.globalData.searchBarHeight,
      })
    },
    ready: function () {
      this.setData({
        darkMode: app.globalData.theme == 'dark'
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 向上触发事件
     */
    onSearch: function () {
      this.triggerEvent('search', {}, {})
    },

    onTapMenu: function () {
      this.triggerEvent('onTapMenu', {}, {})
    },

    /**
     * 向上触发事件
     */
    onNaviBack: function () {
      wx.navigateBack({
        delta: 0,
      })
      this.triggerEvent('naviBack', {}, {})
    }
  }
})