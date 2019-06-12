// pages/information/information.js
import { requestPost } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: []
  },
  onShow: function() {
    var that = this;
    requestPost('https://www.gpper.cn/qjxt/gpper/api/news/list.do', {
      userid: wx.getStorageSync('userid')
    }, function (res) {
      if (res.data.code == '0000') {
        that.setData({
          messageList: res.data.data
        })
      }
    })
  },
  edit: function() {
    wx.navigateTo({
      url: './editInfo'
    })
  }
})