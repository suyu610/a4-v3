// pages/new-word/index.js
const app = getApp()
const globalData = app.globalData
import router from '../../router/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    title: "全部卡片",
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen

    showDropdownOverlay: true,
    checkedCardArr: [],
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    maxDate: new Date().getTime(),
    minDate: new Date(2021, 9, 1).getTime(),

    showCalendar: false,
    option2: [{
        text: '练习次数',
        value: -1
      }, {
        text: '1~3次',
        value: 1
      }, {
        text: '4~6次',
        value: 2
      }, {
        text: '7~10次',
        value: 3
      },
      {
        text: '大于10次',
        value: '4'
      }
    ],
    option3: [{
        text: '卡片状态',
        value: 'a'
      },
      {
        text: '待练习',
        value: 'b'
      },
      {
        text: '已学习',
        value: 'c'
      },
      {
        text: '已完成',
        value: 'd'
      },
    ],
    value1: 0,
    value2: -1,
    value3: 'a',
    dataRange: null
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

  onConfirmCalendar(e) {

    console.log(e.detail[0])
    console.log(e.detail[1])
    const firstDate = new Date(e.detail[0])
    const secondDate = new Date(e.detail[1])

    const resDate = this.p((firstDate.getMonth() + 1)) + '/' + this.p(firstDate.getDate()) + '-' + this.p((secondDate.getMonth() + 1)) + '/' + this.p(secondDate.getDate())
    this.setData({
      dataRange: resDate
    })

    this.onCloseCalendar()
  },
  onCloseCalendar() {
    console.log("onCloseCalendar")
    this.selectComponent('#calendar-dropdown-item').toggle(false);

    this.setData({
      showDropdownOverlay: true,

      showCalendarValue: false
    })
  },
  onOpenCalendar() {
    console.log("onOpenCalendar")

    this.setData({
      showDropdownOverlay: false,
      showCalendarValue: true
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
        name: this.data.mode == 'export' ? "exportConfirm" : "listen",
        data: {
          wordlist
        }
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let e = app.globalData.todayInitData
    const data = router.extract(options);
    console.log(data.mode)
    if (data != null && data.mode != null) {
      this.setData({
        title: data.mode == "export" ? "导出卡片" : data.mode == "learn" ? "全部卡片" : "随身听",
        bottomBtnTitle: data.mode == "export" ? "导出卡片" : data.mode == "learn" ? '开始学习' : "开始随身听",
        mode: data.mode
      })
    }

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
      todayCards: app.globalData.needReviewCard.list,
      hasNextPage: e.todayCards.hasNextPage,
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