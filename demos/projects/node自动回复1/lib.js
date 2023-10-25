// 处理群消息
function filter_msg(chatroom_ids, member_ids, ext_raw_msg) {
    // 群id列表，需要监听的群友id列表，原始json消息
    if (ext_raw_msg.type == 1 && ext_raw_msg.data.memid){
        // 表示是待监控的群的文本消息
        if (member_ids.includes(ext_raw_msg.data.memid) && chatroom_ids.includes(ext_raw_msg.data.fromid) ) {
            // 返回过滤后的文本消息和群id
            return [ext_raw_msg.data.msg, ext_raw_msg.data.fromid]
        } else {
            return false
        }
    }else{
        return false
    }

}

// 根据关键字生成回复文本
function create_reply_msg(reply_list, txt_msg) {
    // reply_list:设置好的关键字和回复文本， txt_msg过滤后需要处理的文字消息
    let reply_txt = ''
    for (let i = 0; i < reply_list.length; i++) {
        for (let k = 0; k < reply_list[i].keywords.length; k++) {
            if (txt_msg.includes(reply_list[i].keywords[k])) {
                reply_txt = reply_txt + reply_list[i].reply_content + '\n'
                break
            }
        }
    }
    return reply_txt
}

// 发送回复文本到群
function send_msg(axios, wx_url, chatroom_id, msg) {
    //axios模块 ext框架url, 群id, 消息
    axios.post(wx_url, {
        method: 'sendText',
        wxid: chatroom_id,
        msg: msg,
        pid: 0
    })
        .then((res) => {
            // console.log(res.data)
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = {
    filter_msg,
    create_reply_msg,
    send_msg        // 发送消息...
}
