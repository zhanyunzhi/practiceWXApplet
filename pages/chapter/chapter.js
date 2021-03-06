//logs.js
const sys = require('../../utils/sys.js');
const path = require('../../utils/path.js');

Page({
  data: {
    chapters: []
  },
  onLoad: function () {
    this.getDataList();
  },
  getDataList: function () {
    let _this = this;
    let url = sys.getHost() + path.getPath('practiceChapterList');
    let param = {};
    param.url = url;
    sys.ajax(param, function(res){
      _this.setData({     //请求响应成功并拿到数据
        chapters: res.data.data
      });
    });
  },
  //页面跳转
  jumpToPractice: function (event) {
    wx.setStorage({     //将章节标题存入storage中
      key:"chapters",
      data:{
        title:event.currentTarget.dataset.title,      //章节标题
        len:event.currentTarget.dataset.len           //章节数
      }
    });
    wx.navigateTo({
      url: event.currentTarget.dataset.url
    });
  },
})
