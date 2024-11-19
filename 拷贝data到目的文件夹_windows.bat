chcp 65001
if exist %USERPROFILE%\code-flow (
	echo "文件夹已经存在"
) else (
	md %USERPROFILE%\code-flow
	echo "文件夹已创建"
)

if exist %USERPROFILE%\code-flow\data.db (
	echo "数据库文件已经存在"
) else (
	copy .\data.db %USERPROFILE%\code-flow\data.db 
	echo "文件已创建"
)

pause