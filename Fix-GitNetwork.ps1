# Git网络问题一劳永逸解决方案
# 作者：云云星羽网络科技工作室

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Git网络问题一劳永逸解决方案" -ForegroundColor Cyan
Write-Host "    云云星羽网络科技工作室" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Git是否安装
try {
    $gitVersion = git --version
    Write-Host "✓ 检测到Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未检测到Git，请先安装Git" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "请选择解决方案：" -ForegroundColor Yellow
Write-Host "1. 快速修复网络问题（推荐）"
Write-Host "2. 配置SSH连接"
Write-Host "3. 配置代理设置"
Write-Host "4. 完整配置（包含所有选项）"
Write-Host "5. 重置Git配置"

$choice = Read-Host "`n请输入选择 (1-5)"

function Set-GitNetworkOptimization {
    Write-Host "`n正在配置Git网络优化..." -ForegroundColor Green
    
    # 设置缓冲区大小
    git config --global http.postBuffer 1048576000
    git config --global http.maxRequestBuffer 100M
    Write-Host "✓ 设置缓冲区大小" -ForegroundColor Green
    
    # 设置超时时间
    git config --global http.lowSpeedLimit 0
    git config --global http.lowSpeedTime 999999
    git config --global http.timeout 300
    Write-Host "✓ 设置超时时间" -ForegroundColor Green
    
    # 禁用SSL验证
    git config --global http.sslVerify false
    Write-Host "✓ 配置SSL设置" -ForegroundColor Green
    
    # 配置GitHub镜像
    git config --global url."https://github.com.cnpmjs.org/".insteadOf "https://github.com/"
    Write-Host "✓ 配置GitHub镜像" -ForegroundColor Green
}

function Set-SSHConnection {
    Write-Host "`n正在配置SSH连接..." -ForegroundColor Green
    
    $sshDir = "$env:USERPROFILE\.ssh"
    $keyPath = "$sshDir\id_ed25519"
    
    # 创建SSH目录
    if (!(Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
        Write-Host "✓ 创建SSH目录" -ForegroundColor Green
    }
    
    # 生成SSH密钥
    if (!(Test-Path $keyPath)) {
        Write-Host "正在生成SSH密钥..." -ForegroundColor Yellow
        ssh-keygen -t ed25519 -C "starssr@github.com" -f $keyPath -N '""'
        Write-Host "✓ SSH密钥已生成" -ForegroundColor Green
    } else {
        Write-Host "✓ SSH密钥已存在" -ForegroundColor Green
    }
    
    # 启动SSH代理并添加密钥
    Start-Process ssh-agent -WindowStyle Hidden
    ssh-add $keyPath
    Write-Host "✓ SSH密钥已添加到代理" -ForegroundColor Green
    
    # 更改远程仓库URL
    try {
        git remote set-url origin git@github.com:starssr/www.git
        Write-Host "✓ 远程仓库URL已更改为SSH" -ForegroundColor Green
    } catch {
        Write-Host "! 无法更改远程仓库URL，请手动执行" -ForegroundColor Yellow
    }
    
    # 显示公钥
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "请将以下公钥添加到GitHub账户：" -ForegroundColor Yellow
    Write-Host "设置 → SSH and GPG keys → New SSH key" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Get-Content "$keyPath.pub"
    Write-Host "========================================" -ForegroundColor Cyan
}

function Set-ProxyConfiguration {
    Write-Host "`n配置代理设置..." -ForegroundColor Green
    
    $proxy = Read-Host "请输入代理地址 (例如: http://127.0.0.1:7890，直接回车跳过)"
    
    if ($proxy) {
        git config --global http.proxy $proxy
        git config --global https.proxy $proxy
        Write-Host "✓ 代理配置完成" -ForegroundColor Green
    } else {
        Write-Host "跳过代理配置" -ForegroundColor Yellow
    }
}

function Reset-GitConfiguration {
    Write-Host "`n正在重置Git配置..." -ForegroundColor Yellow
    
    # 移除相关配置
    git config --global --unset http.postBuffer
    git config --global --unset http.maxRequestBuffer
    git config --global --unset http.lowSpeedLimit
    git config --global --unset http.lowSpeedTime
    git config --global --unset http.timeout
    git config --global --unset http.sslVerify
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    git config --global --unset url."https://github.com.cnpmjs.org/".insteadOf
    
    Write-Host "✓ Git配置已重置" -ForegroundColor Green
}

# 执行选择的操作
switch ($choice) {
    "1" {
        Set-GitNetworkOptimization
        Write-Host "`n✓ 快速修复完成！现在尝试推送代码：" -ForegroundColor Green
        Write-Host "git add ." -ForegroundColor Cyan
        Write-Host "git commit -m `"update`"" -ForegroundColor Cyan
        Write-Host "git push" -ForegroundColor Cyan
    }
    "2" {
        Set-SSHConnection
        Write-Host "`n✓ SSH配置完成！添加公钥到GitHub后即可使用" -ForegroundColor Green
    }
    "3" {
        Set-ProxyConfiguration
    }
    "4" {
        Set-GitNetworkOptimization
        Set-SSHConnection
        Set-ProxyConfiguration
        Write-Host "`n✓ 完整配置完成！" -ForegroundColor Green
    }
    "5" {
        Reset-GitConfiguration
    }
    default {
        Write-Host "无效选择" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "配置完成！如果仍有问题，请尝试以下步骤：" -ForegroundColor Green
Write-Host "1. 重启终端" -ForegroundColor White
Write-Host "2. 检查网络连接" -ForegroundColor White
Write-Host "3. 尝试使用VPN或代理" -ForegroundColor White
Write-Host "4. 联系云云星羽技术支持" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "`n按回车键退出"