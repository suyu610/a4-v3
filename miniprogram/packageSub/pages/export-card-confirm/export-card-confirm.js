// pages/export-confirm/export-confirm.js
import router from '../../../router/index'
const app = getApp()
const gData = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileUrl: "",
    loading: true

  },
  onTapBottomBtn() {
    let that = this
    wx.showLoading({
      title: '导出中',
    })
    wx.downloadFile({
      url: that.data.fileUrl, // 下载url
      success(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          wx.showToast({
            icon: 'none',
            title: '导出成功',
          })
          console.log('res.statusCode', res)
          // that.openFileEvs(res)
          wx.shareFileMessage({
            filePath: res.tempFilePath,
            success(data) {
              console.log('转发成功！！！', data)
            },
            fileName: '卡片导出.pdf',
            fail: console.error,
          })
        }
      },
      fileName: '卡片导出',
      fail: console.error,
    })
  },

  previewPng() {
    let that = this
    wx.previewImage({
      urls: [that.data.fileUrl + "?ci-process=doc-preview&page=1&dstType=png"],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = router.extract(options);
    let that = this

    if (data != null && data.wordlist != null && data.wordlist.length != 0) {
      // 发送请求
      wx.request({
        url: 'http://49.232.162.245:7777/genPdf',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' //修改此处即可
        },
        data: {
          "wordlist": data.wordlist
        },
        success: function (e) {
          that.setData({
            loading: false,
            fileUrl: e.data
          })
        },
        fail: function (e) {
          console.log(e)
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '发生错误',
        success() {
          wx.navigateBack({
            delta: 0,
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})