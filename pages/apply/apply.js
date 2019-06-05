// pages/apply/apply.js
var util = require("../../utils/util.js");
var app = getApp();
var sliderWidth = 50; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["报名学生", "往届学生", "报名"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    studentsList: [{
      "bmName": "弹指",
      "bmPhone": "111111",
      "createtime": "2019-05-30",
      "fraction": "A",
      "id": "1",
      "isGraduation": "1",
      "isPay": "",
      "pxId": "1",
      "remarks": "1231",
      "unionid": "123",
      "wechatid": "qqqq",
      "wechatname": "www",
      "wechaturl": "",
      "xsAge": "11",
      "xsName": "张三"
    }],
    previousList: [{
      "bmName": "弹指1",
      "bmPhone": "111111",
      "createtime": "2019-05-30",
      "fraction": "A",
      "id": "1",
      "isGraduation": "1",
      "isPay": "",
      "pxId": "1",
      "remarks": "1231",
      "unionid": "123",
      "wechatid": "qqqq",
      "wechatname": "www",
      "wechaturl": "",
      "xsAge": "11",
      "xsName": "张三22"
    }],
    show: false,
    startTime: '',
    endTime: '',
    today: '',
    showStudent: null,
    IMG_URL: app.globalData.imgurl
  },
  onLoad: function() {
    var that = this;
    this.setData({
      today: util.formatDate(new Date())
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getuserbm(-1, 'studentsList');
  },
  getuserbm: function (num, field) {
    var that = this;
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/userbm/list.do',
      method: 'post',
      data: {
        userid: app.globalData.userid,
        isGraduation: num
      },
      success: function (res) {
        that.setData({
          // [field]: res.data.data
          [field]: []
        })
      }
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == '0') {
      this.getuserbm(-1, 'studentsList');
    } else if (e.currentTarget.id == '1') {
      this.getuserbm(-2, 'previousList');
    } else if (e.currentTarget.id == '2') {
      wx.request({
        url: 'https://www.gpper.cn/qjxt/gpper/api/applyStart.do',
        method: 'post',
        data: {
          userid: app.globalData.userid
        },
        success: function(res) {
          that.setData({
            isApplyStart: '',
            startTime: '',
            endTime: ''
          })
        }
      })
    }
  },
  getPersonal: function(e, item) {
    var list = e.currentTarget.dataset['list'];
    var index = e.currentTarget.dataset['index'];
    this.setData({
      show: true,
      showStudent: this.data[list][index]
    })
  },
  bindApplyDateChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindDeadlineDate: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  callUp: function() {
    wx.makePhoneCall({
      phoneNumber: String(this.data.showStudent.bmPhone)
    })
  },
  startApply: function() {
    var that = this;
    if (!this.data.startTime && !this.data.endTime) {
      wx.showModal({
        content: '请选择报名开始时间和截止时间',
        showCancel: false
      })
      return ;
    }
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/userbm/list.do',
      method: 'post',
      data: {
        userid: app.globalData.userid,
        startTime: this.data.startTime,
        endTime: this.data.endTime
      },
      success: function (res) {
        // that.setData({
        //   [field]: res.data.data
        // })
        if (res.data.code == '0000') {
          wx.showModal({
            content: '报名开启成功',
            showCancel: false
          })
        }
      }
    })
  }
});