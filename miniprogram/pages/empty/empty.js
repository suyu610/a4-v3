// pages/empty/empty.js
let app = getApp()
import config from '../../config.js'

import {
  User
} from '../../models/user.js'

import {
  Resource
} from '../../models/resource.js'

import {
  Card
} from '../../models/card'

const user = new User()
const resource = new Resource()
const cardApi = new Card()
import router from '../../router/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var value = wx.getStorageSync('hasShowGuide')
      if (value) {

      } else {
        app.globalData.showGuide = true
      }
    } catch (e) {
      console.log(e)
    }

    let that = this

    try {
      var hasUserInfo = wx.getStorageSync('hasUserInfo')
      var userInfo = wx.getStorageSync('userInfo')

      if (hasUserInfo && userInfo) {
        app.globalData.hasUserInfo = hasUserInfo
        app.globalData.userInfo = userInfo
      } else {
        console.log("not login")
      }
    } catch (e) {
      console.log(e)
    }


    resource.getInitData().then(e => {
      console.log(e)
      app.globalData.progressList = e.progressList
      app.globalData.currentDicCode = e.currentDicCode
      app.globalData.setting = e.setting
      app.globalData.todayInitData = e
      app.globalData.briefCalendarList = e.briefCalendarList
      app.globalData.role = e.role
      router.replace({
        name: 'index',
      });
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