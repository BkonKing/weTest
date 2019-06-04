// pages/register/register.js
import WxValidate from '../../utils/WxValidate';
Page({
  onLoad: function() {
    var that = this;
    this.initValidate();
    this.getClasstyp(0, function(res) {
      var curriculum0 = 'curriculumList[0]';
      var curriculum1 = 'curriculumList[1]';
      that.setData({
        [curriculum0]: [{ "fid": 0, "id": 1, "name": "阿萨德", "sort": 1 }]
      })
      console.log(this.data.curriculumList[0][0].id)
      this.getClasstyp(this.data.curriculumList[0][0].id, function(response) {
        that.setData({
          [curriculum1]: [{ "fid": 0, "id": 1, "name": "阿萨德", "sort": 1 }]
        })
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sex: '',
    academy: '',
    curriculum: [0, 0],
    region: '',
    phone: '',
    code: '',
    intervalTime: 0,
    curriculumList: [],
    region: ['福建省', '福州市', '鼓楼区']
  },
  getClasstyp: function (fid, callback) {
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/classtyp/list.do',
      method: 'post',
      data: {
        fid: fid
      },
      success: function (res) {
        if (res.data.code == '0000') {
          callback(res)
        }
      }
    })
  },
  // 课程选择
  curriculumChange: function(e) {
    this.setData({
      curriculum: e.detail.value
    })
  },
  // 城市选择
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 课程多列数据转换
  curriculumColumnChange: function(e) {
    var data = {
      curriculumList: this.data.curriculumList,
      curriculum: this.data.curriculum
    };
    data.curriculum[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      switch (data.curriculum[0]) {
        case 0:
          data.curriculumList[1] = ["语文", "数学", "英语"];
          break;
        case 1:
          data.curriculumList[1] = ['画画', '钢琴', '小提琴'];
          break;
        case 2:
          data.curriculumList[1] = ['篮球', '足球', '乒乓球'];
          break;
      }
      data.curriculum[1] = 0;
    }
    this.setData(data);
  },
  initValidate() {
    const rules = {
      name: {
        required: true,
        minlength: 2
      },
      phone: {
        required: true
      }
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength: '请输入正确的名称'
      },
      phone: {
        required: '请填写手机号'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  phoneBlur: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCode: function(value) {
    var that = this;
    if (!this.isPhone(this.data.phone)) {
      return false;
    }
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/sms.do',
      method: 'post',
      data: {
        phone: this.data.phone,
        type: 'zc'
      },
      success: function (res) {
        that.setData({
          intervalTime: res.data.timeEnd
        })
      }
    })
    var InterValObj = setInterval(function() {
      if (that.data.intervalTime == 0) {
        clearInterval(InterValObj); // 停止计时器
      } else {
        var time = that.data.intervalTime - 1;
        that.setData({
          intervalTime: time
        })
      }
    }, 1000);
  },
  isPhone: function(value) {
    var isMob = /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789]{9})$/;
    //var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|166[0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8}|199[0-9]{8})$/;
    if (isMob.test(value)) {
      return true;
    }
    wx.showModal({
      content: "请输入正确的手机号",
      showCancel: false,
    })
    return false;
  },
  formSubmit: function(e) {
    wx.navigateTo({
      url: './replenishInfo'
    })
    const params = e.detail.value
    console.log(params)
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        content: error.msg,
        showCancel: false,
      })
      return false
    }
    if (!this.isPhone(params.phone)) {
      return false;
    }
    wx.navigateTo({
      url: './replenishInfo'
    })
  }
})