// components/wordlist-popup/index.js
import {
  WordList
} from "../../models/wordlist"

let wordlistApi = new WordList()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {
    curId: 0,
    wordListGroup: []

  },

  observers: {
    'show': function (show) {
      if (show) {
        let that = this
        if (app.globalData.wordListGroup == null) {
          wordlistApi.getWordListGroup().then(e => {
            e.sort(that.sortById);
            that.setData({
              wordListGroup: e
            })
            app.globalData.wordListGroup = e
          })
        } else {
          this.setData({
            wordListGroup: app.globalData.wordListGroup
          })
        }
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
      this.triggerEvent("jump2BookList")
    }

  }
})