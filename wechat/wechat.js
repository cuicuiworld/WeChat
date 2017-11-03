'use strict'

var Promise = require('bluebird')
var fs = require('fs')
var _ = require('lodash')
var request = Promise.promisify(require('request')) //对request进行封装，request本没有promise
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var util = require('./util')
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    //临时
    temorary: {
        upload: prefix + 'media/upload?'
    },
    //永久
    permanent: {
        upload: prefix + 'material/add_material?',
        uploadNews: prefix + 'material/add_news?',
        uploadNewsPic: prefix + 'media/uploadimg?',
    }
}

function Wechat(options) {
    var me = this
    this.appID = options.appID
    this.appSecret = options.appsecret
    this.getAccessToken = options.getAccessToken
    this.saveAccessToken = options.saveAccessToken
    this.fetchAccessToken()
}

/**
 * 获取accesstoken
 */
Wechat.prototype.fetchAccessToken = function (data) {

    var me = this
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this)
        }
    }
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

            me.saveAccessToken(data)
            return Promise.resolve(data)
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
 * 新增素材<通过参数变化成上传临时或是永久>
 * type 类型  默认为临时
 * 如果是图文 material传进来是个数组||其他是一个路径filepath
 * 如果是永久 permanent有值 || 临时素材
 * 
 */
Wechat.prototype.uploadMaterial = function (type, material, permanent) {

    var me = this
    var form = {}
    var uploadUrl = api.temorary.upload
    if (permanent) {
        uploadUrl = api.permanent.upload
        _.extend(form, permanent) //form适合所有图文信息  继承permanent 对象 
    }
    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic
    }
    if (type === 'new') {
        //图文
        uploadUrl = api.permanent.uploadNews
        form = material
    } else {
        form.meadia = fs.createReadStream(material)
    }

    return new Promise(function (resolve, reject) {
        me.fetchAccessToken()
            .then(function (data) {
                var url = uploadUrl + 'access_token=' + data.access_token

                if (!permanent) {
                    url += '&type=' + type //临时
                } else {
                    form.access_token = data.access_token //永久上传需要加access_token
                }

                var options = {
                    method: 'POST',
                    url: uploadUrl,
                    json: true
                }

                if (type === 'news') {
                    options.body = form
                } else {
                    options.formData = form
                }

                request(options).then(function (res) {
                        //[IncomingMessage,read,body:{errcode,errmsg}]
                        var _data = res['body']
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error('Upload material fails')
                        }
                    })
                    .catch(function (err) {
                        reject(err)
                    })
            })
    })
}

/**
 * 渲染模板
 */
Wechat.prototype.reply = function () {

    var content = this.body
    var message = this.weixin
    console.log(JSON.stringify(content) + '*********************')
    var xml = util.tpl(content, message)

    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

module.exports = Wechat