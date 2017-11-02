'use strict'
// 回复策略

exports.reply = function* (next) {
    var message = this.weixin //消息

    //1，判断消息类（事件和文本）
    switch (message.MsgType) {
        case 'event':
            break;
    }
    if (message.MsgType === 'event') {
        switch (message.Event) {
            case 'subscribe':
                if (message.EventKey) {
                    console.log('扫码进来：' + message.EventKey + '消息ID：' + message.Ticket)
                }
                this.body = '谢谢你订阅公众号,输入数字1我们可以进行互动哦'
                break;
            case 'unsubscribe':
                console.log('取消关注')
                this.body = ''
                break;
            case 'LOCATION':
                this.body = '你的地理位置' + message.Longitude + message.Latitude + '精确度' + message.Precision
                break;
            case 'CLICK':
                this.body = '您点击的菜单' + message.EventKey
                break;
            case 'SCAN':
                console.log('扫码进来：' + message.EventKey + '消息ID：' + message.Ticket)
                this.body = '你是扫描了一下'
                break;
            case 'VIEW':
                this.body = '您点击的菜单链接是' + message.EventKey
                //子菜单是不会上报的 
                break;
        }
    } else if (message.MsgType === 'text') {
        console.log(message);
        var content = message.Content
        var reply = ''
        switch (content) {
            case '1':
                reply = '你好美！同意请回复2'
                break;
            case '2':
                reply = '想看我上次偷拍你盛世美颜的照片吗？\n想看回复3,不想看回复3'
                break;
            case '3':
                reply = [{
                    title :'最聚精会神的那个就是你',
                    description :'图片可能点不开，回复5查看更多内容',
                    picUrl :'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509626293008&di=c5fce827989fbb4fc62e457cb9d5dff1&imgtype=0&src=http%3A%2F%2Fimg1.gtimg.com%2F2%2F271%2F27132%2F2713224_980x1200_0.jpg'
                }]
                break;
            default:
                reply = '呀，你说的' + content + '太复杂了,我暂时还不能识别，请回复1-10的数字'
        }
        this.body = reply
    }

    yield next
}