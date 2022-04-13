// pages/dict-wordlist/dict-wordlist.js

const app = getApp()
const globalData = app.globalData
import router from '../../router/index'
import {
  WordList
} from '../../models/wordlist'

const wordListApi = new WordList()

Page({

  data: {
    showAll: false,
    wordCount: 0,
    changedWordDict: {},
    dictCode: "0302",
    wordList: []
  },

  toggleShowAllMode() {
    let showAll = !this.data.showAll
    this.setData({
      showAll,
    })
    // this.setData({
    //   wordCount: this.calWordCount()
    // })
  },

  onCellTapped(e) {
    // 把他压到改变了的数组里去
    let changedWordDict = this.data.changedWordDict
    let wordList = this.data.wordList
    let tapWord = e.currentTarget.dataset.word
    wordList.forEach(word => {
      if (word.wordName == tapWord) {
        word.isIgnore = word.isIgnore == 1 ? 0 : 1
        changedWordDict[word.wordName] = word.isIgnore
      }
    })

    this.setData({
      changedWordDict,
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

  getDate(pageIndex) {
    let that = this
    wordListApi.getBookWordList(this.data.dictCode, 0, pageIndex).then(e => {
      console.log(e)
      let wordList = that.data.wordList
      wordList = wordList.concat(e.list)
      that.setData({
        wordList,
        wordCount: e.total
      })
    })

  }, 
 
  finishSetting() {
    let changedWordDict = this.data.changedWordDict
    wordListApi.saveIgnoreWordList(changedWordDict).then(e => {
      router.pop() 
    })   
  },   
 
  onLoad(options) { 
    const data = router.extract(options); 
    console.log(data)
    this.setData({
      scrollViewHeight: globalData.windowHeight - globalData.navigationBarHeight,
    })

    this.getDate(0)

  }
})