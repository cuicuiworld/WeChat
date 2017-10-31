'use strict'

var ejs = require('ejs')
var heredoc = require('heredoc')

var tpl = heredoc(function () {
    /*
    <xml>
        <ToUserName><![CDATA[<%= ToUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<%= fromUser %>]]></FromUserName> 
        <CreateTime><%= CreateTime %></CreateTime>
        <MsgType><![CDATA[<%= MsgType %>]]></MsgType>
        <%= if(msgType === 'text') { %>
            <Content><![CDATA[<%= Content %>]]></Content>
        <%= } else if (msgType === 'image' ){ %>  
            <Image>
                <MediaId><![CDATA[<%= Content.MediaId %>]]></MediaId>
            </Image>
        <%= } else if (msgType === 'voice' ){ %>   
            <Voice>
                <MediaId><![CDATA[<%= Content.MediaId %>]]></MediaId>
            </Voice>
        <%= } else if (msgType === 'video' ){ %>   
            <Video>
                <MediaId><![CDATA[<%= content.MediaId %>]]></MediaId>
                <Title><![CDATA[<%= content.Title %>]]></Title>
                <Description><![CDATA[<%= content.Description %>]]></Description>
            </Video>
        <%= } else if (msgType === 'news' ){ %>   
            <ArticleCount><%= ArticleCount %></ArticleCount>
                <Articles>
                    <%= content.forEach(function(item){ %>
                        <item>
                            <Title><![CDATA[<%= item.mediaId %>]]></Title> 
                            <Description><![CDATA[<%= item.description %>]]></Description>
                            <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
                            <Url><![CDATA[<%= item.url %>]]></Url>
                        </item>
                    <%= }) %>
                </Articles>
        <%= } %>   
        <MsgId><%= MsgId %></MsgId>
        <AgentID><%= AgentID %></AgentID>
    </xml>
    */
})

