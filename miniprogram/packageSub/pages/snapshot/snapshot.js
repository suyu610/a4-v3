// pages/snapshot/snapshot.js
const app = getApp()
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
    console.log(e)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.loadFontFace({
      family: 'Inter',
      source: 'https://cdns.qdu.life/a4/font/Inter.ttf',
    })

    ///  解析数据
    let styleData = {}
    styleData = {
      "width": "933px",
      "height": "1366px",
      "background": "#f8f8f8",
      "views": [{
        "type": "image",
        "url": "https://cdns.qdu.life/a4/snapshot/bg_2@x3.png",
        "css": {
          "width": "933px",
          "height": "1366px",
          "top": "0px",
          "left": "0px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "scaleToFill"
        }
      }, ]
    }
    const today = new Date()
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1);
    // 本月第一天是周几
    let startIndex = firstDayOfMonth.getDay()
    // 本月的天数
    let dayCount = this.mGetDate() + startIndex
    // 今天是第几天
    let curIndex = today.getDate()

    let data = [0, 1, 2, 3, 0, 0, 1, 2, 3, 0, 1, 2, 3, 3, 3, 1, 2, 3, 3, 0, 1, 2, 3, 3, 0, 1, 2, 3, 3, 3]

    let progressInfo = app.globalData.studyRecordInfo

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
  },

  drawBottomProgressInfo: function (bottomProgressInfo, styleData) {
    styleData['views'].push({
      "type": "text",
      "text": bottomProgressInfo['newCard'].toString(),
      "css": {
        "color": "#000",
        "top": "1176px",
        "left": bottomProgressInfo['newCard'] >= 100 ? "276px" : bottomProgressInfo['newCard'] >= 10 ? "300px" : "310px",
        "fontSize": "44px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "right",
      }
    })
    styleData['views'].push({
      "type": "text",
      "text": bottomProgressInfo['reviewCard'].toString(),
      "css": {
        "color": "#000",
        "top": "1176px",
        "left": bottomProgressInfo['reviewCard'] >= 100 ? "714px" : bottomProgressInfo['reviewCard'] >= 10 ? "740px" : "750px",
        "fontSize": "44px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
      }
    })
    styleData['views'].push({
      "type": "text",
      "text": bottomProgressInfo['studyTime'].toString(),
      "css": {
        "color": "#000",
        "top": "1376px",
        "left": bottomProgressInfo['studyTime'] >= 100 ? "250px" : bottomProgressInfo['studyTime'] >= 10 ? "290px" : "317px",
        "fontSize": "44px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
      }
    })
    styleData['views'].push({
      "type": "text",
      "text": bottomProgressInfo['practiceCount'].toString(),
      "css": {
        "color": "#000",
        "top": "1376px",
        "left": bottomProgressInfo['practiceCount'] >= 100 ? "714px" : bottomProgressInfo['practiceCount'] >= 10 ? "740px" : "750px",
        "fontSize": "44px",
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
      }
    })
    return styleData;
  },
  drawDate: function (dateStr, styleData) {
    styleData['views'].push({
      "type": "text",
      "text": dateStr,
      "css": {
        "color": "#000",
        "top": "284px",
        "left": "90px",
        "fontSize": "46px",
        "fontWeight": "normal",
        "fontFamily": 'Inter',
        "textAlign": "right",
      }
    })
    return styleData
  },
  drawProgressInfo: function (progressInfo, styleData) {
    console.log(progressInfo)
    styleData['views'].push({
      "type": "text",
      "text": progressInfo.yearDayCount.toString(),
      "css": {
        "color": "#000",
        "top": "70px",
        "left": progressInfo.yearDayCount >= 100 ? "210px" : progressInfo.yearDayCount >= 10 ? "240px" : "254px",
        "fontSize": "64px",
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
        "top": "70px",
        "left": progressInfo.monthDayCount >= 100 ? "450px" : progressInfo.monthDayCount >= 10 ? "480px" : "494px",
        "fontSize": "64px",
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
        "top": "70px",
        "left": progressInfo.lastDayCount >= 100 ? "700px" : progressInfo.lastDayCount >= 10 ? "730px" : "744px",
        "fontSize": "64px",
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
        "width": "150px",
        "height": "150px",
        "top": "60px",
        "left": "50px",
        "rotate": "0",
        "borderRadius": "75px",
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
          "width": data[index - startIndex] == 3 ? "21px" : "9px",
          "height": "9px",
          "top": 547 + 108 * parseInt(index / 7) + "px",
          "left": (data[index - startIndex] == 3 ? 118 : 122) + 114 * (index % 7) + "px",
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
          "top": 497 + 108 * parseInt(index / 7) + "px",
          "left": 109 + 114 * (index % 7) + "px",
          "fontSize": "34px",
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