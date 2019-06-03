Page({
  data: {
    files: [],
    honor: '',
    individualResume: ''
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        console.log(that.data.files)
      }
    })
  },
  finish: function (e) {
    if (this.data.files.length == 0) {
      wx.showModal({
        content: "请至少上传一张照片",
        showCancel: false,
      })
      return ;
    }
    if (!this.data.honor) {
      wx.showModal({
        content: "请输入所得荣誉",
        showCancel: false,
      })
      return;
    }
    if (!this.data.individualResume) {
      wx.showModal({
        content: "请输入个人简介",
        showCancel: false,
      })
      return;
    }
    wx.navigateTo({
      url: './detailedInfo'
    })
  }
})