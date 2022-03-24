import {
  Resource
} from "../../../models/resource"
import {
  WordList
} from "../../../models/wordlist"
const app = getApp()

import router from '../../../router/index'

let innerAudioContext = null
// pages/wordlist/wordlist.js
let resourceApi = new Resource()
let wordlistApi = new WordList()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    container: null,
    showPracticeSheetValue: false,
    allSelectMode: false,
    scrollViewHeight: app.globalData.windowHeight - app.globalData.navigationBarHeight,

    practiceModeActions: [{
        name: '记忆模式',
      }, {
        name: '复习模式',
      },
      {
        name: '拼写模式',
      },
    ],
    editMode: false,
    wordCheckedList: [],
    currentWord: '',
    voiceType: '美',
    wordList: []
  },

  onExportWordList() {
    let that = this
    wx.showLoading({
      title: '加载资源中',
    })
    const fs = wx.getFileSystemManager()
    let filePath = `${wx.env.USER_DATA_PATH}/wordlist.txt`
    let wordListStr = this.data.wordRightCheckedList.join("\n");
    fs.writeFile({
      filePath: filePath,
      data: wordListStr,
      encoding: 'utf8',
      success(res) {
        wx.showModal({
          title: '生成完毕',
          content: '是否导出',
          success(res) {
            if (res.confirm) {
              wx.hideLoading()
              that.shareFileToMessage(filePath);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        // 下载完成后转发
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '生成失败',
        })
        console.error(res)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  shareFileToMessage(filePath) {
    console.log(filePath)
    wx.shareFileMessage({
      filePath: filePath,
      success() {},
      fail() {
        wx.showToast({
          icon: 'none',
          title: '生成失败',
        })
      },
    })
  },
  selectAll() {
    let wordList = this.data.wordList
    let allSelectMode = this.data.allSelectMode

    let wordCheckedList = []
    if (wordList.length != this.data.wordCheckedList.length) {
      wordList.forEach(e => {
        wordCheckedList.push(e.wordName)
      })
    }
    this.setData({
      wordCheckedList,
      allSelectMode: !allSelectMode
    })
  },

  onRightBtnTapped(e) {
    let word = e.currentTarget.dataset.word
    let wordCheckedList = this.data.wordCheckedList
    // 存在则删除
    let index = wordCheckedList.indexOf(word)
    if (index != -1) {
      wordCheckedList.splice(index, 1)
    } else {
      // 不存在
      wordCheckedList.push(word)
    }
    this.setData({
      wordCheckedList
    })
  },

  handleDelteWordArrSuccess() {
    wx.hideLoading()
    wx.showToast({
      title: '成功',
    })
    // 把wordLeftCheckedList清空，并去除wordlist中，这些单词
    let wordList = this.data.wordList
    let wordLeftCheckedList = this.data.wordLeftCheckedList
    let newWordList = []
    wordList.forEach(e => {
      if (wordLeftCheckedList.indexOf(e.wordName) == -1) {
        newWordList.push({
          "wordName": e.wordName
        })
      }
    })
    this.setData({
      wordList: newWordList,
      wordLeftCheckedList: []
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

  jumpToSpellPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.wordRightCheckedList)
    wx.navigateTo({
      url: '../spell/spell?from=booklist&wordlist=' + obj + '&pMode=' + pMode,
    })
  },

  jumpToPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.wordRightCheckedList) //myObj：本js文件中的对象
    wx.navigateTo({
      url: '../practice/practice?from=booklist&wordlist=' + obj + '&pMode=' + pMode,
    })

  },

  onClosePracticeSheet() {
    this.setData({
      showPracticeSheetValue: false
    })
  },
  onPractice: function () {
    console.log("onPractice")
    if (this.data.wordRightCheckedList.length == 0) return
    this.setData({
      showPracticeSheetValue: true
    })
  },

  onTapDeleteWordArr() {
    if (this.data.wordLeftCheckedList.length == 0) {
      return
    }
    let that = this
    wx.showLoading({
      title: '删除中',
    })

    wordlistApi.removeWordArr(this.data.wordLeftCheckedList).then(e => that.handleDelteWordArrSuccess(e),
      function (e) {
        console.log(e)
      })
  },

  onLeftBtnTapped(e) {
    let word = e.currentTarget.dataset.word
    let wordLeftCheckedList = this.data.wordLeftCheckedList
    // 存在则删除
    let index = wordLeftCheckedList.indexOf(word)
    if (index != -1) {
      wordLeftCheckedList.splice(index, 1)
    } else {
      // 不存在
      wordLeftCheckedList.push(word)
    }
    this.setData({
      wordLeftCheckedList
    })
  },
  /**
   * 隐藏遮罩事件
   * 
   * @param {}  无需参数
   * @setData {showOverlay, showSearchBar, showSearchBar}  显示搜索框
   */
  onClickHideOverlay: function () {
    let that = this
    // 更新数据
    this.setData({
      showOverlay: false,
      showDictPopup: false
    })
  },
  /**
   * 读当前卡片中的词
   */
  speakCurrentWord() {
    this.speakWordFunc(this.data.currentWord, this.data.voiceType)
  },
  /**
   * 发音
   * @param {单词本身} word 
   * @param {'美|英' } voiceType 
   */
  speakWordFunc(word, voiceType) {
    // 调用有道api
    let url = "https://dict.youdao.com/dictvoice?audio=" + word + "&type=" + (voiceType == '美' ? '2' : '1')
    innerAudioContext.src = url
    innerAudioContext.play()
  },

  // 如果是非编辑模式，则打开词典，如果是编辑模式，则选中或反选框框
  onCellTapped(e) {
    if (!this.data.editMode) {
      this.setData({
        currentWord: e.currentTarget.dataset.word,
      })
      //  发音
      // this.speakCurrentWord()
      this.toggleDict()
    } else {
      this.onLeftBtnTapped(e)
    }
  },



  toggleDict() {
    let that = this
    this.setData({
      dictLoading: true,
      showDictPopup: !this.data.showDictPopup
    })

    resourceApi.getWordInfo(this.data.currentWord).then(e => {
      that.setData({
        dictLoading: false,
        curWordContent: e
      })
    }, function (e) {
      that.setData({
        dictLoading: false,
        showDictPopup: false
      })
    })
  },


  /**
   * 路由返回
   * @param {}  无需参数
   * @toMethod wx.navigateBack()  路由回上一页
   */
  onNaviBack: function () {
    wx.navigateBack()
  },

  onTapEditBtn: function () {
    this.setData({
      editMode: !this.data.editMode
    })
  },

  goToPage: function () {
    if (this.data.jumpPage == null) return
    this.getDate(this.data.jumpPage)
  },

  onChangePageIndex: function (e) {
    // console.log(e.detail)
    this.setData({
      jumpPage: e.detail
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      console.log("has Next Page")

      let indexPage = this.data.currentPageIndex + 1
      this.getDate(indexPage)
    } else {
      console.log("not next page")
    }
  },

  getDate(pageIndex) {
    let that = this
    wordlistApi.getWordList(pageIndex).then(e => {
      console.log(e)
      wx.hideLoading()
      this.setData({
        lastPage: e.lastPage,
        currentPageIndex: e.pageNum,
        totalWordNum: e.total,
        wordList: that.data.wordList.concat(e.list),
        hasNextPage: e.hasNextPage
      })
    })
  },


  onScroll(event) {
    wx.createSelectorQuery()
      .select('#scroller')
      .boundingClientRect((res) => {
        this.setData({
          scrollTop: event.detail.scrollTop,
          offsetTop: res.top,
        });
      })
      .exec();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取组件高度

    const data = router.extract(options);
    // console.log(data)
    // todo: 去获取单词本
    this.setData({
      groupName: data.name,
    })
    wx.showLoading({
      title: '加载资源中',
    })

    this.getDate(1)

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

    this.setData({
      wordRightCheckedList: [],
      darkMode: app.globalData.theme == 'dark'
    })

    innerAudioContext = app.globalData.innerAudioContext
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})