'use strict'

exports.reply = function* (next) {
    var message = this.weixin //消息

    //1，判断消息类（事件和文本）
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫码进来：' + message.EventKey + '消息ID：' + message.Ticket)
            }
            this.body = '谢谢你订阅公众号'
        } else if (message.Event === 'unsubscribe') {
            console.log('取消关注了')
            this.body = ''
        } else if (message.Event === 'LOCATION') {
            this.body = '你的地理位置' + message.Longitude + message.Latitude + '精确度' + message.Precision
        } else if (message.Event === 'CLICK') {
            this.body = '您点击的菜单' + message.EventKey
        } else if (message.Event === 'SCAN') {
            console.log('扫码进来：' + message.EventKey + '消息ID：' + message.Ticket)
            this.body = '你是扫描了一下'
        } else if (message.Event === 'VIEW') {
            this.body = '您点击的菜单链接是' + message.EventKey
            //子菜单是不会上报的
        }
    } else if (message.MsgType === 'text') {
        var content = message.content
        var reply = '呀，你说的' + content + '太复杂了'
        if (content === '1') {
            reply = '第一'
        } else if (content === '2') {
            reply = '第二'
        }
        this.body = reply
    }

    yield next
}