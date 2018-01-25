//logs.js
const util = require('../../utils/util.js');
const sys = require('../../utils/sys.js');
const path = require('../../utils/path.js');

let cid = 1;
let page = 1;
let qno = 1;
let size = 10;
let topicType = 1;
let count = 0;

let chapterLen = 0;

Page({
  data: {
    topics: [],      //存放题目的数据集
    topic: {},      //存放当前题目的变量
    showResult: false,     //是否显示结果
    answerRight: true,     //是否回答正确
    singleSelectAnswer: '', //单选选择用户选择的答案
    inMultiSelect: {}, //多选题用户当前选择的那一个答案
    multiAnswerDataSet: [], //多选题用户存多选题的答案,最终拿去做结果比较的变量
    footerConfig: {     //footer的配置
      isShow: true,    //是否显示底部菜单
      isIndex: true,     //是否显示底部菜单的“首页”
      isCollect: true,     //是否显示底部菜单的“首页”
      isSelectTopic:true,   //是否显示底部菜单的“选择题目”
      isNextTopic: true,     //是否显示底部菜单“下一题”
    }       
  },
  onLoad: function (param) {
    wx.getStorage({     //将章节标题从storage中取出
      key:"chapters",
      complete: function(res) {
        chapterLen = res.data.len;
        wx.setNavigationBarTitle({
          title: res.data.title || '章节练习'        //动态设置页面标题
        });
      }
    });
    cid = param.cid || 1;
    this.getDataList(true);
  },
  getDataList: function (isNewTopic) {    //isNewTopic是否要重新执行一次getNowTopic
    let _this = this;
    let url = sys.getHost() + path.getPath('questionsAfter');
    let data = {};
    data.cid = cid;
    data.page = page;
    data.qno = qno;
    data.size = size;
    data.type = topicType;
    let param = {};
    param.url = url;
    param.data = data;
    param.method = 'POST';
    sys.ajax(param, function(res){
      if (res.data.code == '0') {      //请求响应成功并拿到数据
        _this.data.topics = res.data.data;
        if(isNewTopic){     //需要更新显示的题目
          _this.getNowTopic();
        }
      } else {      //请求响应成功但是没有返回所需的数据
        sys.showToast(res.data.message);
      }
    });
  },
  getNowTopic: function(){
    if(this.data.topics[count]){
      this.setData({
        topic: this.data.topics[count],
        showResult: false,     //是否显示结果
        singleSelectAnswer: '',   //重置单选选择用户选择的答案
        inMultiSelect: {}, //多选题用户当前选择的那一个答案
        multiAnswerDataSet: [], //多选题用户存多选题的答案,最终拿去做结果比较的变量
      });
      qno = this.data.topics[count].qno;
      if(count+1 == size){
        qno++;
        count = -1;    //重新计算count，也就是从新数据的第一条开始拿数据，因为点击next会count++，所以这里重置为-1
        this.getDataList(false);    //题目用完之后，重新获取下一批数据
      }
    }else{    //获取的记录小于size的时候，数据用完了
      topicType++;
      if(topicType <= 2){    //topicType不大于2，拿下一个类型的题目
        qno = 1;        //不同类型的qno都是各自计数的，这里要重置
        count = 0;      //数据集重置后，count也要重置
        this.getDataList(true);    //题目用完之后，重新获取下一批数据
      }else{    //进入下一章
        if(cid == chapterLen){        //最后一章
          sys.showModal('提示','已经是最后一章了，点击确定回到章节选择页面',function(){
            wx.navigateTo({
              url: '/pages/chapter/chapter'
            });
          });
        }else{
            wx.navigateTo({
              url: '/pages/practice/practice?cid='+cid
            });
        }
      }
    }
  },

  next: function(){   //点击下一题
    count++;
    this.getNowTopic();
  },

  selectAnswer: function (e) {      //单选题和判断题点击选项后的处理函数
    if(this.data.showResult) return;
    this.setData({
      showResult: true,     //是否显示结果
      singleSelectAnswer: e.currentTarget.dataset.answer,
    });
    if (this.data.topics[count].option_right + '' == e.currentTarget.dataset.answer){
      this.setData({
        answerRight: true     //是否回答正确
      });
    } else {
      this.setData({
        answerRight: false     //是否回答正确
      });
    }
  },

  collectAnswer: function (e) {      //多选题收集用户答案
    if(this.data.showResult) return;
    let answer = e.currentTarget.dataset.answer;
    if(!this.data.inMultiSelect[answer]){
      this.data.inMultiSelect[answer] = true;
      this.data.multiAnswerDataSet.push(answer);    //追加进数组
    }else{
      this.data.inMultiSelect[answer] = false;
      this.data.multiAnswerDataSet = util.arrayRemoveByValue(this.data.multiAnswerDataSet,answer);    //取消选中，答案数据集中去除这个选项
    }
    this.data.multiAnswerDataSet.sort();    //数组排序
    this.setData({
      inMultiSelect: this.data.inMultiSelect
    });
  },

  submitMultiAnswer: function (e) {      //多选题提交答案
    if(this.data.multiAnswerDataSet.length == 0){
      sys.showToast('请选择至少一个答案','success');
      return;
    }
    if(this.data.showResult) return;
    this.setData({
      showResult: true
    });
    if(util.arrayEquals(this.data.topics[count].option_right,this.data.multiAnswerDataSet)){
      this.setData({
        answerRight: true     //是否回答正确
      });
    } else {
      this.setData({
        answerRight: false     //是否回答正确
      });
    }

  }
})
