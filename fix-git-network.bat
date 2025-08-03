@echo off
chcp 65001 >nul
echo ========================================
echo    Git网络问题一劳永逸解决方案
echo    云云星羽网络科技工作室
echo ========================================
echo.

echo 正在配置Git网络优化设置...
echo.

REM 1. 设置Git缓冲区大小
echo [1/8] 设置Git缓冲区大小...
git config --global http.postBuffer 1048576000
git config --global http.maxRequestBuffer 100M
echo ✓ 完成

REM 2. 设置超时时间
echo [2/8] 设置超时时间...
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
echo ✓ 完成

REM 3. 禁用SSL验证（解决证书问题）
echo [3/8] 配置SSL设置...
git config --global http.sslVerify false
echo ✓ 完成

REM 4. 设置连接超时
echo [4/8] 设置连接超时...
git config --global http.timeout 300
echo ✓ 完成

REM 5. 配置GitHub镜像（可选）
echo [5/8] 配置GitHub镜像...
git config --global url."https://github.com.cnpmjs.org/".insteadOf "https://github.com/"
echo ✓ 完成

REM 6. 设置代理（如果需要）
echo [6/8] 检查代理设置...
echo 如果你使用代理，请手动运行以下命令：
echo git config --global http.proxy http://127.0.0.1:7890
echo git config --global https.proxy http://127.0.0.1:7890
echo.

REM 7. 更改远程仓库为SSH（推荐）
echo [7/8] 更改远程仓库为SSH...
git remote set-url origin git@github.com:starssr/www.git
echo ✓ 完成

REM 8. 显示当前配置
echo [8/8] 显示当前Git配置...
echo.
echo 当前相关配置：
git config --global --get http.postBuffer
git config --global --get http.timeout
git config --global --get http.sslVerify
echo.

echo ========================================
echo 配置完成！建议按以下步骤操作：
echo.
echo 1. 生成SSH密钥（如果还没有）：
echo    ssh-keygen -t ed25519 -C "your-email@example.com"
echo.
echo 2. 将公钥添加到GitHub账户
echo    复制 ~/.ssh/id_ed25519.pub 内容到GitHub
echo.
echo 3. 测试连接：
echo    ssh -T git@github.com
echo.
echo 4. 现在可以正常推送代码了：
echo    git add .
echo    git commit -m "update"
echo    git push
echo ========================================
pause