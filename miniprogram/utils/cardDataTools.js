/*!
 * @author: hpy
 * @version:0.1 
 * @date: 2022-1-27 04:16:36
 *
 */
import {
  Card
} from '../models/card'

const cardApi = new Card()

const app = getApp()
// 需要复习的时间数组，按秒来算，5min, 30min, 12h, 1d, 2d, 4d, 7d, 15d
const REVIEW_TIME_ARR = [
  0,
  5 * 60,
  30 * 60,
  12 * 60 * 60,
  1 * 24 * 60 * 60,
  2 * 24 * 60 * 60,
  4 * 24 * 60 * 60,
  7 * 24 * 60 * 60,
  15 * 24 * 60 * 60
]

/**
 * 查询今日未被删除的的卡片 
 * @return {Array}
 */
export function getTodayCardArr() {
  let todayDate = new Date().Format("yyyyMMdd")
  return getCardArrByDate(todayDate);
}

/**
 * 对于服务端传来的卡片，进行解析，形成三个map => createDateCardMap、reviewDateCardMap、cardIdMap
 * 1. 将createDateCardMap、reviewDateCardMap放入app.globaldata
 * 2. 将 todayArr 的内容放进 [ idMap ]
 */

export function parseServerCard() {
  let cardIdMap = app.globalData.cardIdMap
  let reviewDateCardMap = app.globalData.reviewDateCardMap
  app.globalData.todayCards.forEach(card => {
    cardIdMap[card.cardId] = card
  });
}

/**
 * 查询某日未被删除的的卡片 
 * @param {date} Date yyyymmdd格式 
 * @return {Array}
 */
export function getCardArrByDate(date) {
  let cardIdMap = app.globalData.cardIdMap
  let createDateCardMap = app.globalData.createDateCardMap
  let createDateCardMapKeys = Object.keys(createDateCardMap)
  let cardArr = []
  if (!(date in createDateCardMap) || createDateCardMapKeys.length == 0 || createDateCardMap[date].length == 0) {
    return cardArr;
  }

  createDateCardMap[date].forEach(cardId => {
    if (!cardIdMap[cardId].isDeleted) {
      cardArr.push(cardIdMap[cardId])
    }
  })
  return cardArr;
}


/**
 * @todoTest
 * 根据需要复习的时间筛选卡片 
 * 注意 -1 则为 现在就需要复习
 * @param {timeDistance} int 距离现在多少 [ 秒 ]  
 * @return {Array}
 */
export function getNeedPracticeCardArr(timeDistance) {
  return new Promise((resolve, reject) => {
    let reviewDateCardMap = app.globalData.reviewDateCardMap
    let cardIdMap = app.globalData.cardIdMap
    let resultArr = []
    let matchKeyArr = []
    let notInCardIdMapArr = []

    matchKeyArr = Object.keys(reviewDateCardMap).filter(key => compareTimeDistance(parseInt(key), timeDistance))
    // 返回现在需要复习的卡片
    if (timeDistance == -1) {
      if (!(-1 in reviewDateCardMap)) {
        return []
      }

      reviewDateCardMap[-1].forEach(e => {
        // 把所有 需要从服务端获取的卡片，都加载到cardIdMap里
        if (e in cardIdMap) {
          resultArr.push(cardIdMap[e])
        } else {
          // 获取其他的卡片信息
          notInCardIdMapArr.push(e)
        }
      })
    }

    cardApi.getCardsByCardIdArr(notInCardIdMapArr).then(
      e => {
        e.forEach(fetchFromServerCard => {
          cardIdMap[fetchFromServerCard.cardId] = fetchFromServerCard
          resultArr.push(fetchFromServerCard)
        })
        resolve(resultArr)
      }
    )
  })
}


/**
 * @todoTest
 * 复习完卡片后的数据处理 
 * @param {cardIdArr} 复习的卡片ID数组  
 * @return {Array}

首先根据卡片ID，从 @cardIdMap 中取出卡片的复习时间数组
两种情况，一类是空，一类是有值
  - Ⅰ. 如果为空：说明这张卡片没有复习过，所以他在 @reviewDateCardMap 中，应该为 -1 的字段
    那么需要在-1的字段中，先删了这个卡片ID，然后在 @reviewDateCardMap 中增加,以 {当前时间+5min} 的键
    然后在 @cardIdMap 中的复习时间数组中，压入当前时间
  - Ⅱ. 如果有值：说明复习过，那么他在@reviewDateCardMap 中的键为， 最大值 + 时间间隔数组[复习数组的长度] 
    这里就要比较 复习时间数组的长度 和 6，6的含义为，一个卡片只要复习六次就结束了
      - 如果长度不为6次，那么走流程Ⅰ
      - 如果为6次，直接删除3中他的值就行了
  - Ⅲ. 然后干脆再做一步，把3中，超出此时的键，全部归到-1里去
 */
