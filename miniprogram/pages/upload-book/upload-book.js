// pages/upload-book/upload-book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progressBarWidth: 0,
    tips: '加载中',
    showUploadOverLayValue: false
  },

  chooseFile: function () {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      // extension:['txt','xls','xlsx'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        console.log(res)
        that.setData({
          progressBarWidth: 0,
          tips: '加载中',
          showUploadOverLayValue: true
        })
        that.startUpload()
      }
    })
  },

  onClickHide() {
    let that = this
    wx.showModal({
      title: this.data.uploadSuccess ? "上传结果" : "要取消上传吗？",
      content: this.data.uploadSuccess ? "成功 x" + this.data.uploadWordCount + "\r\n失败 x7" : "",
      cancelColor: 'cancelColor',
      success(res) {
        if (res.confirm) {
          that.setData({
            showUploadOverLayValue: false,
            progressBarWidth: 0,
            tips: '加载中',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  startUpload() {
    let that = this
    var timer = setInterval(function () {
      if (that.data.progressBarWidth >= 100) {
        clearInterval(timer)
        that.setData({
          uploadWordCount: 1360,
          uploadSuccess: true
        })
      }
      that.setData({
        progressBarWidth: Math.min(that.data.progressBarWidth + 20, 100)
      })

    }, 400)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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