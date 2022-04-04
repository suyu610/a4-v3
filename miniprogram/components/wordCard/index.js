import {
  Card
} from "../../models/card"

import config from '../../config'

// components/wordCard/index.js
const app = getApp()
const MAX_CARD_WIDTH = app.globalData.windowWidth - 60

let cardApi = new Card()
// 需要复习的时间数组，按秒来算，5min, 30min, 12h, 1d, 2d, 4d, 7d, 15d
const REVIEW_TIME_ARR = [
  0,
  5 * 60,
  30 * 60,
  12 * 60 * 60,
  1 * 24 * 60 * 60,
  2 * 24 * 60 * 60,
  4 * 24 * 60 * 60,
  7 * 24 * 60 * 60,
  15 * 24 * 60 * 60
]

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'apply-shared' //isolated(默认), apply-shared, shared
  },
  /** 
   * 组件的属性列表
   */
  properties: {
    type: String,
    isFolder: Boolean,
    status_mode: {
      type: Number,
      value: 1
    },
    loading: Boolean,
    wordCard: Object,
    ifEmpty: Boolean,
    mode: String,
    cardCheckedArr: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    dictInfo: config.dictInfo,
    countdownClock: null,
    resort: true,
    cardChecked: false,
    cardStatusActions: [{
        name: '待练习',
      },
      {
        name: '已练习',
      },
      {
        name: '已完成',
        subname: '今后将不再推荐复习'
      },
    ],

  },

  /**
   * 数据监听器
   */
  observers: {
    // 'wordCard': function (wordCard) {
    //   console.log(wordCard)
    //   // 当wordCard已经被设置非空时
    //   if (JSON.stringify(wordCard) != '{}') {
    //     this.wordCardHandler(wordCard, false)
    //   }
    // },

    'cardCheckedArr': function () {
      let flag = false
      this.data.cardCheckedArr.forEach(e => {
        if (this.data.wordCard.cardId == e.cardId) {
          flag = true
        }
      })
      this.setData({
        cardChecked: flag
      })
    },

  },

  lifetimes: {
    ready() {
      let date = this.data.wordCard.date
      if (date != null) {
        date = date.substr(0, 4) + "." + date.substr(4, 2) + "." + date.substr(6)
        console.log(date)
      }

      this.setData({
        date,
        status_mode: Math.round(Math.random() * 2) + 1,
        darkMode: app.globalData.theme == 'dark',
      })

      // console.log(this.data.status_mode)
      // 判断是否都删除了
      this.wordCardHandler(this.data.wordCard, true)
    }
  },
  pageLifetimes: {
    // show() {
    //   if (this.data.wordCard != null && this.data.wordCard.cardId != -1) {
    //     this.startCountDown();
    //   }
    // }
  },

  methods: {

    /**
     * 删除卡片
     */
    deleteCard: function () {
      let that = this
      wx.showModal({
        title: "注意",
        content: "删除卡片暂不可恢复",
        confirmColor: '#220aac',
        confirmText: '删除',
        success(res) {
          if (res.confirm) {
            cardApi.deleteCard(that.data.wordCard.cardId).then(e => {
              that.triggerEvent('deleteCard', {
                cardId: that.data.wordCard.cardId
              }, {})
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    onCloseCardStatus: function () {
      this.setData({
        showCardStatusValue: false
      })
    },
    changeCardStatus: function () {
      this.setData({
        showCardStatusValue: true
      })
    },
    /**
     * 切换卡片选中状态
     */
    switchChecked: function (e) {
      this.setData({
        cardChecked: !this.data.cardChecked
      })
      if (e != null) {
        let isPush = this.data.cardChecked
        let card = this.data.wordCard
        this.triggerEvent('cardChecked', {
          isPush,
          card
        }, {})
      }
    },
    /**
     * 单词卡片首次加载处理方法
     *
     * @param {wordCard} 旧的单词卡片
     * @return {_wordCard} 新的单词卡片
     */

    wordCardHandler: function (wordCard,
      resort = false
    ) {
      if (wordCard == null || resort == false) return
      let that = this
      wordCard.wordList = this.shuffle(wordCard.wordList)

      this.setData({
        _wordCard: wordCard
      })
      //  解决第一次按刷新闪动的问题
      if (wordCard.wordList[0] != null && wordCard.wordList[0].width != null) {
        wordCard.wordList.forEach(function (item, index) {
          // item.left_cal = app.globalData.windowWidth - 60 - item.width
          // 左侧
          if ((index == 0 || index == 2) && wordCard.wordList[index + 1] != null) {
            // 左随机,最小为10，最大为 (屏幕宽度 - 60 - 两个宽度) *比例系数
            item.left_cal = that.getRandomInt(10, (MAX_CARD_WIDTH - item.width - wordCard.wordList[index + 1].width) * 0.5)
          }

          // 右侧
          if ((index == 1 || index == 3) && wordCard.wordList[index - 1] != null) {
            item.left_cal = that.getRandomInt(10 + wordCard.wordList[index - 1].left_cal + wordCard.wordList[index - 1].width, (MAX_CARD_WIDTH - item.width) * 0.85)
          }

          if (index == 4) {
            item.left_cal = that.getRandomInt(10, MAX_CARD_WIDTH - item.width)
          }

          //干脆固定，01为第一行,23第二行，4第三行
          item.top_cal = Math.floor(index / 2)
        })
        that.setData({
          _wordCard: wordCard,
          resort: false
        })
      } else {
        const query = this.createSelectorQuery()
        query.selectAll('.main-text').boundingClientRect()
        query.exec(function (res) {
          wordCard.wordList.forEach(function (item, index) {
            item.isDeleted = item.passed
            item.width = res[0][index].width
            // item.left_cal = app.globalData.windowWidth - 60 - item.width
            // 左侧 
            if (index == 0 || index == 2) {
              // 左随机,最小为10，最大为 (屏幕宽度 - 60 - 两个宽度) *比例系数
              if (item != null && res[0][index + 1] != null) {
                item.left_cal = that.getRandomInt(10, (MAX_CARD_WIDTH - item.width - res[0][index + 1].width) * 0.5)
              }
            }

            // 右侧
            if (index == 1 || index == 3) {
              if (item != null && res[0][index + 1] != null) {
                item.left_cal = that.getRandomInt(10 + wordCard.wordList[index - 1].left_cal + wordCard.wordList[index - 1].width, (MAX_CARD_WIDTH - item.width) * 0.85)
              }
            }

            if (index == 4) {
              if (item != null) {
                item.left_cal = that.getRandomInt(10, MAX_CARD_WIDTH - item.width)
              }
            }

            //干脆固定，01为第一行,23第二行，4第三行
            item.top_cal = Math.floor(index / 2)
          })
          that.setData({
            _wordCard: wordCard,
            resort: false
          })
        })
      }
    },
    refreshCard: function () {
      this.wordCardHandler(this.data.wordCard, true)
    },

    deleteCardWord: function (deleteWordName) {
      console.log("deleteCardWord")
      let _wordCard = this.data._wordCard
      _wordCard.wordList.forEach(e => {
        if (e.wordName == deleteWordName) {
          e.isDeleted = true
        }
      })

      let allPassed = 0
      this.data._wordCard.wordList.forEach(word => {
        allPassed += word.isDeleted
      });

      if (allPassed == this.data.wordCard.wordList.length) {
        wx.showToast({
          icon: 'none',
          title: '本卡片已删除',
        })
        this.triggerEvent('deleteCard', {
          cardId: this.data.wordCard.cardId
        }, {})
        cardApi.deleteCard(this.data.wordCard.cardId)
      }

      this.setData({
        _wordCard
      })
      // this.wordCardHandler(this.data.wordCard, true)
    },

    replaceCardWord: function (oldWordName, newWordName) {
      let _wordCard = this.data._wordCard
      _wordCard.wordList.forEach(e => {
        if (e.wordName.toLowerCase() == oldWordName.toLowerCase()) {
          e.wordName = newWordName
        }
      })
      this.setData({
        _wordCard
      })
    },

    /** 
     * 点击单词 
     */
    onWord: function (e) {
      let word = e.currentTarget.dataset.item
      this.triggerEvent('word', {
        wordName: word.wordName,
        cardId: this.data.wordCard.cardId,
        dictCode: this.data.wordCard.dictCode,
        selfDefWordNameCh: word.selfDefWordNameCh,
        isFavor: word.isFavor
      }, {})
    },

    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
    },

    // 重排函数
    shuffle: function (arr) {
      for (let i = arr.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
      }
      return arr;
    }

  }
})