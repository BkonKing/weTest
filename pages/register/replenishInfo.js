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
            console.log("图片上传失败");
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
      imageId: this.data.imageId
    }, (res) => {
      if (res.data.code == "0000") {
        wx.showToast({
          title: '注册成功！！！',
        })
        wx.switchTab({
          url: '../record/record',
        })
      }
    })
  }
})