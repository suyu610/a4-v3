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

  },

  onTapBookItem(e) {
    let bookCode = e.currentTarget.dataset.code
    let bookName = e.currentTarget.dataset.name
    let that = this
    if (bookCode != this.data.currentBookCode) {
      wx.showModal({
        title: "确认",
        content: "是否切换词书为「" + bookName + "」",
        cancelColor: 'cancelColor',
        success(res) {
          if (res.confirm) {
            that.confirmSwitchBook(bookCode)
          }
        }
      })
    }
  },
  confirmSwitchBook(bookCode) {
    let that = this
    if (bookCode != null) {
      wordbook.switchCurBook(bookCode).then(e => {
        wx.showToast({
          icon: 'none',
          title: '已切换至 \r\n《' + e.book.bookName + '》',
        })
        app.globalData.currentBookCode = bookCode
        let bookColumns = that.data.bookColumns
        bookColumns.forEach(column => {
          column.bookList.forEach(book => {
            book.isCurrent = book.code == bookCode
          }) 
        })
        this.setData({
          bookColumns
        })
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择词书',
      })
    }
  },


  judgeBookType(book, key, progressList, currentBookCode) {
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

    if (currentBookCode == key) {
      book.isCurrent = true
      book.hasAdded = true
    } else {
      book.isCurrent = false
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const TabsLineHeight = 44

    let dict = config.dictInfo
    let bookColumns = this.data.bookColumns
    let currentBookCode = app.globalData.currentBookCode
    let progressList = app.globalData.progressList
    let targetCount = app.globalData.setting.targetCount

    this.setData({
      dict,
      targetCount,
      currentBookCode,
      navigationBarHeight: app.globalData.navigationBarHeight,
      windowHeight: app.globalData.windowHeight,
      tabContainerHeight: app.globalData.windowHeight - app.globalData.navigationBarHeight - TabsLineHeight
    })
    for (const key in dict) {
      if (Object.hasOwnProperty.call(dict, key)) {
        const book = dict[key];
        this.judgeBookType(book, key, progressList, currentBookCode)
        const bookColumnId = key.substr(0, 2)
        book.bookColumnId = bookColumnId
        book.code = key
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