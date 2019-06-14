var app = getApp();
import {
  requestPost
} from '../../utils/util.js';
Page({
  data: {
    files: [],
    teacherHonor: '',
    teacherInfo: '',
    teacherVoId: '',
    imageId: ''
  },
  onLoad: function(e) {
    this.setData({
      teacherVoId: e.teacherVoId
    })
    var data = wx.getStorageSync("register");
    // console.log(data)
    if (e.amend) {
      var teacherinfo = app.globalData.teacherinfo;
      this.setData({
        files: [teacherinfo.teacherImage],
        teacherHonor: teacherinfo.teacherName,
        teacherInfo: teacherinfo.teacherSex,
      })
    }
  },
  formTeacherInfo: function (e) {
    this.setData({
      teacherInfo: e.detail.value
    })
  },
  formTeacherHonor: function (e) {
    this.setData({
      teacherHonor: e.detail.value
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function(res) {
        wx.uploadFile({
          url: 'https://www.gpper.cn/qjxt/gpper/api/upload/picture.do', 
          filePath: res.tempFilePaths[0],
          name: "imageUrl", 
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
  finish: function(e) {
    if (this.data.files.length == 0) {
      wx.showModal({
        content: "请至少上传一张照片",
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
    if (!this.data.teacherHonor) {
      wx.showModal({
        content: "请输入所得荣誉",
        showCancel: false,
      })
      return;
    }
    requestPost('https://www.gpper.cn/qjxt/gpper/api/teacherRegister.do', {
      userid: wx.getStorageSync('userid'),
      teacherInfo: this.data.teacherInfo,
      teacherHonor: this.data.teacherHonor,
      teacherVoId: this.data.teacherVoId,
      imageId: this.data.imageId
    }, (res) => {
      if (res.data.code == "0000") {
        wx.showModal({
          content: '注册成功！！！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: './detailedInfo',
              })
            }
          }
        })
      }
    })
  }
})