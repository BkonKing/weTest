// pages/apply/apply.js
var util = require("../../utils/util.js");
var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["报名学生", "往届学生", "报名"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    studentsList: [
      {
        id: 'sdf',
        name: '李寻欢',
        age: 11,
        phone: 13612345621,
        situation: 1
      }
    ],
    previousList: [
      {
        id: 'sdf',
        name: '小飞刀',
        age: 18,
        phone: 179213458,
        situation: 1
      }
    ],
    show: false,
    applyDate: '',
    deadlineDate: '',
    today: '',
    IMG_URL: app.globalData.imgurl
  },
  onLoad: function () {
    var that = this;
    this.setData({
      today: util.formatDate(new Date())
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getPersonal: function (e) {
    this.setData({
      show: true
    })
  },
  bindApplyDateChange: function (e) {
    this.setData({
      applyDate: e.detail.value
    })
  },
  bindDeadlineDate: function (e) {
    console.log(e.detail.value)
    this.setData({
      deadlineDate: e.detail.value
    })
  },
  callUp: function () {
    wx.makePhoneCall({
      phoneNumber: '15505919792'
    })
  }
});