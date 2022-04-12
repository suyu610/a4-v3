/**
 * 卡片相关接口封装
 * card.js
 */

/**
 * 单词卡片数据模型
 * 有三种单词卡片
 * 1. cardIdMap
 *   {{ "CARD_ID" : "详细内容" }}
 * 
 * 2. createDateCardMap
 *   {"CARD_CREATE_DATE": ["CARD_ID","CARD_ID"]} 
 *     CARD_CREATE_DATE : "yyyymmdd"
 * 
 * 3. reviewDateCardMap 
 *   {"NEED_REVIEW_TIMESTAMP":["CARD_ID","CARD_ID"]}
 *     NEED_REVIEW_TIMESTAMP : "需要复习的时间戳"
 *     如果该时间戳小于当前时间，则将其统一放入，"NeedReview"里
 */


import {
  HTTP
} from '../utils/http.js'
class Card extends HTTP {

  emptyCard(cardId) {
    // 判断当前是自定义词书，还是官方词书
    return new Promise((resolve, reject) => {
      this.request({
        url: '/userCard/status/empty/' + cardId,
        method: 'POST',
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

  completeCard(cardId) {
    // 判断当前是自定义词书，还是官方词书
    return new Promise((resolve, reject) => {
      this.request({
        url: '/userCard/status/complete/' + cardId,
        method: 'POST',
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

  genNewCard(useCustomBook) {
    // 判断当前是自定义词书，还是官方词书
    return new Promise((resolve, reject) => {
      this.request({
        url: '/userCard/genNewCard',
        method: 'POST',
        data: {
          useCustomBook
        }
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }
  // 练习前做的准备，比如简短释义、用户自定义释义
  prePractice(cardIdArr) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/userCard/practice/pre',
        method: 'POST',
        data: cardIdArr
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }
  // 当前需要复习的卡片
  getNeedReviewCard(pageIndex) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/userCard/review/' + pageIndex,
        method: 'GET'
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }
  // 今日卡片
  genTodayCard(pageIndex, useCustomBook) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/today/' + pageIndex,
          method: 'POST',
          data: {
            useCustomBook
          }
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  // 全部卡片
  getAllCard(filterConfig, pageIndex) {
    filterConfig['pageIndex'] = pageIndex
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/all/' + pageIndex,
          method: 'POST',
          data: filterConfig
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  // 按月份的进度

  // 按日期的卡片
  getCardArrByDate(data, pageIndex) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/' + data + '/' + pageIndex,
          method: 'GET'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  // 删除卡片
  deleteCard(cardId) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/delete/' + cardId,
          method: 'POST'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  // 替换卡片中的某个单词
  replaceWordInCard(dictCode, word, cardId) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/word/replace/' + dictCode + '/' + cardId + '/' + word,
          method: 'POST'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  // 删除卡片中的单词
  deleteWordInCard(word, cardId) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/word/delete/' + cardId + '/' + word,
          method: 'POST'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }


  // 全部的已删除卡片

  // 根据ID数组获取卡片
  getCardsByCardIdArr(cardIdArr) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/userCard/cardlist',
          method: 'POST',
          data: cardIdArr
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
}

export {
  Card
}