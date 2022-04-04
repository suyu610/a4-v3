/**
 * 数据库用户资源接口封装
 * user.js
 */
import {
  HTTP
} from '../utils/http.js'

class User extends HTTP {
  /**
   * 获取Token
   * 
   * @param {} 无需参数
   * @return {token} 用户信息 
   */
  getToken(code) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/token',
          method: 'POST',
          data: {
            code
          }
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }

  /**
   * 获取用户信息信息
   *
   * @param {} 无需参数
   * @return {userInfo} 用户信息
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
          name: 'user-info',
          data: {
            method: 'GET'
          }
        })
        .then(res => {
          resolve(res.result.data[0])
        })
        .catch(console.error)
    })
  }
  /**
   * 修改用户资料
   */

  modifyUserProfile(profile) {
    return new Promise((resolve, reject) => {
      this.request({ 
        url: '/user/profile',
        method: 'POST', 
        data: profile
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
   * 修改用户设置
   */

  modifyUserSetting(setting) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/user/modifySetting',
        method: 'POST',
        data: setting 
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
   * 重置词书
   */
  resetDictProgress(dictDode) {
    return new Promise((resolve, reject) => {
      this.request({
        url: '/user/resetProgress/' + dictDode,
        method: 'POST',
      }).then(res => {
        resolve(res)
      }).
      catch(function (e) {
        reject(e)
      })
    })
  }

}



export {
  User
}