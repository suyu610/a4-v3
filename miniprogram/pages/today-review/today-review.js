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
    title: "今日推荐复习",
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen
    checkedCardArr: [],
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    open: false
  },
  cardSwiper(e) {
    let that = this
    that.setData({
      cardCur: e.detail.current
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
    }
  },
  toggleOpenStatus(e) {
    let cardId = e.currentTarget.dataset.item.cardId
    let todayCards = this.data.todayCards
    todayCards.forEach(e => {
      if (e.cardId == cardId) {
        e.open = !e.open
      }
    });
    this.setData({
      todayCards
    })
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
    const data = router.extract(options);
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
      windowWidth: app.globalData.windowWidth,
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
  getInitData() {
    let that = this
    // 获取今日卡片
    cardApi.getNeedReviewCard(0).then(e => {
      console.log(e)
      that.setData({
        todayCards: e.list,
        currentPageIndex: e.pageNum,
        totalCardNum: e.total, 
        hasNextPage: e.hasNextPage,
        loading: false
      }) 
    })

    // 如果是从练习页退回来的，则要取消掉选定的数组
    this.setData({
      checkedCardArr: [],
      allChecked: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInitData()
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