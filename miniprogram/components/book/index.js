// components/dict-book/index.js
Component({

  properties: {
    bookName: String,
    totalCount: Number,
    useCustomBook: {
      type: Boolean,
      value: false
    },
    bookColumnId: {
      type: Number,
      value: 1 
    }
  },

  data: {},
  lifetimes: {},

  methods: {
    imgLoad(e) {
      console.log(e)
    },

  }
})