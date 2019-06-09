const innerAudioContext = wx.createInnerAudioContext();
import {
  requestPost
} from '../../utils/util.js';
Page({
  data: {
    audiolist: {
      audiosrc: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
      coverimg: "https://goss.veer.com/creative/vcg/veer/800water/veer-146156021.jpg"
    },
    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0,
    curriculumList: [],
    albumInfo: null
  },
  onLoad: function() {
    this.setData({
      curriculumList: wx.getStorageSync('curriculum') || [],
      albumInfo: wx.getStorageSync('album') || {}
    })
    this.getAudio(0)
  },
  onShow: function() {
    this.Initialization();
    this.loadaudio();
  },
  //初始化播放器，获取duration
  Initialization() {
    var t = this;
    if (this.data.audiolist.audiosrc.length != 0) {
      //设置src
      innerAudioContext.src = this.data.audiolist.audiosrc;
      //运行一次
      innerAudioContext.play();
      innerAudioContext.pause();
      innerAudioContext.onCanplay(() => {
        //初始化duration
        innerAudioContext.duration
        setTimeout(function() {
          //延时获取音频真正的duration
          var duration = innerAudioContext.duration;
          var min = parseInt(duration / 60);
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          t.setData({
            audioDuration: innerAudioContext.duration,
            showTime2: `${min}:${sec}`
          });
        }, 1000)
      })
    }
  },
  //拖动进度条事件
  sliderChange(e) {
    var that = this;
    innerAudioContext.src = this.data.audiolist.audiosrc;
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({
      audioTime: value
    });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({
      audioSeek: value,
      isPlayAudio: true
    });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },
  //播放、暂停按钮
  playAudio() {
    //获取播放状态和当前播放时间
    var isPlayAudio = this.data.isPlayAudio;
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({
      isPlayAudio: !isPlayAudio
    })
    if (isPlayAudio) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({
        audioSeek: innerAudioContext.currentTime
      });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = this.data.audiolist.audiosrc;
      if (innerAudioContext.duration != 0) {
        this.setData({
          audioDuration: innerAudioContext.duration
        });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },
  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function() {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
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
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({
            audioSeek: 0,
            audioTime: 0,
            audioDuration: duration,
            isPlayAudio: false,
            showTime1: `00:00`
          });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({
          audioSeek: seek + 1,
          audioTime: time,
          audioDuration: duration,
          showTime1: `${min}:${sec}`,
          showTime2: `${min1}:${sec1}`
        });
      }
    }, 1000);
  },
  onUnload: function() {
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
  },
  listenTest: function(e) {
    this.getAudio(e.currentTarget.dataset.index);
  },
  getAudio: function(index) {
    var that = this;
    requestPost('https://www.gpper.cn/qjxt/gpper/api/albuminfo/play.do', {
      userid: wx.getStorageSync('userid'),
      videoId: this.data.curriculumList[index].videoId
    }, function(res) {
      that.setData({
        'audiolist.audiosrc': res.data.play_url
      })
    })
  }
})