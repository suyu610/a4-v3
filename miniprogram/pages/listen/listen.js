// pages/listen/listen.js
import config from '../../config'
import router from '../../router/index'
const app = getApp()
const audioBaseUrl = "https://cdns.qdu.life/a4/listen/"
const bgmInnerAudioContext = wx.createInnerAudioContext();

import {
  Resource
} from '../../models/resource.js'
import {
  WordList
} from '../../models/wordlist'
const resource = new Resource()
const wordListApi = new WordList()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放音频相关
    abbrDict: config.abbrDict,
    showListPopupValue: false,
    showSettingPopupValue: false,
    currentBgmValue: 0.2,
    time: 0,
    closeTimerValue: 0,
    stopAllAudioValue: false,
    isFirst: true,
    isPlay: false,
    random: false,
    blurMeanDetail: false,
    blurMeanCh: false,
    defIndex: 0,
    curPlayIndex: 0,
    wordResourceList: [],
    curWordContent: {},
    wordlist: [],
    bgmName: '关闭',
    // 设置项
    voiceType: 'us',
    speakSentence: true,
    speakSpell: false,
    showBgmSettingSheetValue: false,
    bgmSettingSheetActions: [{
        name: '关闭',
      },
      {
        name: 'piano',
        subname: 'canon'
      },
      {
        name: 'cello',
        subname: 'Cello Suite No.1 in G major'
      },
    ],
    clockFromButton: false,
    clockValue: '不自动关闭',
    clockSettingSheetActions: [{
        name: '不自动关闭'
      },
      {
        name: '1min'
      },
      {
        name: '15min'
      },
      {
        name: '30min'
      },
      {
        name: '60min'
      }
    ],
    showClockSettingSheetValue: false
  },

  setBgmVolumn() {
    console.log(bgmInnerAudioContext.volume)
    bgmInnerAudioContext.volume = this.data.currentBgmValue
  },

  onChangingBgmVolumn(e) {
    console.log(e)
    this.setData({
      currentBgmValue: e.detail / 100
    })

  },
  stopAllAudio() {
    console.log('stopAllAudio')
    app.globalData.innerAudioContext.stop()
    bgmInnerAudioContext.stop()
    this.setData({
      isPlay: false,
      clockValue: '不自动关闭'
    })
  },
  calAudioType() {
    // @1：英(1)  拼写(0) 有例句(0)
    // @2：英(1)  无拼写(1) 有例句(0)
    // @3：英(1)  拼写(0) 无例句(2)
    // @4：英(1)  无拼写(1) 无例句(2)

    // @5：美(5)  拼写 有例句
    // @6：美(5)  无拼写 有例句
    // @7：美(5)  拼写 无例句
    // @8：美(5)  无拼写 无例句

    let type = 0
    if (this.data.voiceType == 'us') {
      type += 5
    } else {
      type += 1
    }

    if (!this.data.speakSentence) {
      type += 2
    }
    if (!this.data.speakSpell) {
      type += 1
    }
    return "@" + type + ".mp3"
  },

  onChangeVoiceType() {
    this.setData({
      voiceType: this.data.voiceType == 'us' ? 'uk' : 'us'
    })
  },
  onChangeSpeakSentence() {
    this.setData({
      speakSentence: !this.data.speakSentence
    })
  },
  onChangeSpeakSpell() {
    this.setData({
      speakSpell: !this.data.speakSpell
    })
  },
  onSelectBgmSettingSheet(e) {
    let bgmName = e.detail.name
    if (bgmName == '关闭') {
      bgmInnerAudioContext.stop()
    } else {
      bgmInnerAudioContext.src = 'https://cdns.qdu.life/a4/bgm/' + (bgmName == 'piano' ? 'canon-piano.mp3' : 'BWV-1007.mp3')
      bgmInnerAudioContext.play()
    }
    this.setData({
      bgmName
    })
  },
  onCloseBgmSettingSheet() {
    this.toggleBgmSettingSheet()
  },

  toggleBgmSettingSheet() {
    this.toggleSettingPopup()
    this.setData({
      showBgmSettingSheetValue: !this.data.showBgmSettingSheetValue
    })
  },

  toggleClockSettingSheet(e) {
    this.setData({
      showClockSettingSheetValue: !this.data.showClockSettingSheetValue,
      showSettingPopupValue: false
    })
  },

  onSelectClockSettingSheet(e) {
    let clockValue = e.detail.name
    if (clockValue != '不自动关闭') {
      this.setData({
        time: parseInt(clockValue) * 60 * 1000
      })
    } else {
      this.setData({
        time: 0
      })
    }
    this.setData({
      clockValue
    })
  },

  onCloseClockSettingSheet() {
    this.toggleClockSettingSheet()
  },


  toggleSettingPopup() {
    this.setData({
      showSettingPopupValue: !this.data.showSettingPopupValue
    })
  },

  switchListSeq(e) {
    let curPlayIndex = e.currentTarget.dataset.index
    let wordResourceList = this.data.wordResourceList
    this.setData({
      curPlayIndex,
      curWordContent: wordResourceList[curPlayIndex],
      isPlay: true
    })
    app.globalData.innerAudioContext.src = wordResourceList[curPlayIndex].audioSrc + this.calAudioType()
    app.globalData.innerAudioContext.play()
  },

  toggleListPopup() {
    this.setData({
      showListPopupValue: !this.data.showListPopupValue
    })
  },

  onTapDefBtn: function (e) {
    this.setData({
      defIndex: e.currentTarget.dataset.index
    })
  },

  onTapBlurMeanDetail() {
    this.setData({
      blurMeanDetail: !this.data.blurMeanDetail
    })
  },
  onTapBlurMeanCh() {
    this.setData({
      blurMeanCh: !this.data.blurMeanCh
    })
  },

  onTapNextBtn() {
    this.setNextAudioSrc()
  },

  onTapPrevBtn() {
    this.setPrevAudioSrc()
  },



  setNextAudioSrc() {
    app.globalData.innerAudioContext.stop()
    let curPlayIndex = 0
    if (this.data.random) {
      curPlayIndex = Math.round(Math.random() * (this.data.wordlist.length - 1));
    } else {
      curPlayIndex = this.data.curPlayIndex
      if (curPlayIndex >= this.data.wordlist.length - 1) {
        curPlayIndex = 0
      } else {
        curPlayIndex = curPlayIndex + 1
      }
    }
    this.setData({
      curPlayIndex,
      curWordContent: this.data.wordResourceList[curPlayIndex]
    })
    app.globalData.innerAudioContext.src = this.data.wordResourceList[curPlayIndex].audioSrc + this.calAudioType()
    app.globalData.innerAudioContext.play()
    this.setData({
      isPlay: true
    })
  },


  setPrevAudioSrc() {
    app.globalData.innerAudioContext.stop()

    let curPlayIndex = 0
    if (this.data.random) {
      curPlayIndex = Math.round(Math.random() * (this.data.wordlist.length - 1));
    } else {
      curPlayIndex = this.data.curPlayIndex
      if (curPlayIndex == 0) {
        curPlayIndex = this.data.wordlist.length - 1
      } else {
        curPlayIndex = curPlayIndex - 1
      }
    }
    this.setData({
      curPlayIndex,
      curWordContent: this.data.wordResourceList[curPlayIndex]
    })
    app.globalData.innerAudioContext.src = this.data.wordResourceList[curPlayIndex].audioSrc + this.calAudioType()
    app.globalData.innerAudioContext.play()
    this.setData({
      isPlay: true
    })
  },

  onTapPlayBtn() {
    let that = this
    this.setData({
      isPlay: !this.data.isPlay
    })
    if (this.data.isPlay) {
      if (bgmInnerAudioContext.paused && that.data.bgmName != '关闭' && bgmInnerAudioContext.src != '') {
        bgmInnerAudioContext.play()
      }

      app.globalData.innerAudioContext.play()
    } else {
      app.globalData.innerAudioContext.stop()
      bgmInnerAudioContext.pause()
    }
  },

  onTapRandomBtn() {
    this.setData({
      random: !this.data.random
    })
  },

  onFinishFetchInitDate(wordResourceList) {
    let that = this
    this.setData({
      curPlayIndex: 0,
      loading: false,
      curWordContent: this.data.wordResourceList[0],
      isFirst: false,
    })

    app.globalData.innerAudioContext.src = wordResourceList[0].audioSrc + this.calAudioType()

    app.globalData.innerAudioContext.onEnded(function () {
      console.log(app.globalData.innerAudioContext.src)
      that.setNextAudioSrc()
      // that.playWordAudio() 
    })

    app.globalData.innerAudioContext.onError(function () {
      console.log("error")
      console.log(app.globalData.innerAudioContext.src)
      // 如果发生错误，则跳转到下一个单词
      wx.showToast({
        icon: 'none',
        title: '无此音频，即将切换',
      })
      that.setNextAudioSrc()
      // that.playWordAudio()
    })
  },

  fetchInitDate(wordlist) {
    console.log("fetchInitDate")
    let that = this
    // 这里用promise all
    wordListApi.preListenFromWordList(wordlist).then(function (wordArr) {
      console.log(wordArr)
      wordArr.forEach(word => {
        word.audioSrc = audioBaseUrl + word.wordName
        that.setData({
          wordResourceList: wordArr
        })
      })

      that.onFinishFetchInitDate(wordArr)
    })
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    const data = router.extract(options);
    bgmInnerAudioContext.loop = true
    bgmInnerAudioContext.volume = this.data.currentBgmValue
    this.setData({
      bgmInnerAudioContext
    })
    if (data != null && data.wordlist != null && data.wordlist.length != 0) {
      let wordlist = data.wordlist
      this.setData({
        wordlist
      })

      this.fetchInitDate(wordlist)
      console.log(wordlist)
    }
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
      curPlayIndex: 0,
      isPlay: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
    app.globalData.innerAudioContext.stop()
    bgmInnerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.innerAudioContext.stop()
    bgmInnerAudioContext.stop()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})