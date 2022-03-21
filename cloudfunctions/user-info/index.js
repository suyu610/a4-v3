// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.method == 'GET') {
    try {
      return await cloud.database().collection('user-info').where({
        openid: wxContext.OPENID,
      }).get()
    } catch (e) {
      console.error(e)
    }
  } else if (event.method == 'UPDATE') {
    try {
      let key = event.key
      let value = event.value
      return await cloud.database().collection('user-info').where({
        openid: wxContext.OPENID,
      }).update({
        data: {
          [key]: value
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}