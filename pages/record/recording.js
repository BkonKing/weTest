// pages/record/recording.js
var util = require("../../utils/util.js");
var app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const options = {
  duration: 600000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
  sampleRate: 16000, //采样率
  numberOfChannels: 1, //录音通道数
  encodeBitRate: 96000, //编码码率
  format: 'mp3', //音频格式，有效值 aac/mp3
  frameSize: 50, //指定帧大小，单位 KB
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operationImg: 'play.png',
    operation: '开始',
    setInter: undefined,
    recordingTime: 0,
    showTime: '00:00:00',
    tempFilePath: '',
    recordState: 0
  },
  listening: function() {
    var that = this;
    // wx.playVoice({
    //   filePath: that.data.tempFilePath,
    //   complete() {}
    // })
    // wx.playBackgroundAudio({
    //   //播放地址
    //   dataUrl: that.data.tempFilePath
    // })
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  save: function() {
    var that = this;
    if (this.data.recordState != 0) {
      recorderManager.stop();
    }
    wx.navigateTo({
      url: './saveRecord'
    })
  },
  //录音计时器
  recordingTimer: function() {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        var time = that.data.recordingTime + 1;
        that.setData({
          recordingTime: time,
          showTime: util.formatMinute(time)
        })
      }, 1000);
  },
  startRecord: function(e) {
    clearInterval(this.data.setInter);
    if (this.data.recordState == 0) {
      recorderManager.start(options);
    } else if (this.data.recordState == 1) {
      recorderManager.pause()
    } else {
      recorderManager.resume()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    recorderManager.onStart(() => {
      console.log("开始");
      //开始录音计时   
      that.recordingTimer();
      that.setData({
        operationImg: 'pause.png',
        operation: '正在录制中',
        recordState: 1
      })
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    });
    recorderManager.onResume((res) => {
      console.log("重新开始");
      that.recordingTimer();
      that.setData({
        operationImg: 'pause.png',
        operation: '正在录制中',
        recordState: 1
      })
    });
    recorderManager.onPause(() => {
      console.log("清除");
      that.setData({
        operationImg: 'play.png',
        operation: '继续录音',
        recordState: 2
      })
    });
    recorderManager.onStop((res) => {
      //结束录音计时  
      clearInterval(that.data.setInter);
      that.setData({
        operationImg: 'play.png',
        operation: '已完成，重新录制',
        tempFilePath: res.tempFilePath,
        recordingTime: 0,
        recordState: 0
      })
      console.log('。。停止录音。。', res.tempFilePath)
      const {
        tempFilePath
      } = res;
      wx.navigateTo({
        url: './saveRecord'
      })
      //上传录音
      wx.uploadFile({
        url: 'https://www.gpper.cn/qjxt/gpper/api/upload/audio.do', //这是你自己后台的连接
        filePath: tempFilePath,
        name: "file", //后台要绑定的名称
        // header: {
        //   "Content-Type": "multipart/form-data"
        // },
        //参数绑定
        formData: {
          userid: app.globalData.userid
        },
        success: function(ress) {
          if (res.data.code == '0000') {
            wx.showToast({
              title: '保存完成',
              icon: 'success',
              duration: 2000
            })
            wx.navigateTo({
              url: './saveRecord?audioId=' + res.data.audioId
            })
          }
        },
        fail: function(ress) {
          console.log("。。录音保存失败。。");
        }
      })
    })
  }
})