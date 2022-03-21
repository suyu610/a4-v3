// components/sidebar/sidebar.js
const app = getApp()
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
    notvipFuncItemList: [{
        title: '全部卡片',
        icon: './images/allcard.png'
      },
      {
        title: '收藏单词',
        icon: './images/mark.png'
      },
      {
        title: '定时提醒',
        icon: './images/alarm.png'
      },
      {
        title: '截图分享',
        icon: './images/shoot.png'
      },

    ],
    vipFuncItemList: [{
        title: '自定义词书',
        icon: './images/custom.png',
        isVip: true,
        url: '../../pages/upload-book/upload-book'
      },
      {
        title: '单词随身听',
        icon: './images/listen.png',
        isVip: true
      },
      {
        title: '导出卡片',
        icon: './images/export.png',
        isVip: true
      },

    ],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump2Calendar() {
      wx.navigateTo({
        url: '../../pages/calendar/calendar',
      })
    },

    showTimeInfoToast() {
      wx.showModal({
        title: "提示",
        content: "无需手动打卡，每天完成至少一个学习计划（复习、新学）即视为学习打卡",
        confirmText: '我知道了',
        showCancel: false,
        confirmColor: "#332FEB"
      })
    },

    jump2Setting() {
      wx.navigateTo({
        url: '../../pages/settings/settings',
      })
    }
  },
  lifetimes: {
    ready() {
      this.setData({
        searchBarTop: app.globalData.searchBarTop
      })
    }
  }
})