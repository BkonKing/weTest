// pages/register/detailedInfo.js
var app = getApp();
Page({
  data: {
    teacherinfo: null
  },
  onLoad: function (options) {
    this.setData({
      teacherinfo: app.globalData.teacherinfo
    })
  },
  amend: function (e) {
    wx.navigateTo({
      url: '/pages/register/basicInfo?amend=1'
    })
  }
})