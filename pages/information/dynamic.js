// pages/information/dynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    leaveWord: '',
    leaveWords: [
      {
        headPortrait: '/static/images/icon_API.png',
        name: '小新',
        date: '2019-06-12',
        content: '不错不错感谢分享。',
        pick: 0,
        pickNum: 95
      },
      {
        headPortrait: '/static/images/icon_API.png',
        name: '小新222',
        date: '2019-06-12',
        content: 'sdfsdf',
        pick: 1,
        pickNum: 40
      }
    ]
  },

  changePick: function (e) {
    var index = e.target.dataset.index;
    var picker = 'leaveWords[' + index + '].pick';
    var pickNumer = 'leaveWords[' + index + '].pickNum';
    var pick = this.data.leaveWords[index].pick ? 0 : 1;
    var pickNum = pick ? this.data.leaveWords[index].pickNum + 1 : this.data.leaveWords[index].pickNum - 1;
    this.setData({
      [picker]: pick,
      [pickNumer]: pickNum
    })
  },

  message: function () {
    this.setData({
      show: true
    })
  },

  ok: function () {
    console.log(this.data.leaveWord)
    if (!this.data.leaveWord) {
      wx.showModal({
        content: '留言不能为空',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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