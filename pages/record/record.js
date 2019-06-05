// pages/record/record.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: [{
      "createtime": "2019-06-04",
      "id": "1234",
      "teacherAlbumInfo": "",
      "teacherAlbumName": "专辑2",
      "teacherAlbumTitle": "糖豆豆2糖豆豆2",
      "unionid": "123"
    }, {
      "createtime": "2019-06-03",
      "id": "123",
      "teacherAlbumInfo": "",
      "teacherAlbumName": "专辑1",
      "teacherAlbumTitle": "糖豆豆",
      "unionid": "123"
    }]
  },
  onLoad: function() {
    var that = this;
    app.getUser().then(() => {
      // if (app.globalData.teacherinfo.flag == 0) {
      //   wx.redirectTo({
      //     url: '/pages/register/basicInfo'
      //   })
      //   return;
      // }
      wx.request({
        url: 'https://www.gpper.cn/qjxt/gpper/api/album/list.do',
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
    })
  }
})