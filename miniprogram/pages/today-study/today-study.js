// pages/new-word/index.js
const app = getApp()
const globalData = app.globalData
import router from '../../router/index'
import {
  Resource
} from '../../models/resource.js'
const resource = new Resource()

import {
  Card
} from '../../models/card.js'
const cardApi = new Card()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    allSelectMode: false,
    cardCur: 0,
    wordlist: ["hello", "abandon", "people", "world", "open"],
    nextWordList: [],
    todayCards: [],
    title: "今日计划新学",
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen
    checkedCardArr: [],
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
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
  },

  onAllSelectBtnTapped: function () {
    let allSelectMode = this.data.allSelectMode

    let checkedCardArr = [] //this.data.checkedCardArr
    if (!allSelectMode) {
      this.data.todayCards.forEach(e => {
        checkedCardArr.push(e)
      })
    }

    this.setData({
      allSelectMode: !allSelectMode,
      checkedCardArr
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
  /**
   * 底部按钮的点击事件
   */
  onTapBottomBtn() {
    let wordlist = []
    let checkedCardArr = this.data.checkedCardArr
    checkedCardArr.forEach(card => {
      card.wordList.forEach(word => {
        if (!word.isDeleted) {
          wordlist.push(word.wordName)
        }
      });
    });
    console.log(wordlist)

    if (this.data.mode == 'export' || this.data.mode == "listen") {
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
  replaceWord() {
    let cardCur = this.data.cardCur

    if (cardCur + 1 == this.data.wordlist.length) {
      cardCur = 0
    } else {
      cardCur++
    }

    this.setData({
      cardCur
    })
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

  cardSwiper(e) {
    let that = this
    that.setData({
      cardCur: e.detail.current
    })
  },

  confirmWord: function (e) {
    wx.showLoading({
      title: '切换中',
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '切换成功',
      })
    }, 500);
    this.onClickHideOverlay(e)
  },

  onClickHideOverlay: function (e) {
    if (e.currentTarget.dataset.class == "swiper-item") {
      return
    }
    let that = this
    // 更新数据
    this.setData({
      showOverlay: false,
      showSearchBar: false,
      showDictPopup: false
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
    console.log(e.detail.wordlist)
    let that = this

    resource.getWordListInfo(e.detail.wordlist).then(function (e) {
      console.log(e)
      that.setData({
        cardBaseWordList: e,
        showDictPopup: true,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let e = app.globalData.todayInitData
    const data = router.extract(options);

    if (data != null && data.mode != null) {
      this.setData({
        title: data.mode == "export" ? "导出卡片" : "随身听",
        bottomBtnTitle: data.mode == "export" ? "导出卡片" : "开始随身听",
        mode: data.mode
      })
    }

    this.setData({
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      loading: true,
      windowWidth: app.globalData.windowWidth
    })
    app.globalData.needReviewTodayStudyDate = false
    this.getDate(0)


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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getDate(pageIndex) {
    this.setData({
      loadingMore: true
    })
    let that = this
    cardApi.genTodayCard(pageIndex).then(e => {
      let todayCards = this.data.todayCards
      todayCards = todayCards.concat(e.list)
      app.globalData.needReviewTodayStudyDate = false
      that.setData({
        todayCards: todayCards,
        currentPageIndex: e.pageNum,
        totalCardNum: e.total,
        hasNextPage: e.hasNextPage,
        loading: false,
        loadingMore: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.needReviewTodayStudyDate) {
      // 如果是从练习页退回来的，则要取消掉选定的数组
      this.setData({
        checkedCardArr: [],
        allSelectMode: false,
        todayCards: []
      })
      // 获取今日卡片
      this.getDate(0)
    }
  },


  /**
   * 添加卡片事件
   * 
   * @param {}  无需参数
   * @setData {userWordCardToday}  更新数据
   */
  async onAddCard() {
    // 如果没有选定词书，则弹出警告
    if (app.globalData.currentBookCode == null || app.globalData.currentBookCode == '') {
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
      title: '新增单词卡片\r\n《' + config.dictInfo[app.globalData.currentBookCode].name + '》',
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
        progressList[that.data.currentBookCode] = progressList[that.data.currentBookCode] + 5
        that.setData({
          loadingAddCard: false,
          todayCards,
          progressList
        })

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
    console.log("onReachBottom")
    if (this.data.hasNextPage) {
      console.log("has Next Page")
      let indexPage = this.data.currentPageIndex + 1
      this.getDate(indexPage)
    } else {
      console.log("not next page")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})