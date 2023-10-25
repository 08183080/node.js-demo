const express = require('express')
const axios = require('axios')
const app = express()
const conf = require('./config')
const lib = require('./lib')
const admin = require('./admin')

var CONF = admin.load_config()  // 载入 配置文件...


function run(raw_json, conf) {
    // 监听消息

    console.log("开始运行")
    let ret = lib.filter_msg(conf.chatroom_ids, conf.member_ids, raw_json)
    if (ret) {        
        console.log("回复消息...")
        // 回复消息
        let reply_msg = lib.create_reply_msg(conf.reply_setting, ret[0])
        if (reply_msg) {
            lib.send_msg(axios, conf.ext_url, ret[1], reply_msg)
            return
        }
    }
    // 如果是 命令级别 的消息...
    let admin_ret = admin.filter_admin_msg(conf.admin_id, raw_json)
    if(admin_ret){
        // 表示命令执行成功，重新载入配置文件
        console.log('管理命令执行成功', admin_ret)
        CONF = admin.load_config()
        lib.send_msg(axios, conf.ext_url, conf.admin_id, admin_ret)
    }

}

console.log("开始获取请求消息");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 此处 接受请求，返回输出
app.post('/message', (request, response) => {
    // 这一部分压根就没有输出消息,可恶。。。
    let start_ts = new Date().getTime()
    run(request.body, CONF)
    let end_ts = new Date().getTime()
    console.log('处理耗时(ms):', end_ts-start_ts)
    response.send('')
})

// 这个app监控的是哪个端口？
// Port: It specifies the port on which we want our app to listen.
app.listen(5000, (err) => {
    if (!err) console.log('服务器启动成功了')
})
// 打开app之后, app监听port这个端口

/**
 * "ext_url": "http://127.0.0.1:8203/api?json&key=5E14382E06DD1EF6A5260D264A5715ED40371012",
 * 这个又是什么
 * 
 */

/**
 * 监控的流程是什么?
 * 1. node服务器监控到网络消息
 * 2. 过滤消息，看看有没有请求的对应的微信消息
 * 3. 有请求的对应的微信消息的情况，就把对应消息发送给e小天，让e小天对应发送过去...
 * 
 */