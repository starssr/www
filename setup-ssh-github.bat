@echo off
chcp 65001 >nul
echo ========================================
echo    GitHub SSH密钥配置工具
echo    云云星羽网络科技工作室
echo ========================================
echo.

echo 正在检查SSH密钥配置...
echo.

REM 检查是否已有SSH密钥
echo [1/5] 检查现有SSH密钥...
if exist "%USERPROFILE%\.ssh\id_ed25519.pub" (
    echo ✓ 发现现有SSH密钥
    echo.
    echo 你的公钥内容：
    type "%USERPROFILE%\.ssh\id_ed25519.pub"
    echo.
    echo 请将上述公钥内容复制并添加到GitHub账户：
    echo 1. 访问 https://github.com/settings/keys
    echo 2. 点击 "New SSH key"
    echo 3. 粘贴上述公钥内容
    echo 4. 点击 "Add SSH key"
    echo.
    pause
) else (
    echo ❌ 未找到SSH密钥，正在生成...
    echo.
    echo [2/5] 生成新的SSH密钥...
    echo 请输入你的GitHub邮箱地址：
    set /p email="邮箱: "
    ssh-keygen -t ed25519 -C "%email%" -f "%USERPROFILE%\.ssh\id_ed25519" -N ""
    echo ✓ SSH密钥生成完成
    echo.
    echo 你的公钥内容：
    type "%USERPROFILE%\.ssh\id_ed25519.pub"
    echo.
    echo 请将上述公钥内容复制并添加到GitHub账户：
    echo 1. 访问 https://github.com/settings/keys
    echo 2. 点击 "New SSH key"
    echo 3. 粘贴上述公钥内容
    echo 4. 点击 "Add SSH key"
    echo.
    pause
)

echo [3/5] 启动SSH代理...
start-ssh-agent
ssh-add "%USERPROFILE%\.ssh\id_ed25519"
echo ✓ 完成

echo [4/5] 测试GitHub连接...
ssh -T git@github.com
echo.

echo [5/5] 配置完成！
echo.
echo 如果上面显示 "Hi username! You've successfully authenticated"
echo 说明SSH配置成功，现在可以正常推送代码了。
echo.
echo 如果仍然失败，建议切换到HTTPS方式：
echo git remote set-url origin https://github.com/starssr/www.git
echo.
echo ========================================
pause