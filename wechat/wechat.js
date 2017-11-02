'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request')) //对request进行封装，request本没有promise
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var util = require('./util')
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

function Wechat(options) {
    var me = this
    this.appID = options.appID
    this.appSecret = options.appsecret
    this.getAccessToken = options.getAccessToken
    this.saveAccessToken = options.saveAccessToken
    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return me.updateAccessToken()
            }

            if (me.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return me.updateAccessToken()
            }
        })
        .then(function (data) {
            me.access_token = data.access_token
            me.expires_in = data.expires_in //过期时间

            return me.saveAccessToken(data)

            // me.saveAccessToken(data)
            // return Promise.resolve(data)
        })
}

/**
 * 验证access_token是否有效
 */
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }

    var now = new Date().getTime()
    if (now < data.expires_in) { //如果当前时间小于过期时间
        return true
    } else {
        return false
    }
}

/**
 * 过期后重新获取access_token
 */
Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID
    var appSecret = this.appSecret
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (res) {
            //[IncomingMessage,read,body:{errcode,errmsg}]
            var data = res['body']
            var now = new Date().getTime()
            console.log(data)
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
            resolve(data)
        })
    })

}

/**
 * 渲染模板
 */
Wechat.prototype.reply = function () {

    var content = this.body
    var message = this.weixin
    console.log(content + '*********************')
    var xml = util.tpl(content, message)

    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

module.exports = Wechat