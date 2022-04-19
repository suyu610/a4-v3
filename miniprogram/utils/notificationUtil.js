/**
 * 判断是否需要被提醒
 */
function shouldShowNotification() {
  const app = getApp()
  if (app.globalData.notificationConfig.mode != 0) {
    console.log("用户设置为需要提醒")
    let notificationSetFlag = wx.getStorageSync('notificationSetFlag')
    if (notificationSetFlag == null || notificationSetFlag == "" || notificationSetFlag != app.globalData.todayDate) {
      console.log("今日未申请过提醒")
      return true
    } else {
      console.log("今日已经申请过提醒")
    }
  } else {
    console.log("用户设置为永不提醒")
  }
  return false
}

/**
 * 如果用户设置不为永不提醒，
 * 且今日未设置需要提醒，
 * 则向微信发起一次需要提醒
 */

function requestNotification() {
  wx.requestSubscribeMessage({
    tmplIds: ['HjD6Lq6HwmjuG7fCBKZ96sUEzmvAnl39bu3gS1rHbXU'],
    success(res) {
      console.log(res)
      wx.setStorageSync('notificationSetFlag', app.globalData.todayDate)
    },
    fail(res) {
      console.log(res)
    },
    complete() {}
  })

}

module.exports = {
  requestNotification: requestNotification,
  shouldShowNotification: shouldShowNotification
}