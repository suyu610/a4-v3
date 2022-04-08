// components/calendar/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calendarData: Object
  },
  observers: {
    'calendarData': function (data) {
      // this.calProgressWidth(data)
      this.toList(data)
    }
  },
  data: {
    targetCount: 30
  },

  lifetimes: {
    ready: function () {
      let curTime = new Date()
      let dateInfo = this.calMonthAndYear(curTime.getFullYear(), curTime.getMonth() + 1, '')
      let curYear = dateInfo.year
      let curMon = dateInfo.month
      let day = curTime.getDate()
      let curDay = day
      this.setData({
        darkMode: app.globalData.theme == 'dark',
        targetCount: app.globalData.setting.targetCount,
        curTime: curTime,
        curYear,
        curMon,
        curDay,
        chosenDate: {
          year: curYear,
          month: curMon,
          day
        },
        monthDayCount: dateInfo.monthDayCount,
        beginWeek: dateInfo.beginWeek
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    weekDayNameArr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    MonthStrArr: ["Jan.", "February", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
    chooseDate: "20220123",
    curYear: 0,
    curMon: 0,
    curDay: 0,
    curTime: null,
    monthDayCount: 0,
    beginWeek: 0,
    progressWidthArr: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toList: function (data) {
      let calendarStatusDataList = []
      for (let key in data) {
        let obj = data[key]
        calendarStatusDataList.push(obj.status)
      }
      this.setData({
        calendarStatusDataList
      })
    },
    calProgressWidth: function (data) {
      if (data == null) return
      let year = this.data.curYear
      let month = this.data.curMon
      if (month < 10) {
        month = '0' + month
      }
      let progressWidthArr = []

      for (let i = 1; i <= 31; i++) {
        let day = i
        if (day < 10) {
          day = '0' + day
        }
        let dateKey = String(year) + String(month) + String(day)
        if (dateKey in data) {
          let width = 100 * (data[dateKey].newWordCount / app.globalData.setting.targetCount)
          if (width > 100) width = 100
          progressWidthArr.push(width)
        } else {
          progressWidthArr.push(0)
        }
      }

      this.setData({
        progressWidthArr: progressWidthArr
      })
    },
    /*
     *  本月有多少天
     **/
    getDaysOfMonth: function (date) {
      var month = date.getMonth(); //注意此处月份要加1，所以我们要减一
      var year = date.getFullYear();
      return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    isLeapYear: function (year) {
      if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
      return false;
    },

    /*
     *  本月开始的星期
     **/
    getBeginDayOfMouth: function (date) {
      var month = date.getMonth();
      var year = date.getFullYear();
      var d = this.getDate(year, month, 1);
      return d.getDay();
    },

    /*
     *  拼接日期
     **/
    getDate: function (year, month, day) {
      return new Date(year, month - 1, day)
    },

    /*
     *  切换月份
     **/
    tapToggleMonthBtn: function (e) {
      wx.showToast({
        icon: 'none',
        title: '暂不支持切换月份',
      })
      // let direct = e.currentTarget.dataset.direct
      // let year = this.data.curYear
      // let month = this.data.curMon

      // let dateInfo = this.calMonthAndYear(year, month, direct)
      // this.setData({
      //   curYear: dateInfo.year,
      //   curMon: dateInfo.month,
      //   monthDayCount: dateInfo.monthDayCount,
      //   beginWeek: dateInfo.beginWeek
      // })
      // this.triggerEvent('changeMonth', dateInfo);
    },

    /*
     *  计算前后一个月，返回 年 和 月，天数，开始时间
     */
    calMonthAndYear: function (year, month, direct) {
      if (direct == "prev") {
        if (month == 1) {
          year = year - 1
          month = 12
        } else {
          month = month - 1
        }
      }

      if (direct == "next") {
        if (month == 12) {
          year = year + 1
          month = 1
        } else {
          month = month + 1
        }
      }

      let newDate = this.getDate(year, month, 1)
      return {
        year,
        month,
        monthDayCount: this.getDaysOfMonth(newDate),
        beginWeek: newDate.getDay(),
      }
    },

    /*
     * 改变选择的日期
     **/
    changeChosenDay: function (e) {
      let chosenIndex = e.currentTarget.dataset.index + 1
      let chosenDate = {
        year: this.data.curYear,
        month: this.data.curMon,
        day: chosenIndex
      }
      this.setData({
        chosenDate
      })

      // 向外部发送
      this.triggerEvent('changeChosenDate', chosenDate);
    },
  }
})