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

  todayStudy: {
    path: '/pages/today-study/today-study'
  },

  todayReview: {
    path: '/pages/today-review/today-review'
  },

  allCard: {
    path: '/pages/all-card/all-card'
  },


  pay: {
    path: '/pages/pay/pay'
  },

  listen: {
    path: '/pages/listen/listen'
  },

  exportCardConfirm: {
    path: '/packageSub/pages/export-card-confirm/export-card-confirm'
  },

  snapshot: {
    path: '/packageSub/pages/snapshot/snapshot'
  }
};