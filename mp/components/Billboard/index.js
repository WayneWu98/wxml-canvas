// components/Billboard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    log() {
      console.log(this.properties.src);
    },
    save() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.src,
        success() {
          wx.showToast({
            title: '保存成功',
          })
        },
        fail(err) {
          console.error(err)
          wx.showToast({
            title: '保存失败',
          })
        }
      })
    }
  }
})
