let app = getApp()
Component({
  data: {
    show: true,
    selected: 0,
    color: app.globalData.theme == 'dark' ? "grey" : "#8e8e8e",
    selectedColor: app.globalData.theme == 'dark' ? "rgb(198, 198, 216)" : "#1d1d1f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: app.globalData.theme == 'dark' ? "/images/dark/home.png" : "/images/home.png",
      selectedIconPath: app.globalData.theme == 'dark' ? "/images/dark/home_fill.png" : "/images/home_fill.png",
      text: "首页"
    }, {
      pagePath: "/pages/review/review",
      iconPath: app.globalData.theme == 'dark' ? "/images/dark/review.png" : "/images/review.png",
      selectedIconPath: app.globalData.theme == 'dark' ? "/images/dark/review_fill.png" : "/images/review_fill.png",
      text: "复习"
    }, {
      pagePath: "/pages/settings/settings",
      iconPath: app.globalData.theme == 'dark' ? "/images/dark/setting.png" : "/images/setting.png",
      selectedIconPath: app.globalData.theme == 'dark' ? "/images/dark/setting_fill.png" : "/images/setting_fill.png",
      text: "设置"
    }]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})