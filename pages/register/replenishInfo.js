var app = getApp();
import {
  requestPost
} from '../../utils/util.js';
Page({
  data: {
    files: [],
    teacherHonor: '',
    teacherInfo: '',
    imageId: ''
  },
  onLoad: function(e) {
    if (e.amend) {
      var teacherinfo = app.globalData.teacherinfo;
      this.setData({
        teacherName: teacherinfo.teacherName,
        teacherSex: teacherinfo.teacherSex,
        graduateSchool: teacherinfo.graduateSchool,
        curriculum: [0, 0],
        phone: teacherinfo.phone,
        region: [0, 0, 0],
        amend: 1
      })
    }
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        requestPost('https://www.gpper.cn/qjxt/gpper/api/upload/picture.do', {
          userid: wx.getStorageSync('userid')
        }, function(response) {
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
        })
      }
    })
  },
  finish: function(e) {
    if (this.data.files.length == 0) {
      wx.showModal({
        content: "请至少上传一张照片",
        showCancel: false,
      })
      return;
    }
    if (!this.data.teacherHonor) {
      wx.showModal({
        content: "请输入所得荣誉",
        showCancel: false,
      })
      return;
    }
    if (!this.data.teacherInfo) {
      wx.showModal({
        content: "请输入个人简介",
        showCancel: false,
      })
      return;
    }
    requestPost('https://www.gpper.cn/qjxt/gpper/api/teacherRegister.do', {
      userid: wx.getStorageSync('urserid'),
      teacherInfo: this.data.teacherInfo,
      teacherHonor: this.data.teacherHonor,
      imageId: this.data.imageId
    }, function(res) {

    })
    wx.navigateTo({
      url: './detailedInfo'
    })
  }
})