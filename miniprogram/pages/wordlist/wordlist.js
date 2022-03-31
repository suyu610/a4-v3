// pages/wordlist/detail/detail.js
import router from '../../router/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 'bottom',
    duration: 300,
    showBottomSheetValue: false,

    bottomSheetActions: [{
        name: '重命名',
      },
      {
        name: '删除分组',
        subname: '单词会移至默认分组',
      },
    ],

    wordlistGroup: [{
        id: 0,
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

  selectBottomSheet(e) {
    switch (e.detail.name) {
      case '重命名':
        this.modifyGroupName()
        break;
      case '删除分组':
        this.deleteGroupComfirm()
        break;
    }
  },

  modifyGroupName() {
    this.setData({
      showFieldPopupValue: true,
      editMode: true
    })
  },
  openBottomSheet(e) {
    this.setData({
      showBottomSheetValue: true,
      curGroupName: e.currentTarget.dataset.name,
      curGroupId: e.currentTarget.dataset.id
    })
  },
  deleteGroup() {
    wx.showToast({
      icon: 'none',
      title: '删除成功',
    })
  },
  deleteGroupComfirm() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除 「' + this.data.curGroupName + '」 分组吗',
      confirmColor: "#332FEB",
      success(res) {
        if (res.confirm) {
          that.deleteGroup()
        }
      }
    })
  },

  closeBottomSheet() {
    this.setData({
      showBottomSheetValue: false
    })
  },
  openFieldPupup() {
    // this.setData({
    //   showFieldPopupValue: true,
    //   editMode: false
    // })
    wx.showModal({
      title: '新建单词本',
      editable: true,
      placeholderText: '请输入单词本名称',
      cancelColor: 'cancelColor',
      confirmColor:'#4931EB',
      confirmText: '完成'
    })
  },

  closeFieldPupup() {
    this.setData({
      showFieldPopupValue: false,
      editMode: false
    })
  },
  jump2WordlistDetail(e) {
    router.push({
      name: 'wordlistDetail',
      data: {
        id: e.currentTarget.dataset.id,
        name: e.currentTarget.dataset.name,
      },
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