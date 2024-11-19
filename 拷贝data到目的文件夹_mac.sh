#!/bin/bash

# 检查 code-flow 文件夹是否存在，如果不存在则创建
if [ -d "$HOME/code-flow" ]; then
    echo "文件夹已经存在"
else
    mkdir "$HOME/code-flow"
    echo "文件夹已创建"
fi

# 检查 data.db 文件是否存在，如果不存在则复制到 code-flow 文件夹
if [ -f "$HOME/code-flow/data.db" ]; then
    echo "数据库文件已经存在"
else
    cp ./data.db "$HOME/code-flow/"
    echo "文件已创建"
fi

# pause 在 macOS 下没有直接等效命令，但我们可以简单地让脚本暂停等待用户按键
read -p "按任意键继续..."