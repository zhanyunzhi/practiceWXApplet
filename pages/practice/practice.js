//logs.js
const sys = require('../../utils/sys.js');
const path = require('../../utils/path.js');

let cid = 1;
let page = 1;
let qno = 1;
let size = 10;
let type = 0;
let count = 0;

Page({
  data: {
    topics: [],      //存放题目的数据集
    topic: {},      //存放当前题目的变量
  },
  onLoad: function (param) {
    wx.getStorage({     //将章节标题从storage中取出
      key:"chaptersTitle",
      complete: function(res) {
        wx.setNavigationBarTitle({
          title: res.data || '章节练习'        //动态设置页面标题
        });
      }
    });
    cid = param.cid || 1;
    this.getDataList();
  },
  getDataList: function () {
    let _this = this;
    let url = sys.getHost() + path.getPath('questionsAfter');
    let data = {};
    data.cid = cid;
    data.page = page;
    data.qno = qno;
    data.size = size;
    data.type = type;
    let param = {};
    param.url = url;
    param.data = data;
    param.method = 'POST';
    sys.ajax(param, function(res){
      if (res.data.code == '0') {      //请求响应成功并拿到数据
        _this.data.topics = res.data.data;
        _this.getNowTopic();
      } else {      //请求响应成功但是没有返回所需的数据
        sys.showToast(res.data.message);
      }
    });
  },
  getNowTopic: function(){
    this.setData({
      topic: this.data.topics[count]
    })
  },
  next: function(){
    count++;
    this.getNowTopic();
  }
})
