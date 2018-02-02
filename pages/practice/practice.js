//logs.js
const util = require('../../utils/util.js');
const sys = require('../../utils/sys.js');
const path = require('../../utils/path.js');

let cid = 1;
let page = 1;
let qno = 1;
let size = 10;
let topicType = 0;
let count = 0;

let chapterLen = 0;

Page({
  data: {
    topics: [],      //存放题目的数据集
    topic: {},      //存放当前题目的变量
    sortNumbers: [],  //存放选题列表的变量
    showResult: false,     //是否显示结果
    answerRight: true,     //是否回答正确
    singleSelectAnswer: '', //单选选择用户选择的答案
    inMultiSelect: {}, //多选题用户当前选择的那一个答案
    multiAnswerDataSet: [], //多选题用户存多选题的答案,最终拿去做结果比较的变量
    isShowPop: false, //是否打开题目选择框
    nowCount: 1, //当前是第几题
    sumCount: 0, //一共多少题
    footerConfig: {     //footer的配置
      isShow: true,    //是否显示底部菜单
      isIndex: true,     //是否显示底部菜单的“首页”
      isCollect: true,     //是否显示底部菜单的“首页”
      isSelectTopic:true,   //是否显示底部菜单的“选择题目”
      isNextTopic: true,     //是否显示底部菜单“下一题”
    }       
  },
  onLoad: function (param) {
    cid = parseInt(param.cid) || 1;
    page = 1;
    qno = 1;
    size = 10;
    topicType = 0;
    count = 0;
    chapterLen = 0;
    wx.getStorage({     //将章节标题从storage中取出
      key:"chapters",
      complete: function(res) {
        chapterLen = res.data && res.data.len || 12;
        wx.setNavigationBarTitle({
          title:  res.data && res.data.title || '章节练习'        //动态设置页面标题
        });
      }
    });
    this.getDataList(true);
    this.getSerialNumber();     //获取选题列表数据
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
    param.data = data;    //参数
    param.method = 'POST';
    sys.ajax(param, function(res){
      _this.data.topics = res.data.data;  //请求响应成功并拿到数据
      if(isNewTopic){     //需要更新显示的题目
        _this.getNowTopic();
      }
    });
  },
  getNowTopic: function(){
    if (this.data.topics &&　this.data.topics[count]){
      this.setData({
        topic: this.data.topics[count],
        showResult: false,     //是否显示结果
        singleSelectAnswer: '',   //重置单选选择用户选择的答案
        inMultiSelect: {}, //多选题用户当前选择的那一个答案
        multiAnswerDataSet: [], //多选题用户存多选题的答案,最终拿去做结果比较的变量
      });
      qno = this.data.topic.qno;
      if(this.data.topic.type == 0){this.data.nowCount = this.data.topic.qno;this.setData({nowCount: this.data.nowCount})};
      if(this.data.topic.type == 1){this.data.nowCount = this.data.sortNumbers[0].length + this.data.topic.qno;this.setData({nowCount: this.data.nowCount})};
      if(this.data.topic.type == 2){this.data.nowCount = this.data.sortNumbers[0].length + this.data.sortNumbers[1].length +  this.data.topic.qno;this.setData({nowCount: this.data.nowCount})};
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
        this.data.nowCount--;     //计数器减一
        this.setData({
          nowCount: this.data.nowCount
        });
        if(cid == chapterLen){        //最后一章
          sys.showModal('提示','已经是最后一章了，点击确定回到章节选择页面',function(){
            wx.redirectTo({
              url: '/pages/chapter/chapter'
            });
          });
        }else{
          sys.showModal('提示', '当前章节已练习完毕，是否进入下一章', function () {
            cid++;
            wx.redirectTo({
              url: '/pages/practice/practice?cid=' + cid
            });
          });
        }
      }
    }
  },

  next: function(){   //点击下一题
    count++;
    this.data.nowCount++;     //计数器加一
    this.setData({
      nowCount: this.data.nowCount
    });
    this.getNowTopic();
  },

  selectAnswer: function (e) {      //单选题和判断题点击选项后的处理函数
    if(this.data.showResult) return;
    this.setData({
      showResult: true,     //是否显示结果
      singleSelectAnswer: e.currentTarget.dataset.answer,
    });
    if (this.data.topic.option_right + '' == e.currentTarget.dataset.answer){
      this.setData({
        answerRight: true     //是否回答正确
      });
    } else {
      this.setData({
        answerRight: false     //是否回答正确
      });
    };
    this.flagTopic();   //标记题目为已经做过
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
    if(util.arrayEquals(this.data.topic.option_right,this.data.multiAnswerDataSet)){
      this.setData({
        answerRight: true     //是否回答正确
      });
    } else {
      this.setData({
        answerRight: false     //是否回答正确
      });
    };
    this.flagTopic();   //标记题目为已经做过
  },
  showPop: function() {
    this.setData({
      isShowPop: true
    });
  },
  closePop: function () {
    this.setData({
      isShowPop: false
    });
  },
  getSerialNumber: function () {    //获取题目选择的列表数据
    let _this = this;
    let url = sys.getHost() + path.getPath('practiceList') + '?cid=' + cid;
    let param = {};
    param.url = url;
    param.method = 'GET';
    sys.ajax(param, function (res) {
      _this.setData({     //请求响应成功并拿到数据
        sortNumbers: res.data.data.list
      });
      for(var datas in _this.data.sortNumbers){
        _this.data.sumCount += _this.data.sortNumbers[datas].length;
      }
      _this.setData({
        sumCount: _this.data.sumCount
      });
      wx.setNavigationBarTitle({
        title: res.data.data.chapter_title || '章节练习'        //动态设置页面标题
      });
    });
  },
  //对选题列表的题目进行标识，也就是被做过的题目会被标识成绿色，这里给数据集内的对应数据追加一个属性，isFinish
  flagTopic: function() {
    let param = {};
    for(let datas in this.data.sortNumbers[this.data.topic.type]){
      if(this.data.sortNumbers[this.data.topic.type][datas].qid == this.data.topic.qid){
        let str = "sortNumbers[" + this.data.topic.type +"][" + datas + "].isFinish";
        param[str] = true;
        this.setData(param);
        break;
      }
    }
  },
  //选题
  goToTopic: function(e) {
    qno = e.currentTarget.dataset.qno;
    topicType = e.currentTarget.dataset.topicType;
    count = 0;
    this.getDataList(true);
    this.setData({
      isShowPop: false
    });
  },
  //增加收藏
  collectAdd: function () {    //isNewTopic是否要重新执行一次getNowTopic
    let _this = this;
    let url = sys.getHost() + path.getPath('collectAdd');
    let data = {};
    data.qid = this.data.topic.qid;
    let param = {};
    param.url = url;
    param.data = data;    //参数
    param.method = 'POST';
    sys.ajax(param, function (res) {
      wx.showToast({
        title: '收藏成功',
      })
    });
  },
  //删除收藏
  collectDelete: function () {    //isNewTopic是否要重新执行一次getNowTopic
    let _this = this;
    let url = sys.getHost() + path.getPath('collectDelete');
    let data = {};
    data.qid = this.data.topic.qid;
    let param = {};
    param.url = url;
    param.data = data;    //参数
    param.method = 'POST';
    sys.ajax(param, function (res) {
      wx.showToast({
        title: '删除成功',
      })
    });
  },
})
