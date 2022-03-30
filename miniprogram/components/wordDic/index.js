// components/wordDic/index.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import config from '../../config'
import {
  WordList
} from '../../models/wordlist.js'

import {
  Card
} from '../../models/card.js'
import {
  Resource
} from '../../models/resource.js'
const resource = new Resource()

const app = getApp()

const card = new Card()
const wordListApi = new WordList()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    noFooter: Boolean,
    // 需要词典来获取单词数据
    noData: Boolean,
    wordContent: Object,
    loading: Boolean,
    cardId: Number,
    dictCode: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    minWidth: app.globalData.windowWidth * 0.85,
    defIndex: 0,
    abbrDict: config.abbrDict,
    open: true,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    translate: '',
    voiceType: '美',
    editMode: false,
    editSelfShortDef: ''
  },

  pageLifetimes: {
    show: function () {
      this.setData({
        showNoEver: app.globalData.showNoEver,
        voiceType: app.globalData.voiceType
      })
    },
  },

  observers: {
    'wordContent': function (wordContent) {
      let that = this
      console.log(wordContent)
      if (wordContent != null) {
        // 发音
        wx.getStorage({
          key: 'openAutoSpeak',
          success(res) {
            if (res.data == 1) {
              that.speakWordFunc()
            }
          },
          fail(res) {
            that.speakWordFunc()
          }
        })
        this.setData({
          defIndex: 0,
          editMode: false,
          editSelfShortDef: this.data.wordContent.selfShortDef
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggleEditMode: function () {
      this.setData({
        editMode: !this.data.editMode
      })
    },
    onTapDefBtn: function (e) {
      this.setData({
        defIndex: e.currentTarget.dataset.index
      })
    },
    /**
     * 确认修改自定义释义
     */

    confirmEditSelfDef() {
      let that = this
      let editSelfShortDef = this.data.editSelfShortDef
      wx.showLoading({
        title: '修改中',
      })
      // todo: 服务端
      wordListApi.makeSelfDef({
        word: this.data.wordContent.wordName,
        selfDef: editSelfShortDef
      }).then(e => {
        this.setData({
          ['wordContent.selfShortDef']: editSelfShortDef
        })
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
        })
        that.toggleEditMode()
      })
    },
    /**
     * 重置自定义释义
     */
    resetSelfDef() {
      wx.showLoading({
        title: '删除中',
      })
      // todo: 服务端
      wordListApi.makeSelfDef({
        word: this.data.wordContent.wordName,
        selfDef: ''
      }).then(e => {
        this.setData({
          ['wordContent.selfShortDef']: ''
        })
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
        })
      })
    },
    speakWordFunc() {
      // 调用有道api
      let url = "https://dict.youdao.com/dictvoice?audio=" + this.data.wordContent.wordName + "&type=" + (this.data.voiceType == '美' ? '2' : '1')
      app.globalData.innerAudioContext.src = url
      app.globalData.innerAudioContext.play()
    },

    changeVoiceType() {
      this.setData({
        voiceType: this.data.voiceType == '美' ? '英' : '美'
      })

      app.globalData.voiceType = this.data.voiceType
      wx.setStorage({
        key: 'voiceType',
        data: this.data.voiceType
      })

      this.speakWordFunc()
    },

    closeDict: function () {
      this.setData({
        // windowWidth: wx.getSystemInfoSync().windowWidth,
        // windowHeight: wx.getSystemInfoSync().windowHeight,
        status: 0
      })
      // wx.vibrateShort()
      this.triggerEvent('closeDict', {}, {})
    },

    confirmWord: function () {
      this.triggerEvent('confirmWord', {}, {})
    },
    replaceWord: function () {
      let that = this
      this.setData({
        loading: true
      })

      card.replaceWordInCard(this.data.dictCode, this.data.wordContent.wordName, this.data.cardId).then(newWord => {
        resource.getWordInfo(newWord).then(function (e) {
          that.setData({
            wordContent: e,
            loading: false
          })
        })

      })
      // that.triggerEvent('replaceWord', {
      //   word: that.data.wordContent.wordName
      // }, {})
    },

    onChangeShowNoEver: function (e) {
      this.setData({
        showNoEver: e.detail
      })
    },

    confirmDelete: function () {
      let that = this
      // 检测一下 showNoEver
      if (this.data.showNoEver) {
        that.deleteWord()
        return;
      }

      Dialog.confirm({
          title: '注意',
          message: '删除的单词不可恢复',
          confirmButtonText: '删除',
          context: this
        })
        .then(() => {
          that.deleteWord()
          wx.setStorage({
            key: 'showNoEver',
            data: that.data.showNoEver
          })
        })
        .catch(() => {
          // on cancel
        });

      // wx.showModal({
      //   title: "注意",
      //   content: "删除的单词不可恢复",
      //   confirmColor: '#220aac',
      //   confirmText: '删除',
      //   success(res) {
      //     if (res.confirm) {
      //       that.deleteWord()
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    },
    deleteWord: function () {
      let that = this
      wx.showLoading({
        icon: 'none',
        title: '处理中',
      })
      card.deleteWordInCard(this.data.wordContent.wordName, this.data.cardId).then(e => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              icon: 'none',
              title: '已删除',
            })
          },
        })
        that.triggerEvent('refreshCard', {
          word: that.data.wordContent.wordName
        }, {})
      })
    },

    // 收藏单词
    addWord: function () {
      let that = this
      wordListApi.addWordToWordList(this.data.wordContent.wordName).then(e => {
        that.setData({
            'wordContent.mark': true
          }),
          wx.showToast({
            title: '添加成功',
          })
      })
    },

    copyWordName: function () {
      wx.setClipboardData({
        data: this.data.wordContent.wordName,
        success(res) {
          wx.hideToast({
            success: (res) => {
              wx.showToast({
                title: '已复制单词',
              })
            },
          })
        }
      })
    },
    removeWord: function () {
      let that = this
      wordListApi.removeWordFromWordList(this.data.wordContent.wordName).then(e => {
        that.setData({
            'wordContent.mark': false
          }),
          wx.showToast({
            title: '移除成功',
          })
      })
    }

  }
})