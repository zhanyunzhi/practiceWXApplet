//login.js
//获取应用实例

const sys = require('../../utils/sys.js');

Page({
  data: {
    code: ''
  },
  onLoad: function () {
    wx.checkSession({     //开发者只需要调用wx.checkSession接口检测当前用户登录态是否有效。登录态过期后开发者可以再调用wx.login获取新的用户登录态。
      success: function () {      //session 未过期，并且在本生命周期一直有效
        wx.navigateTo({
          url: '../practice/practice'     //已经登录了
        })
      },
      fail: function () {         //登录态过期(微信服务器那边的登录过期，不是我们自己的服务器登录过期)
        sys.wxLogin((res) => {   //调用登录接口重新登录
          wx.showToast({
            title: '登录成功',
            complete: function(){
              wx.navigateTo({
                url: '../chapter/chapter'     //登录成功
              })
            }
          }) 
        }) 
      }
    })
  }
  
})
