// pages/settings/settings.js
const app = getApp()
import config from '../../config.js'
import {
  User
} from '../../models/user.js'


const userApi = new User();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTargetPopupValue: false,
    resetProgressValue: false,
    currentDictName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  underDev() {
    wx.showToast({
      icon: 'none',
      title: '正在开发中',
    })
  },

  copyQQ(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.qq,
      // success: function (res) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '复制群号成功',
      //     showCancel: false
      //   });
      // }
    })
  },
  onClickResetProgress() {
    this.setData({
      resetProgressValue: !this.data.resetProgressValue
    })
  },

  /**
   * 打开每日单词目标的popup 
   */
  toggleTargetPopup(e) {
    this.setData({
      showTargetPopupValue: !this.data.showTargetPopupValue,
      tmpTargetCount: this.data.setting.targetCount
    })

  },

  jumpToDictChange() {
    wx.navigateTo({
      url: '../dictionary/dictionary',
    })
  },

  onChangeDailyTarget(e) {
    this.setData({
      tmpTargetCount: e.detail
    })
  },

  // 确认修改每日目标
  changeTargetCount() {
    let that = this
    let tmpTargetCount = this.data.tmpTargetCount
    let setting = {
      "targetCount": tmpTargetCount
    }
    wx.showLoading({
      title: '修改中',
    })
    userApi.modifyUserSetting(setting).then(e => {
      // 成功后，要修改globaldata和本页面的data
      app.globalData.setting.targetCount = tmpTargetCount
      that.setData({
        ['setting.targetCount']: tmpTargetCount
      })
      that.toggleTargetPopup()
      wx.showToast({
        icon: 'none',
        title: '修改成功',
      })
    })
  },

  //倒计时的开关 
  switchCountdown() {
    let that = this
    wx.showModal({
      title: "提示",
      content: "要" + (that.data.setting.openCountdown == 0 ? '开启' : '关闭') + "练习模式的倒计时吗",
      confirmColor: '#220aac',
      confirmText: that.data.setting.openCountdown == 0 ? '开启' : '关闭',
      success(res) {
        if (res.confirm) {
          let newOpenCountdown = that.data.setting.openCountdown == 0 ? 1 : 0
          let setting = {
            "openCountdown": newOpenCountdown
          }
          userApi.modifyUserSetting(setting).then(e => {
            wx.showToast({
              title: '已' + (newOpenCountdown == 1 ? '开启' : '关闭') + '倒计时',
            })
            // 成功后，要修改globaldata和本页面的data
            app.globalData.setting.openCountdown = newOpenCountdown
            that.setData({
              ['setting.openCountdown']: newOpenCountdown
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  jump2BookList() {
    wx.navigateTo({
      url: '../wordlist/wordlist',
    })
  },

  jump2DelCard() {
    wx.navigateTo({
      url: '../deleted_card/deleted_card',
    })
  },

  openDarkMode() {
    let that = this
    wx.showModal({
      title: "提示",
      showCancel: false,
      content: "将微信设置为深色模式即可\r\n如有疑问可咨询客服",
      confirmColor: '#220aac',
      confirmText: '好的',
    })
  },

  onCloseDarModeTutorial() {
    this.setData({
      showDarModeTutorialValue: false
    })
  },
  jump2MoreSettings() {
    wx.navigateTo({
      url: './more_settings/more_settings',
    })
  },
  switchAutoSpeak() {
    let that = this
    wx.showModal({
      title: "提示",
      content: (that.data.setting.openAutoSpeak == 0 ? '开启' : '关闭') + "弹出词典自动读音",
      confirmColor: '#220aac',
      confirmText: that.data.setting.openAutoSpeak == 0 ? '开启' : '关闭',
      success(res) {
        if (res.confirm) {
          let openAutoSpeak = that.data.setting.openAutoSpeak == 0 ? 1 : 0
          wx.showToast({
            title: '已' + (openAutoSpeak == 1 ? '开启' : '关闭'),
          })
          // 成功后，要修改globaldata和本页面的data
          app.globalData.setting.openAutoSpeak = openAutoSpeak
          wx.setStorage({
            key: 'openAutoSpeak',
            data: openAutoSpeak
          })
          that.setData({
            ['setting.openAutoSpeak']: openAutoSpeak
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 倒计时结束后提示释义
   */
  switchReviewShowToast() {
    let that = this
    wx.showModal({
      title: "提示",
      content: (that.data.setting.showReviewToast == 0 ? '开启' : '关闭') + "倒计时结束后提示释义",
      confirmColor: '#220aac',
      confirmText: that.data.setting.showReviewToast == 0 ? '开启' : '关闭',
      success(res) {
        if (res.confirm) {
          let showReviewToast = that.data.setting.showReviewToast == 0 ? 1 : 0
          wx.showToast({
            title: '已' + (showReviewToast == 1 ? '开启' : '关闭'),
          })
          // 成功后，要修改globaldata和本页面的data
          app.globalData.setting.showReviewToast = showReviewToast
          wx.setStorage({
            key: 'showReviewToast',
            data: showReviewToast
          })
          that.setData({
            ['setting.showReviewToast']: showReviewToast
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  switchCustomKeyboard() {
    let that = this
    wx.showModal({
      title: "提示",
      content: (that.data.setting.customKeyboard == 0 ? '使用' : '不使用') + "自定义键盘",
      confirmColor: '#220aac',
      confirmText: that.data.setting.customKeyboard == 0 ? '使用' : '不使用',
      success(res) {
        if (res.confirm) {
          let customKeyboard = that.data.setting.customKeyboard == 0 ? 1 : 0
          wx.showToast({
            title: '已' + (customKeyboard == 1 ? '开启' : '关闭'),
          })
          // 成功后，要修改globaldata和本页面的data
          app.globalData.setting.customKeyboard = customKeyboard
          wx.setStorage({
            key: 'customKeyboard',
            data: customKeyboard
          })
          that.setData({
            ['setting.customKeyboard']: customKeyboard
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  switchVibrate() {
    let that = this
    wx.showModal({
      title: "提示",
      content: (that.data.setting.vibrate == 0 ? '开启' : '关闭') + "震动模式",
      confirmColor: '#220aac',
      confirmText: that.data.setting.vibrate == 0 ? '开启' : '关闭',
      success(res) {
        if (res.confirm) {
          let vibrate = that.data.setting.vibrate == 0 ? 1 : 0
          wx.showToast({
            title: '已' + (vibrate == 1 ? '开启' : '关闭'),
          })
          // 成功后，要修改globaldata和本页面的data
          app.globalData.setting.vibrate = vibrate
          wx.setStorage({
            key: 'vibrate',
            data: vibrate
          })
          that.setData({
            ['setting.vibrate']: vibrate
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  beginResetProgress() {
    if (this.data.resetProgressTextValue != '重置进度') return
    this.setData({
      resetProgressTextValue: '',
      resetProgressValue: false
    })
    wx.showLoading({
      title: '重置中',
    })

    userApi.resetDictProgress(app.globalData.currentDicCode).then(e => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '重置成功\r\n建议重启小程序',
      })
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    this.setData({
      currentDictName: config.dictInfo[app.globalData.currentDicCode].name,
      setting: app.globalData.setting,
      deletedCardCount: app.globalData.deletedCardCount,
      markWordCount: app.globalData.markWordCount
    })

    // 载入setting.showReviewToast
    wx.getStorage({
      key: 'showReviewToast',
      success(res) {
        that.setData({
          ['setting.showReviewToast']: res.data
        })
      },
      fail() {
        that.setData({
          ['setting.showReviewToast']: 1
        })
      }
    })

    wx.getStorage({
      key: 'openAutoSpeak',
      success(res) {
        that.setData({
          ['setting.openAutoSpeak']: res.data
        })
      },
      fail() {
        that.setData({
          ['setting.openAutoSpeak']: 1
        })
      }
    })

    wx.getStorage({
      key: 'vibrate',
      success(res) {
        that.setData({
          ['setting.vibrate']: res.data
        })
      },
      fail() {
        that.setData({
          ['setting.vibrate']: 1
        })
      }
    })


    wx.getStorage({
      key: 'customKeyboard',
      success(res) {
        that.setData({
          ['setting.customKeyboard']: res.data
        })
      },
      fail() {
        that.setData({
          ['setting.customKeyboard']: 1
        })
      }
    })

  },
})