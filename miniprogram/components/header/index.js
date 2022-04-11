// components/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    bgColor: String,
    cardNum: Number,
    selectMode: Boolean,
    cardId: {
      type: String,
      value: 0
    },
    paddingBottom: {
      type: Number,
      value: 24
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRightBtnTapped() {
      this.triggerEvent("onRightBtnTapped", {
        cardId: this.data.cardId
      })
    }
  }
})