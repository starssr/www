# Git网络问题一劳永逸解决方案

## 问题描述
在使用Git推送代码到GitHub时经常遇到网络连接问题，如：
- `fatal: unable to access 'https://github.com/...'`
- `Failed to connect to github.com port 443`
- 连接超时等问题

## 解决方案

### 方案一：使用批处理脚本（推荐）
1. 双击运行 `fix-git-network.bat`
2. 按照提示完成配置
3. 尝试推送代码

### 方案二：使用PowerShell脚本
1. 右键点击 `Fix-GitNetwork.ps1`
2. 选择"使用PowerShell运行"
3. 根据需要选择配置选项

### 方案三：手动配置

#### 1. 网络优化配置
```bash
# 设置缓冲区大小
git config --global http.postBuffer 1048576000
git config --global http.maxRequestBuffer 100M

# 设置超时时间
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
git config --global http.timeout 300

# 禁用SSL验证（解决证书问题）
git config --global http.sslVerify false
```

#### 2. 配置SSH连接（最推荐）
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 添加密钥到SSH代理
ssh-add ~/.ssh/id_ed25519

# 更改远程仓库URL为SSH
git remote set-url origin git@github.com:starssr/www.git
```

#### 3. 配置代理（如果使用代理）
```bash
# 设置HTTP代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

## SSH密钥配置步骤

### 1. 生成SSH密钥
运行 `setup-ssh-github.bat` 或手动执行：
```bash
ssh-keygen -t ed25519 -C "starssr@github.com"
```

### 2. 添加公钥到GitHub
1. 复制公钥内容：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. 登录GitHub → Settings → SSH and GPG keys
3. 点击 "New SSH key"
4. 粘贴公钥内容并保存

### 3. 测试连接
```bash
ssh -T git@github.com
```

## 常见问题解决

### Q: 仍然无法连接？
A: 尝试以下步骤：
1. 检查防火墙设置
2. 尝试使用手机热点
3. 配置代理或VPN
4. 使用GitHub镜像站

### Q: SSH连接失败？
A: 确保：
1. SSH密钥已正确添加到GitHub
2. SSH代理正在运行
3. 网络允许SSH连接（端口22）

### Q: 代理如何配置？
A: 根据你的代理软件：
- Clash: 通常是 `http://127.0.0.1:7890`
- V2Ray: 通常是 `http://127.0.0.1:10809`
- 其他代理请查看软件设置

## 验证配置

配置完成后，尝试推送代码：
```bash
git add .
git commit -m "test push"
git push
```

如果成功推送，说明问题已解决！

## 技术支持

如果以上方案都无法解决问题，请联系：
- 微信：starssr-com
- QQ：521001121
- 邮箱：support@starssr.com

---
*云云星羽网络科技工作室*  
*专业解决各种技术难题*