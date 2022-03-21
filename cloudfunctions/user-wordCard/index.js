// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.method == 'GET') {
    try {
      return await cloud.database().collection('user-wordCard').where({
        openid: wxContext.OPENID,
        date: event.date,
      }).get()
    } catch (e) {
      console.error(e)
    }
  }
}