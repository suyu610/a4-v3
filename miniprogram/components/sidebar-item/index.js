// components/sidebar-item/index.js
import router from '../../router/index'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    routerName: String,
    routerData: Object,
    iconPath: {
      type: String,
      value: './images/allcard.png',
    },
    itemName: {
      type: String,
      value: '未命名',
    },
    isVip: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isMiniScreen: app.globalData.isMiniScreen
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpRouter() {
      if (this.data.routerName != '') {
        router.push({
          name: this.data.routerName,
          data: this.data.routerData
        })
      }
    }
  }
})