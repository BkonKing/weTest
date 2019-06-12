const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatMinute = time => {
  var minute = parseInt(time / 60);
  var second = parseInt(time % 60);
  if (minute.toString().length == 1) {
    minute = `0${minute}`;
  }
  if (second.toString().length == 1) {
    second = `0${second}`;
  }
  return [minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const requestPost = (url, data, successCallback, errorCallback) => {
  wx.showLoading()
  wx.request({
    url: url,
    method: 'post',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function(res) {
      successCallback(res)
    },
    fail: function(ress) {
      console.log(ress)
      errorCallback(ress)
    },
    complete: function() {
      wx.hideLoading()
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatMinute: formatMinute,
  requestPost: requestPost
}