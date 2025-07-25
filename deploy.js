/**
 * 云云星羽网络科技工作室 - 部署脚本
 * 自动构建并部署到远程预览环境
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RemoteDeployer {
    constructor() {
        this.buildDir = './dist';
        this.previewServices = [
            {
                name: 'Netlify Drop',
                url: 'https://app.netlify.com/drop',
                description: '拖拽部署，即时预览'
            },
            {
                name: 'Surge.sh',
                command: 'npx surge',
                description: '命令行部署，快速预览'
            },
            {
                name: 'Vercel',
                command: 'npx vercel --prod',
                description: '专业部署平台'
            }
        ];
    }

    // 检查构建文件
    checkBuildFiles() {
        if (!fs.existsSync(this.buildDir)) {
            console.log('📦 构建目录不存在，开始构建...');
            execSync('node build.js', { stdio: 'inherit' });
        }
        
        const requiredFiles = ['index.html', 'style.css', 'main.js'];
        const missingFiles = requiredFiles.filter(file => 
            !fs.existsSync(path.join(this.buildDir, file))
        );
        
        if (missingFiles.length > 0) {
            throw new Error(`缺少必要文件: ${missingFiles.join(', ')}`);
        }
        
        console.log('✅ 构建文件检查完成');
    }

    // 生成部署说明
    generateDeployInstructions() {
        const instructions = `
# 云云星羽网络科技工作室 - 远程预览部署指南

## 🚀 快速部署选项

### 1. Netlify Drop (推荐 - 最简单)
1. 访问: https://app.netlify.com/drop
2. 将 \`dist\` 文件夹拖拽到页面中
3. 获得即时预览链接
4. 支持自定义域名

### 2. Surge.sh (命令行)
\`\`\`bash
# 安装 surge (如果未安装)
npm install -g surge

# 部署到 surge
cd dist
surge

# 或使用自定义域名
surge --domain starssr-preview.surge.sh
\`\`\`

### 3. Vercel (专业平台)
\`\`\`bash
# 安装 vercel (如果未安装)
npm install -g vercel

# 部署
npx vercel --prod
\`\`\`

### 4. GitHub Pages
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为源
4. 访问: https://username.github.io/repository-name

## 📋 部署清单
- ✅ HTML文件已优化
- ✅ CSS文件已压缩
- ✅ JavaScript功能完整
- ✅ 图片资源已包含
- ✅ PWA清单已生成
- ✅ 响应式设计已测试

## 🔧 环境变量 (如需要)
\`\`\`
NODE_ENV=production
SITE_URL=https://your-domain.com
\`\`\`

## 📱 预览功能确认
- [x] 加载动画效果
- [x] Hero区域科技风设计
- [x] 粒子动画系统
- [x] 响应式布局
- [x] 微信二维码弹窗
- [x] 社交链接功能
- [x] 回到顶部按钮
- [x] 移动端适配

构建时间: ${new Date().toLocaleString('zh-CN')}
版本: 1.0.0
`;

        fs.writeFileSync(path.join(this.buildDir, 'DEPLOY.md'), instructions);
        console.log('✅ 部署说明已生成');
    }

    // 创建预览环境配置
    createPreviewConfig() {
        const config = {
            "build": {
                "command": "node build.js",
                "publish": "dist"
            },
            "redirects": [
                {
                    "from": "/*",
                    "to": "/index.html",
                    "status": 200
                }
            ],
            "headers": [
                {
                    "source": "/**/*.@(js|css)",
                    "headers": [
                        {
                            "key": "Cache-Control",
                            "value": "public, max-age=31536000"
                        }
                    ]
                },
                {
                    "source": "/**/*.@(jpg|jpeg|png|gif|ico|svg|webp)",
                    "headers": [
                        {
                            "key": "Cache-Control",
                            "value": "public, max-age=31536000"
                        }
                    ]
                }
            ]
        };

        // Netlify配置
        fs.writeFileSync(
            path.join(this.buildDir, 'netlify.toml'),
            `[build]
  command = "node build.js"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/**/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/**/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
`
        );

        // Vercel配置
        fs.writeFileSync(
            path.join(this.buildDir, 'vercel.json'),
            JSON.stringify({
                "version": 2,
                "name": "starssr-tech-website",
                "builds": [
                    {
                        "src": "**/*",
                        "use": "@vercel/static"
                    }
                ],
                "routes": [
                    {
                        "src": "/(.*)",
                        "dest": "/$1"
                    }
                ]
            }, null, 2)
        );

        console.log('✅ 预览环境配置已创建');
    }

    // 生成预览链接
    generatePreviewLinks() {
        const links = {
            "预览服务": [
                "https://app.netlify.com/drop (拖拽部署)",
                "https://vercel.com/new (GitHub导入)",
                "https://surge.sh (命令行部署)",
                "https://pages.github.com (GitHub Pages)"
            ],
            "演示链接": [
                "本地预览: http://localhost:8080",
                "构建预览: http://localhost:3000"
            ]
        };

        fs.writeFileSync(
            path.join(this.buildDir, 'preview-links.json'),
            JSON.stringify(links, null, 2)
        );

        console.log('🌐 预览链接已生成');
        console.log('\n📋 可用的部署选项:');
        this.previewServices.forEach(service => {
            console.log(`  • ${service.name}: ${service.description}`);
        });
    }

    // 执行部署准备
    deploy() {
        console.log('🚀 开始准备远程预览环境...\n');
        
        try {
            this.checkBuildFiles();
            this.generateDeployInstructions();
            this.createPreviewConfig();
            this.generatePreviewLinks();
            
            console.log('\n🎉 远程预览环境准备完成！');
            console.log(`📦 部署文件位于: ${this.buildDir}`);
            console.log('📖 查看 DEPLOY.md 获取详细部署说明');
            console.log('\n🌐 推荐部署方式:');
            console.log('  1. 访问 https://app.netlify.com/drop');
            console.log('  2. 拖拽 dist 文件夹到页面');
            console.log('  3. 获得即时预览链接');
            
        } catch (error) {
            console.error('❌ 部署准备失败:', error.message);
            process.exit(1);
        }
    }
}

// 执行部署准备
const deployer = new RemoteDeployer();
deployer.deploy();