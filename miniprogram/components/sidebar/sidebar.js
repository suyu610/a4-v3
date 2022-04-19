// components/sidebar/sidebar.js
import router from '../../router/index'
import {
  User
} from '../../models/user'
const userApi = new User()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isInviteMode: Boolean,
    userAuthInfo: Object,
    userBaseInfo: Object,
    studyRecordInfo: Object,
    notificationConfig: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    isMiniScreen: app.globalData.isMiniScreen,
    showInvitePopupValue: false,
    notificationTypeIndex: 0,
    notificationType: ['关闭提醒', '当日有未完成的任务', '总是提醒'],
    timePickerFilter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }
      return options;
    },
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
      this.triggerEvent('showInvitePopup')
    },

    getUserProfile(e) {
      console.log("getUserProfile")
      wx.showLoading({
        title: '登录中',
      })
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userBaseInfo: res.userInfo,
            hasUserInfo: true
          })

          // todo: 发送给服务端
          userApi.modifyUserProfile(res.userInfo).then(e => {
            console.log("修改成功")
          })
        },
        fail(res) {
          console.log(res)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    },
    onTapSidebarItem(e) {
      if (e.currentTarget.dataset.name == 'export') {
        if (app.globalData.userAuthInfo.role == 'user') {
          wx.showToast({
            icon: 'none',
            title: '请先开通会员',
          })
          return
        }
        this.setData({
          showExportActionSheetValue: true,
          mode: "export"
        })
        this.toggleLockDrawer()
      }

      if (e.currentTarget.dataset.name == 'listen') {
        // 
        if (app.globalData.userAuthInfo.role == 'user') {
          wx.showToast({
            icon: 'none',
            title: '请先开通会员',
          })
          return
        }
        this.setData({
          showExportActionSheetValue: true,
          mode: "listen"
        })
        this.toggleLockDrawer()
      }

      if (e.currentTarget.dataset.name == 'notification') {
        // 
        this.setData({
          showNotificationPopupValue: true
        })
        this.toggleLockDrawer()
      }
    },

    onAvatarLongPress() {

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
    confirmTimePickerPopup(e) {
      console.log(e.detail)
      let notificationConfig = this.data.notificationConfig
      notificationConfig.hour = e.detail.split(":")[0]
      notificationConfig.minute = e.detail.split(":")[1]

      this.setData({
        notificationConfig,
        notificationTimeStr: e.detail
      })

      this.closeTimePickerPopup()
    },

    closeTimePickerPopup() {
      this.setData({
        showTimePickerPopupValue: false
      })
    },

    onTapConfirmBtn() {
      this.triggerEvent('openAlarm', {
        "notificationConfig": this.data.notificationConfig
      })
      this.closeNotificationPopup()
    },

    onChangeNotificationType() {
      let mode = this.data.notificationConfig.mode
      if (mode == 2) {
        mode = 0
      } else {
        mode = mode + 1
      }

      this.setData({
        ['notificationConfig.mode']: mode
      })
    },

    closeNotificationPopup() {
      this.setData({
        showNotificationPopupValue: false
      })
      this.toggleLockDrawer()
    },

    toggleLockDrawer() {
      console.log("toggleLockDrawer")
      this.triggerEvent("toggleLockDrawer")
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
      this.toggleLockDrawer()

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
      this.setData({
        searchBarTop: app.globalData.searchBarTop,
        notificationTimeStr: (this.data.notificationConfig.hour < 10 ? ('0' + this.data.notificationConfig.hour) : this.data.notificationConfig.hour) + ":" + (this.data.notificationConfig.minute < 10 ? ('0' + this.data.notificationConfig.minute) : this.data.notificationConfig.minute)
      })
    }
  }
})