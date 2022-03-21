// config.js
const config = {
  // 域名前缀 
  api_base_url: 'https://beta.opentext.press/v1',
  // api_base_url: 'http://localhost:6110/v1', 
  // api_base_url: 'http://192.168.1.108:6110/v1', 

  // 词书信息            
  dictInfo: {
    "0101": {
      name: "人教版一年级上",
      totalWordNum: 53
    },  
    "0201": {
      name: "初中英语词汇",
      totalWordNum: 1849
    },
    "0202": {
      name: "中考核心词汇",
      totalWordNum: 2140
    },
    "0203": {
      name: "中考英语词汇",
      totalWordNum: 2559
    },
    "0301": {
      name: "高中英语词汇",
      totalWordNum: 3786
    },
    "0302": {
      name: "高考大纲词汇",
      totalWordNum: 3635
    },
    "0303": {
      name: "高考英语词汇",
      totalWordNum: 4077
    },
    "0401": {
      name: "四级核心词汇",
      totalWordNum: 5193
    },
    "0402": {
      name: "四级大纲词汇",
      totalWordNum: 6298
    },
    "0403": {
      name: "六级核心词汇",
      totalWordNum: 5328
    },
    "0404": {
      name: "六级大纲词汇",
      totalWordNum: 8013
    },
    "0405": {
      name: "专四词汇",
      totalWordNum: 4875
    },
    "0406": {
      name: "专八词汇",
      totalWordNum: 5829
    },
    "0407": {
      name: "专升本词汇",
      totalWordNum: 3218
    },
    "0501": {
      name: "考研核心词汇",
      totalWordNum: 2015
    },
    "0502": {
      name: "考研大纲词汇",
      totalWordNum: 5617
    },
    "0503": {
      name: "考研英语词汇",
      totalWordNum: 6088
    },
    "0601": {
      name: "托福核心词汇",
      totalWordNum: 4264
    },
    "0602": {
      name: "托福词汇",
      totalWordNum: 5224
    },
    "0603": {
      name: "雅思核心词汇",
      totalWordNum: 3838
    },
    "0604": {
      name: "雅思词汇",
      totalWordNum: 5470
    },
    "0605": {
      name: "GRE核心词汇",
      totalWordNum: 2968
    },
    "0606": {
      name: "GRE词汇",
      totalWordNum: 6513
    },
    "1001": {
      name: "测试自定义词书",
      totalWordNum: 1
    } 
  }
}

export default config


// index.js init()
// let senInfo = await resource.getSenInfobyDate(app.globalData.todayDate)
// console.log(senInfo)

// let userInfo = await user.getUserInfo()
// let userWordCardToday = await user.getUserWordCardByDate(app.globalData.todayDate)

// // Check: 用户点赞记录是否更新到今天
// if (userInfo.likeTodaySenInfo.date == app.globalData.todayDate) {
//   this.setData({
//     // senInfo,
//     userInfo,
//     loading: false,
//     userWordCardToday,
//   })
// } else {
//   // 本地UPDATE: userInfo.LikeTodaySenInfo
//   userInfo.likeTodaySenInfo = {
//     date: app.globalData.todayDate,
//     status: false
//   }

//   this.setData({
//     // senInfo,
//     userInfo,
//     loading: false,
//     userWordCardToday,
//   })

//   // 云端UPDATE: userInfo.LikeTodaySenInfo
//   await user.updateUserInfo('likeTodaySenInfo', {
//     date: app.globalData.todayDate,
//     status: false
//   })
// }