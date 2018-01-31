const sys = require('sys.js');
const path = require('path.js');
//登录
const login = (param, success, fail, complete) => {      //获取接口服务器地址
  wx.login({
    success: res => {
      if (res.code) {
        //发起网络请求
        let url = sys.getHost() + path.getPath('login');
        let data = {};
        data.code = res.code;
        let param = {};
        param.url = url;
        param.data = data;    //参数
        param.method = 'POST';
        sys.ajax(param, function (res) {

        });
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}


module.exports = {
  login: login
}
