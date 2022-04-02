// components/home-card/home-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    ready() {
      this.popover = this.selectComponent('#popover');
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    subBtnTapped() {
      console.log("subBtnTapped")
      this.triggerEvent('subBtnTapped', {});
    },

    mainBtnTapped() {
      this.triggerEvent('mainBtnTapped', {});
    }

  }
})