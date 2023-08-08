const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');


export default { prefix: 'cmd' };

export const openCode = async (event, address) => {
    try {
    var exec = require('child_process').exec;
    exec(`code E:\\practice\\zh-skill-tree\\code\\web\\zh-admin-vue`);
    } catch (err) {
        console.log(err);
    }
}