// pages/wordlist/detail/detail.js
import router from '../../router/index'


import {
  WordList
} from "../../models/wordlist"

const app = getApp()
let wordlistApi = new WordList()

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

    wordListGroup: []
  },

  onTap: function () {
    this.popover = this.selectComponent('#popover')
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().in(this).select('#group_0').boundingClientRect(res => {
      console.log(res)
      // 调用自定义组件 popover 中的 onDisplay 方法z
      this.popover.onDisplay(res);
    }).exec();
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
    wx.showToast({
      icon: 'none',
      title: '开发中...',
    })
    return
    wx.showModal({
      title: '修改分组名',
      editable: true,
      placeholderText: this.data.curGroupName,
      cancelColor: 'cancelColor',
      confirmColor: '#4931EB',
      confirmText: '完成'
    })
  },

  openBottomSheet(e) {
    if (e.currentTarget.dataset.id == 0) {
      wx.showToast({
        icon: 'none',
        title: '不可修改默认单词本',
      })
      return
    }
    this.setData({
      showBottomSheetValue: true,
      curGroupName: e.currentTarget.dataset.name,
      curGroupId: e.currentTarget.dataset.id
    })
  },

  deleteGroup() {
    let that = this
    let curGroupId = this.data.curGroupId
    wordlistApi.deleteGroup(curGroupId).then(e => {
      let wordListGroup = that.data.wordListGroup
      wordListGroup.forEach((item, index) => {
        if (item.id == curGroupId) {
          wordListGroup[0].count += item.count
          let index = wordListGroup.indexOf(item)
          wordListGroup.splice(index, 1)
        }
      })
      wx.showToast({
        icon: 'none',
        title: '删除成功',
      })

      that.setData({
        wordListGroup
      })
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
    let that = this
    wx.showModal({
      title: '新建单词本',
      editable: true,
      placeholderText: '请输入单词本名称',
      cancelColor: 'cancelColor',
      confirmColor: '#4931EB',
      confirmText: '完成',
      success(res) {
        if (res.confirm) {
          if (res.content == '') {
            wx.showToast({
              icon: 'none',
              title: '创建失败\r\n请填写分组名',
            })
            setTimeout(() => {
              that.openFieldPupup()
            }, 500);
          } else {
            if (res.content.length > 50) {
              wx.showToast({
                icon: 'none',
                title: '创建失败\r\n分组名过长',
              })
              setTimeout(() => {
                that.openFieldPupup()
              }, 500);
              return
            }
            // 创建单词分组
            wordlistApi.createWordListGroup(res.content).then(e => {
              wx.showToast({
                title: '创建成功',
              })
              let wordListGroup = that.data.wordListGroup
              wordListGroup.push(e)
              that.setData({
                wordListGroup
              })
            })
          }
        }
      }
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

  sortById: function (a, b) {
    return a.id - b.id
  },

  onShow: function () {
    // this.onTap()
    wordlistApi.getWordListGroup().then(e => {
      // id从小到大排序
      e.sort(this.sortById);
      this.setData({
        wordListGroup: e
      })
      app.globalData.wordListGroup = e 
    })
  },
})