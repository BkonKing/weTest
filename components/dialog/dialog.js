var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗宽度
    width: {
      type: String,
      value: "600",
    },
    // 弹窗高度
    height: {
      type: String,
      value: "480",
    },
    // 标题
    title: {
      type: String
    },
    show: {
      type: Boolean,
      value: false,
    },
    // 是否显示底部按钮
    footer: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    IMG_URL: app.globalData.imgurl,
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    close: function () {
      this.setData({
        show: false
      })
    },
    // 取消事件
    cancel: function () {
      this.setData({
        show: false
      });

      this.triggerEvent('cancel');
    },
    // 取消事件
    ok: function () {
      this.setData({
        show: false
      });
      this.triggerEvent('ok');
    }
  },

})