// pages/snapshot/snapshot.js
const app = getApp()
let radio = 0.66
import {
  Progress
} from '../../../models/progress'

const progressApi = new Progress()

const cavasPosArr = [
  [{
      "top": "",
      "left": ""
    },
    {
      "top": "",
      "left": ""
    },
    {
      "top": "",
      "left": ""
    }
  ]
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cavasPosArr: cavasPosArr,
    calendarDateArr: ["", "double", "orange", "blue", "", "double", "orange"],
    styleData: {}
  },

  onImgOK(e) {
    this.setData({
      imgUrl: e.detail.path
    })
  },

  preview() {
    wx.previewImage({
      urls: [this.data.imgUrl],
    })
  },

  shareTimeline() {

  },
  onShareTimeline: function () {
    return {
      title: '来看看我的学习记录吧~',
      //query: 'id=-1'
      imageUrl: this.data.imgUrl,
      query: {
        id: 1
      }

    }
  },
  // 获取当月天数
  mGetDate: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  didShow: function (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const today = new Date()
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1);
    // 本月第一天是周几
    let startIndex = firstDayOfMonth.getDay()
    // 本月的天数
    let dayCount = that.mGetDate() + startIndex
    // 今天是第几天
    let curIndex = today.getDate()

    progressApi.getProgressByMonth(app.globalData.todayMonthDate).then(function (e) {
      console.log(e)

      let data = []
      console.log(dayCount)
      for (var i = startIndex; i < dayCount; i++) {
        let todayStr = parseInt(i - startIndex + 1) < 10 ? ("0" + (i - startIndex + 1)) : (i - startIndex + 1)
        todayStr = app.globalData.todayMonthDate + todayStr
        if (e.hasOwnProperty(todayStr)) {
          data.push(e[todayStr].status)
        } else {
          data.push(0)
        }
      }
      ///  解析数据
      let styleData = {}
      styleData = {
        "width": 933 * radio + "px",
        "height": 1366 * radio + "px",
        "background": "#f8f8f8",
        "borderRadius": 50 * radio + "px",
        "views": [{
          "type": "image",
          "url": "https://cdns.qdu.life/a4/snapshot/bg_3@x2.png",
          "css": {
            "width": 933 * radio + "px",
            "height": 1366 * radio + "px",
            "top": "0px",
            "left": "0px",
            "rotate": "0",
            "borderRadius": 50 * radio + "px",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "mode": "scaleToFill"
          }
        }, ]
      }



      let progressInfo = app.globalData.studyRecordInfo
      if (progressInfo == null) {
        progressInfo = {
          yearDayCount: 0,
          monthDayCount: 0,
          lastDayCount: 0
        }
      }
      let bottomProgressInfo = {
        "newCard": 222,
        "reviewCard": 2,
        "studyTime": 18,
        "practiceCount": 14
      }

      styleData = that.fillDay(startIndex, dayCount, curIndex, styleData)
      styleData = that.fillDot(startIndex, dayCount, data, curIndex, styleData)
      styleData = that.drawAvatar(styleData)
      styleData = that.drawProgressInfo(progressInfo, styleData)
      // styleData = that.drawBottomProgressInfo(bottomProgressInfo, styleData)

      // styleData = that.drawDate(today.toLocaleString('en', {  year: "numeric", month: "short", day: "numeric" }), styleData)
      let dateStr = today.toDateString()
      let d = dateStr.split(' ');
      dateStr = d[1] + '. ' + d[2] + ' ' + d[3]
      styleData = that.drawDate(dateStr, styleData)
      that.setData({
        styleData
      })

      // wx.loadFontFace({
      //   global: true,
      //   family: 'Inter',
      //   scopes: ['webview', 'native'],
      //   source: 'https://cdns.qdu.life/a4/font/Inter.ttf',
      //   success(res) {
      //     that.setData({
      //       styleData
      //     })
      //   }
      // })

    })
  },


  drawDate: function (dateStr, styleData) {
    styleData['views'].push({
      "type": "text",
      "text": dateStr,
      "css": {
        "color": "#000",
        "top": 284 * radio + "px",
        "left": 90 * radio + "px",
        "fontSize": 46 * radio + "px",
        "fontWeight": "normal",
        "fontFamily": 'Inter',
        "textAlign": "right",
      }
    })
    return styleData
  },
  drawProgressInfo: function (progressInfo, styleData) {
    styleData['views'].push({
      "type": "text",
      "text": progressInfo.yearDayCount.toString(),
      "css": {
        "color": "#000",
        "top": 70 * radio + "px",
        "left": progressInfo.yearDayCount >= 100 ? 210 * radio + "x" : progressInfo.yearDayCount >= 10 ? 240 * radio + "px" : 254 * radio + "px",
        "fontSize": 64 * radio + "px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "right",
      }
    })
    styleData['views'].push({
      "type": "text",
      "text": progressInfo.monthDayCount.toString(),
      "css": {
        "color": "#000",
        "top": 70 * radio + "px",
        "left": progressInfo.monthDayCount >= 100 ? 450 * radio + "px" : progressInfo.monthDayCount >= 10 ? 480 * radio + "px" : 494 * radio + "px",
        "fontSize": 64 * radio + "px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
      }
    })
    styleData['views'].push({
      "type": "text",
      "text": progressInfo.lastDayCount.toString(),
      "css": {
        "color": "#000",
        "top": 70 * radio + "px",
        "left": progressInfo.lastDayCount >= 100 ? 700 * radio + "px" : progressInfo.lastDayCount >= 10 ? 730 * radio + "px" : 744 * radio + "px",
        "fontSize": 64 * radio + "px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
      }
    })
    return styleData
  },
  drawAvatar: function (styleData) {
    let url = "/images/avatar.png"
    if (app.globalData.userBaseInfo) {
      url = app.globalData.userBaseInfo.avatarUrl
    }

    styleData['views'].push({
      "type": "image",
      "url": url,
      "css": {
        "width": 150 * radio + "px",
        "height": 150 * radio + "px",
        "top": 60 * radio + "px",
        "left": 50 * radio + "px",
        "rotate": "0",
        "borderRadius": 75 * radio + "px",
        "borderWidth": "",
        "borderColor": "#000000",
        "shadow": "",
        "mode": "auto"
      }
    })
    return styleData
  },
  fillDot: function (startIndex, dayCount, data, curIndex, styleData) {
    for (let index = 0; index < 35; index++) {
      if (index < startIndex) continue
      if (index > dayCount + 1) continue
      if (index - startIndex > data.length) continue
      if ((index - startIndex + 1) > curIndex) continue
      let url = "/images/"
      switch (data[index - startIndex]) {
        case 0:
          continue;
        case 1:
          url += "blue.png"
          break;
        case 2:
          url += "orange.png"
          break;
        case 3:
          url += "double.png"
          break;
        default:
          continue;
      }

      styleData['views'].push({
        "type": "image",
        "url": url,
        "css": {
          "width": data[index - startIndex] == 3 ? 21 * radio + "px" : 9 * radio + "px",
          "height": 9 * radio + "px",
          "top": radio * (547 + 108 * parseInt(index / 7)) + "px",
          "left": radio * ((data[index - startIndex] == 3 ? 118 : 122) + 114 * (index % 7)) + "px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "auto"
        }
      })
    }
    return styleData
  },

  /**
   * 生成日历组件中的日期
   * @param {*} startIndex  该月的一号是从周几开始的，周日为0，
   * @param {*} dayCount  该月有多少天
   * @param {*} styleData 
   */
  fillDay: function (startIndex, dayCount, curIndex, styleData) {
    for (let index = 0; index < 35; index++) {
      if (index < startIndex) continue
      if (index > dayCount + 1) continue
      styleData['views'].push({
        "type": "text",
        "text": (index - startIndex + 1).toString(),
        "css": {
          "color": (index - startIndex + 1) > curIndex ? "#C9CDD4" : (index - startIndex + 1) == curIndex ? "#4C34F0" : "#000",
          "top": radio * (497 + 108 * parseInt(index / 7)) + "px",
          "left": radio * (109 + 114 * (index % 7)) + "px",
          "fontSize": 34 * radio + "px",
          "fontWeight": "bold",
          "fontFamily": "Inter",
          "textAlign": "center",
          // "textDecoration": (index - startIndex + 1) == curIndex ? "overline" : ""
        }
      })
    }
    return styleData
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})