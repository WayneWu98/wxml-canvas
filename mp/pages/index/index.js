// index.js
// 获取应用实例
import WC from '../../wxml-canvas/index';

const app = getApp()

const classNames = ['.container', '.content', '.title', '.img']

Page({
  data: {

  },

  onLoad() {
  },

  onShow() {
    console.clear()
    const wc = new WC({
      backgroundColor: '#fff',
      canvas: '#canvas',
      classNames,
      instanceContext: this
    })

    wc.on('ready', () => {
      wc.draw();
    })
  }
})
