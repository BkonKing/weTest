// pages/information/information.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [{
      "count": "1",
      "createtime": "2019-05-29",
      "flag": "1",
      "id": "123",
      "leaveCount": 1,
      "newsContent": "123",
      "newsImage": "123",
      "title": "123",
      "unionid": "123"
    }]
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/news/list.do',
      method: 'post',
      data: {
        userid: app.globalData.userid
      },
      success: function(res) {
        if (res.data.code == '0000') {
          that.setData({
            albumList: res.data.data
          })
        }
      }
    })
  },
  edit: function() {
    wx.navigateTo({
      url: './editInfo'
    })
  }
})