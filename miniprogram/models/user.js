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
  checkInviteUrlAndUnlock(userId) {
    return new Promise((resolve, reject) => {
      this.request({
          url: '/user/invite/check/' + userId,
          method: 'GET',
        }).then(res => {
          resolve(res)
        })
        .catch(console.error)
    })
  }
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
  modifyNotificationConfig(notificationConfig) {
    return new Promise((resolve, reject) => {
      this.request({ 
        url: '/user/notification',
        method: 'POST',
        data: notificationConfig 
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