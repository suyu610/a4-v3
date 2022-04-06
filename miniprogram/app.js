// app.js
import * as dateTools from './utils/dateTools'
import * as cacheUtil from './utils/cacheUtil'
import {
  Websocket
} from "./utils/wsUtil"

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
  globalData: {
    websocketUrl: "ws://" + "localhost" + ":5678"
  },
  onLaunch: function () {
    var that = this;
    // this.socketInit()

    // this.loadFontFace();
    this.initSystemData();
    this.initSystemCache();
    this.initFont();
  },
  onShow() {
    // this.linkWebsocket()
  },

  // 建立连接
  linkWebsocket() {
    this.websocket.initWebSocket({
      url: this.globalData.websocketUrl,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log("linkWebsocket err", err)
      }
    })
  },
  /**
   * 创建websocket对象
   */
  socketInit() {
    // 创建websocket对象
    this.websocket = new Websocket({
      // true代表启用心跳检测和断线重连
      heartCheck: false,
      isReconnection: true
    });
    // 建立连接
    // 监听websocket状态
    this.websocket.onSocketClosed({
      url: this.globalData.websocketUrl,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log("onSocketClosed err", err)
      }
    })

    // 监听网络变化
    this.websocket.onNetworkChange({
      url: this.globalData.websocketUrl,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log("onNetworkChange err", err)
      }
    })

    // 监听服务器返回
    this.websocket.onReceivedMsg(result => {
      console.log('app.js收到服务器内容：' + result.data);
      // 要进行的操作
    })
  },

  // 向其他页面暴露当前websocket连接
  getSocket() {
    return this.websocket;
  },


  initFont() {

  },

  initSystemCache: function () {

  },

  initSystemData: function () {
    let that = this
    innerAudioContext = wx.createInnerAudioContext({
      // useWebAudioImplement: true
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

    let scrollViewHeight = sysInfo.windowHeight - navigationBarHeight
    this.globalData.scrollViewHeight = scrollViewHeight

    let practiceViewHeight = sysInfo.windowHeight - navigationBarHeight
    this.globalData.practiceViewHeight = practiceViewHeight
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