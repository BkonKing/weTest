//app.js
App({
  onLaunch: function() {
    // var that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {

    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //     // if (!res.authSetting['scope.userLocation']) {
    //     //   wx.authorize({
    //     //     scope: 'scope.userLocation',
    //     //     success() {

    //     //     }
    //     //   })
    //     // }
    //   }
    // })
    // }
  },
  getUser: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: 'https://www.gpper.cn/qjxt/gpper/api/login.do ',
              data: {
                code: res.code,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              method: 'Post',
              dataType: 'json',
              responseType: 'text',
              success: function(response) {
                // console.log(response)
                if (response.data.code == '0000') {
                  that.globalData.userid = response.data.id
                  that.globalData.teacherinfo = response.data.teacherinfo
                  resolve(response)
                }
              },
              fail: function(res) {
                // console.log('no')
              },
              complete: function(res) {
                // console.log(that.data.wxcode)
              }
            })
          } else {
            // console.log('获取用户登录态失败！' + res.errMsg);
            reject('error');
          }
        }
      })
    })
  },
  globalData: {
    userid: '',
    teacherinfo: {},
    userInfo: null,
    imgurl: "/static/images"
  }
})