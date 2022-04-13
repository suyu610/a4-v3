// pages/settings/settings.js
const app = getApp()
import config from '../../config.js'
import router from '../../router/index'

import {
  WordBook
} from '../../models/wordbook.js'
import {
  User
} from '../../models/user.js'

const wordbook = new WordBook()
const userApi = new User()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resetProgressValue: false,
    resetProgressTextValue: '',
    showLongPressActionSheetValue: false,
    longPressActionSheet: [{
        name: '查看词书单词列表',
      },
      {
        name: '重置进度',
        color: "red",
      },
    ],
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

  closeResetPopup() {
    this.setData({
      resetProgressValue: false,
      resetProgressTextValue: '',
    })
  },

  beginResetProgress() {
    if (this.data.resetProgressTextValue != '重置进度') return
    this.setData({
      resetProgressTextValue: '',
      resetProgressValue: false
    })
    wx.showLoading({
      title: '重置中',
    })

    userApi.resetDictProgress(this.data.curBookCode).then(e => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '重置成功\r\n须重启小程序',
      })
    })
  },

  resetProgress() {
    this.setData({
      resetProgressValue: !this.data.resetProgressValue
    })
  },
  onSelectLongPressActionSheet(e) {
    console.log(e.detail.name)
    console.log(e)
    if (e.detail.name == "查看词书单词列表") {
      router.push({
        name: "dictWordList",
        data: {
          code: "123",
          isCustomBook: false
        }
      })
      return
    }

    if (e.detail.name == "重置进度") {
      this.resetProgress()
      return
    }
  },

  onCloseLongPressActionSheet() {
    this.setData({
      showLongPressActionSheetValue: false
    })
  },
  onLongPressBookItem(e) {
    let curBookCode = e.currentTarget.dataset.code
    let curBookName = e.currentTarget.dataset.name
    this.setData({
      curBookCode,
      curBookName,
      showLongPressActionSheetValue: true
    })
  },
  onTapBookItem(e) {
    let bookCode = e.currentTarget.dataset.code
    let bookName = e.currentTarget.dataset.name
    let that = this
    if (bookCode != this.data.currentBookCode) {
      wx.showModal({
        title: "确认",
        content: "是否切换词书为「" + bookName + "」",
        confirmColor: "#220aac",
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
        if (book.isCustomBook) {
          continue
        }
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