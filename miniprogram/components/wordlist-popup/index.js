// components/wordlist-popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {
    curId: 0,
    wordlistGroup: [{
        id: 0,
        name: '我的收藏',
        count: 18
      }, {
        id: 4,
        name: '我的收藏',
        count: 18
      }, {
        id: 5,
        name: '我的收藏',
        count: 18
      }, {
        id: 6,
        name: '我的收藏',
        count: 18
      }, {
        id: 7,
        name: '我的收藏',
        count: 18
      },
      {
        id: 1,
        name: '自定义单词本-1',
        count: 27
      }, {
        id: 2,
        name: '自定义单词本-2',
        count: 123
      }
    ]
  },


  /**
   * 组件的方法列表
   */
  methods: {
    closePopup() {
      this.setData({
        show: false
      })
    },
    selectGroup(e) {
      this.setData({
        curId: e.currentTarget.dataset.id
      })
    },

    jump2BookList() {
      this.triggerEvent("jump2BookList")
    }

  }
})