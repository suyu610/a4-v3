// pages/calendar/calendar.js
const app = getApp()
const {
  wxml,
  style
} = require('./demo.js')

import * as cardDataTools from '../../utils/cardDataTools'
const filterSheetActionsArr = ["现在复习", "5分钟内复习", "30分钟内复习", "12小时内复习", "大于1天"]

import {
  Progress
} from '../../models/progress'

const progress = new Progress()

import {
  Card
} from '../../models/card'
import {
  Resource
} from '../../models/resource'

const resource = new Resource
const cardApi = new Card()
import router from '../../router/index'

const filterSheetActionsTimeArr = [
  -1,
  5 * 60,
  30 * 60,
  12 * 60 * 60,
  24 * 60 * 60
]


Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''

  },
  renderToCanvas() {
    router.push({
      name: "snapshot"
    })
  },
  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        width: this.container.layoutBox.width,
        height: this.container.layoutBox.height
      })
    })
  },
  changeMonth(e) {
    // beginWeek: 2
    // month: 3
    // monthDayCount: 31
    // year: 2022
    console.log(e)
  },
  formatDateStr(year, month, day) {
    return String(year) + String(month < 10 ? '0' + month : month) + String(day < 10 ? '0' + day : day)
  },

  changeChosenDate(e) {
    let dateStr = this.formatDateStr(e.detail.year, e.detail.month, e.detail.day)
    let curItem = {
      newCardCount: 0,
      practiceCount: 0
    }
    if (this.data.calendarData.hasOwnProperty(dateStr)) {
      curItem = this.data.calendarData[dateStr]
    }
    this.setData({
      curItem,
      curDate: e.detail
    })
    // day: 4
    // month: 3
    // year: 2022
  },

  jump2AllCard: function () {
    router.push({
      name: "allCard",
      data: this.data.curDate
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.widget = this.selectComponent('.widget')
    let that = this

    progress.getProgressByMonth(app.globalData.todayMonthDate).then(function (e) {
      console.log(e)
      let curItem = {
        newCardCount: 0,
        practiceCount: 0
      }

      if (e.hasOwnProperty(app.globalData.todayDate)) {
        curItem = e[app.globalData.todayDate]
      }
      let today = new Date()
      that.setData({
        calendarData: e,
        curItem,
        curDate: {
          year: today.getFullYear(),
          month: today.getUTCMonth() + 1,
          day: today.getDate()
        }
      })

      let year = that.data.chosenYear
      let month = that.data.chosenMonth
      let progressArr = []

      for (let i = 1; i <= 31; i++) {
        let day = i
        if (day < 10) {
          day = '0' + day
        }
        let dateKey = String(year) + String(month) + String(day)
        if (dateKey in e) {
          progressArr.push({
            newWordCount: e[dateKey].newWordCount,
            practiceCount: e[dateKey].practiceCount
          })
        } else {
          progressArr.push({})
        }
      }
      that.setData({
        progressArr
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})