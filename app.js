//app.js
App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.gpper.cn/qjxt/gpper/api/login.do',
          method: 'POST',
          data: {
            code: 'sdfwerxcvxcvcv'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          success: function(res) {
            if (res.data.code == '0000') {
              that.globalData.userid = res.data.id
              that.globalData.teacherinfo = res.data.teacherinfo
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {

            }
          })
        }
      }
    })
    function JSON_to_URLEncoded(element, key, list) {
      var list = list || [];
      if (typeof (element) == 'object') {
        for (var idx in element)
          JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
      } else {
        list.push(key + '=' + encodeURIComponent(element));
      }
      return list.join('&');
    }
  },
  globalData: {
    userid: '',
    teacherinfo: {
      flag: 0
    },
    userInfo: null,
    imgurl: "/static/images"
  }
})