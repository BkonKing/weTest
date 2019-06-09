//index.js
const app = getApp()

Page({
  onLoad: function() {
    app.getUser().then(() => {
      if (app.globalData.teacherinfo.flag != 0) {
        wx.redirectTo({
          url: '/pages/register/basicInfo'
        })
        return;
      } else {
        wx.switchTab({
          url: '/pages/record/record'
        })
      }
    })
  }
})