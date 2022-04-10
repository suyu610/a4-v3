// components/sidebar-canlendar/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    briefCalendarList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    todayIndex: new Date().getDay(),
    isMiniScreen: app.globalData.isMiniScreen
  },
  lifetimes: {

  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})