// pages/settings/settings.js
const app = getApp()
import config from '../../config.js'
import {
  WordBook
} from '../../models/wordbook.js'

const wordbook = new WordBook()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: '1',
    currentWordBookName: '',
    oldWordBookName: '',
    bookColumns: [{
      id: 0,
      name: "热门",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: true,
        isCurrent: true,
        totalCount: 275,
        addedPeopleCount: 123,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        addedPeopleCount: 123,
        totalCount: 275,
        desc: "完整收录四级大纲词汇，高效备考之选。\r\n完整收录四级大纲词汇，高效备考之选。完整收录四级大纲词汇，高效备考之选。完整收录四级大纲词汇，高效备考之选。"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: true,
        totalCount: 3075,
        desc: "33333词书的介绍"
      }, ]
    }, {
      id: 1,
      name: "考研",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "22222词书的介绍"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "33333词书的介绍"
      }, ]
    }, {
      id: 2,
      name: "大学",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "22222词书的介绍"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "33333词书的介绍"
      }, ]
    }, {
      id: 3,
      name: "出国",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "22222词书的介绍"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "33333词书的介绍"
      }, ]
    }, {
      id: 4,
      name: "高中",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "22222词书的介绍"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "33333词书的介绍"
      }, ]
    }, {
      id: 5,
      name: "初中",
      bookList: [{
        id: 1,
        bookName: "考研核心词汇",
        hasAdded: true,
        totalCount: 275,
        desc: "1111词书的介绍"
      }, {
        id: 1,
        bookName: "高考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "22222词书的介绍"
      }, {
        id: 1,
        bookName: "中考核心词汇",
        hasAdded: false,
        totalCount: 275,
        desc: "33333词书的介绍"
      }, ]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择词书',
    })
  },

  confirmSwitchBook() {
    let bookCode = this.data.radio;
    if (bookCode != null) {
      wordbook.switchCurBook(bookCode).then(e => {
        wx.showToast({
          icon: 'none',
          title: '已切换至 \r\n《' + e.book.bookName + '》',
        })
        app.globalData.needRefreshTodayCard = true
        app.globalData.currentDicCode = bookCode
      })

      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1000);
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择词书',
      })
    }
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onRadioChange(event) {
    this.setData({
      radio: event.detail,
    })
  },

  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;

    this.setData({
      radio: name,
      currentWordBookName: config.dictInfo[name].name
    });
  },

  /**
   * 路由到词典页面事件
   * @param {}  无需参数
   * @toMethod wx.navigateBack()  路由回上一页
   */
  onNaviBack: function () {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const TabsLineHeight = 44
    this.setData({
      navigationBarHeight: app.globalData.navigationBarHeight,
      windowHeight: app.globalData.windowHeight,
      tabContainerHeight: app.globalData.windowHeight - app.globalData.navigationBarHeight - TabsLineHeight
    })
    // if (app.globalData.currentDicCode != null && app.globalData.currentDicCode != '') {
    //   activeNames = (parseInt(app.globalData.currentDicCode / 100)).toString()
    // }

    // this.setData({
    //   radio: app.globalData.currentDicCode,
    //   currentWordBookName: config.dictInfo[app.globalData.currentDicCode].name,
    //   oldWordBookName: config.dictInfo[app.globalData.currentDicCode],
    // })
  },
})