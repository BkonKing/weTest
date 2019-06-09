// pages/record/record.js
var app = getApp();
import { requestPost } from '../../utils/util.js'
Page({
  data: {
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
    curriculumList: {
      "123": [{
        "albumId": "123",
        "createtime": "2019-06-04",
        "flag": "1",
        "id": "1",
        "teacherClassImage": "",
        "teacherClassTitle": "糖豆豆",
        "unionid": "123",
        "videoId": "12312"
      }, {
        "albumId": "123",
        "createtime": "2019-06-04",
        "flag": "1",
        "id": "1",
        "teacherClassImage": "",
        "teacherClassTitle": "糖豆豆2222",
        "unionid": "123",
        "videoId": "24234"
      }],
      "1234": []
    }
  },
  onLoad: function() {
    var that = this;
    // wx.redirectTo({
    //   url: '/pages/register/basicInfo'
    // })

    requestPost('https://www.gpper.cn/qjxt/gpper/api/album/list.do', {
      userid: wx.getStorageSync('userid')
    }, function (res) {
      if (res.data.code == '0000') {
        that.setData({
          albumList: res.data.data,
          curriculumList: res.data.data2
        })
      }
    });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.albumList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      albumList: this.data.albumList
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.albumList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      albumList: that.data.albumList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function(e) {
    console.log(e)
  },
  edit: function(e) {
    wx.navigateTo({
      url: './saveRecord',
    })
  },
  toDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.albumList[index].id;
    wx.setStorageSync('album', this.data.albumList[index]);
    wx.setStorageSync('curriculum', this.data.curriculumList[id]);
    wx.navigateTo({
      url: './listening',
    })
  }
})