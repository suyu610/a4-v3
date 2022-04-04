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
    cardCur: 0,
    wordlist: ["hello", "abandon", "people", "world", "open"],
    nextWordList: [],
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
  onPractice: function () {
    if (this.data.checkedCardArr.length == 0) return
    // 增加复习模式
    this.setData({
      showPracticeSheetValue: true
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let e = app.globalData.todayInitData
    const data = router.extract(options);
    let nextWordList = []
    let that = this

    // this.data.wordlist.forEach(word => {
    //   resource.getWordInfo(word).then(function (ele) {
    //     nextWordList.push(ele)
    //     that.setData({
    //       nextWordList,
    //     })
    //   })
    // });

    if (data != null && data.mode != null) {
      this.setData({
        title: data.mode == "export" ? "导出卡片" : "随身听",
        bottomBtnTitle: data.mode == "export" ? "导出卡片" : "开始随身听",
        mode: data.mode
      })
    }

    this.setData({
      movable_y: app.globalData.windowHeight - 70,
      movable_x: (app.globalData.windowWidth - 125) / 2,
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      loading: true,
      windowWidth: app.globalData.windowWidth
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    // 获取今日卡片
    cardApi.genTodayCard(0).then(e => {
      console.log(e)
      that.setData({
        todayCards: e.list,
        currentPageIndex: e.pageNum,
        totalCardNum: e.total,
        hasNextPage: e.hasNextPage,
        loading: false
      })
    })
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