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
    showInvitePopupValue: false,
    notificationTypeIndex: 0,
    notificationType: ['当日有未完成的任务', '总是提醒', '关闭提醒'],
    isVip: false,
    timePickerFilter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }

      return options;
    },

    userInfo: {},
    hasUserInfo: false,
    showTimePickerPopupValue: false,
    showNotificationPopupValue: false,
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
        icon: './images/allcard.png',
        routerName: 'allCard',
        routerData: {
          mode: "learn",
          modeStr: "开始学习"
        }
      },
      {
        title: '单词本',
        icon: './images/mark.png',
        routerName: 'wordlist'
      },
      {
        title: '定时提醒',
        icon: './images/alarm.png',
        name: 'notification'
      },
      {
        title: '截图分享',
        icon: './images/shoot.png',
        routerName: 'snapshot'
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
        isVip: true,
        name: "listen"
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
    onInviteFriendTapped() {
      this.triggerEvent("share")
    },

    showInvitePopup() {
      this.setData({
        showInvitePopupValue: true
      })
    },

    hideInvitePopup() {
      this.setData({
        showInvitePopupValue: false
      })
    },
    getUserProfile(e) {
      wx.showLoading({
        title: '登录中',
      })
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log(res.userInfo)
          // todo: 发送给服务端
          wx.setStorageSync('hasUserInfo', true)
          wx.setStorageSync('userInfo', res.userInfo)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    },
    onTapSidebarItem(e) {
      if (e.currentTarget.dataset.name == 'export') {
        this.setData({
          showExportActionSheetValue: true,
          mode: "export"
        })
      }

      if (e.currentTarget.dataset.name == 'listen') {
        this.setData({
          showExportActionSheetValue: true,
          mode: "listen"
        })
      }

      if (e.currentTarget.dataset.name == 'notification') {
        this.setData({
          showNotificationPopupValue: true
        })
      }

    },
    onTap: function (e) {
      this.popover = this.selectComponent('#popover1')
      // 获取按钮元素的坐标信息
      var id = e.target.id // 或者  获取点击元素的 ID 值
      wx.createSelectorQuery().in(this).select('#' + id).boundingClientRect(res => {
        console.log(res)
        // 调用自定义组件 popover 中的 onDisplay 方法z
        this.popover.onDisplay(res);
      }).exec();
    },
    showTimePickerPopup() {
      this.setData({
        showTimePickerPopupValue: true
      })
    },

    closeTimePickerPopup() {
      this.setData({
        showTimePickerPopupValue: false
      })
    },
    onTapConfirmBtn() {
      this.triggerEvent('openAlarm', {})
      this.closeNotificationPopup()
    },

    onChangeNotificationType() {
      this.setData({
        notificationTypeIndex: ++this.data.notificationTypeIndex
      })
    },

    closeNotificationPopup() {
      this.setData({
        showNotificationPopupValue: false
      })
    },

    onSelectExportActionSheet(e) {
      let routerName = ""
      let mode = this.data.mode
      let modeStr = this.data.mode == 'listen' ? "随身听" : "导出卡片"
      switch (e.detail.name) {
        case "今日新学卡片":
          routerName = "todayStudy"
          break;
        case "今日复习卡片":
          routerName = "todayReview"
          break;
        case "所有卡片":
          routerName = "allCard"
          break;
      }

      router.push({
        name: routerName,
        data: {
          modeStr: modeStr,
          mode: mode
        }
      })
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
    },
  },
  lifetimes: {
    ready() {
      let isInviteMode = app.globalData.isInviteMode
      console.log(isInviteMode)
      let userAuthInfo = app.globalData.userAuthInfo || {}
      let role = userAuthInfo.role
      let unlockCount = userAuthInfo.unlockCount
      let invitePopupTitleText = isInviteMode === 'undefined' ? "会员解锁邀请" : (role != "vip") ? "邀请好友" : "恭喜！你已成功解锁会员"
      let invitePopupSubTitleText = "共同免费解锁会员权益"
      let invitePopupBottomText = "分享给好友或群聊"

      if (isInviteMode) {
        invitePopupSubTitleText = "xxx邀请你共同免费解锁会员权益"
      } else {
        if (role == 'vip') {
          if (unlockCount < 3) {
            invitePopupSubTitleText = "你可以继续分享，帮助" + parseInt(3 - unlockCount) + "名好友解锁"
          } else {
            invitePopupSubTitleText = "你的解锁名额已经用完"
          }
        }
      }

      // [ todo ] 兼容getUserInfo 和 profile
      var hasUserInfo = app.globalData.hasUserInfo
      var userInfo = app.globalData.userInfo
      if (hasUserInfo && userInfo) {
        this.setData({
          hasUserInfo,
          userInfo
        })
        // Do something with return value
      } else {
        console.log("not login")
      }

      this.setData({
        searchBarTop: app.globalData.searchBarTop,
        role,
        unlockCount,
        invitePopupSubTitleText,
        invitePopupTitleText,
        invitePopupBottomText
      })
    }
  }
})