export function practice(practiceCardIdArr) {

  // 判空
  if (practiceCardIdArr == null || practiceCardIdArr.length == 0) {
    return
  }

  // let reviewDateCardMap = app.globalData.reviewDateCardMap

  let cardIdMap = app.globalData.cardIdMap
  // 根据cardIdArr补全卡片
  let modifyCard = []
  let currentDate = new Date().getTime();
  practiceCardIdArr.forEach(id => {
    modifyCard.push(cardIdMap[id])
  })

  // modifyCard.forEach(card => {
  //   reviewDateCardMap[-1].remove(card.cardId)

  //   // 从没有练习过的卡片，练习第一次 
  //   if (card.progress == null) {
  //     card.progress = {
  //       "practiceTime": currentDate,
  //       "seq": 1
  //     }
  //     let reviewDate = currentDate + REVIEW_TIME_ARR[0] * 1000

  //     if (reviewDate in reviewDateCardMap) {
  //       reviewDateCardMap[reviewDate].push(card.cardId)
  //     } else {
  //       reviewDateCardMap[reviewDate] = [card.cardId]
  //     }

  //   } else {
  //     let reviewDate = currentDate + REVIEW_TIME_ARR[card.progress.seq] * 1000
  //     // 需要从 {上一次的复习时间}中，推导出reviewDateCardMap的KEY
  //     let oldKey = card.progress.practiceTime + REVIEW_TIME_ARR[card.progress.seq] * 1000

  //     if (oldKey in reviewDateCardMap) {
  //       reviewDateCardMap[oldKey].remove(card.cardId)
  //     }
  //     card.progress = {
  //       "practiceTime": currentDate,
  //       "seq": card.progress.seq + 1
  //     }

  //     if (reviewDate in reviewDateCardMap) {
  //       reviewDateCardMap[reviewDate].push(card.cardId)
  //     } else {
  //       reviewDateCardMap[reviewDate] = [card.cardId]
  //     }
  //   }

  //   // todo: 处理reviewDateCardMap
  //   // processreviewDateCardMap()
  // })
}

/**
 * 1. 将待复习时间 > 此时 的key都放到-1中
 * 2. 删掉长度为0的key
 */
function processreviewDateCardMap() {

  let reviewDateCardMap = app.globalData.reviewDateCardMap
  console.log("2. reviewDateCardMap", reviewDateCardMap)

  let currentDate = new Date().getTime();
  // 
  let matchKeyArr = Object.keys(reviewDateCardMap).filter(key => key != -1 && (currentDate >= key || reviewDateCardMap[key].length == 0))
  console.log("matchKeyArr", matchKeyArr)
  matchKeyArr.forEach(keyTime => {
    reviewDateCardMap[-1] = reviewDateCardMap[-1].concat(reviewDateCardMap[keyTime]);
    delete reviewDateCardMap[keyTime]
  })

  console.log("3. reviewDateCardMap", reviewDateCardMap)

  // todo 发送给服务器
}

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

/**
 * 判断现在的时间是否大于 from + distance
 * @param {from} 起始时间 timestamp
 * @param {distance} 距离(秒) int  
 */
function compareTimeDistance(from, distance) {
  if (from == -1) return true
  let currentTime = new Date().getTime()
  return currentTime + distance * 1000 >= from
}


/** 
 * 根据卡片数据，获得它下一次要复习的倒计时（秒）
 * @param {card}   
 * @return {nextPracticeCountDownTime} 
 */
export function getNextPracticeCountDownTime(card) {
  // 如果练习次数为0，则推荐其现在就复习，返回 -1
  if (card.practice == null) return -1;
  // 否则，返回 最后一次复习时间 + 时间间隔数组[复习长度]
  let currentDate = new Date().getTime();

  return (this.data.wordCard.progress.practiceTime + REVIEW_TIME_ARR[this.data.wordCard.progress.seq] * 1000 - currentDate) / 1000
}


/**
 * 根据传入的时间，判断是否为今天 00:00-23:59
 * @param {string} timeStamp
 * @return {bool} 
 */
function isTodayByTimeStamp(timeStamp) {
  const today = new Date().Format('yy-MM-dd 00:00:00');
  const todayStart = new Date(today).getTime();
  const dateTime = new Date(timeStamp).getTime();
  return dateTime > todayStart && dateTime < todayStart + 24 * 60 * 60 * 1000
}

/**
 * 格式化时间
 * new Date(1542274800000).Format('yy-MM-dd hh:mm:ss'); //"2018-11-15 17:40:00"
 * @param {String} fmt 时间的格式
 */
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}