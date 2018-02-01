//login.js
//获取应用实例

const common = require('../../utils/common.js');

Page({
  data: {
    code: ''
  },
  onLoad: function () {
    common.wxLogin((res) => {
      console.log(res)
    })
  }
  
})
