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
    teacherAlbumTitle: '',
    teacherAlbumInfo: '',
    teacherAlbumName: '',
    albumState: false,
    albumList: [{
      "createtime": "2019-06-04",
      "id": "1234",
      "teacherAlbumInfo": "",
      "teacherAlbumName": "专辑2",
      "teacherAlbumTitle": "糖豆豆2糖豆豆2",
      "unionid": "123"
    }, {
      "createtime": "2019-06-03",
      "id": "123",
      "teacherAlbumInfo": "",
      "teacherAlbumName": "专辑1",
      "teacherAlbumTitle": "糖豆豆",
      "unionid": "123"
    }],
    agreement: 0
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
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
  bindPickerChange: function(e) {
    this.setData({
      album: e.detail.value,
      teacherAlbumInfo: this.data.albumList[e.detail.value].teacherAlbumInfo,
      teacherAlbumName: this.data.albumList[e.detail.value].teacherAlbumName,
      teacherAlbumTitle: this.data.albumList[e.detail.value].teacherAlbumTitle,
      albumState: this.isNew(this.data.albumList[e.detail.value].teacherAlbumName)
    })
  },
  isNew(name) {
    return name.indexOf('新建') == -1
  },
  formSubmit: function(e) {
    // wx.navigateTo({
    //   url: './replenishInfo'
    // })
    var that = this;
    const params = e.detail.value
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
      id: this.data.albumList[this.data.album].id
    };
    let newObj = {};
    // 13599023245
    Object.assign(newObj, params, user);
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/albumInfo/add.do',
      method: 'post',
      data: newObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(response) {
        if (response.data.code == '0000') {
          that.setData({
            albumList: response.data.data
          })
        }
      }
    })
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      audioId: e.audioId
    })
    requestPost('https://www.gpper.cn/qjxt/gpper/api/album/selectAlbum.do', {
      userid: wx.getStorageSync('userid')
    }, response => {
      if (response.data.code == '0000') {
        // that.setData({
        //   albumList: response.data.data
        // })
        this.setData({
          teacherAlbumInfo: this.data.albumList[0].teacherAlbumInfo,
          teacherAlbumName: this.data.albumList[0].teacherAlbumName,
          teacherAlbumTitle: this.data.albumList[0].teacherAlbumTitle,
          albumState: this.isNew(this.data.albumList[0].teacherAlbumName)
        })
      }
    })
  }
})