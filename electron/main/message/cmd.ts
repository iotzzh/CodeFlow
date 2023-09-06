const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');


export default { prefix: 'cmd' };

export const openCode = async (event, address) => {
    try {
        var exec = require('child_process').exec;
        exec(`code E:\\tworspace\\zh-admin-vue`);
    } catch (err) {
        console.log(err);
    }
}

export const startServer = async (event, address) => {
    try {
        var exec = require('child_process').exec;
        const res = await exec(`cd ${address} && npm run start`);
        console.log('res, ', res);
    } catch (err) {
        console.log(err);
    }
}

export const stopServer = async (event, address) => {
    try {
        var ex = require("child_process").execSync;
        var iconv = require('iconv-lite');
        var res = ex("netstat -o -n -a | findstr :8000");

        let result = iconv.decode(Buffer.from(res), 'gbk');

        const lines = result.split('\r\n');
        const lineRes = lines[0].split('       ')[4];

        console.log(result);
        console.log(lineRes);

        var res1 = ex(`taskkill /F /PID ${Number(lineRes)}`);
        const str = iconv.decode(Buffer.from(res1), 'gbk');
        console.log(str);

        // ex.exec('ipconfig', { encoding: binaryEncoding }, function(err, stdout, stderr){
        //     console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding), iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
        // })
        // var stdout = ex("ping www.jshaman.com", { encoding: 'binary' }).toString();
        // console.log(stdout);

        // var execSync = require('child_process').execSync;
        // const res = await execSync(`netstat -o -n -a | findstr :8000`);
        // console.log('res, ', res);
        // const first = res[0];
    } catch (err) {
        console.log(err);
    }
}

export const prettierCode = async (event, address) => {
    try {
        var exec = require('child_process').exec;
        const res = await exec(`cd E:\\tworspace\\zh-admin-vue && npm run lint:prettier`);
        console.log('res, ', res);
    } catch (err) {
        console.log(err);
    }
}