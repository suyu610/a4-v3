// pages/upload-book/upload-book.js
const app = getApp()
let uploadTask;
import config from '../../config.js';
import {
  CustomBook
} from '../../models/customBook.js'
const customBookApi = new CustomBook()
import {
  WordBook
} from '../../models/wordbook.js'

const wordbookApi = new WordBook()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notShowTips: false,
    progressBarWidth: 0,
    tips: '上传中',
    showUploadOverLayValue: false,
    bookList: [],
    longPressActionSheet: [{
        name: '查看单词列表',
      }, {
        name: '重命名',                                                                                                                                                                                                                                                                                                                                      
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ,
      {
        name: '删除词书',
      },
      {
        name: '重置进度',
        color: "red",
      },
    ],
  },
  onCloseLongPressActionSheet() {
    this.setData({
      showLongPressActionSheetValue: false
    })
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
            notShowTips: true
          })  
          wx.setStorageSync('showCustomTips', true)
        }
      }
    })
  },

  onLongPressBookItem(e) {
    let curBookCode = e.currentTarget.dataset.code
    let curBookName = e.currentTarget.dataset.name == null ? '未命名词书' : e.currentTarget.dataset.name
    this.setData({
      curBookCode,
      curBookName,
      showLongPressActionSheetValue: true
    })
  },

  onTapBookItem(e) {
    let bookCode = e.currentTarget.dataset.code
    let bookName = e.currentTarget.dataset.name
    if (bookCode == this.data.currentBookCode) return
    let that = this
    wx.showModal({
      title: "确认",
      content: '是否切换词书为 \r\n 「' + (bookName == null ? '未命名' : bookName) + '」',
      confirmColor: "#220aac",
      success(res) {
        if (res.confirm) {
          that.confirmSwitchBook(bookCode)
        }
      }
    })
  },


  confirmSwitchBook(bookCode) {
    let that = this
    if (bookCode != null) {
      customBookApi.switchCurCustomBook(bookCode).then(e => {
        wx.showToast({
          icon: 'none',
          title: '已切换至 \r\n「' + (e.book.bookName == null ? '未命名' : e.book.bookName) + '」',
        })
        app.globalData.currentBookCode = bookCode
        let bookList = that.data.bookList
        bookList.forEach(book => {
          book.isCurrent = book.bookCode == bookCode
        })
        this.setData({
          bookList,
          currentBookCode: bookCode
        })
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择词书',
      })
    }
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
            customBookApi.renameCustomBook(res.content, that.data.uploadBookId).then(e => {
              wx.showToast({
                title: '成功',
              })
              let bookList = that.data.bookList
              bookList.forEach(book => {
                if (book.bookCode == that.data.uploadBookId) {
                  book.bookName = res.content
                }
              })

              config.dictInfo[that.data.uploadBookId] = {
                name: res.content,
                totalWordNum: config.dictInfo[that.data.uploadBookId].totalWordNum,
                isCustomBook: true
              }
              that.setData({
                bookList
              })
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
        if (data.errcode == 0) {
          let bookList = that.data.bookList
          let uploadBook = {
            totalCount: data.data.successCount,
            bookName: null,
            bookCode: data.data.customBookId
          }

          bookList.push(uploadBook)

          config.dictInfo[data.data.customBookId] = {
            name: '未命名',
            totalWordNum: data.data.successCount,
            isCustomBook: true
          }

          that.setData({
            bookList,
            uploadWordCount: data.data.successCount,
            totalWordCount: data.data.totalCount,
            uploadSuccess: true,
            uploadBookId: data.data.customBookId
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
    let progressList = app.globalData.progressList
    var notShowTips = wx.getStorageSync('showCustomTips')
    if (notShowTips == '') {
      this.setData({
        notShowTips: false
      })
    } else {
      this.setData({
        notShowTips
      })
    }
    customBookApi.getCustomBook().then(e => {
      e.forEach(book => {
        book.curStudyNum = progressList[book.bookCode]
        book.totalCount = book.totalNum
        if (book.bookCode == currentBookCode) {
          book.isCurrent = true
        }
      })
      this.setData({
        currentBookCode,
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
      tabContainerHeight: app.globalData.windowHeight - app.globalData.navigationBarHeight,
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