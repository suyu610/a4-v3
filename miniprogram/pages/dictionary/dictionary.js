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
    bookList: [],
    bookColumns: [{
        name: "热门",
        code: "-1",
        bookList: []
      }, {
        name: "考研",
        code: "05",
        bookList: []

      },
      {
        name: "大学",
        code: "04",
        bookList: []

      },
      {
        name: "出国",
        code: "06",
        bookList: []

      },
      {
        name: "高中",
        code: "03",
        bookList: []

      },
      {
        name: "初中",
        code: "02",
        bookList: []
      },
      {
        name: "小学",
        code: "01",
        bookList: []

      }
    ]
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


  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;

    this.setData({
      radio: name,
      currentWordBookName: config.dictInfo[name].name
    });
  },

  judgeBookType(book, key, progressList, currentDicCode) {
    if (progressList[key]) {
      book.hasAdded = true
      // 判断是否学完
      if (progressList[key] == book.totalWordNum) {
        book.finished = true
      } else {
        book.finished = false
      }
      book.curStudyNum = progressList[key]
    } else {
      book.hasAdded = false
    }

    if (currentDicCode == key) {
      book.isCurrent = true
    } else {
      book.isCurrent = false
    }
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
    let dict = config.dictInfo
    let bookColumns = this.data.bookColumns
    let currentDicCode = app.globalData.currentDicCode
    let progressList = app.globalData.progressList
    let targetCount = app.globalData.targetCount
    this.setData({
      targetCount
    })
    for (const key in dict) {
      if (Object.hasOwnProperty.call(dict, key)) {
        const book = dict[key];
        this.judgeBookType(book, key, progressList, currentDicCode)
        const bookColumnId = key.substr(0, 2)
        book.bookColumnId = bookColumnId
        book.remainDay = book.totalWordNum / targetCount
        if (book.isHot) {
          bookColumns[0].bookList.push(book)
        }
        this.data.bookColumns.forEach(column => {
          if (column.code == bookColumnId) {
            column.bookList.push(book)
          }
        });

      }
    }

    this.setData({
      bookColumns
    })
  },
})