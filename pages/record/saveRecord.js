// pages/record/saveRecord.js
import WxValidate from '../../utils/WxValidate';
import {
  requestPost
} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    album: 0,
    files: [],
    imageId: '',
    audioId: '',
    teacherAlbumInfo: '',
    teacherAlbumName: '',
    teacherClassTitle: '',
    albumState: false,
    albumList: [],
    agreement: 0,
    edit: false
  },
  onLoad: function (e) {
    requestPost('https://www.gpper.cn/qjxt/gpper/api/album/selectAlbum.do', {
      userid: wx.getStorageSync('userid')
    }, response => {
      if (response.data.code == '0000') {
        var data = [{
          teacherAlbumName: '新建专辑',
          id: ''
        }]
        data.concat(response.data.data)
        this.setData({
          albumList: data
        })
      }
    });
    if (e.edit) {
      var albumInfo = wx.getStorageSync('album');
      this.setData({
        files: [albumInfo.teacherAlbumImage],
        imageId: "",
        teacherAlbumInfo: albumInfo.teacherAlbumInfo,
        teacherAlbumName: albumInfo.teacherAlbumName,
        albumState: false,
        edit: true
      })
    } else {
      this.setData({
        audioId: e.audioId
      })
    }
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
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
            console.log("图片上传失败");
          }
        })
      }
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      album: e.detail.value,
      teacherAlbumInfo: this.data.albumList[e.detail.value].teacherAlbumInfo,
      teacherAlbumName: this.data.albumList[e.detail.value].teacherAlbumName,
      albumState: this.data.albumList[e.detail.value].id || 0
    })
  },
  formSubmit: function(e) {
    var that = this;
    const params = e.detail.value
    if (!this.data.edit) {
      if (!this.data.agreement) {
        wx.showModal({
          content: "请阅读并同意使用条款和隐私政策",
          showCancel: false,
        })
        return false;
      }
      let user = {
        userid: wx.getStorageSync('userid'),
        imageId: this.data.imageId,
        id: this.data.albumList[this.data.album].id,
        audioId: this.data.audioId
      };
      let newObj = {};
      // 13599023245
      Object.assign(newObj, params, user);
      requestPost('https://www.gpper.cn/qjxt/gpper/api/albumInfo/add.do', newObj, (response) => {
        if (response.data.code == '0000') {
          wx.showModal({
            content: '发布成功！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: './record'
                })
              }
            }
          })
        }
      })
    } else {
      const params = e.detail.value
      let user = {
        userid: wx.getStorageSync('userid'),
        imageId: this.data.imageId,
        id: this.data.albumList[this.data.album].id
      };
      let newObj = {};
      Object.assign(newObj, params, user);
      requestPost('https://www.gpper.cn/qjxt/gpper/api/album/edit.do', newObj, (response) => {
        if (response.data.code == '0000') {
          wx.showModal({
            content: '修改成功！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: './record'
                })
              }
            }
          })
        }
      })
    }
  },
  checkboxChange: function(e) {
    this.setData({
      agreement: e.detail.value
    })
  },
  showCommitment() {
    this.setData({
      show: true
    })
  }
})