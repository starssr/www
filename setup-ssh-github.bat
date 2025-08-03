@echo off
chcp 65001 >nul
echo ========================================
echo    GitHub SSH密钥配置脚本
echo    云云星羽网络科技工作室
echo ========================================
echo.

REM 检查SSH目录是否存在
if not exist "%USERPROFILE%\.ssh" (
    echo 创建SSH目录...
    mkdir "%USERPROFILE%\.ssh"
)

REM 检查SSH密钥是否已存在
if exist "%USERPROFILE%\.ssh\id_ed25519" (
    echo SSH密钥已存在，跳过生成步骤
    goto :add_key
)

echo 正在生成SSH密钥...
echo 请在提示时直接按回车（使用默认设置）
echo.
ssh-keygen -t ed25519 -C "starssr@github.com" -f "%USERPROFILE%\.ssh\id_ed25519"

:add_key
echo.
echo 启动SSH代理并添加密钥...
start /B ssh-agent
ssh-add "%USERPROFILE%\.ssh\id_ed25519"

echo.
echo ========================================
echo 请将以下公钥复制并添加到GitHub账户：
echo 设置 → SSH and GPG keys → New SSH key
echo ========================================
echo.
type "%USERPROFILE%\.ssh\id_ed25519.pub"
echo.
echo ========================================

echo.
echo 按任意键继续测试SSH连接...
pause >nul

echo 测试SSH连接到GitHub...
ssh -T git@github.com

echo.
echo ========================================
echo SSH配置完成！
echo 现在你可以使用SSH方式推送代码了
echo ========================================
pause