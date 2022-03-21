// components/progressCard/index.js
const app = getApp()
import config from '../../config.js'

// 导入资源接口与用户接口
// import { Resource } from '../../models/resource.js'
// const resource = new Resource()
import {
  Sentence
} from '../../models/sentence.js'
const sentence = new Sentence()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: Boolean,
    senInfo: Object,
    userInfo: Object,
    progressList: Object,
    currentDicCode: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        dictInfo: config.dictInfo,
        darkMode: app.globalData.theme == 'dark'
      })
    }
  },

  /**
   * 数据监听器
   */
  observers: {
    'progressList,currentDicCode': function (progressList, currentDicCode) {
      // 设置进度条宽度  
      this.getProgressCurrentWidth(progressList, currentDicCode)
      // 设置当前时间戳
      this.setData({
        currentTimeStamp: app.globalData.currentTimeStamp
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 计算当前progress-current的宽度（从而计算进度条的百分比）
     * 
     * @param {} 无需参数
     * @setData {progressCurrentWidth} 进度条当前宽度
     */
    getProgressCurrentWidth: function (progressList, currentDicCode) {
      if (app.globalData.progressList == null || app.globalData.progressList.length == 0 || this.data.currentDicCode == '') return
      let num_1 = Math.min(this.data.progressList[this.data.currentDicCode], config.dictInfo[this.data.currentDicCode].totalWordNum)
      let num_2 = config.dictInfo[this.data.currentDicCode].totalWordNum
      // 计算.progress节点容器宽度 
      this.setData({
        progressCurrentWidth: parseInt(100 * (num_1 / num_2))
      })
    },

    /**
     * 计算当前progress-current的宽度（从而计算进度条的百分比）
     * 
     * @param {} 无需参数
     * @setData {progressCurrentWidth} 进度条当前宽度
     */
    onLike: async function () {
      // 本地UPDATE
      let str_1 = `senInfo.ifLike`
      let str_2 = `senInfo.likeNum`
      this.setData({
        [str_1]: !this.data.senInfo.ifLike,
        [str_2]: !this.data.senInfo.ifLike ? this.data.senInfo.likeNum + 1 : this.data.senInfo.likeNum - 1,
      })
      app.globalData.senInfo = this.data.senInfo

      // 云端UPDATE
      sentence.toggleSentenceMarkStatus(app.globalData.todayDate, this.data.senInfo.ifLike)

      // await resource.updateSenInfobyDate(app.globalData.todayDate, 'likeNum', this.data.senInfo.likeNum)
      // await user.updateUserInfo('likeTodaySenInfo', {
      //   date: app.globalData.todayDate,
      //   status: likeTodaySenInfo.status
      // })
    },

    /**
     * 向上传递事件
     */
    onNaviToDictionary: function () {
      this.triggerEvent('naviToDictionary', {}, {})
    }
  }
})