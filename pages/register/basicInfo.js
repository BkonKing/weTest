// pages/register/register.js
var app = getApp();
import WxValidate from '../../utils/WxValidate';
import {
  requestPost
} from '../../utils/util.js';
Page({
  onLoad: function(e) {
    if (e.amend) {
      var teacherinfo = app.globalData.teacherinfo;
      this.setData({
        teacherName: teacherinfo.teacherName,
        teacherSex: teacherinfo.teacherSex,
        graduateSchool: teacherinfo.graduateSchool,
        curriculum: [teacherinfo.classBigId, teacherinfo.classTwoId],
        phone: teacherinfo.phone,
        region: [teacherinfo.teacherProvincesCode, teacherinfo.teacherCityCode, teacherinfo.teacherAreaCode],
        amend: 1
      })
    }
    var that = this;
    this.initValidate();
    this.getClasstyp('0', res => {
      this.setData({
        'curriculumList[0]': res.data.data
      })
      this.getClasstyp(this.data.curriculumList[0][this.data.curriculum[0]].id, response => {
        this.setData({
          'curriculumList[1]': response.data.data
        })
      })
    })
    this.getArea('86', res => {
      this.setData({
        'regionList[0]': res.data.data
      })
      this.getArea(this.data.regionList[0][this.data.region[0]].code, response => {
        this.setData({
          'regionList[1]': response.data.data
        })
        this.getArea(this.data.regionList[1][this.data.region[1]].code, obj => {
          this.setData({
            'regionList[2]': obj.data.data
          })
        })
      })
    })
  },
  data: {
    teacherName: '',
    teacherSex: '',
    graduateSchool: '',
    curriculum: [0, 0],
    phone: '',
    message: '',
    intervalTime: 0,
    curriculumList: [],
    region: [0, 0, 0],
    regionList: [],
    amend: 0
  },
  getClasstyp: function(fid, callback) {
    requestPost('https://www.gpper.cn/qjxt/gpper/api/classtype/list.do', {
      fid: fid
    }, function(res) {
      if (res.data.code == '0000') {
        callback(res)
      }
    })
  },
  getArea: function(fid, callback) {
    requestPost('https://www.gpper.cn/qjxt/gpper/api/dictDistrict/list.do', {
      parent: fid
    }, function(res) {
      if (res.data.code == '0000') {
        callback(res)
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
      this.getClasstyp(this.data.curriculumList[0][e.detail.value].id, response => {
        data.curriculumList[1] = response.data.data;
        console.log(response.data.data)
        data.curriculum[1] = 0;
        this.setData(data);
      })
    } else {
      this.setData(data);
    }
  },
  regionColumnChange: function(e) {
    var data = {
      regionList: this.data.regionList,
      region: this.data.region
    };
    data.region[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      this.getArea(this.data.regionList[0][e.detail.value].code, response => {
        data.regionList[1] = response.data.data;
        data.region[1] = 0;
        this.getArea(this.data.regionList[1][0].code, obj => {
          data.regionList[2] = obj.data.data;
          data.region[2] = 0;
          this.setData(data);
        })
      })
    } else if (e.detail.column == 1) {
      this.getArea(this.data.regionList[1][e.detail.value].code, obj => {
        data.regionList[2] = obj.data.data;
        data.region[2] = 0;
        this.setData(data);
      })
    } else {
      this.setData(data);
    }
  },
  initValidate() {
    const rules = {
      teacherName: {
        required: true
      },
      teacherSex: {
        required: true
      },
      graduateSchool: {
        required: true
      },
      message: {
        required: true
      },
      phone: {
        required: true
      }
    }
    const messages = {
      teacherName: {
        required: '请填写姓名'
      },
      teacherSex: {
        required: '请选择性别'
      },
      graduateSchool: {
        required: '请填写毕业院校'
      },
      message: {
        required: '请填写验证码'
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
    requestPost('https://www.gpper.cn/qjxt/gpper/api/sms.do', {
      phone: this.data.phone,
      type: 'zc'
    }, res => {
      if (res.data.code == '0000') {
        this.setData({
          intervalTime: res.data.timeEnd
        })
        var InterValObj = setInterval(function () {
          if (that.data.intervalTime == 0) {
            clearInterval(InterValObj); // 停止计时器
          } else {
            var time = that.data.intervalTime - 1;
            that.setData({
              intervalTime: time
            })
          }
        }, 1000);
      } else if (res.data.code == '-1') {
        wx.showModal({
          content: '短信发送在时间间隔内',
          showCancel: false
        })
      } else {
        wx.showModal({
          content: '发送短信次数上限',
          showCancel: false
        })
      }
    })
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
    const params = e.detail.value
    params.message = Number(params.message)
    params.phone = Number(params.phone)
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
    let user = {
      userid: wx.getStorageSync('userid'),
      classBigId: this.data.curriculumList[0][this.data.curriculum[0]].id,
      classTwoId: this.data.curriculumList[1][this.data.curriculum[1]].fid,
      teacherProvincesCode: this.data.regionList[0][this.data.region[0]].code,
      teacherCityCode: this.data.regionList[1][this.data.region[1]].code,
      teacherAreaCode: this.data.regionList[2][this.data.region[2]].code
    };
    let newObj = {};
    Object.assign(newObj, params, user);
    wx.request({
      url: 'https://www.gpper.cn/qjxt/gpper/api/nextStep.do',
      method: 'post',
      data: newObj,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: res => {
        if (res.data.code == -1) {
          wx.showModal({
            content: '验证码错误，请重新输入',
            showCancel: false
          })
        } else if (res.data.code == -2) {
          wx.showModal({
            content: '验证码已失效，请重新获取',
            showCancel: false
          })
        } else if (res.data.code == '0000') {
          wx.setStorageSync("register", {
            curriculum: this.data.curriculum,
            region: this.data.region,
            city: this.data.regionList[0][this.data.region[0]].name + '' + this.data.regionList[1][this.data.region[1]].name + '' + this.data.regionList[2][this.data.region[2]].name,
            classText: this.data.curriculumList[0][this.data.curriculum[0]].name + ',' + this.data.curriculumList[1][this.data.curriculum[1]].name
          });
          if (this.data.amend) {
            wx.navigateTo({
              url: './replenishInfo?amend=1&teacherVoId=' + res.data.teacherVoId
            })
          }
          wx.navigateTo({
            url: './replenishInfo?teacherVoId=' + res.data.teacherVoId
          })
        }
      }
    })
  }
})