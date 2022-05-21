// pages/example2/index.js
import WC from '../../wxml-canvas/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const selectors = ['.billboard', '.type', '.no', '.holder-name', '.expired']
    const wc = new WC({
      backgroundColor: '#fff',
      canvas: '#canvas',
      selectors,
      instanceContext: this
    })

    wc.on('ready', () => {
      wc.draw();
    });

    wc.on('finish', () => {
      console.log('finish');
      wx.canvasToTempFilePath({
        canvas: wc.canvas,
      }, this).then(res => {
        this.setData({src: res.tempFilePath})
      });
    });

    wc.on('error', err => {
      console.error(err)
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})