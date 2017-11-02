'use strict'

var Koa = require('Koa')
var path = require('path')
var util = require('./libs/util')
var config = require('./config')
var weixin = require('./weixin')
var wechat = require('./wechat/generator')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var app = new Koa();
app.use(wechat(config.wechat, weixin.reply))

app.listen(config.port)
console.log('服务器启动了...')
console.log('监听端口：' + config.port)
console.log('本地网址：http://127.0.0.1:' + config.port)
console.log('内网映射：' + config.proxy)