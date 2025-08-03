@echo off
chcp 65001 >nul
echo ========================================
echo    切换到HTTPS推送方式
echo    云云星羽网络科技工作室
echo ========================================
echo.

echo 正在切换远程仓库到HTTPS方式...
echo.

REM 切换到HTTPS
echo [1/3] 切换远程仓库URL...
git remote set-url origin https://github.com/starssr/www.git
echo ✓ 完成

REM 清理可能冲突的配置
echo [2/3] 清理冲突配置...
git config --global --unset url."https://github.com.cnpmjs.org/".insteadOf 2>nul
git config --global http.sslVerify true
echo ✓ 完成

REM 显示当前配置
echo [3/3] 显示当前配置...
echo.
echo 远程仓库：
git remote -v
echo.

echo ========================================
echo 切换完成！现在可以使用HTTPS方式推送：
echo.
echo git add .
echo git commit -m "update"
echo git push
echo.
echo 注意：首次推送可能需要输入GitHub用户名和密码
echo 建议使用Personal Access Token代替密码
echo ========================================
pause