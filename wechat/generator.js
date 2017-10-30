'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('./wechat')

module.exports = function (options) {
    var wechat = new Wechat(options)

    return function* (next) {
        console.log(options)

        //验证，加密，排序
        var token = options.token
        var signature = this.query.signature
        var echostr = this.query.echostr
        var timestamp = this.query.timestamp
        var nonce = this.query.nonce

        var str = [token, timestamp, nonce].sort().join('')
        var sha = sha1(str);

        if(this.method === 'GET'){
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong'
            }
        }else if(this.method === 'POST'){
            if (sha != signature) {
                this.body = 'wrong'
                return false
            }

            var data = ''
        }
    }
}