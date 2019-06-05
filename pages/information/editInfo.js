// pages/information/edit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    id: "",
    newsContent: "",
    title: "",
    imageId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
  },
  formTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  formContent: function (e) {
    this.setData({
      newsContent: e.detail.value
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.request({
          url: 'https://www.gpper.cn/qjxt/gpper/api/upload/picture.do',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            userid: app.globalData.userid
          },
          success: function(response) {
            if (response.data.code == '0000') {
              that.setData({
                files: res.tempFilePaths,
                imageId: response.data.imageId
              })
            } else {
              wx.showModal({
                title: '上传失败，请重新上传！',
                showCancel: false
              })
            }
          }
        })
      }
    })
  },
  publish: function() {
    var that = this;
    if (!this.data.title) {
      this.showMo("请填写标题")
      return false
    }
    if (!this.data.newsContent) {
      this.showMo("请填写内容")
      return false
    }
    if (!this.data.imageId) {
      this.showMo("请上传图片或者重新上传图片")
      return false
    }
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/news/publishNews.do',
      method: 'post',
      data: {
        userid: app.globalData.userid,
        id: that.data.id,
        newsContent: that.data.newsContent,
        title: that.data.title,
        imageId: that.data.imageId
      },
      success: function (res) {
        if (res.data.code == '0000') {
          that.showMo("发布成功")
        }
      }
    })
  },
  showMo: function (content) {
    wx.showModal({
      content: content,
      showCancel: false
    })
  }
})