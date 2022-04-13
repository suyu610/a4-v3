// components/wordlist-popup/index.js
import {
  WordList
} from "../../models/wordlist"

import router from '../../router/index'

let wordlistApi = new WordList()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    word: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    curId: 0,
    wordListGroup: []

  },

  pageLifetimes: {
    show: function () {
      let that = this
      if (app.globalData.wordListGroup == null) {
        wordlistApi.getWordListGroup().then(e => {
          e.sort(that.sortById);
          that.setData({
            wordListGroup: e,
            curId: 0
          })
          app.globalData.wordListGroup = e
        })
      } else {
        this.setData({
          wordListGroup: app.globalData.wordListGroup,
          curId: 0
        })
      }
    },
  },
  observers: {
    'show': function (show) {
      if (show) {
        let that = this
        // if (app.globalData.wordListGroup == null) {
        wordlistApi.getWordListGroup().then(e => {
          e.sort(that.sortById);
          that.setData({
            wordListGroup: e,
            curId: 0
          })
          app.globalData.wordListGroup = e
        })
        // } else {
        //   this.setData({
        //     wordListGroup: app.globalData.wordListGroup,
        //     curId: 0
        //   })
        // }
      }
    }
  },
  lifetimes: {
    ready() {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    markWord: function () {
      let that = this
      console.log(this.data.curId)
      wordlistApi.addWordToWordList(this.data.word, this.data.curId).then(e => {
        wx.showToast({
          title: '收藏成功',
        })
        that.setData({
          show: false
        })
        this.triggerEvent("markWord")
      })
    },
    sortById: function (a, b) {
      return a.id - b.id
    },
    closePopup() {
      this.setData({
        show: false
      })
    },
    selectGroup(e) {
      this.setData({
        curId: e.currentTarget.dataset.id
      })
    },

    jump2BookList() {
      router.push({
        "name": "wordlist"
      })
    }

  }
})