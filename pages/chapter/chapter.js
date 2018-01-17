//logs.js
const sys = require('../../utils/sys.js');
const path = require('../../utils/path.js');

Page({
  data: {
    chapters: []
  },
  onLoad: function () {
    let _this = this;
    let url = sys.getHost() + path.getPath('practiceList');
    let param = {};
    param.url = url;
    sys.ajax(param, function(res){
      if (res.data.code == '0') {      //请求响应成功并拿到数据
        _this.setData({
          chapters: res.data.data
        })
      } else {      //请求响应成功但是没有返回所需的数据
        sys.showToast(res.data.message);
      }
    });
  }
})
