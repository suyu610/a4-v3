// pages/index/index.js
const app = getApp()

// 导入资源接口与用户接口
import * as debugTools from '../../utils/debugTools'
import * as cardDataTools from '../../utils/cardDataTools'
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
import router from '../../router/index'

const user = new User()
const resource = new Resource()
const cardApi = new Card()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // planTimeColumn: ['杭州', '宁波', '温州', '嘉兴', '湖州'],

    planTimeColumn: ["10", "15", "20", "30 (当前)", "40", "50", "60", "70", "80", "90", "100", "150", "200"],
    showPlanTimeColumnValue: false,
    showGuide: false,
    appearDict: {},
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
    loading: true,
    senInfo: {},
    userInfo: {},
    todayCards: [],
    checkedCardArr: [],
    latestCardId: "",
    searchWordInputValue: "",
    showDictPopup: false,
    dictNoFooterMode: false,
  },

  onOpenPlanTimeColumn() {
    this.setData({
      showPlanTimeColumnValue: true
    })
  },
  onClosePlanTimeColumn() {
    this.setData({
      showPlanTimeColumnValue: false
    })
  },
  tapGuide() {
    this.setData({
      showGuide: false
    })
    wx.setStorage({
      key: 'hasShowGuide',
      data: true
    })
  },

  jump2TodayStudy() {
    router.push({
      name: 'todayStudy'
    })
  },

  jump2TodayReview() {
    router.push({
      name: 'todayReview'
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

  /**
   * 删除卡片，同时要在选定词卡数组中也删除
   */
  deleteCard: function (e) {
    let cardId = e.detail.cardId
    let todayCards = this.data.todayCards
    let checkedCardArr = this.data.checkedCardArr

    let newtodayCards = todayCards.filter(function (e) {
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
      todayCards: newtodayCards,
      checkedCardArr: newCheckedCardArr
    })
    // 
    wx.showToast({
      title: '删除成功',
      duration: 500
    })
    app.globalData.needRefreshReviewData = true
    app.globalData.needRefreshCalendarData = true
  },

  /**
   * 添加卡片事件
   * 
   * @param {}  无需参数
   * @setData {userWordCardToday}  更新数据
   */
  async onAddCard() {
    // 如果没有选定词书，则弹出警告
    if (app.globalData.currentDicCode == null || app.globalData.currentDicCode == '') {
      wx.showToast({
        icon: 'none',
        title: '还未选择词书',
      })
      return
    }

    // 防止多次点击
    if (this.data.todayCards.length != 0 && this.data.todayCards[this.data.todayCards.length - 1].cardId == -1) {
      wx.showLoading({
        title: '添加卡片中',
      })
      return
    }

    let that = this;
    wx.showToast({
      icon: 'none',
      title: '新增单词卡片\r\n《' + config.dictInfo[app.globalData.currentDicCode].name + '》',
      duration: 500
    })

    // 占位用的空的卡片
    let emptyNewCard = {
      dictCode: "0301",
      progress: [],
      cardId: -1,
      wordList: [],
      loading: true,
      loadingAddCard: true
    }

    if (this.data.todayCards.length == 0) {
      this.setData({
        loadingAddCard: true,
        [`todayCards`]: [emptyNewCard],
      })
    } else {
      let todayCards = this.data.todayCards
      todayCards.push(emptyNewCard)
      this.setData({
        loadingAddCard: true,
        todayCards
      })
    }
    that.setData({
      latestCardId: -1
    })

    // 从服务器拉取今日卡片  
    var p = cardApi.genNewCard()
    p.then(function (fetchNewCard) {
        let todayCards = that.data.todayCards
        // Check: 是否卡片为空 
        todayCards.forEach(e => {
          if (e.cardId == -1) {
            e.dictCode = fetchNewCard.dictCode
            e.cardId = fetchNewCard.cardId
            e.progress = null
            e.loading = false
            e.wordList = fetchNewCard.wordList
            return;
          }
        })
        // 处理一下progressList
        let progressList = that.data.progressList
        progressList[that.data.currentDicCode] = progressList[that.data.currentDicCode] + 5
        that.setData({
          loadingAddCard: false,
          todayCards,
          progressList
        })

        setTimeout(() => {
          console.log(app.globalData.needReviewCard.total)
          if (app.globalData.showGuide && app.globalData.needReviewCard.total == 0) {
            that.setData({
              showGuide: true
            })
            app.globalData.showGuide = false
          }
        }, 500);


        app.globalData.todayCards = todayCards
        app.globalData.needRefreshCalendarData = true
        app.globalData.needRefreshReviewData = true
      },
      function (e) {
        // 背完了就要删除掉-1的卡片
        let todayCards = that.data.todayCards
        todayCards.pop()
        that.setData({
          loadingAddCard: false,
          todayCards
        })
        console.log("背完了")
      }
    )
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

    })

  },

  /**
   * 路由到词典页面事件
   * @param {}  无需参数
   * @toMethod wx.navigateTo()  路由到词典页面
   */
  onNaviToDictionary: function () {
    wx.navigateTo({
      url: '../dictionary/dictionary',
    })
  },


  /**
   * 生命周期函数: 监听页面显示
   * 
   * @param {}  无需参数
   * @toMethod 
   */
  onShow() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let fromRoute = currPage.data.fromRoute
    // 如果是从练习页退回来的，则要取消掉选定的数组
    if (fromRoute == "practice") {
      this.setData({
        checkedCardArr: [],
        allChecked: false
      })
    }

    if (app.globalData.needRefreshTodayCard) {
      this.init()
    }
    this.setData({
      darkMode: app.globalData.theme == 'dark'
    })

  },

  init() {
    let that = this
    resource.getInitData().then(e => {
      app.globalData.progressList = e.progressList
      app.globalData.currentDicCode = e.currentDicCode
      app.globalData.senInfo = e.sentence
      app.globalData.todayCards = e.todayCards.list
      app.globalData.setting = e.setting
      app.globalData.deletedCardCount = e.deletedCardCount
      app.globalData.markWordCount = e.markWordCount
      that.setData({
        senInfo: e.sentence,
        loading: false,
        progressList: e.progressList,
        currentDicCode: e.currentDicCode,
        currentPageIndex: e.todayCards.pageNum,
        totalCardNum: e.todayCards.total,
        todayCards: e.todayCards.list,
        hasNextPage: e.todayCards.hasNextPage
      })
    })
    app.globalData.needRefreshTodayCard = false
  },


  getMoreTodayDate: function (indexPage) {
    let that = this
    cardApi.genTodayCard(indexPage).then(e => {
      wx.hideNavigationBarLoading()
      that.setData({
        currentPageIndex: e.pageNum,
        totalCardNum: e.total,
        todayCards: that.data.todayCards.concat(e.list),
        hasNextPage: e.hasNextPage
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.setData({
        hasNextPage: false
      })
      wx.showNavigationBarLoading()
      // console.log("has Next Page")
      let indexPage = this.data.currentPageIndex + 1
      this.getMoreTodayDate(indexPage)
    }
  },

  refreshCard: function (e) {
    let that = this
    let deletedWordName = e.detail.word
    let cardId = e.currentTarget.dataset.cardid
    // 调用子组件
    let id = '#card_' + cardId
    this.selectComponent(id).deleteCardWord(deletedWordName)
    this.setData({
      showDictPopup: false,
    })


  },

  replaceWord: function (e) {
    let that = this
    let oldWord = e.detail.word
    let newWord = e.detail.newWord
    let cardId = e.currentTarget.dataset.cardid
    // 调用子组件
    let id = '#card_' + cardId
    this.selectComponent(id).replaceCardWord(oldWord, newWord)
    this.setData({
      showDictPopup: false,
    })

  },
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "来体验A4纸背单词的方法吧", // 默认是小程序的名称(可以写slogan等)
      imageUrl: '../../images/share.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
    // 返回shareObj
    return shareObj;
  },
  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '来体验A4纸背单词的方法吧',
      imageUrl: '../../images/share.png'
    }
  },
  /** 
   * 生命周期函数: 监听页面加载
   * 
   * @param {}  无需参数
   * @toMethod 转入初始化函数 this.init()  
   */
  onLoad: function () {
    // this.init()
    let e = app.globalData.todayInitData
    console.log("searchBarTop", app.globalData.searchBarTop)
    this.setData({
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      scrollViewHeight: app.globalData.scrollViewHeight,
      senInfo: e.sentence,
      loading: false,
      progressList: e.progressList,
      currentDicCode: e.currentDicCode,
      currentPageIndex: e.todayCards.pageNum,
      totalCardNum: e.todayCards.total,
      todayCards: e.todayCards.list,
      hasNextPage: e.todayCards.hasNextPage,
      windowWidth: app.globalData.windowWidth
    })

    app.globalData.needRefreshTodayCard = false
  },

  /**
   * 下拉刷新函数
   * 
   * @param {}  无需参数
   * @toMethod this.init()  转入初始化函数
   */
  onScrollViewRefresh: async function () {
    this.onSearch()
    this.setData({
      refresherTriggered: false
    })
  },


  onTapMenu: function () {
    this.setData({
      drawerInfo: "transform:translateX(316px)"
    })
  },



  /**
   * 跳转到练习页
   * 
   * @param {}  无需参数
   * @toPage practice.index  跳转到练习页
   */
  onPractice: function () {
    if (this.data.checkedCardArr.length == 0) return
    // 增加复习模式
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
    this.setData({
      showPracticeSheetValue: false
    })
  },

  jumpToPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../practice/practice?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },

  jumpToSpellPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../spell/spell?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },

  selectAll() {
    let allSelectMode = this.data.allSelectMode

    let checkedCardArr = []
    if (!allSelectMode) {
      let todayCards = this.data.todayCards
      if (todayCards.length >= 20) {
        wx.showToast({
          icon: 'none',
          title: '最大数量为20张卡片',
        })
      }
      todayCards.forEach(e => {
        checkedCardArr.push(e)
      })
    }

    this.setData({
      checkedCardArr,
      allSelectMode: !allSelectMode
    })
  },
})