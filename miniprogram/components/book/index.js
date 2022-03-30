// components/dict-book/index.js
Component({

  properties: {
    bookName: String,
    totalCount: Number,
  },

  data: {
    randomIndex: 1
  },
  lifetimes: {
    ready() {
      this.setData({
        randomIndex: Math.round(Math.random() * 4 + 1)
      })
    }
  },

  methods: {


  }
})