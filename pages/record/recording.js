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
  data: {
    operationImg: 'play.png',
    operation: '开始',
    setInter: undefined,
    recordingTime: 0,
    showTime: '00:00',
    tempFilePath: '',
    recordState: 0,
    left: 0
  },
  onLoad(options) {
    var that = this;
    recorderManager.onStart(() => {
      //开始录音计时   
      // console.log("开始");
      that.setData({
        operationImg: 'pause.png',
        operation: '正在录制中',
        recordingTime: 1,
        showTime: util.formatMinute(1),
        recordState: 1
      })
      that.recordingTimer();
    });
    recorderManager.onPause(() => {
      // console.log("清除");
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
        recordState: 3
      })
      // console.log('停止录音');
    });
    //错误回调
    recorderManager.onError((res) => {
      wx.showModal({
        content: res,
        showCancel: false
      })
    });
  },
  listening() {
    var that = this;
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.tempFilePath,
      innerAudioContext.onPlay(() => {
        // console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      wx.showModal({
        content: res.errMsg,
        showCancel: false
      })
      // console.log(res.errMsg)
      // console.log(res.errCode)
    })
  },
  save() {
    var that = this;
    if (this.data.recordState != 0) {
      recorderManager.stop();
    } else {
      wx.showModal({
        content: '请先录音',
        showCancel: false
      })
    }
  },
  startRecord(e) {
    clearInterval(this.data.setInter);
    if (this.data.recordState == 1) {
      recorderManager.pause()
    } else if (this.data.recordState == 2) {
      recorderManager.resume()
    } else {
      recorderManager.start(options);
    }
  },
  uploadVoice() {
    innerAudioContext.stop();
    wx.uploadFile({
      url: 'https://www.gpper.cn/qjxt/gpper/api/upload/audio.do', //这是你自己后台的连接
      filePath: this.data.tempFilePath,
      name: "audioUrl", //后台要绑定的名称
      // header: {
      //   "Content-Type": "multipart/form-data"
      // },
      //参数绑定
      formData: {
        userid: wx.getStorageSync('userid')
      },
      success: function(response) {
        var data = JSON.parse(response.data)
        if (data.code == '0000') {
          wx.showModal({
            content: '录音上传成功！！！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: './saveRecord?audioId=' + data.audioId
                })
              }
            }
          })
        } else {
          wx.showModal({
            content: '录音上传失败，请重新上传',
            showCancel: false
          })
        }
      },
      fail: function(ress) {
        wx.showModal({
          content: '录音上传失败，请重新上传',
          showCancel: false
        })
      }
    })
  },
  //录音计时器
  recordingTimer() {
    //将计时器赋值给setInter
    this.data.setInter = setInterval(
      () => {
        var time = this.data.recordingTime + 1;
        var left = this.data.left + 4 > 364 ? 0 : this.data.left + 4
        this.setData({
          recordingTime: time,
          showTime: util.formatMinute(time),
          left: left
        })
      }, 1000);
  }


})