// pages/example1/index.js
import WXMLCanvas from '../../wxml-canvas/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      ['房源套数', '287'],
      ['入围组数', '690'],
      ['入围分', '0.93'],
      ['入围比', '1.3'],
      ['社保系数', '2.1'],
    ],
    src: '',
    size: { width: 0, height: 0 },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    const selectors = [
      '.billboard',
      '.name',
      '.row',
      '.left',
      '.right',
      '.qr-code',
    ];
    const wc = new WXMLCanvas({
      canvas: '#canvas',
      selectors,
      instanceContext: this,
    });

    // wc.on('drawing', () => {
    //   console.log('drawing');
    // });

    // wc.on('aborted', () => {
    //   console.log('aborted');
    // });
    wc.draw()
      .then(() => {
        const { width, height } = wc.canvas;
        console.log(width, height);
        this.setData({
          size: { width, height },
        });
        wx.nextTick(() => {
          wx.canvasToTempFilePath(
            {
              canvas: wc.canvas,
              width,
              height,
              destWidth: width,
              destHeight: height,
              quality: 1,
            },
            this
          )
            .then(res => {
              this.setData({
                src: res.tempFilePath,
              });
            })
            .catch(console.log);
        });
      })
      .catch(console.log);
  },
});
