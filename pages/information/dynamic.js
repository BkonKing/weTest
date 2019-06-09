// pages/information/dynamic.js
import {
  requestPost
} from '../../utils/util.js';
Page({
  data: {
    show: false,
    news: null,
    // leaveWord: '',
    leaveWords: [{
      "createtime": "2019-05-13",
      "id": "2c9058006ab00e4c016ab01a06f9003a",
      "newMessage": "感谢评论！",
      "wechatid": "1",
      "wechatname": "廖思宇",
      "wechaturl": ""
    }]
  },

  // changePick: function (e) {
  //   var index = e.target.dataset.index;
  //   var picker = 'leaveWords[' + index + '].pick';
  //   var pickNumer = 'leaveWords[' + index + '].pickNum';
  //   var pick = this.data.leaveWords[index].pick ? 0 : 1;
  //   var pickNum = pick ? this.data.leaveWords[index].pickNum + 1 : this.data.leaveWords[index].pickNum - 1;
  //   this.setData({
  //     [picker]: pick,
  //     [pickNumer]: pickNum
  //   })
  // },

  message: function() {
    this.setData({
      show: true
    })
  },

  // ok: function () {
  //   console.log(this.data.leaveWord)
  //   if (!this.data.leaveWord) {
  //     wx.showModal({
  //       content: '留言不能为空',
  //       showCancel: false
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // requestPost('https://www.gpper.cn/qjxt/gpper/api/news/showLeave.do', {
    //   userid: wx.getStorageSync('userid'),
    //   id: ''
    // }, function(res) {
    //   if (res.data.code == '0000') {
    //     that.setData({
    //       news: res.data.news,
    //       leaveWords: res.data.data
    //     })
    //   }
    // })
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/news/showLeave.do',
      data: {
        userid: wx.getStorageSync('userid'),
        id: options.id
      },
      success: function(res) {
        if (res.data.code == '0000') {
          that.setData({
            news: res.data.news,
            leaveWords: res.data.data
          })
        }
      }
    })
  }
})