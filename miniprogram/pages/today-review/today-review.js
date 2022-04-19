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
    curIndex: 0,
    dictLoading: false,
    showWordGroupPopupValue: false,
    cardCur: 0,
    wordlist: ["hello", "abandon", "people", "world", "open"],
    title: "今日推荐复习",
    bottomBtnTitle: "开始学习",
    mode: "study", // study export listen
    checkedCardArr: [],
    cardsGroupByDate: {},
    scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    open: false,
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
  showWordGroupPopup() {
    this.setData({
      showWordGroupPopupValue: true
    })
  },
  markWord(e) {
    let wordName = this.data.currentWordName
    this.selectComponent("#dict_" + wordName).setMarkWord()
    console.log(e)
  },

  cardSwiper(e) {
    let that = this
    let curIndex = e.detail.current
    that.setData({
      curIndex,
      currentWordName: this.data.cardBaseWordList[curIndex].wordName
    })
    app.speakWordFunc(this.data.cardBaseWordList[curIndex].wordName)

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

  selectAll(e) {
    let id = e.detail.cardId
    let checkedCardArr = this.data.checkedCardArr
    let cardsGroupByDate = this.data.cardsGroupByDate
    let item = cardsGroupByDate[id]
    let list = item.list
    item.allSelect = !item.allSelect

    let checkedCardSet = new Set(checkedCardArr);
    let thisCardSet = new Set(list);

    if (item.allSelect) {
      checkedCardArr = new Set([...checkedCardSet, ...thisCardSet])
    } else {
      checkedCardArr = new Set([...checkedCardSet].filter(x => !thisCardSet.has(x)))
    }
    this.setData({
      checkedCardArr: Array.from(checkedCardArr)
    })
  },

  toggleOpenStatus(e) {
    let item = e.currentTarget.dataset.item
    let id = item.id

    let cardsGroupByDate = this.data.cardsGroupByDate
    console.log(cardsGroupByDate[id].list[0])
    cardsGroupByDate[id].list.forEach(card => {
      card.open = (card.open == null) ? true : !card.open
    });


    this.setData({
      cardsGroupByDate
    })
  },

  onClickHideOverlay: function (e) {
    if (e.currentTarget.dataset.class == "swiper-item") {
      return
    }
    let that = this
    // 更新数据
    this.setData({
      curIndex: 0,
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
    let wordName = e.detail.wordName
    let that = this

    app.speakWordFunc(wordName)

    resource.getWordListInfo(e.detail.wordlist).then(function (e) {
      that.setData({
        currentCardId: cardId,
        currentDictCode: dictCode,
        cardBaseWordList: e,
        dictLoading: false
      })
    })

    this.setData({
      currentWordName: wordName,
      showDictPopup: true,
      dictLoading: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getData(0)

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


  getData(pageIndex) {
    let that = this
    // 获取今日卡片
    cardApi.getNeedReviewCard(pageIndex).then(e => {
      app.globalData.needRefreshData = false
      let cardsGroupByDate = this.data.cardsGroupByDate


      e.list.forEach(card => {
        if (cardsGroupByDate.hasOwnProperty(0 - card.date)) {
          // 看看该卡片是不是已存在
          cardsGroupByDate[0 - card.date].list.push(card)
        } else {
          cardsGroupByDate[0 - card.date] = {
            "date": card.date.substr(4, 2) + "." + card.date.substr(6),
            list: [card],
            id: 0 - card.date,
            allSelect: false
          }
        }
      })
      that.setData({
        cardsGroupByDate,
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

  },
})