/**
 * 进度相关接口封装 
 * 1. 重置当前词书的进度
 * 2. 提交卡片复习完成
 */

import {
  HTTP
} from '../utils/http.js'

class Progress extends HTTP {
  savePracticeProgress(cardArr) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/progress/save',
          method: 'POST',
          data: cardArr
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
  /**
   * 获取该月，每日的练习次数和新学单词，只会返回有学习记录的天
   * @param {String} month yyyymm格式 
   */
  getProgressByMonth(month) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/progress/month/' + month,
          method: 'GET'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
}
export {
  Progress
}