const jsonFile = require('jsonfile')
// 处理管理员消息
function filter_admin_msg(admin_id, ext_raw_msg){
    // 管理员发来的消息
    if (ext_raw_msg.type == 1 && ext_raw_msg.data.fromid == admin_id){
        let msg = ext_raw_msg.data.msg
        return parse_admin_msg(msg)
    }else{
        return false
    }
}
function parse_admin_msg(command) {
    // 新增命令
    let reg_add = /\[新增\]\s\[关键词\]\s(.+)\s\[回复内容\]\s([\s\S]*)/gm
    let reg_add_res = reg_add.exec(command)
    if (reg_add_res) {
        let new_conf = add_config(reg_add_res[1], reg_add_res[2])
        save_config(new_conf)
        return '新增命令已完成'
    }
    // 删除命令1
    let reg_del_1 = /\[删除\]\s\[关键词\]\s(.+)\s\[回复内容\]\s([\s\S]*)/gm
    let reg_del_1_res = reg_del_1.exec(command)
    if (reg_del_1_res) {
        let new_conf = del_config_1(reg_del_1_res[1], reg_del_1_res[2])
        save_config(new_conf)
        return '删除命令已完成'
    }
    //删除命令2
    let reg_del_2 = /\[删除\]\s\[配置编号\]\s(.+)/gm
    let reg_del_2_res = reg_del_2.exec(command)
    if (reg_del_2_res) {
        let new_conf = del_config_2(reg_del_2_res[1])
        save_config(new_conf)
        return '删除命令已完成'
    }
    // 修改命令
    let reg_edit = /\[修改\]\s\[配置编号\]\s(\d+)\s\[回复内容\]\s([\s\S]*)/gm
    let reg_edit_res = reg_edit.exec(command)
    if(reg_edit_res){
        let new_conf = edit_config(reg_edit_res[1], reg_edit_res[2])
        save_config(new_conf)
        return '修改命令已完成'
    }
    // 查看命令
    let reg_show = /\[查看\]/g
    let reg_show_res = reg_show.exec(command)
    if(reg_show_res){
        return show_config()
    }
    // 管理员发送的不是命令
    return false
}

// 新增配置信息
function add_config(keywords, reply_content) {
    let kw_list = keywords.replace(/\s/g, '').replace(/，/g, ',').split(',')
    let json_data = load_config()
    let conf_list = json_data.reply_setting
    // 检查回复内容是否存在
    for (i in conf_list) {
        if (conf_list[i].reply_content == reply_content) {
            // 回复内容存在，只增加关键词列表
            let new_kw = handleArr(conf_list[i].keywords.concat(kw_list))
            json_data.reply_setting[i].keywords = new_kw
            return json_data
        }
    }
    // 回复内容不存在
    let new_data = {
        keywords: kw_list,
        reply_content: reply_content
    }
    json_data.reply_setting.push(new_data)
    return json_data
}

// 删除配置信息
function del_config_1(keywords, reply_content) {
    let kw_list = keywords.replace(' ', '').replace('，', ',').split(',')
    let json_data = load_config()
    let conf_list = json_data.reply_setting
    // 检查回复内容是否存在
    for (i in conf_list) {
        if (conf_list[i].reply_content == reply_content) {
            // 回复内容存在，删除设置的关键词列表
            let kw = conf_list[i].keywords.filter(item => {
                if(!kw_list.includes(item)){
                    return item
                }
            })
            json_data.reply_setting[i].keywords = kw
            if(kw.length <1){
                json_data.reply_setting.splice(i,1)
            }            
        }
    }
    return json_data
}
// 根据配置编号删除配置信息
function del_config_2(str_index){
    let index = parseInt(str_index.replace(' ', ''))
    let json_data = load_config()
    json_data.reply_setting.splice(index -1,1)
    return json_data
}

// 根据配置编号修改回复信息
function edit_config(str_index,reply_content){
    console.log(reply_content)
    let index = parseInt(str_index.replace(' ', ''))
    let json_data = load_config()
    let conf_list = json_data.reply_setting
    if(conf_list.length > (index-1)){
        json_data.reply_setting[index-1].reply_content = reply_content
    }
    return json_data
}

// 根据配置编号显示配置信息
function show_config(){
    let json_data = load_config()
    let conf_list = json_data.reply_setting
    let ret = ''
    for(i in conf_list){
        ret = ret + '编号:' + (parseInt(i)+1) + '\n关键词:' + conf_list[i].keywords.join(",") + '\n回复内容:' + conf_list[i].reply_content + '\n\n'
    }
    return ret
}

function load_config() {
    return jsonFile.readFileSync('./config.json')
}
function save_config(obj) {
    if (obj) {
        jsonFile.writeFileSync('./config.json', obj, { spaces: 2 })
    }
}

// 数组去重
function handleArr(arr) {
    return ([...new Set(arr)])
}

module.exports = {
    filter_admin_msg,
    load_config
}