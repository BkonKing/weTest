// pages/information/dynamic.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/news/showLeave.do',
      method: 'get',
      data: {
        userid: app.globalData.userid,
        id: ''
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})