// pages/index/index.js
const app = getApp()
let gData = app.globalData

// 导入资源接口与用户接口
import config from '../../config.js'
import router from '../../router/index'

import {
  User
} from '../../models/user.js'

import {
  Resource
} from '../../models/resource.js'

import {
  Card
} from '../../models/card'
const originPlanTimeColumn = ["10", "15", "20", "30", "40", "50", "60", "70", "80", "90", "100", "150", "200", "300", "400", "500"]
const userApi = new User()
const resource = new Resource()
const cardApi = new Card()
Page({

  data: {
    showRandomCardValue: false,
    lockDrawerValue: false,
    drawerStatus: false,
    knowNewFeature: false,
    showOverlay: false,
    showPageContainerValue: false,
    showInvitePopupValue: false,
    showInvitePopupResultValue: false,
    inviteSuccess: false,
    showWordGroupPopupValue: false,
    randomCard: {
      "cardId": 976842,
      "date": null,
      "dictCode": "0201",
      "progress": {
        "practiceTime": 1645463839000,
        "seq": 1
      },
      "wordList": []
    },

    planTimeColumn: [],
    showPlanTimeColumnValue: false,
    showGuide: false,
    appearDict: {},
    showPracticeSheetValue: false,
    practiceModeActions: [{
        name: '记忆模式',
      }, {
        name: '复习模式',
      },
      {
        name: '拼写模式',
      },
    ],
    loading: true,
    userInfo: {},
    todayCards: [],
    checkedCardArr: [],
    searchWordInputValue: "",
    showDictPopup: false,
    tmpFlag: false
  },

  showTipImage(e) {
    let current = e.currentTarget.dataset.seq
    console.log(current)
    const baseUrl = "https://cdns.qdu.life/a4/tips/"
    const imgList = [baseUrl + "0.png", baseUrl + "1.png", baseUrl + "2@v1.png", baseUrl + "3.png"]

    wx.previewImage({
      urls: imgList,
      current: imgList[current]
    })
  },

  copyQQ(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.qq,
      // success: function (res) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '复制群号成功',
      //     showCancel: false
      //   });
      // }
    })
  },
  toggleLockDrawer() {
    console.log("index toggleLockDrawer")
    this.setData({
      lockDrawerValue: !this.data.lockDrawerValue
    })
  },
  stopPullTop() {
    console.log("stop")
    this.setData({
      tmpFlag: false
    })
  },
  openDrawer() {
    if (!this.data.drawerStatus) {
      wx.vibrateShort()
      this.setData({
        drawerStatus: true
      })
    }
  },
  closeDrawer() {
    this.setData({
      drawerStatus: false
    })
  },
  openPageContainer() {
    if (!this.data.showPageContainerValue) {
      wx.vibrateShort()
      this.setData({
        showPageContainerValue: true
      })
    }
  },
  leavePageContainer() {
    this.exit()
  },
  exit() {
    this.setData({
      showPageContainerValue: false
    })
  },
  sayHi() {
    let that = this
    if (!this.data.tmpFlag) {
      wx.vibrateShort({
        success() {
          that.setData({
            tmpFlag: true
          })
        }
      })
    }
  },
  //////////////////// 单词分组相关 ///////////////////////////////////
  markWord(e) {
    this.selectComponent(".v-word-dic").setMarkWord()
    console.log(e)
  },

  showWordGroupPopup() {
    this.setData({
      showWordGroupPopupValue: true
    })
  },


  showTips: function (e) {
    if (this.popover == null) {
      this.popover = this.selectComponent("#popover")
    }
    // 获取按钮元素的坐标信息
    var id = e.target.id // 获取点击元素的 ID 值
    wx.createSelectorQuery().in(this).select('#' + id).boundingClientRect(res => {
      // 调用自定义组件 popover 中的 onDisplay 方法
      this.popover.onDisplay(res);
    }).exec();
  },
  onOpenPlanTimeColumn() {
    this.setData({
      showPlanTimeColumnValue: true
    })
  },
  onClosePlanTimeColumn() {
    this.setData({
      showPlanTimeColumnValue: false
    })
  },

  jump2TodayStudy() {
    if (!this.hasSetDict()) {
      return
    }
    router.push({
      name: 'todayStudy'
    })
  },

  hasSetDict() {
    if (this.data.currentBookCode == '' || this.data.currentBookCode == null) {
      wx.showToast({
        icon: 'none',
        title: '请先选择词书',
      })
      return false
    }

    return true
  },

  jump2TodayReview() {
    // 如果未选择词书
    if (!this.hasSetDict()) {
      return
    }

    router.push({
      name: 'todayReview'
    })
  },
  /**
   * 搜索框的值改变 
   */
  bindSearchWordKeyInput: function (e) {
    this.setData({
      searchWordInputValue: e.detail.value
    })
  },

  bindSearchWordKeyInputBlur: function (e) {
    this.bindSearchWordKeyInput(e)
    this.setData({
      keyboardHeight: 0
    })
  },

  onTapSearchWordBtn: function () {
    if (this.data.searchWordInputValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入单词',
      })
      return
    }
    let that = this
    wx.showLoading({
      title: '搜索中',
    })
    app.speakWordFunc(this.data.searchWordInputValue)
    resource.getWordInfo(this.data.searchWordInputValue).then(function (e) {
        wx.hideLoading()
        console.log(e)
        that.setData({
          curWord: e,
          showSearchBar: false,
          showDictPopup: true,
          searchWordInputValue: "",
          showOverlay: false,
          dictNoFooterMode: true,
          dictLoading: false
        })
      }),
      function () {
        //  无单词
        that.setData({
          curWord: null,
          showSearchBar: true,
          showDictPopup: false,
          showOverlay: true,
          dictNoFooterMode: false,
          dictLoading: false
        })
      }
  },
  /**
   * 搜索事件
   * 
   * @param {}  无需参数
   * @setData {showSearchBar}  显示搜索框
   */
  onSearch: function () {
    // 更新数据
    this.setData({
      showOverlay: true,
      showSearchBar: true,
    })

  },

  openOverlay() {
    this.setData({
      showOverlay: true,
    })
  },

  onOpenRuleImage() {
    router.push({
      name: "rules"
    })
  },

  /**
   * 隐藏遮罩事件
   * 
   * @param {}  无需参数
   * @setData {showOverlay, showSearchBar, showSearchBar}  显示搜索框
   */
  onClickHideOverlay: function () {
    let that = this
    // 更新数据
    this.setData({
      showOverlay: false,
      showSearchBar: false,
      showDictPopup: false,
      showRulesOverlayValue: false
    })

  },

  /**
   * 键盘聚焦事件
   * 
   * @param {e}  事件内部参数
   * @setData {keyboardHeight}  显示搜索框
   */
  onKeyboardFocus: function (e) {
    this.setData({
      keyboardHeight: e.detail.height
    })
  },

  /**
   * 点击单词事件
   * 
   * @param {}  无需参数
   * @setData {showPopup}  显示搜索框
   */
  onWord: function (e) {
    let cardId = e.detail.cardId
    let dictCode = e.detail.dictCode

    let that = this
    resource.getWordInfo(e.detail.wordName).then(function (e) {
      console.log(e)
      that.setData({
        currentCardId: cardId,
        currentDictCode: dictCode,
        curWord: e,
        showSearchBar: false,
        showDictPopup: true,
        searchWordInputValue: "",
        showOverlay: false,
        dictNoFooterMode: false
      })
    })

  },

  /**
   * 路由到词典页面事件
   * @param {}  无需参数
   * @toMethod wx.navigateTo()  路由到词典页面
   */
  onNaviToDictionary: function () {
    wx.navigateTo({
      url: '../dictionary/dictionary',
    })
  },

  onConfirmPlanTimeColumn(e) {
    console.log(e)
    this.changeTargetCount(parseInt(e.detail.value))
  },

  onTap: function (e) {
    this.popover = this.selectComponent('#popover1')
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().in(this).select('#homecard').boundingClientRect(res => {
      console.log(res)
      // 调用自定义组件 popover 中的 onDisplay 方法z
      this.popover.onDisplay(res);
    }).exec();
  },

  // 确认修改每日目标
  changeTargetCount(count) {
    let that = this
    let tmpTargetCount = count
    let setting = {
      "targetCount": tmpTargetCount
    }
    wx.showLoading({
      title: '修改中',
    })
    userApi.modifyUserSetting(setting).then(e => {
      // 成功后
      that.initFromServer()
      that.onClosePlanTimeColumn()
      wx.hideLoading()

      wx.showModal({
        title: '修改成功',
        content: "已生成的卡片，将继续存在",
        confirmColor: "#332FEB",
        confirmText: '知道了',
        showCancel: false,
      })
    })
  },

  /**
   * 生命周期函数: 监听页面显示
   * 
   * @param {}  无需参数
   * @toMethod 
   */
  onShow() {
    app.globalData.innerAudioContext.stop()
    // if (app.globalData.needRefreshHomePageData) {
    this.initFromServer()
    // }

    // setTimeout(() => {
    //   this.onTap()
    // }, 500);
  },

  // 判断是否解锁成功
  checkShareStatus() {
    console.log("checkShareStatus")
    let userId = this.data.inviteUserId
    let that = this
    // 先拿到用户的id
    this.judgeSharePopup()
    this.setData({
      showInvitePopupValue: false
    })

    let checkTask = userApi.checkInviteUrlAndUnlock(userId)
    checkTask.then(e => {
      console.log(e)
      if (e.errcode == 0) {
        if (!that.data.userAuthInfo.isVip) {
          that.setData({
            userAuthInfo: {
              role: 'roles-vip',
              vip: true,
              expireDate: 1893427200,
              unlockCount: 1
            }
          })
        }
        // 解锁成功
        that.setData({
          showInvitePopupResultValue: true,
          inviteSuccess: true,
        })
        that.judgeSharePopup()
      }

      if (e.errcode == -11) {
        // 解锁失败，无名额
        this.setData({
          showInvitePopupResultValue: true,
          inviteSuccess: false
        })
      }

      if (e.errcode == 12) {
        // 点击自己的
      }

      if (e.errcode == -10) {
        wx.showToast({
          icon: 'none',
          title: '链接有误',
        })
      }
    })
  },

  judgeSharePopup() {
    let isInviteMode = this.data.isInviteMode
    console.log(isInviteMode)
    if (isInviteMode) {
      this.setData({
        showInvitePopupValue: true,
        isInviteMode: false,
        invitePopupBottomText: "立即解锁",
        invitePopupSubTitleText: "邀请你共同免费解锁会员权益",
        invitePopupTitleText: "会员解锁邀请"
      })

    } else {
      this.setData({
        invitePopLoading: true
      })
      // 在这发起请求
      userApi.getUserAuthInfo().then(e => {
        let invitePopupTitleText = "成功解锁"
        let invitePopupSubTitleText = "共同免费解锁会员权益"
        let invitePopupBottomText = "分享给好友或群聊"
        let role = e.role
        let unlockCount = e.unlockCount
        if (role == 'roles-vip') {
          if (unlockCount < 3) {
            invitePopupSubTitleText = "你可以继续分享，帮助" + parseInt(3 - unlockCount) + "名好友解锁"
          } else {
            invitePopupSubTitleText = "你的解锁名额已用完"
          }
        }

        this.setData({
          unlockCount,
          invitePopupTitleText,
          invitePopupBottomText,
          invitePopupSubTitleText
        })
      })



    }


  },

  // todo: 要拉取一下数据
  showInvitePopup() {
    this.judgeSharePopup()
    this.setData({
      showInvitePopupValue: true
    })
  },

  hideInvitePopup() {
    this.setData({
      showInvitePopupValue: false
    })
  },

  hideInviteResultPopup() {
    this.setData({
      showInvitePopupResultValue: false
    })
  },

  initFromServer() {
    console.log("initFromServer")
    let that = this
    let p = resource.getInitData()

    p.finally(e => {
      this.setData({
        loading: false
      })
    })

    p.catch(e => {
      wx.showToast({
        icon: 'none',
        title: '网络错误，进入离线模式',
      })
    })

    p.then(e => {
      if (e.studyRecordInfo != null && e.studyRecordInfo.lastDayCount == null) {
        e.studyRecordInfo.lastDayCount = 0
      }

      wx.setStorageSync('userAuthInfo', e.userAuthInfo)

      if (e.studyRecordInfo == null) {
        e.studyRecordInfo = {
          lastDayCount: 6,
          monthDayCount: 4,
          yearDayCount: 6
        }
      }
      let options = that.data.options
      if (options != null && options.invite && e.userBaseInfo.id != options.invite) {
        // 如果是自己的，则不弹窗
        that.setData({
          isInviteMode: true,
          inviteUserId: options.invite,
          options: null
        })
      }

      var planTimeColumn = that.data.planTimeColumn
      originPlanTimeColumn.forEach((item, index) => {
        if (item == e.setting.targetCount) {
          planTimeColumn[index] = item + "*"
        } else {
          planTimeColumn[index] = item
        }
      })

      let dictInfo = config.dictInfo
      if (e.customBookList != null) {
        e.customBookList.forEach(book => {
          dictInfo[book.bookCode] = {
            name: book.bookName == null ? '未命名' : book.bookName,
            totalWordNum: book.totalNum,
            isCustomBook: true
          }
        })
      }

      gData.progressList = e.progressList || {}
      gData.currentBookCode = e.currentBookCode
      gData.setting = e.setting
      gData.userAuthInfo = e.userAuthInfo
      gData.userid = e.userid
      gData.userBaseInfo = e.userBaseInfo
      gData.dailyStudyTask = e.dailyStudyTask
      gData.dailyFinishedData = e.dailyFinishedData
      gData.notificationConfig = e.notificationConfig
      gData.needReviewTodayStudyDate = true
      gData.studyRecordInfo = e.studyRecordInfo

      that.setData({
        notificationConfig: e.notificationConfig,
        isIOS: app.globalData.isIOS != null,
        progressList: e.progressList,
        currentBookCode: e.currentBookCode,
        dailyStudyTask: e.dailyStudyTask,
        userAuthInfo: e.userAuthInfo,
        userBaseInfo: e.userBaseInfo,
        studyRecordInfo: e.studyRecordInfo,
        setting: e.setting,
        dailyFinishedData: e.dailyFinishedData,
        dictInfo,
        loading: false,
        planTimeColumn
      })

      that.judgeSharePopup()

    })
  },
  share() {
    console.log("share")
  },

  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      path: "pages/index/index?invite=" + app.globalData.userid,
      title: options.from == 'button' ? "邀请你共同免费解锁会员权益" : "来体验A4纸背单词的方法吧", // 默认是小程序的名称(可以写slogan等)
      imageUrl: 'https://cdns.qdu.life/a4/images/invite-share.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {}
      }
    }
    // 返回shareObj
    return shareObj;
  },

  onShareTimeline: function () {
    return {
      title: '来体验A4纸背单词的方法吧',
      imageUrl: '../../images/share.png'
    }
  },

  onChangePlanPicker(e) {
    console.log(parseInt(e.detail.value))
  },

  initSystem() {
    let that = this
    wx.getStorage({
      key: 'knowNewFeature',
      success(res) {
        that.setData({
          knowNewFeature: res.data
        })
      },
      fail() {
        that.setData({
          knowNewFeature: false
        })
      } 
    })

    this.setData({
      screenHeight: app.globalData.screenHeight,
      navigationBarHeight: app.globalData.navigationBarHeight,
      searchBarTop: app.globalData.searchBarTop,
      searchBarHeight: app.globalData.searchBarHeight,
      scrollViewHeight: app.globalData.scrollViewHeight,
      windowWidth: app.globalData.windowWidth,
    })
  },

  /**  
   * 生命周期函数: 监听页面加载
   * 
   * @param {}  无需参数
   * @toMethod 转入初始化函数 this.init()  
   */
  onLoad: function (options) {
    this.initSystem()
    this.setData({
      options
    })
  },

  setBackgroudImage() {
    this.setData({
      alarmOverlay: true
    })
  },

  openAlarm(e) {
    console.log(e.detail.notificationConfig)
    wx.showLoading({
      title: '设置中',
    })

    app.globalData.notificationConfig = e.detail.notificationConfig

    userApi.modifyNotificationConfig(e.detail.notificationConfig).then(e => {
      wx.hideLoading()
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          console.log(res.subscriptionsSetting)
        }
      })
      let that = this
      // this.setBackgroudImage()
      wx.requestSubscribeMessage({
        tmplIds: ['HjD6Lq6HwmjuG7fCBKZ96sUEzmvAnl39bu3gS1rHbXU'],
        success(res) {
          console.log(res)
          wx.setStorageSync('notificationSetFlag', app.globalData.todayDate)
          that.setData({
            alarmOverlay: false
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    })
  },

  showRandomCard: function () {
    if (!this.hasSetDict()) {
      return
    }
    this.setData({
      showRandomCardValue: true
    })
  },

  onCloseRandomCard: function () {
    this.setData({
      showRandomCardValue: false
    })
  },
  /**
   * 下拉刷新函数
   *   
   * @param {}  无需参数
   * @toMethod this.init()  转入初始化函数
   */
  onScrollViewRefresh: function (e) {
    if (e.detail.dy > 80) {
      this.onSearch()
      this.setData({
        refresherTriggered: false
      })
    } else {
      this.setData({
        refresherTriggered: false
      })
    }
  },
  enter() {

  },


  onTapMenu: function () {
    this.setData({
      drawerInfo: "transform:translateX(316px)"
    })
  },

  /**
   * 跳转到练习页
   * 
   * @param {}  无需参数
   * @toPage practice.index  跳转到练习页
   */
  onPractice: function () {
    if (this.data.checkedCardArr.length == 0) return
    // 增加复习模式
    this.setData({
      showPracticeSheetValue: true
    })
  },

  onSelectPracticeSheet(e) {
    let nameStr = e.detail.name
    if (nameStr == '记忆模式') {
      this.jumpToPractice('memory')
      return
    }

    if (nameStr == '复习模式') {
      this.jumpToPractice('practice')
      return
    }

    if (nameStr == '拼写模式') {
      this.jumpToSpellPractice('spelling')
      return
    }
  },

  onClosePracticeSheet() {
    this.setData({
      showPracticeSheetValue: false
    })
  },

  jumpToPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../practice/practice?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },

  jumpToSpellPractice(pMode) {
    // 传参
    var obj = JSON.stringify(this.data.checkedCardArr)
    wx.navigateTo({
      url: '../spell/spell?checkedCardArr=' + obj + '&pMode=' + pMode,
    })
  },
})