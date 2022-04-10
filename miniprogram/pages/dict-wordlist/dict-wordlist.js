// pages/dict-wordlist/dict-wordlist.js

const app = getApp()
const globalData = app.globalData
import router from '../../router/index'

Page({

  data: {
    showAll: false,
    wordCount: 0,
    wordList: [{
      wordName: "abandon",
      ignore: false
    }, {
      wordName: "abolish",
      ignore: false
    }, {
      wordName: "aboard",
      ignore: false
    }, {
      wordName: "aboard2",
      ignore: false
    }, {
      wordName: "aboard3",
      ignore: false
    }, {
      wordName: "aboard4",
      ignore: false
    }, {
      wordName: "aboard5",
      ignore: true
    }, {
      wordName: "aboard6",
      ignore: false
    }, {
      wordName: "aboard7",
      ignore: false
    }]
  },

  toggleShowAllMode() {
    let showAll = !this.data.showAll
    this.setData({
      showAll,
    })
    this.setData({
      wordCount: this.calWordCount()
    })
  },

  onCellTapped(e) {
    let wordList = this.data.wordList
    let tapWord = e.currentTarget.dataset.word
    wordList.forEach(word => {
      if (word.wordName == tapWord) {
        word.ignore = !word.ignore
      }
    })

    this.setData({
      wordList,
      wordCount: this.calWordCount()
    })
  },

  calWordCount() {
    let showAll = this.data.showAll
    let wordList = this.data.wordList
    if (showAll) {
      return wordList.length
    } else {
      let count = 0
      wordList.forEach(e => {
        if (!e.ignore) {
          count++
        }
      })
      return count
    }
  },

  getDate() {
    this.setData({
      wordCount: this.calWordCount()
    })
  },

  finishSetting() {
    console.log(this.data.wordList)
    router.pop()
  },

  onLoad(options) {
    const data = router.extract(options);
    console.log(data)
    this.setData({
      scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    })

    this.getDate()

  }
})