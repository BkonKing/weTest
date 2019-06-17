// pages/information/edit.js
import {
  requestPost
} from '../../utils/util.js';
var app = getApp();
Page({
  data: {
    files: [],
    id: "",
    newsContent: "",
    title: "",
    imageId: ""
  },
  formTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  formContent: function(e) {
    this.setData({
      newsContent: e.detail.value
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log(res.tempFilePaths[0])
        wx.uploadFile({
          url: 'https://www.gpper.cn/qjxt/gpper/api/upload/picture.do', //这是你自己后台的连接
          filePath: res.tempFilePaths[0],
          name: "imageUrl", //后台要绑定的名称
          // header: {
          //   "Content-Type": "multipart/form-data"
          // },
          //参数绑定
          formData: {
            userid: wx.getStorageSync('userid')
          },
          success: function (response) {
            var data = JSON.parse(response.data)
            if (data.code == '0000') {
              that.setData({
                files: res.tempFilePaths,
                imageId: data.imageId
              })
            } else {
              wx.showModal({
                title: '上传失败，请重新上传！',
                showCancel: false
              })
            }
          },
          fail: function (ress) {
            wx.showModal({
              title: '上传失败，请重新上传！',
              showCancel: false
            })
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
    // if (!this.data.imageId) {
    //   this.showMo("请上传图片或者重新上传图片")
    //   return false
    // }
    requestPost('https://www.gpper.cn/qjxt/gpper/api/news/publishNews.do', {
      userid: wx.getStorageSync('userid'),
      id: that.data.id,
      newsContent: that.data.newsContent,
      title: that.data.title,
      imageId: that.data.imageId || 'sdfsdfsdf'
    }, res => {
      if (res.data.code == '0000') {
        wx.showModal({
          content: '发布成功！！！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  showMo: function(content) {
    wx.showModal({
      content: content,
      showCancel: false
    })
  }
})