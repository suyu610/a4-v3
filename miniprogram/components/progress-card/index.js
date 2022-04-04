// components/progress-card/index.js
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
    userInfo: Object,
    progressList: Object,
    currentBookCode: String
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
    ready: function () {
      let currentBookCode = this.data.currentBookCode
      this.setData({
        dictInfo: config.dictInfo,
        darkMode: app.globalData.theme == 'dark',
        remainDay: currentBookCode != null && currentBookCode != '' ? parseInt(config.dictInfo[currentBookCode].totalWordNum / app.globalData.setting.targetCount) : 0
      })
    }
  },

  /**
   * 数据监听器
   */
  observers: {
    'progressList,currentBookCode': function (progressList, currentBookCode) {
      // 设置当前时间戳
      this.setData({
        currentTimeStamp: app.globalData.currentTimeStamp,
        remainDay: currentBookCode != null && currentBookCode != '' ? parseInt(config.dictInfo[currentBookCode].totalWordNum / app.globalData.setting.targetCount) : 0
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 向上传递事件
     */
    onNaviToDictionary: function () {
      this.triggerEvent('naviToDictionary', {}, {})
    },

  }
})