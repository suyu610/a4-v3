// pages/listen/listen.js
import config from '../../config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    abbrDict: config.abbrDict,
    showListPopupValue: false,
    play: false,
    random: false,
    blurMeanDetail: false,
    blurMeanCh: false,
    defIndex: 0,
    curPlayIndex: 0,
    wordContent: {
      definitionArr: [{
          prs: "verb",
          english: "to be alive",
          chinese: "活着"
        },
        {
          prs: "adjective",
          english: "having life : living or alive",
          chinese: "有生命：活着还是活着"
        },
        {
          prs: "adverb",
          english: "during, from, or at the actual time that something (such as a performance or event) happens",
          chinese: "在某物（如表演或事件）发生的过程中、开始时或实际时间"
        }
      ],
      exampleArr: [{
          english: "We learned about the people who lived during colonial times.",
          chinese: "我们了解了殖民时期的人们。"
        },
        {
          english: "They object to the use of live animals in scientific experiments.",
          chinese: "他们反对在科学实验中使用活体动物。"
        },
        {
          english: "The program was shown live.",
          chinese: "节目现场直播。"
        }
      ],
      mark: false,
      phoneticSign: null,
      prsUk: "lɪv; laɪv",
      prsUs: "lɪv; laɪv",
      selfShortDef: null,
      shortDef: "adj. 活的；生动的；实况转播的；精力充沛的\nvt. 经历；度过\nvi. 活；居住；生存",
      wordName: "live",
      wordNameCh: "居住"
    },
    wordlist:["abandon","wordNameCh","shortDef","prsUs","phoneticSign","mark"]
  },
  switchListSeq(e) {
    this.setData({
      curPlayIndex:e.currentTarget.dataset.index
    })
  },
  toggleListPopup() {
    this.setData({
      showListPopupValue: !this.data.showListPopupValue

    })
  },

  onTapDefBtn: function (e) {
    this.setData({
      defIndex: e.currentTarget.dataset.index
    })
  },
  onTapBlurMeanDetail() {
    this.setData({
      blurMeanDetail: !this.data.blurMeanDetail
    })
  },
  onTapBlurMeanCh() {
    this.setData({
      blurMeanCh: !this.data.blurMeanCh
    })
  },
  onTapPlayBtn() {
    this.setData({
      play: !this.data.play
    })
  },
  onTapRandomBtn() {
    this.setData({
      random: !this.data.random
    })
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})