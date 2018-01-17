const getHost = () => {      //获取接口服务器地址
  return 'http://s1.p5w.net/s_exam/';
}

const showToast = (title, icon, duration) => {    //提示框
  wx.showToast({
    title: title || '提示',
    icon: icon || 'loading',
    duration: duration || 1500
  })
}

const ajax = (param, success, fail, complete) => {      //获取接口服务器地址
  wx.request({
    url: param.url, //仅为示例，并非真实的接口地址
    data: param.data || {},
    header: param.header || '',
    method: param.method || 'GET',
    dataType: param.dataType || '',
    responseType: param.responseType || '',
    success: function (res) {
      success(res);
    },
    fail: function (res) {     //接口响应失败
      (fail && fail(res)) || sys.showToast('获取数据失败!');
    },
    complete: function(res){
      complete && fail(complete);
    }
  })
}


module.exports = {
  showToast: showToast,
  getHost: getHost,
  ajax: ajax
}
