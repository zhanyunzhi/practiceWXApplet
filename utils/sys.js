const path = require('path.js');

const getHost = () => {      //获取接口服务器地址
  if(true){
    return 'http://localhost/signature/public/index/xsb/';
  }else{
    return 'http://s1.p5w.net/s_exam/';
  }
}

const showToast = (title, icon, duration) => {    //提示框
  wx.showToast({
    title: title || '提示',
    icon: icon || 'loading',
    duration: duration || 1500
  })
}

const showModal = (title, content, suc, cancel) => {    //显示模态弹窗
  wx.showModal({
    title: title || '提示',
    content: content || '这是一个模态弹窗',
    success: function(res) {
      if (res.confirm) {
        suc && suc();
      } else if (res.cancel) {
        cancel && cancel();
      }
    }
  })
}

const ajax = (param, success, fail, complete) => {      //获取接口服务器地址
  wx.showLoading({
    title: param.msg || '数据加载中...',
    mask: true
  })
  param.header = { token: wx.getStorageSync('token')};
  wx.request({
    url: param.url, //仅为示例，并非真实的接口地址
    data: param.data || {},
    header: param.header,
    method: param.method || 'GET',
    dataType: param.dataType || '',
    responseType: param.responseType || '',
    success: res => {   //这里是调用微信的wx.requestApi成功
      wx.hideLoading();
      if(res.statusCode == 200){    //状态码200，是后台服务器返回成功
        if(res.data.code == '000000'){    //接口返回正常数据
          success && success(res);
        } else if (res.data.code == '400001') {   //返回400001表示小程序与我们自己的服务器之间的session失效
          wx.showToast({
            title: '登录失效',
            icon: 'loading',
            complete: function(){
              wxLogin(res=>{});
            }
          });
        } else if (res.data.code != '000000') {   //接口返回非正常数据（参数错误，数据库错误等的处理）
          fail ? fail(res) : wx.showToast({
            title: res.data.message || '请求出错',
            icon: 'loading'
          });
        }
      } else {    //后台服务器返回非200状态的处理
        fail ? fail(res) : wx.showToast({
          title: '服务器访问失败',
          icon: 'loading'
        });
      }
    },
    fail: res => {     //接口响应失败
      wx.hideLoading();
      fail ? fail(res) : wx.showToast({
        title: '无法发起请求',
        icon: 'loading',
        duration: 1500
      });
    },
    complete: res => {
      complete && complete(res);
    }
  })
}
//微信登录
const wxLogin = (success) => {      //获取接口服务器地址
  wx.login({
    success: res => {
      var code = res["code"];
      if (code) {
        wx.getUserInfo({
          success: function (info) {
            // console.log(info);
            var rawData = info['rawData'];
            var signature = info['signature'];
            var encryptedData = info['encryptedData'];
            var iv = info['iv'];
            //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.//发起网络请求
            let url = getHost() + path.getPath('login');
            let data = {};
            data.code = res.code;
            data.rawData = rawData;
            data.signature = signature;
            data.encryptedData = encryptedData;
            data.iv = iv;
            let param = {};
            param.url = url;
            param.data = data;    //参数
            param.method = 'POST';
            ajax(param, function (res) {
              wx.setStorageSync('token', res.data.data.token);
              success && success(res);
            });
          }
        });

      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}


module.exports = {
  showToast: showToast,
  showModal: showModal,
  getHost: getHost,
  ajax: ajax,
  wxLogin: wxLogin
}
