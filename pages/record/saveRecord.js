// pages/record/saveRecord.js
import WxValidate from '../../utils/WxValidate';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    album: 0,
    albumList: ["新建文件夹", "新建文件夹1", "新建文件夹2"],
    agreement: 0
  },
  bindPickerChange: function (e) {
    this.setData({
      album: e.detail.value
    })
  } ,
  initValidate() {
    const rules = {
      title: {
        required: true
      },
      intro: {
        required: true
      },
      album: {
        required: true
      },
      albumName: {
        required: true
      }
    }
    const messages = {
      title: {
        required: '请填写标题'
      },
      intro: {
        required: '请填写课程简介'
      },
      album: {
        required: '请选择专辑'
      },
      albumName: {
        required: '请填写专辑名称'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  formSubmit: function (e) {
    // wx.navigateTo({
    //   url: './replenishInfo'
    // })
    const params = e.detail.value
    console.log(params)
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        content: error.msg,
        showCancel: false,
      })
      return false
    }
    if (!this.data.agreement) {
      wx.showModal({
        content: "请阅读并同意使用条款和隐私政策",
        showCancel: false,
      })
      return false;
    }
    this.setData({
      show: true
    })
  },
  checkboxChange: function (e) {
    this.setData({
      agreement: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.initValidate();
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