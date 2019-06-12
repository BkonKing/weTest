// pages/register/detailedInfo.js
var app = getApp();
Page({
  data: {
    teacherinfo: null
  },
  onLoad: function (options) {
    app.getUser().then((res) => {
      this.setData({
        teacherinfo: res.data.teacherinfo
      })
    })
  },
  amend: function (e) {
    wx.navigateTo({
      url: '/pages/register/basicInfo?amend=1'
    })
  },
  toWorkbench(e) {
    wx.switchTab({
      url: '/pages/record/record'
    })
  }
})