// components/dict-book-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasAdded: Boolean,
    isCurrent: Boolean,
    finished: Boolean,
    bookName: String,
    bookColumnId: Number,
    curStudyNum: {
      type: Number,
      value: 0
    },
    desc: {
      type: String,
      value: '暂无详细介绍'
    },
    totalCount: Number,
    planDayCount: {
      type: Number,
      value: 30
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    remainDay: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    ready() {
      this.setData({
        remainDay: parseInt(this.data.totalCount / this.data.planDayCount)
      })
    }
  }
})