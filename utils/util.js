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
  var hour = '00';
  var minute = 0;
  if (time > 59) {
    minute = '0' + parseInt(time / 60);
  } else {
    minute = '00'
  }
  var second = time % 60;
  if (second < 10) {
    second = '0' + second
  }

  return [hour, minute, second].map(formatNumber).join(':')
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
    success: function(res) {
      successCallback(res)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
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