// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curriculumList: [
      ["文化类", "艺术类", "体育类"],
      ["语文", "数学", "英语"]
    ],
    curriculum: [0, 0],
    region: ['福建省', '福州市', '鼓楼区']
  },
  curriculumChange: function(e) {
    this.setData({
      curriculum: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
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
  next: function(e) {
    wx.navigateTo({
      url: './replenishInfo'
    })
  }
})