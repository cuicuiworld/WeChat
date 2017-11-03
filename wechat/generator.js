'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')//raw-body可以把这个js上的request对象去拼装它的数据最终拿到一个buffer的xml数据
var util = require('./util')
var Wechat = require('./wechat')

module.exports = function (options, handler) {
    //我们在传入这个中间件的时候，首先初始化这个 Wechat，获取到一个实例，后面使用
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
            // console.log(data.toString())            

            var content = yield util.parseXMLAsync(data)    //解析xml
            // console.log(content+'----------------')

            var message = util.formatMessage(content.xml)   //格式化xml
            // console.log(message+'//////')

            this.weixin = message
            yield handler.call(this, next)  //handler是传参进来的
            wechat.reply.call(this)
        }
    }
}