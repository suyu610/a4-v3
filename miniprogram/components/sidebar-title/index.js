// components/sidebar-title/index.js
import router from '../../router/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openVip() {
      router.push({
        name: "pay"
      })
    }
  }
})