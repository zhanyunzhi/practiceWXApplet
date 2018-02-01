const sys = require('sys.js');
const path = require('path.js');
//登录
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
            let url = sys.getHost() + path.getPath('login');
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
            sys.ajax(param, function (res) {
              success && success(res);
            },function(){
              wx.showToast({
                title: '登录失败',
                icon: 'loading'
              });
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
  wxLogin: wxLogin
}
