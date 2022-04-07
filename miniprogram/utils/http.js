/**
 * 网络请求接口
 * http.js
 */
import config from '../config.js'

const tips = {
  "1": '抱歉，出现了一个错误',
  "-1": '登陆失败，请重启小程序',
  "-2": '请重启小程序',
  "-4": '无此单词，已发送反馈',
  "-5": '请勿重复添加单词',
  "-6": '取消收藏单词失败',
  "-7": '单词分组名为空',
  "-8": '词书背完啦'
}

/**
 * 获取令牌事件 
 * 
 * @param {}  无需参数
 * @return { token }  获取到登陆令牌
 */
function getToken() {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: 'token',
      success(res) {
        console.log("has Token")
        resolve(res.data)
      },
      fail() {
        wx.showLoading({
          title: '初始化中',
        })
        genToken().then(function (token) {
          console.log("not token")
          console.log(token)
          wx.hideLoading()
          resolve(token)
        })
      }
    })
  })
}

function genToken() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success(res) {
        console.log(res.code)
        if (res.code) {
          wx.request({
            url: config.api_base_url + '/token',
            method: "POST",
            data: {
              code: res.code
            },
            success(res) {
              console.log("get server token success")
              resolve(res.data.data.token);
              wx.setStorage({
                key: "token",
                data: res.data.data.token
              })
            },
            fail(res) {
              reject(res)
            }
          })
        } else {
          reject(res.errMsg)
        }
      }
    })
  })
}

class HTTP {
  /**
   * 发起网络请求
   *
   * @param { url, data, method } 
   * @return { Promise } 
   */
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    let that = this
    return new Promise(function (resolve, reject) {
      let token = getToken()
      token.then(function (token) {
        // 发起网络请求
        wx.request({
          url: config.api_base_url + url,
          method: method,
          data: data,
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success: (res) => {
            const code = res.statusCode.toString()
            if (code.startsWith('2') && res.data.errcode == 0) {
              resolve(res.data.data)
            } else {
              const error_code = res.data.errcode
              // console.error(res) 
              if (error_code == -2 || error_code == -1) {
                // token失效
                console.log("token 失效")
                wx.removeStorageSync("token")
                that._show_error(error_code)
              } else {
                reject(error_code)
                that._show_error(error_code)
              }
            }
          },
          fail: (err) => {
            // console.error(err.errMsg)
            reject()
            that._show_error(1)
          }
        })
      })
    })
  }

  /**
   * request方法的内部封装
   */
  _request(url, token, data, method) {
    // console.log(config.api_basebase_url + url)
    // console.log('code: ' + data.code)
    // console.log('token: ' + token)
    let that = this
    return new Promise(function (resolve, reject) {

    })
  }
  /**
   * 错误提示
   */
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}