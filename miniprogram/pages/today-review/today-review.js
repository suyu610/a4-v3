// pages/new-word/index.js
const app = getApp()
const globalData = app.globalData
import router from '../../router/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "今日推荐复习",
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen

    checkedCardArr: [],
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    open: false
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let e = app.globalData.todayInitData
    let todayCards = app.globalData.needReviewCard.list
    const data = router.extract(options);

    if (data != null && data.mode != null) {
      this.setData({
        title: data.mode == "export" ? "导出卡片" : "随身听",
        bottomBtnTitle: data.mode == "export" ? "导出卡片" : "开始随身听",
        mode: data.mode
      })
    }
    todayCards.forEach(e => {
      e.open = false
    });
    this.setData({
      movable_y: app.globalData.windowHeight - 70,
      movable_x: (app.globalData.windowWidth - 125) / 2,
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      senInfo: e.sentence,
      loading: false,
      progressList: e.progressList,
      currentDicCode: e.currentDicCode,
      currentPageIndex: e.todayCards.pageNum,
      totalCardNum: e.todayCards.total,
      hasNextPage: e.todayCards.hasNextPage,
      windowWidth: app.globalData.windowWidth,
      todayCards
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