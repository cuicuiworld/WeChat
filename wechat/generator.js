'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')//raw-body可以把这个js上的request对象去拼装它的数据最终拿到一个buffer的xml数据
var util = require('./util')
var Wechat = require('./wechat')

module.exports = function (options) {
    var wechat = new Wechat(options)

    return function* (next) {
        console.log(options)

        //验证，加密，排序
        var me = this
        var token = options.token
        var signature = this.query.signature
        var echostr = this.query.echostr
        var timestamp = this.query.timestamp
        var nonce = this.query.nonce

        var str = [token, timestamp, nonce].sort().join('')
        var sha = sha1(str);

        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong'
            }
        } else if (this.method === 'POST') {
            if (sha != signature) {
                this.body = 'wrong'
                return false
            }

            var data = yield getRawBody(this.req, {
                length:this.length,
                limit:'1mb',
                encoding:this.chartset
            })
            console.log(data.toString())            

            var content = yield util.parseXMLAsync(data)
            console.log(content+'//////////////////////////////////////////////////////////')

            var message = util.formatMessage(content.xml)
            console.log(message)

            if(message.MsgType === 'event'){
                if(message.Event === 'subscribe'){
                    var now = new Date().getTime()

                    me.status = 200
                    me.type = 'application/xml'
                    me.body = ''
                    return
                }
            }
        }
    }
}