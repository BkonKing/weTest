// pages/register/detailedInfo.js
var app = getApp();
Page({
  data: {
    teacherinfo: null,
    classText: '',
    city: ''
  },
  onLoad: function (options) {
    app.getUser().then((res) => {
      wx.hideLoading();
      var data = wx.getStorageSync("register");
      console.log(data)
      this.setData({
        teacherinfo: res.data.teacherinfo,
        classText: data.classText,
        city: data.city
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