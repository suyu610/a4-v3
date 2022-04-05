/**
 * 单词数据接口封装 
 * resource.js
 */
import {
  HTTP
} from '../utils/http.js'


class WordList extends HTTP {
  /**
   * 添加单词到单词本
   *
   * @param {word} 单词
   */
  addWordToWordList(word) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/wordlist/add/' + word,
          method: 'POST'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  /**
   * 从单词本中移除单词
   *
   * @param {word} 单词
   */
  removeWordFromWordList(word) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/wordlist/remove/' + word,
          method: 'POST'
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
  /**
   * 添加自定义释义
   */
  makeSelfDef(def) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/word/makeSelfDef',
        method: 'POST',
        data: def
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

  /**
   * 创建单词分组
   */
  createWordListGroup(groupName) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/group/create',
        method: 'POST',
        data: groupName
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

  /**
   * 删除单词分组
   */
  deleteGroup(groupId) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/group/delete/' + groupId,
        method: 'POST',
        data: groupId
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }



  /**
   * 获取单词本分组
   * @param {*} pageIndex 
   * @param {*} groupName 
   */
  getWordListGroup() {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/self/group',
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
  /**
   * 获取自己的单词本
   *
   * @return {wordArr} 单词本数组
   */
  getWordList(groupId, pageIndex) {
    if (pageIndex == null) {
      pageIndex == 1
    }
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/self/' + groupId + '/' + pageIndex,
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



  /**
   * 取消收藏单词
   */

  removeWordArr(wordArr) {
    if (wordArr == null || wordArr.length == 0) return
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/remove/list',
        method: 'POST',
        data: wordArr
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

  /**
   * 进入复习模式
   */
  prePracticeFromWordList(wordArr) {
    if (wordArr == null || wordArr.length == 0) return
    return new Promise((resolve, reject) => {
      this.request({
        url: '/wordlist/practice',
        method: 'POST',
        data: wordArr
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        console.log(e)
        reject(e)
      })
    })
  }

}

export {
  WordList
}