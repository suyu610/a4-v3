module.exports = {
  // 搜索课程的页面
  index: {
    auth: false,

    path: '/pages/index/index',
  },


  settings: {
    auth: false,
    path: '/pages/settings/settings',
  },

  uploadBook: {
    auth: true,
    path: '/pages/upload-book/upload-book'
  },

  wordlist: {
    path: '/pages/wordlist/wordlist'
  },
  wordlistDetail: {
    path: '/pages/wordlist/detail/detail'
  },

  calendar: {
    path: '/pages/calendar/calendar',
  },


  newWord: {
    path: '/pages/new-word/index'
  }

};