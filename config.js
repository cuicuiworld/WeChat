'use strict'

var wechat = require('./wechat/generator')
var path = require('path')
var util = require('./libs/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var config = {
    port: '1234',
    proxy: 'http://daidou.ngrok.xiaomiqiu.cn',
    wechat: {
        appID: 'wxdd768060b97612d9',
        appsecret: '5ea9a35a3b68b879dd8ef2b9255d383a',
        token: 'testwechatbycuicuiworld',
        getAccessToken() {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken(data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file, data)
        }
    }
}

module.exports = config