import {exec as execute} from 'child_process'
import iconv from 'iconv-lite'

/**
 * 使用特定的标记字符串来辅助解码，辨别exec的输出编码
 */
const chineseMark = '$中文标记$'
/**
 * @description 执行原生命令
 * @param {string} command 命令
 * @param {object} options exec 的选项
 * @param {number} timeout 超时时间
 */
export async function exec (command, options = null, timeout = 10000) {
  options = {
    encoding: 'buffer',
    windowsHide: false, // 默认设置为隐藏子窗口
    ...options
  }
  let childProcess = null
  let exitFlag = false
  return await Promise.race([
    await new Promise((resolve, reject) => {
      try {
        childProcess = execute(command, options, (error:any, stdout:any, stderr:any) => {
          if (error) {
            reject(error)
          } else {
            // Decode Buffer
            if (Buffer.isBuffer(stdout)) {
              let charset = ['cp936', 'utf8'].find((charset) => {
                return ~iconv.decode(stdout, charset).indexOf(chineseMark)
              })
              if (charset) {
                [stdout, stderr] = [stdout, stderr].map(v => iconv.decode(v, charset))
                stdout = stdout.replace(chineseMark, '') // 移除标记
              } else {
                [stdout, stderr] = [stdout, stderr].map(v => v.toString('utf8'))
              }
              // 尝试检查编码
            }
            resolve(stdout)
          }
        })
      } catch (e) {
        reject(e)
      } finally {
        exitFlag = true
      }
    }),
    await new Promise((resolve:any, reject) => {
      setTimeout(() => {
        if (!exitFlag) {
          // 子进程未退出，手动结束
          childProcess && childProcess.kill()
          reject(new Error('EXEC TIMED OUT'))
        } else {
          resolve()
        }
      }, Math.max(timeout, 1000))
    })
  ])
}
/**
 * @description 获取窗口标题
 */
export function getWindows () {
  // return exec('echo hello你好啊' + chineseMark)
  return exec(`powershell.exe  -ExecutionPolicy Bypass "Get-Process QQMusic | Select-Object MainWindowTitle  | Format-Wide | Out-String | &{$input+'${chineseMark}'}"`)
}


export const prettierCode = async (address:string) => {
  var exec = require('child_process').exec;
  const res = await exec(`cd E:\\tworspace\\zh-admin-vue\\ && npm run lint:prettier`);
}; 