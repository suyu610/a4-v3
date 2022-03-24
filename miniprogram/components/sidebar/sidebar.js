// components/sidebar/sidebar.js
import router from '../../router/index'

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

    showExportActionSheetValue: false,
    exportActionSheetActions: [{
        name: '今日新学卡片',
      },
      {
        name: '今日复习卡片',
      }, {
        name: '所有卡片',
      }
    ],
    notvipFuncItemList: [{
        title: '全部卡片',
        icon: './images/allcard.png'
      },
      {
        title: '单词本',
        icon: './images/mark.png',
        routerName: 'wordlist'
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
        routerName: 'uploadBook'
      },
      {
        title: '单词随身听',
        icon: './images/listen.png',
        isVip: true
      },
      {
        title: '导出卡片',
        icon: './images/export.png',
        isVip: true,
        name: "export"
      },
    ],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapSidebarItem(e) {
      if (e.currentTarget.dataset.name == 'export') {
        this.setData({
          showExportActionSheetValue: true
        })
      }
    },

    onSelectExportActionSheet(e) {
      console.log(e)
    },
    onCloseExportActionSheet() {
      this.setData({
        showExportActionSheetValue: false
      })
    },

    jump2Calendar() {
      router.push({
        name: 'calendar'
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
      router.push({
        name: 'settings'
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