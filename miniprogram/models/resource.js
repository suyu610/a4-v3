/**
 * 数据库公共资源接口封装 
 * resource.js
 */
import {
  HTTP
} from '../utils/http.js'

class Resource extends HTTP {

  /**
   * 获取初始数据
   *  
   */
  getInitData() {
    return this.request({
      url: '/init',
      method: 'POST',
    })
  }

  /**
   * 获取单日句子信息
   *
   * @param {date} 单日日期
   * @return {senInfo} 句子信息
   */
  getSenInfobyDate(date) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/senInfo',
          method: 'GET',
          data: {
            date: date
          }
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  /**
   * 批量获取单词信息
   *
   * @param {word} 单词
   * @return {wordInfo} 单词信息
   */
  getWordListInfo(wordlist) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/dictionary/search/',
        method: 'POST',
        data: wordlist
      }).then(res => {
        resolve(res)
      }).catch(e => reject())
    })
  }
  /**
   * 获取单词信息
   *
   * @param {word} 单词
   * @return {wordInfo} 单词信息
   */
  getWordInfo(word) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/dictionary/search/' + word,
        method: 'GET'
      }).then(res => {
        resolve(res)
      }).catch(e => reject())
    })
  }

  /**
   * 更新单日句子信息
   *
   * @param {date} 日期
   * @param {key} 更新的字段
   * @param {value} 更新后的值
   * @return {errMsg} 状态
   */
  updateSenInfobyDate(date, key, value) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
          name: 'sen-info',
          data: {
            method: 'UPDATE',
            date: date,
            key: key,
            value: value,
          }
        })
        .then(res => {
          resolve(res.result.errMsg)
        })
        .catch(console.error)
    })
  }
}

export {
  Resource
}