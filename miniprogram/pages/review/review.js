// pages/review/review.js
const app = getApp()
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
    reviewNextPageLoading: false,
    calendarNextPageLoading: false,
    allSelectMode: false,
    backFromPrctice: false,
    showPracticeSheetValue: false,
    practiceModeActions: [{
        name: '记忆模式'
      }, {
        name: '复习模式'
      },
      {
        name: '拼写模式'
      },
    ],
    // 跟分页有关
    currentReviewPageIndex: 1,
    reviewHasNextPage: false,
    reviewTotalCardNum: 0,
    calendarPageIndex: 1,
    calendarHasNextPage: false,
    calendarTotalCardNum: 0,

    checkedCardArr: [],
    showDictPopup: false,
    activeTabIndex: 0,
    showFilterSheetValue: false,
    currentFilterSheetIndex: 0,
    filterSheetActionsArr: filterSheetActionsArr,
    loading: true,
    actions: [{
        name: '现在复习',
      }, {
        name: '5分钟内复习',
      },
      {
        name: '30分钟内复习',
      },
      {
        name: '12小时内复习',
      }, {
        name: '大于1天',
      }
    ],
    showBottomShadow: false,
    reviewWordCardArr: [],
    dateWordCardArr: [],
    chosenYear: 0,
    chosenMonth: 0,
    chosenDay: 0,
    hasGetCalendarInitDate: false
  },


  /**
   * 全选
   */
  selectAll(e) {
    let from = e.currentTarget.dataset.from
    let allSelectMode = this.data.allSelectMode
    let allCard = []
    let checkedCardArr = []
    if (!allSelectMode) {
      if (from == 'review') {
        allCard = this.data.reviewWordCardArr
      } else {
        allCard = this.data.dateWordCardArr
      }
      if (allCard.length >= 20) {
        wx.showToast({
          icon: 'none',
          title: '最大数量为20张卡片',
        })
      }

      allCard.forEach(e => {
        checkedCardArr.push(e)
      })
    }

    this.setData({
      checkedCardArr,
      allSelectMode: !allSelectMode
    })
  },

  /**
   * 点击单词事件
   * 
   * @param {}  无需参数
   * @setData {showPopup}  显示搜索框
   */
  onWord: function (e) {
    let cardId = e.detail.cardId
    let dictCode = e.detail.dictCode
    let that = this
    resource.getWordInfo(e.detail.wordName).then(function (e) {
      that.setData({
        currentCardId: cardId,
        currentDictCode: dictCode,
        curWord: e,
        showSearchBar: false,
        showDictPopup: true,
        searchWordInputValue: "",
        showOverlay: false,
        dictNoFooterMode: false
      })

      // 隐藏tabBar
      that.getTabBar().setData({
        show: false
      })
    })
  },

  /**
   * 隐藏遮罩事件
   * 
   * @param {}  无需参数
   * @setData {showOverlay, showSearchBar, showSearchBar}  显示搜索框
   */
  onClickHideOverlay: function () {
    let that = this
    // 更新数据
    this.setData({
      showOverlay: false,
      showSearchBar: false,
      showDictPopup: false
    })

    setTimeout(() => {
      // 显示tabBar
      that.getTabBar().setData({
        show: true
      })
    }, 200);
  },

  /**
   * 搜索事件
   * 
   * @param {}  无需参数
   * @setData {showSearchBar}  显示搜索框
   */
  onSearch: function () {
    // 更新数据
    this.setData({
      showOverlay: true,
      showSearchBar: true,
    })

    // 隐藏tabBar
    this.getTabBar().setData({
      show: false
    })
  },

  /**
   * 键盘聚焦事件
   * 
   * @param {e}  事件内部参数
   * @setData {keyboardHeight}  显示搜索框
   */
  onKeyboardFocus: function (e) {
    this.setData({
      keyboardHeight: e.detail.height
    })
  },
  /**
   * 搜索框的值改变 
   */
  bindSearchWordKeyInput: function (e) {
    this.setData({
      searchWordInputValue: e.detail.value
    })
  },
  bindSearchWordKeyInputBlur: function (e) {
    this.bindSearchWordKeyInput(e)
    this.setData({
      keyboardHeight: 0
    })
  },


  onTapSearchWordBtn: function () {
    if (this.data.searchWordInputValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入单词',
      })
      return
    }
    let that = this

    wx.showLoading({
      title: '搜索中',
    })

    resource.getWordInfo(this.data.searchWordInputValue).then(function (e) {
        wx.hideLoading()
        that.setData({
          curWord: e,
          showSearchBar: false,
          showDictPopup: true,
          searchWordInputValue: "",
          showOverlay: false,
          dictNoFooterMode: true,
          dictLoading: false
        })
      }),
      function () {
        //  无单词
        that.setData({
          curWord: null,
          showSearchBar: true,
          showDictPopup: false,
          showOverlay: true,
          dictNoFooterMode: false,
          dictLoading: false
        })
      }
  },

  hideTabbar() {
    // 隐藏tabBar
    this.getTabBar().setData({
      show: false
    })
  },
  showTabBar() {
    this.getTabBar().setData({
      show: true
    })
  },

  /**
   * 跳转到练习页
   * 
   * @param {}  无需参数
   * @toPage practice.index  跳转到练习页
   */
  onPractice: function () {
    // 传参
    if (this.data.checkedCardArr.length == 0) return
    // 增加复习模式
    this.hideTabbar()
    this.setData({
      showPracticeSheetValue: true
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

  onClosePracticeSheet() {
    this.showTabBar()
    this.setData({
      showPracticeSheetValue: false
    })
  },

  jumpToSpellPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../spell/spell?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },
  jumpToPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../practice/practice?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },

  /*
   * 接收日历发来的改变日期信号
   **/
  changeChosenDate: function (e) {
    let that = this
    let date;
    // 说明是手动选择的日期
    if (e != null) {
      date = e.detail
      if (date.month < 10) {
        date.month = "0" + date.month
      }
      if (date.day < 10) {
        date.day = "0" + date.day
      }
      this.setData({
        chosenYear: date.year,
        chosenMonth: date.month,
        chosenDay: date.day,
        chosenIndex: parseInt(date.day) - 1
      })

      let dataStr = date.year.toString() + date.month.toString() + date.day
      console.log(dataStr)
      // let calendarPageIndex = this.data.calendarPageIndex

      cardApi.getCardArrByDate(dataStr, 1).then(function (e) {
        that.setData({
          dateWordCardArr: e.list,
          calendarPageIndex: e.pageNum,
          calendarHasNextPage: e.hasNextPage,
          calendarTotalCardNum: e.total
        })
      })
    }

    // 说明是默认的天
    if (date == null) {
      let today = app.globalData.todayDate
      this.setData({
        chosenYear: today.substring(0, 4),
        chosenMonth: today.substring(4, 6),
        chosenDay: today.substring(6, 8),
        chosenIndex: parseInt(today.substring(6, 8)) - 1
      })
      let dataStr = today.substring(0, 4) + today.substring(4, 6) + today.substring(6, 8)
      let calendarPageIndex = this.data.calendarPageIndex
      cardApi.getCardArrByDate(dataStr, calendarPageIndex).then(function (e) {
        that.setData({
          dateWordCardArr: e.list,
          calendarPageIndex: e.pageNum,
          calendarHasNextPage: e.hasNextPage,
          calendarTotalCardNum: e.total
        })
      })
      return;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollViewHeight: app.globalData.scrollViewHeight,
      // reviewWordCardArr: cardDataTools.getNeedPracticeCardArr(-1),
    })
    let e = app.globalData.needReviewCard
    this.setData({
      reviewTotalCardNum: e.total,
      reviewWordCardArr: e.list,
      currentReviewPageIndex: e.pageNum,
      reviewHasNextPage: e.hasNextPage,
      loading: false
    })
  },

  /**
   * Tabs切换事件
   */
  onChangeTabbar(event) {
    let that = this
    this.setData({
      checkedCardArr: [],
      activeTabIndex: event.detail.index,
      allSelectMode: false
    })
    // 如果是切换到日历，则需要检查日期是否改变
    if (event.detail.index == 1 && app.globalData.needRefreshCalendarData) {
      this.changeChosenDate()
      progress.getProgressByMonth(this.data.chosenYear + this.data.chosenMonth).then(function (e) {
        that.setData({
          calendarData: e
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
      app.globalData.needRefreshCalendarData = false
    }

    if (event.detail.index == 0 && app.globalData.needRefreshReviewData) {
      // 初始化数据
      this.getMoreCalendarCard(1)
      app.globalData.needRefreshReviewData = false
    }
  },

  changeMonth: function (e) {
    let that = this
    let month = e.detail.month
    if (month < 10) {
      month = '0' + month
    }
    progress.getProgressByMonth(String(e.detail.year) + String(month)).then(function (e) {
      that.setData({
        calendarData: e
      })
    })
  },
  /**
   * 打开筛选sheet
   */
  onTapFilterBtn() {
    this.setData({
      showFilterSheetValue: !this.data.showFilterSheetValue
    })

    // 显示tabbar的时候，要慢一点
    if (!this.getTabBar().data.show) {
      setTimeout(() => {
        // 隐藏tabBar
        this.getTabBar().setData({
          show: true
        })
      }, 200);
    } else {
      this.getTabBar().setData({
        show: false
      })
    }
  },
  /**
   * 滑动事件
   */
  onScrollViewScroll(e) {
    if (e.detail.scrollTop >= 44) {
      this.setData({
        showBottomShadow: true
      })
    } else {
      this.setData({
        showBottomShadow: false
      })
    }
  },

  /**
   * 
   */
  onSelectFilterSheet: function (e) {
    let index = filterSheetActionsArr.indexOf(e.detail.name)

    this.setData({
      currentFilterSheetIndex: index,
      reviewWordCardArr: cardDataTools.getNeedPracticeCardArr(filterSheetActionsTimeArr[index])

    })
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


  /**
   * 删除卡片，同时要在选定词卡数组中也删除
   */
  deleteCard: function (e) {
    // 判断现在的tabbar位置
    let cardId = e.detail.cardId
    let reviewWordCardArr = this.data.reviewWordCardArr
    let dateWordCardArr = this.data.dateWordCardArr
    let checkedCardArr = this.data.checkedCardArr

    let newReviewWordCardArr = reviewWordCardArr.filter(function (e) {
      if (e.cardId == cardId) {
        return false;
      } else {
        return true;
      }
    })

    let newDateWordCardArr = dateWordCardArr.filter(function (e) {
      if (e.cardId == cardId) {
        return false;
      } else {
        return true;
      }
    })

    // 删除选定的 checkedCardArr 
    let newCheckedCardArr = checkedCardArr.filter(function (e) {
      if (e.cardId == cardId) {
        return false;
      } else {
        return true;
      }
    })

    this.setData({
      dateWordCardArr: newDateWordCardArr,
      reviewWordCardArr: newReviewWordCardArr,
      checkedCardArr: newCheckedCardArr
    })
    // 
    wx.showToast({
      title: '删除成功',
      duration: 500
    })

    app.globalData.needRefreshTodayCard = true

  },


  refreshCard: function (e) {
    let that = this
    let deletedWordName = e.detail.word
    // this.init()
    console.log(e.currentTarget.dataset.cardid)
    let cardId = e.currentTarget.dataset.cardid
    // 调用子组件
    let id = '#card_' + cardId
    let id2 = '#cardc_' + cardId

    if (this.selectComponent(id) != null) {
      this.selectComponent(id).deleteCardWord(deletedWordName)
    }
    if (this.selectComponent(id2) != null) {
      this.selectComponent(id2).deleteCardWord(deletedWordName)
    }
    this.setData({
      showDictPopup: false,
    })

    that.getTabBar().setData({
      show: true
    })
  },


  replaceWord: function (e) {
    let that = this
    let oldWord = e.detail.word
    let newWord = e.detail.newWord
    let cardId = e.currentTarget.dataset.cardid
    // 调用子组件
    let id = '#card_' + cardId
    let id2 = '#cardc_' + cardId
    if (this.selectComponent(id) != null) {
      this.selectComponent(id).replaceCardWord(oldWord, newWord)
    }
    if (this.selectComponent(id2) != null) {
      this.selectComponent(id2).replaceCardWord(oldWord, newWord)
    }
    this.setData({
      showDictPopup: false,
    })

    that.getTabBar().setData({
      show: true
    })
    console.log(e)
  },



  /** 
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let fromRoute = currPage.data.fromRoute
    // 如果是从练习页退回来的，则要取消掉选定的数组
    if (fromRoute == "practice" && (app.globalData.needRefreshReviewData || app.globalData.needRefreshCalendarData)) {
      let progressArr = this.data.progressArr
      let chosenIndex = this.data.chosenIndex
      if (progressArr != null && chosenIndex != null) {
        progressArr[chosenIndex].practiceCount = progressArr[chosenIndex].practiceCount + 1
        this.setData({
          progressArr,
        })
      }
      this.setData({
        checkedCardArr: [],
        allChecked: false,
        allSelectMode: false,
        backFromPrctice: true
      })
    }

    if (app.globalData.needRefreshReviewData && this.data.activeTabIndex == 0) {
      // 判断当前在哪个tabbar
      // 复习页
      cardApi.getNeedReviewCard(1).then(e => {
        wx.hidenavigation-barLoading()
        wx.hideLoading()
        that.setData({
          reviewTotalCardNum: e.total,
          reviewWordCardArr: e.list,
          currentReviewPageIndex: e.pageNum,
          reviewHasNextPage: e.hasNextPage,
          loading: false
        })
        app.globalData.needRefreshReviewData = false
      })
    }

    if (app.globalData.needRefreshCalendarData && this.data.activeTabIndex == 1) {
      wx.hidenavigation-barLoading()
      wx.hideLoading()

      // 日历页
      this.getMoreCalendarCard(1)
      app.globalData.needRefreshCalendarData = false
    }

    this.setData({
      darkMode: app.globalData.theme == 'dark',
      targetCount: app.globalData.setting.targetCount
    })

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  
  getMoreReviewCard: function (pageIndex) {
    let that = this
    cardApi.getNeedReviewCard(pageIndex).then(e => {
      wx.hidenavigation-barLoading()
      wx.hideLoading()
      that.setData({
        reviewNextPageLoading: false,
        reviewTotalCardNum: e.total,
        reviewWordCardArr: that.data.reviewWordCardArr.concat(e.list),
        currentReviewPageIndex: e.pageNum,
        reviewHasNextPage: e.hasNextPage
      })
    })
  },

  getMoreCalendarCard(pageIndex) {
    wx.hideLoading()
    wx.hidenavigation-barLoading()

    let that = this
    let dateWordCardArr = []

    let dataStr = this.data.chosenYear + this.data.chosenMonth + this.data.chosenDay
    cardApi.getCardArrByDate(dataStr, pageIndex).then(function (e) {
      if (pageIndex == 1) {
        dateWordCardArr = e.list
      } else {
        dateWordCardArr = that.data.dateWordCardArr.concat(e.list)
      }
      that.setData({
        dateWordCardArr,
        calendarPageIndex: e.pageNum,
        calendarHasNextPage: e.hasNextPage,
        calendarTotalCardNum: e.total,
        calendarNextPageLoading: false
      })
    })
    return;
  },

  onReachBottom() {
    this.setData({
      backFromPrctice: false
    })
    if ((this.data.activeTabIndex == 0 && this.data.reviewNextPageLoading) || (this.data.activeTabIndex == 1 && this.data.calendarNextPageLoading)) {
      return;
    }
    // 如果是推荐复习页
    if (this.data.activeTabIndex == 0 && this.data.reviewHasNextPage) {
      wx.shownavigation-barLoading()
      this.setData({
        reviewNextPageLoading: true
      })
      this.getMoreReviewCard(this.data.currentReviewPageIndex + 1)
    } else {
      if (this.data.activeTabIndex == 1 && this.data.calendarHasNextPage) {
        wx.shownavigation-barLoading()
        this.setData({
          calendarNextPageLoading: true
        })
        this.getMoreCalendarCard(this.data.calendarPageIndex + 1)
      }
    }
  }
})