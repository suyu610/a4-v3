import {
  Card
} from "../../models/card"

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
    countdownClock: null,
    resort: true,
    time: -1, // 秒
    cardChecked: false,
    today: app.globalData.todayDate
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

    'wordCard.progress': function () {
      if (this.data.wordCard != null && this.data.wordCard.cardId != -1) {
        this.startCountDown();
      }
    }
  },

  lifetimes: {
    ready() {
      this.setData({
        status_mode: Math.round(Math.random()) + 1,
        darkMode: app.globalData.theme == 'dark',
        today: app.globalData.todayDate
      })

      console.log(this.data.status_mode)
      // 判断是否都删除了
      this.wordCardHandler(this.data.wordCard, true)
      if (this.data.wordCard != null && this.data.wordCard.cardId != -1) {
        this.startCountDown();
      }
    }
  },
  pageLifetimes: {
    // show() {
    //   if (this.data.wordCard != null && this.data.wordCard.cardId != -1) {
    //     this.startCountDown();
    //   }
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startCountDown() {
      let that = this
      let time = that.getNextPracticeCountDownTime()
      if (this.data.wordCard.progress == null) {
        this.setData({
          formatTime: 'NEED_REVIEW'
        })
        return
      }

      // 如果复习超过了7次，则不需要再复习了
      if (this.data.wordCard.progress.seq >= REVIEW_TIME_ARR.length) {
        this.setData({
          formatTime: 'HAS_DONE'
        })
        // clearInterval(this.data.countdownClock);
        return
      }

      if (this.data.countdownClock != null) {
        clearInterval(this.data.countdownClock);
      }

      that.setData({
        time
      })

      let formatTime = that.data.time
      if (time >= 24 * 60 * 60) {
        formatTime = parseInt(time / (24 * 3600)) + "天"
      } else if (time >= 60 * 60) {
        formatTime = parseInt(time / 3600) + "小时"
      } else if (time > 60) {
        formatTime = parseInt(time / 60) + "分钟"
      } else {
        formatTime = parseInt(time) + "秒"
      }

      that.setData({
        time: that.data.time - 1,
        formatTime: formatTime
      })

      // this.data.countdownClock = setInterval(function () {
      //   let formatTime = that.data.time
      //   if (time >= 24 * 60 * 60) {
      //     formatTime = parseInt(time / (24 * 3600)) + "天"
      //   } else if (time >= 60 * 60) {
      //     formatTime = parseInt(time / 3600) + "小时"
      //   } else if (time > 60) {
      //     formatTime = parseInt(time / 60) + "分钟"
      //   } else {
      //     formatTime = time + "秒"
      //   }

      //   that.setData({
      //     time: that.data.time - 1,
      //     formatTime: formatTime
      //   })

      //   // 如果时间小于0，则停止
      //   if (that.data.time <= 0) {
      //     clearInterval(that.data.countdownClock);
      //   }
      // }, 1000)
    },

    getNextPracticeCountDownTime: function () {
      // 如果练习次数为0，则推荐其现在就复习，返回 -1
      if (this.data.wordCard.progress == null) return -1;
      // 否则，返回 最后一次复习时间 + 时间间隔数组[复习长度]
      let currentDate = new Date().getTime();

      return (this.data.wordCard.progress.practiceTime + REVIEW_TIME_ARR[this.data.wordCard.progress.seq] * 1000 - currentDate) / 1000
    },


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