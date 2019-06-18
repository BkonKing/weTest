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
    durationIntval: 0,
    recordingTime: 0,
    showTime: '00:00',
    showTime2: '10:00',
    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    audioTime: 0,
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
        tempFilePath: '',
        showTime2: '10:00',
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
        operation: '已完成，点击重新录制',
        tempFilePath: res.tempFilePath,
        recordingTime: 0,
        recordState: 3,
        left: 0
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
    if (!this.data.tempFilePath) {
      wx.showModal({
        content: "请先保存再试听",
        showCancel: false
      })
      return;
    }
    this.stopListing();
    this.Initialization();
    this.loadaudio();
    this.setData({
      isPlayAudio: true
    })
    innerAudioContext.play();
    // innerAudioContext.onPlay(() => {
    //   this.recordingTimer()
    // })
    // innerAudioContext.onPause(() => {
    //   this.setData({
    //     left: 0
    //   })
    //   clearInterval(this.data.setInter);
    // })
    // innerAudioContext.onError((res) => {
    //   wx.showModal({
    //     content: res.errMsg,
    //     showCancel: false
    //   })
    //   // console.log(res.errMsg)
    //   // console.log(res.errCode)
    // })
  },
  //初始化播放器，获取duration
  Initialization() {
    //设置src
    innerAudioContext.src = this.data.tempFilePath;
    //运行一次
    innerAudioContext.play();
    innerAudioContext.pause();
    innerAudioContext.onCanplay(() => {
      //初始化duration
      innerAudioContext.duration
      setTimeout(() => { 
        //延时获取音频真正的duration
        var duration = innerAudioContext.duration;
        this.setData({
          audioDuration: innerAudioContext.duration,
          showTime2: util.formatMinute(duration+1)
        });
      }, 1000)
    })
  },
  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration || 0.01;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        var left = that.data.left;
        var duration = innerAudioContext.duration;
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        if (time >= 100) {
          that.stopListing(duration);
          that.setData({
            audioDuration: duration
          })
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({
          left: left + 4 > 364 ? 0 : left + 4,
          audioSeek: seek + 1,
          audioTime: time,
          audioDuration: duration,
          showTime: `${min}:${sec}`
        });
      }
    }, 1000);
  },
  onUnload: function () {
    //卸载页面，清除计步器
    this.stopListing()
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
  stopListing() {
    clearInterval(this.data.durationIntval);
    console.log("chaoshi ")
    this.setData({
      left: 0,
      audioSeek: 0,
      audioTime: 0,
      isPlayAudio: false,
      showTime: `00:00`
    })
    innerAudioContext.stop();
  },
  startRecord(e) {
    clearInterval(this.data.setInter);
    if (this.data.isPlayAudio) {
      console.log("zanting")
      this.stopListing()
    }
    if (this.data.recordState == 1) {
      recorderManager.pause()
    } else if (this.data.recordState == 2) {
      recorderManager.resume()
    } else {
      recorderManager.start(options);
    }
  },
  uploadVoice() {
    innerAudioContext.pause();
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
          innerAudioContext.destroy()
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