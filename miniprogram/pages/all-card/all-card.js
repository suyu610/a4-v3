// pages/new-word/index.js
const app = getApp()
const globalData = app.globalData
import router from '../../router/index'
import config from '../../config'
import {
  Card
} from '../../models/card.js'

const cardApi = new Card()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPracticeSheetValue: false,
    practiceModeActions: [{
        name: '记忆模式',
      }, {
        name: '复习模式',
      },
      {
        name: '拼写模式',
      },
    ],
    allSelectMode: false,
    loading: true,
    title: "全部卡片",
    currentPageIndex: 0,
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen
    showDropdownOverlay: true,
    checkedCardArr: [],
    cardList: [],
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    maxDate: new Date().getTime(),
    minDate: new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 3,
    showCalendar: false,
    dictOption: [{
      text: '选择词书',
      value: 0
    }],

    statusOption: [{
        text: '卡片状态',
        value: 0
      },
      {
        text: '未完成',
        value: 1
      },
      {
        text: '已完成',
        value: 2
      }
    ],

    dictValue: 0,
    statusValue: 0,
    dataRange: null
  },
  jumpToPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../practice/practice?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },

  onSelectPracticeSheet(e) {
    let nameStr = e.detail.name
    if (nameStr == '记忆模式') {
      this.jumpToPractice('memory')
      return
    }

    if (nameStr == '复习模式') {
      this.jumpToPractice('practice')
      return
    }

    if (nameStr == '拼写模式') {
      this.jumpToSpellPractice('spelling')
      return
    }
  },

  jumpToSpellPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../spell/spell?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },
  p(s) {
    return s < 10 ? '0' + s : s
  },

  onResetCalender() {
    this.selectComponent("#calendar").reset()
  },

  callConfirmCalendar() {
    this.selectComponent("#calendar").onConfirm();
  },



  onCloseCalendar() {
    this.selectComponent('#calendar-dropdown-item').toggle(false);

    this.setData({
      showDropdownOverlay: true,
      showCalendarValue: false
    })
  },

  onOpenCalendar() {

    this.setData({
      showDropdownOverlay: false,
      showCalendarValue: true
    })
  },
  onPractice: function () {
    if (this.data.checkedCardArr.length == 0) return
    // 增加复习模式
    this.setData({
      showPracticeSheetValue: true
    })
  },
  onClosePracticeSheet() {
    this.setData({
      showPracticeSheetValue: false
    })
  },
  onTapBottomBtn() {
    let wordlist = []
    if (this.data.mode == 'export' || this.data.mode == "listen") {
      let checkedCardArr = this.data.checkedCardArr
      checkedCardArr.forEach(card => {
        card.wordList.forEach(word => {
          if (!word.isDeleted) {
            wordlist.push(word.wordName)
          }
        });
      });
      console.log(wordlist)
      router.push({
        name: this.data.mode == 'export' ? "exportCardConfirm" : "listen",
        data: {
          wordlist
        }
      })
    } else {
      this.onPractice()
    }
  },

  onAllSelectBtnTapped: function () {
    let allSelectMode = this.data.allSelectMode

    let checkedCardArr = [] //this.data.checkedCardArr
    if (!allSelectMode) {
      this.data.cardList.forEach(e => {
        checkedCardArr.push(e)
      })
    }

    this.setData({
      allSelectMode: !allSelectMode,
      checkedCardArr
    })
  },
  getDate(filterConfig, pageIndex) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loadingMore: true,
    })

    let that = this
    let cardList = this.data.cardList
    console.log(pageIndex)
    cardApi.getAllCard(filterConfig, pageIndex).then(e => {
      wx.hideLoading()
      cardList = cardList.concat(e.list)
      that.setData({
        loading: false,
        loadingMore: false,
        cardList,
        currentPageIndex: e.pageNum,
        totalCardNum: e.total,
        hasNextPage: e.hasNextPage,
      })
    })
  },
  onLoad: function (options) {
    let that = this

    const data = router.extract(options);

    let filterConfig = {}
    this.setData({
      filterConfig,
      calendarDefaultToday: [new Date().getTime(), new Date().getTime()]
    })
    this.getDate(filterConfig, 0)


    if (data != null && data.mode != null) {
      this.setData({
        title: data.mode == "export" ? "导出卡片" : data.mode == "learn" ? "全部卡片" : "随身听",
        bottomBtnTitle: data.mode == "export" ? "导出卡片" : data.mode == "learn" ? '开始学习' : "开始随身听",
        mode: data.mode
      })
    }

    let progressList = app.globalData.progressList
    this.setData({
      movable_y: app.globalData.windowHeight - 70,
      movable_x: (app.globalData.windowWidth - 125) / 2,
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      loading: false,
      progressList,
      windowWidth: app.globalData.windowWidth
    })

    let dictOption = this.data.dictOption
    for (var key in progressList) {
      console.log(key)
      console.log(config.dictInfo[key])
      if (config.dictInfo[key] != null) {
        dictOption.push({
          text: config.dictInfo[key].name,
          value: key
        })
      }
    }

    this.setData({
      dictOption
    })

  },
  // 切换日历配置
  onConfirmCalendar(e) {
    const firstDate = new Date(e.detail[0])
    const secondDate = new Date(e.detail[1])
    let resDate = this.p((firstDate.getMonth() + 1)) + '/' + this.p(firstDate.getDate()) + "后"

    if (e.detail[1] != null) {
      resDate = this.p((firstDate.getMonth() + 1)) + '/' + this.p(firstDate.getDate()) + '-' + this.p((secondDate.getMonth() + 1)) + '/' + this.p(secondDate.getDate())
    }

    this.setData({
      dataRange: resDate
    })
    let config = this.data.filterConfig
    config['startDate'] = e.detail[0]
    config['endDate'] = e.detail[1]
    this.setData({
      cardList: [],
      loading: true
    })
    this.getDate(config, 0)
    this.onCloseCalendar()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
    if (this.data.hasNextPage) {
      console.log("has Next Page")
      let pageIndex = this.data.currentPageIndex + 1
      this.getDate(this.data.filterConfig, pageIndex)
    } else {
      console.log("not next page")
    }
  },
  changeStatusOption(e) {
    console.log("切换状态")
    let newStatusValue = e.detail
    if (this.data.statusValue != newStatusValue) {
      // 
      console.log("改变了状态")
      // -1 是全部
      // 0 是未完成
      // 1 是已完成
      let config = this.data.filterConfig
      config['cardStatus'] = newStatusValue
      this.setData({
        cardList: [],
        loading: true,
        statusValue: newStatusValue
      })
      this.getDate(config, 0)
    }
  },

  changeDictOption(e) {
    let newDictValue = e.detail
    if (newDictValue != this.data.dictValue) {
      let config = this.data.filterConfig
      config['bookCode'] = newDictValue
      this.setData({
        cardList: [],
        loading: true,
        dictValue: newDictValue
      })
      this.getDate(config, 0)
    }
  },
  /**
   * 切换卡片选中状态
   */
  cardChecked: function (e) {
    let isPush = e.detail.isPush
    let card = e.detail.card
    let checkedCardArr = this.data.checkedCardArr
    let _checkedCardArr = []
    if (isPush) {
      checkedCardArr.push(card)
      _checkedCardArr = checkedCardArr
    } else {
      _checkedCardArr = checkedCardArr.filter(function (e) {
        if (e.cardId == card.cardId) {
          return false;
        } else {
          return true;
        }
      })
    }
    this.setData({
      checkedCardArr: _checkedCardArr
    })
  },
})