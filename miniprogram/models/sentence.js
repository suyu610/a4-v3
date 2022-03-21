/**
 * 句子资源接口封装
 * user.js
 */
import {
  HTTP
} from '../utils/http.js'

class Sentence extends HTTP {

  /**
   * 切换收藏句子的状态
   *
   * @param {date}    卡片日期
   * @param {toStatus} 改变之后的状态 true / false
   */
  toggleSentenceMarkStatus(date, toStatus) {
    let url = (toStatus ? '/senInfo/add/' : '/senInfo/remove/') + date
    return new Promise((resolve, reject) => {
      this.request({
          url: url, 
          method: 'POST',
          data: {
            date
          }
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
}
export {
  Sentence
}