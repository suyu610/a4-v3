// pages/upload-book/upload-book.js
const app = getApp()
let uploadTask;
import config from '../../config.js';
import {
  CustomBook
} from '../../models/customBook.js'
const customBookApi = new CustomBook()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips: true,
    progressBarWidth: 0,
    tips: '上传中',
    showUploadOverLayValue: false,
    bookList: []
  },
  showNoMore: function () {
    let that = this
    wx.showModal({
      title: "提示",
      content: "确认要关闭使用说明吗",
      cancelColor: 'cancelColor',
      confirmColor: '#220aac',
      success(res) {
        if (res.confirm) {
          that.setData({
            showTips: false
          })

        }
      }
    })
  },

  isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (value.toLowerCase() === arr[i].toLowerCase()) {
        return true;
      }
    }
    return false;
  },

  // 判断是否为 txt/text 或 excel:xls,xlsx
  checkFileType(extension) {
    const extensionList = ["txt", "text", "xls", "xlsx"]
    return this.isInArray(extensionList, extension)
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
        if (res.tempFiles.length > 0) {
          var filename = res.tempFiles[0].path
          var index = filename.lastIndexOf(".");
          var suffix = filename.substr(index + 1);
          if (that.checkFileType(suffix)) {
            that.setData({
              progressBarWidth: 0,
              tips: '加载中',
              showUploadOverLayValue: true
            })
            that.startUpload(filename)
          } else {
            wx.showToast({
              icon: 'error',
              title: '文件类型不符',
            })
          }
        }

      }
    })
  },
  /**
   * 上传成功后弹出命名的modal，否则提示是否要中断上传
   */
  onClickBottomBtn() {
    let that = this
    if (this.data.uploadSuccess) {
      that.onClickHide()
      wx.showModal({
        title: '提示',
        placeholderText: '请输入词书名',
        editable: true,
        confirmColor: '#220aac',

        success(res) {
          if (res.confirm) {
            // 重命名
            wx.showToast({
              title: '成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '要取消上传吗？',
        confirmColor: '#220aac',
        success(res) {
          if (res.confirm) {
            that.onClickHide()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  onClickHide() {
    uploadTask.abort() // 取消上传任务
    let that = this
    this.setData({
      showUploadOverLayValue: false,
    })

    setTimeout(() => {
      that.setData({
        progressBarWidth: 0,
        tips: '加载中',
      })
    }, 300);
  },

  startUpload(filePath) {
    let that = this
    uploadTask = wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: config.api_base_url + '/custom-book/upload',
      header: {
        "Authorization": wx.getStorageSync('token')
      },
      success(res) {
        console.log(res.data)
        let data = JSON.parse(res.data);
        console.log(data)
        console.log(data.errcode)
        if (data.errcode == 0) {
          that.setData({
            uploadWordCount: data.data.successCount,
            totalWordCount: data.data.totalCount,
            uploadSuccess: true
          })
        } else {
          wx.showToast({
            title: data.errmsg,
          })
        }
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '未知错误',
        })
        console.log(res) //do something
      }
    })

    uploadTask.onProgressUpdate((res) => {
      that.setData({
        progressBarWidth: Math.min(res.progress, 100)
      })
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentBookCode = app.globalData.currentBookCode
    customBookApi.getCustomBook().then(e => {
      e.forEach(book => {
        if (book.bookCode == currentBookCode) {
          book.isCurrent = true
        }
      })
      this.setData({
        bookList: e
      })
    })
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
    this.setData({
      navigationBarHeight: app.globalData.navigationBarHeight,
      windowHeight: app.globalData.windowHeight,
      tabContainerHeight: app.globalData.windowHeight - app.globalData.navigationBarHeight
    })
    let that = this

    // const query = wx.createSelectorQuery().in(this)

    // query.selectAll('#descContainer').boundingClientRect(function (res) {
    //   that.setData({
    //     descContainerHeight: res[0].height + 30
    //   })

    // }).exec()

    // descContainerHeight
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