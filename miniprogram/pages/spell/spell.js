// pages/practice/practice.js


const app = getApp()
let innerAudioContext
import * as cardDataTools from '../../utils/cardDataTools'
import * as notificationUtil from '../../utils/notificationUtil'
const REVIEW_TIME_ARR = [
  0,
  1 * 24 * 60 * 60,
  2 * 24 * 60 * 60,
  4 * 24 * 60 * 60,
  7 * 24 * 60 * 60,
  15 * 24 * 60 * 60
]

import {
  Progress
} from '../../models/progress'


import {
  Card
} from '../../models/card'

import {
  Resource
} from '../../models/resource'
import {
  WordList
} from '../../models/wordlist'

const resourceApi = new Resource()
const progressApi = new Progress()
const cardApi = new Card()
const wordListApi = new WordList()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    textValue: "",
    keyboardHeight: 0,
    spellCorrect: false,
    pMode: 'practice',
    showMeaning: true,
    showAddDefBar: false,
    showOverlay: false,
    wordName: "record",
    openCountdown: true,
    progressCurrentWidth: 100,
    progressCountDown: null,
    practiceWordArr: [],
    circleWordArr: [],
    from: 'card',
    curWord: {},
    reviewMode: false,
    // 标记游戏步骤的
    curPracticeIndex: 0,
    // 打开详细释义
    showDictValue: false,
    // 提示
    showAnswer: false,
    // 显示自定义释义还是词典释义，true为自定义
    showSelfDef: false,
    voiceType: '美',
    wordfontSize: 48,
    defFontSize: 32,
    wordfontWeight: 1,
    showSettingSheetValue: false,
    showFontSettingSheetValue: false,
    settingActions: [{
        name: '单词尺寸',
      },
      {
        name: '选项',
      },
      {
        name: '选项',
        subname: '描述信息',
        openType: 'share',
      },
    ],
  },

  toggleAnswer() {
    this.setData({
      showAnswer: !this.data.showAnswer
    })
  },
  /**
   * 下一步，这个地方的逻辑是，
   * 1. 判断 轮询数组是否为空，如果不为空，则把轮询数组中第一个拿出来
   * 2. 如果当前单词未学习，按下一步则将其标记为已学习，并且将所有已学习的放入到下一轮数组里
   */
  nextStep() {
    let that = this
    let flag = true
    let circleWordArr = this.data.circleWordArr
    let practiceWordArr = this.data.practiceWordArr
    let curPracticeIndex = this.data.curPracticeIndex
    let curWord = {}
    let reviewMode = this.data.reviewMode
    this.setData({
      textValue: "",
      showAnswer: false
    })
    // 还有单词没复习到
    if (curPracticeIndex < practiceWordArr.length - 1) {
      reviewMode = true
      curPracticeIndex++
      practiceWordArr[curPracticeIndex].isLearned = true
      curWord = practiceWordArr[curPracticeIndex]
      // 将所有已复习的单词，放入circleWordArr
    } else {
      flag = false
      curWord = {
        "wordName": "复习完毕"
      }
      wx.disableAlertBeforeUnload();
      // 所有单词都复习到了
      wx.showModal({
        title: '复习完毕',
        content: '真棒',
        confirmText: that.data.from == 'card' ? '保存进度' : '返回',
        confirmColor: '#220aac',
        showCancel: false,
        success() {
          if (that.data.from == 'card') {
            that.saveProgress();
          } else {
            wx.navigateBack({
              delta: 9,
            })
          }
        }
      })
    }


    this.setData({
      curWord,
      practiceWordArr,
      circleWordArr,
      curPracticeIndex,
      reviewMode
    })

    // if (flag) this.speakCurrentWord()

  },
  bindKeyInput: function (e) {
    this.setData({
      textValue: e.detail.value
    })
  },
  /**
   * 保存学习进度
   */

  saveProgress: function () {
    if (this.data.inSaving) {
      return;
    }

    this.setData({
      inSaving: true
    })

    wx.showLoading({
      title: '保存中',
    })
    let checkedCardArr = this.data.checkedCardArr
    let cardArr = []
    checkedCardArr.forEach(e => {
      if (e.progress == null || e.progress.seq == 0) {
        console.log("进度为空")
        cardArr.push({
          id: e.cardId,
          pseq: 1,
          nrt: new Date().getTime() + REVIEW_TIME_ARR[1] * 1000,
        })
      }
      // 如果还没到下一次复习的时间，则seq就不需要加
      else if (new Date().getTime() < new Date(e.nextPracticeTime).getTime()) {
        cardArr.push({
          id: e.cardId,
          pseq: e.validPracticeCount,
          nrt: e.nextPracticeTime
        })
      } else if (e.validPracticeCount + 1 < REVIEW_TIME_ARR.length) {
        console.log("正常加")
        let recordInfo = {
          id: e.cardId,
          pseq: e.validPracticeCount + 1,
          nrt: new Date().getTime() + REVIEW_TIME_ARR[e.validPracticeCount + 1] * 1000
        }
        cardArr.push(recordInfo)
        // 超出复习次数
      } else {
        cardArr.push({
          id: e.cardId,
          pseq: 9,
          nrt: new Date("2088-01-01 00:00:00").getTime()
        })
      }
    })
    
    if (notificationUtil.shouldShowNotification()) {
      wx.requestSubscribeMessage({
        tmplIds: ['HjD6Lq6HwmjuG7fCBKZ96sUEzmvAnl39bu3gS1rHbXU'],
        success(res) {
          progressApi.savePracticeProgress(cardArr).then(e => {
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 9,
              })
            }, 1000)
          })
          wx.setStorageSync('notificationSetFlag', app.globalData.todayDate)
        },
        fail(res) {
          console.log(res)
        },
      })
    } else {
      progressApi.savePracticeProgress(cardArr).then(e => {
        wx.showToast({
          title: '保存成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 9,
          })
        }, 1000)
      })
    }

  },

  onAddSelfDefTapped() {
    this.setData({
      showOverlay: true,
      showAddDefBar: true,
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
      showAddDefBar: false,
    })
  },

  /**
   * 键盘聚焦事件
   * 
   * @param {e}  事件内部参数
   * @setData {keyboardHeight}  显示搜索框
   */
  bindkeyboardheightchange: function (e) {
    this.setData({
      keyboardHeight: e.detail.height,
    })
  },


  /**
   * 读当前卡片中的词
   */
  speakCurrentWord() {
    this.speakWordFunc(this.data.curWord.wordName, this.data.voiceType)
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

  /**
   * 收藏单词
   */
  onTapFavorBtn() {
    // todo
    if (this.data.curWord.favor == 1) {
      // 取消收藏
      this.removeWord()
    } else {
      // 收藏
      this.addWord()
    }
  },

  // 收藏单词
  addWord: function () {
    let that = this
    wordListApi.addWordToWordList(this.data.curWord.wordName).then(e => {
      that.setData({
          ['curWord.favor']: true
        }),
        wx.showToast({
          title: '添加成功',
        })
    })
  },

  removeWord: function () {
    let that = this
    wordListApi.removeWordFromWordList(this.data.curWord.wordName).then(e => {
      that.setData({
          ['curWord.favor']: false
        }),
        wx.showToast({
          title: '移除成功',
        })
    })
  },

  /**
   * 切换词典打开状态
   */
  toggleDict() {
    // 如果是打开状态，则只需要关闭即可
    if (this.data.showDictValue) {
      this.setData({
        showDictValue: false
      })

      return;
    }
    let that = this
    resourceApi.getWordInfo(this.data.curWord.wordName).then(function (e) {
        wx.hideLoading()
        that.setData({
          curSearchWord: e,
        })
      }),
      function () {
        //  无单词
        that.setData({
          curWord: null,
        })
      }
    this.setData({
      showDictValue: true
    })
  },
  /**
   * 修改自定义释义
   */
  saveSeflDef() {
    this.setData({
      ['curWord.selfShortDef']: this.data.tmpModifySelfDef
    })
    wx.showLoading({
      title: '保存中',
    })
    // todo: 服务端
    wordListApi.makeSelfDef({
      word: this.data.curWord.wordName,
      selfDef: this.data.tmpModifySelfDef
    }).then(e => {
      wx.hideLoading()
      wx.showToast({
        title: '修改成功',
      })
      this.onClickHideOverlay();
    })

  },


  /**
   * 自定义释义改变
   */
  selfDefChange(e) {
    this.setData({
      tmpModifySelfDef: e.detail.value
    })
  },

  /**
   * 切换发音类型
   */
  toggleVoiceType() {
    let voiceType = this.data.voiceType
    voiceType = voiceType == '美' ? '英' : '美'
    this.setData({
      voiceType
    })

    app.globalData.voiceType = this.data.voiceType
    wx.setStorage({
      key: 'voiceType',
      data: this.data.voiceType
    })

    this.speakCurrentWord()
  },

  throwErr() {
    wx.showToast({
      icon: 'none',
      title: '发生错误，请重启小程序',
    })
    setTimeout(() => {
      wx.reLaunch({
        url: '../index/index',
      })
    }, 500);
  },

  // 重排函数
  shuffle: function (arr) {
    for (let i = 1; i < arr.length; i++) {
      const random = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr;
  },

  /**
   * 从单词本中来的
   * @param {*}  
   */
  initDateFromBookList: function (fromWordList) {
    wx.showLoading({
      title: '加载资源中',
    })
    let that = this
    let practiceWordArr = []
    let circleWordArr = []
    let curWord = {}

    wordListApi.prePracticeFromWordList(fromWordList).then(function (wordArr) {
        // 打乱顺序
        wx.hideLoading();
        wordArr.forEach(word => {
          practiceWordArr.push(word)
        })

        practiceWordArr = that.shuffle(practiceWordArr)
        practiceWordArr[0].isLearned = true
        curWord = practiceWordArr[0]
        circleWordArr.push(curWord)
        that.setData({
          openCountdown: app.globalData.setting.openCountdown == 1 ? true : false,
          circleWordArr,
          practiceWordArr,
          curWord,
          reviewMode: that.data.pMode == 'memory' ? false : true
        })
        // that.speakCurrentWord()

      },
      function (e) {
        console.log(e)
      })
  },


  /**
   * 初始化数据
   * 1. 将多张卡片的单词提取出来，组成待复习数组practiceCardArr
   * 2. 从服务器获取上述词组中的数据:简要释义、英美音标、用户标记的中文、用户是否收藏
   * 3. 将第一个单词加入轮询数组
   */
  initDate: function (checkedCardArr) {
    // 
    wx.showLoading({
      title: '加载资源中',
    })
    let that = this
    let cardIdArr = []
    let practiceWordArr = []
    let circleWordArr = []
    let curWord = {}
    checkedCardArr.forEach(card => {
      cardIdArr.push(card.cardId)
    })

    // 向服务器申请资源
    cardApi.prePractice(cardIdArr).then(function (wordArr) {
      wx.hideLoading();
      wordArr.forEach(word => {
        practiceWordArr.push(word)
      })

      practiceWordArr = that.shuffle(practiceWordArr)
      practiceWordArr[0].isLearned = true
      curWord = practiceWordArr[0]
      circleWordArr.push(curWord)

      that.setData({
        openCountdown: app.globalData.setting.openCountdown == 1 ? true : false,
        circleWordArr,
        practiceWordArr,
        checkedCardArr,
        curWord,
        reviewMode: that.data.pMode == 'memory' ? false : true
      })
      // that.speakCurrentWord()
    })
  },

  onShow() {
    let that = this
    this.setData({
      voiceType: app.globalData.voiceType
    })

    wx.getStorage({
      key: 'vibrate',
      success(res) {
        that.setData({
          vibrate: res.data
        })
      },
      fail() {
        that.setData({
          vibrate: 1
        })
      }
    })
  },
  /**
   * 生命周期函数: 监听页面加载
   * 
   * @param {}  无需参数
   * @setData practiceViewHeight  更新数据
   */
  onLoad: function (options) {
    // 从单词本中来的
    if (options.from != null && options.from == 'booklist' && options.wordlist != null) {
      // 看看wordList
      var wordlist = JSON.parse(options.wordlist)
      if (wordlist == null || wordlist.length == 0) {
        this.throwErr()
      } else {
        this.setData({
          from: 'wordlist',
          pMode: options.pMode
        })
        this.initDateFromBookList(wordlist)
      }
    } else {
      if (options.checkedCardArr == null) {
        this.throwErr()
      } else {
        var checkedCardArr = JSON.parse(options.checkedCardArr)
        this.setData({
          pMode: options.pMode
        })
        if (checkedCardArr == null || checkedCardArr.length == 0) {
          // todo: throw err
          this.throwErr()
        }
        // 退出时提示
        wx.enableAlertBeforeUnload({
          message: "中途退出不会记录学习进度",
        });
        this.initDate(checkedCardArr)
      }
    }

    innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true
    });

    this.setData({
      practiceViewHeight: app.globalData.practiceViewHeight
    })
  },

  /**
   * @param {}  无需参数
   * @toMethod wx.navigateBack()  路由回上一页
   */
  onNaviBack: function () {
    wx.navigateBack()
  },

  /**
   * 配合键盘输入事件：input，获取输入内容到虚拟输入框中
   */
  inputChange: function (e) {
    console.log(e.detail)
    const textValue = e.detail;
    this.setData({
      textValue: textValue
    });
  },

  systemKeyboardInput: function (e) {
    this.setData({
      textValue: e.detail.value
    })
  },


  /**
   * 配合键盘点击‘完成’事件：done，设置虚拟输入框为未激活状态
   */
  inputDone: function () {
    // 做拼写检查
    if (this.data.textValue.toLowerCase().replace(/[^a-zA-Z]+/g, '') == this.data.curWord.wordName.toLowerCase().replace(/[^a-zA-Z]+/g, '')) {
      wx.showToast({
        title: '正确',
        duration: 800
      })
      this.setData({
        spellCorrect: true
      })
      setTimeout(() => {
        this.setData({
          spellCorrect: false
        })
        this.nextStep()
      }, 500);
    } else {
      if (this.data.vibrate) {
        wx.vibrateShort({
          type: 'light',
        })
      }
      wx.showToast({
        icon: 'none',
        title: '拼写有误',
      })
    }
  },




  skipSpell() {
    this.setData({
      spellCorrect: true
    })
    setTimeout(() => {
      this.setData({
        spellCorrect: false
      })
      this.nextStep()
    }, 500);
  }
})