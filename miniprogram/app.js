// app.js
import * as dateTools from './utils/dateTools'
import * as cacheUtil from './utils/cacheUtil'

import {
  User
} from 'models/user.js'

let innerAudioContext

import {
  Resource
} from './models/resource';
const user = new User()
const resource = new Resource()

App({
  globalData: {},
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'release-o6wz5',
        traceUser: true,
      });
    }
    // this.loadFontFace();
    this.initServerData();
    this.initSystemData();
    this.initSystemCache();
  },
  
  initSystemCache: function () {

  },

  initSystemData: function () {
    let that = this
    innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true
    });



    this.globalData.innerAudioContext = innerAudioContext
    this.globalData.showNoEver = false
    wx.getStorage({
      key: 'showNoEver',
      success(res) {
        that.globalData.showNoEver = res.data
      }
    })

    this.globalData.voiceType = '美'

    wx.getStorage({
      key: 'voiceType',
      success(res) {
        that.globalData.voiceType = res.data
      }
    })

    this.globalData.needRefreshTodayCard = true
    this.globalData.needRefreshPracticeCard = true
    this.globalData.needRefreshCalendarData = true
    this.globalData.needRefreshReviewData = true


    // 设置全局变量
    let sysInfo = wx.getSystemInfoSync() 
    let theme = sysInfo.theme
    this.globalData.theme = theme
    let statusBarHeight = sysInfo.statusBarHeight
    let titleBarHeight = sysInfo.platform == 'android' ? 48 : 44
    let navigationBarHeight = statusBarHeight + titleBarHeight
    this.globalData.navigationBarHeight = navigationBarHeight

    let searchBarTop = wx.getMenuButtonBoundingClientRect().top;
    this.globalData.searchBarTop = searchBarTop

    let searchBarHeight = wx.getMenuButtonBoundingClientRect().height;
    this.globalData.searchBarHeight = searchBarHeight

    let todayDate = dateTools.formatDate(new Date(), 'yyyyMMdd') // 在整个项目中，date都是指的'yyyymmdd'格式的日期
    this.globalData.todayDate = todayDate

    this.globalData.currentTimeStamp = Date.parse(new Date())

    let windowWidth = sysInfo.windowWidth
    this.globalData.windowWidth = windowWidth
    this.globalData.windowHeight = sysInfo.windowHeight
    this.globalData.windowWidth = sysInfo.windowWidth

    let scrollViewHeight = sysInfo.windowHeight - navigationBarHeight - 55
    this.globalData.scrollViewHeight = scrollViewHeight

    let practiceViewHeight = sysInfo.windowHeight - navigationBarHeight
    this.globalData.practiceViewHeight = practiceViewHeight
  },

  /**
   * 初始化函数，从服务器上拉取数据
   * 
   * @param {}  无需参数
   * @setData {senInfo, userInfo, userWordCardToday}  更新数据
   */
  initServerData() {
    let that = this

    // todo: 这里应该是从服务器上拿到的数据
    this.globalData.cardIdMap = {
      "a": 'b'
    }

    this.globalData.loading = false
    this.globalData.wordCardArr = {}
    this.globalData.createDateCardMap = {}
    this.globalData.reviewDateCardMap = {}
  },

  loadFontFace() {
    wx.loadFontFace({
      global: true, // 版本 2.10.0 后 全局app.js 使用
      family: "Noto Sans",
      source: 'url("https://cdns.qdu.life/font/NotoSans.woff")', // 不是真的链接
      success: (res) => {
        // console.log("font " + res.status)
      }
    });
  },

  onThemeChange: function (e) {
    this.globalData.theme = e.theme
  },
})