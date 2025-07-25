/**
 * 云云星羽网络科技工作室 - 构建脚本
 * 用于优化和构建静态网站
 */

const fs = require('fs');
const path = require('path');

class StaticSiteBuilder {
    constructor() {
        this.sourceDir = './';
        this.buildDir = './dist';
        this.requiredFiles = [
            'index.html',
            'style.css',
            'main.js',
            'wdwx.webp'
        ];
    }

    // 创建构建目录
    createBuildDir() {
        if (!fs.existsSync(this.buildDir)) {
            fs.mkdirSync(this.buildDir, { recursive: true });
            console.log('✅ 创建构建目录:', this.buildDir);
        }
    }

    // 复制必要文件
    copyFiles() {
        console.log('📁 开始复制文件...');
        
        this.requiredFiles.forEach(file => {
            const sourcePath = path.join(this.sourceDir, file);
            const destPath = path.join(this.buildDir, file);
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`✅ 复制文件: ${file}`);
            } else {
                console.warn(`⚠️  文件不存在: ${file}`);
            }
        });
    }

    // 优化HTML文件
    optimizeHTML() {
        const htmlPath = path.join(this.buildDir, 'index.html');
        
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf8');
            
            // 添加构建时间戳
            const timestamp = new Date().toISOString();
            html = html.replace(
                '<meta name="theme-color" content="#00D4FF">',
                `<meta name="theme-color" content="#00D4FF">
    <meta name="build-time" content="${timestamp}">`
            );
            
            // 压缩HTML（移除多余空白）
            html = html.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
            
            fs.writeFileSync(htmlPath, html);
            console.log('✅ HTML文件已优化');
        }
    }

    // 优化CSS文件
    optimizeCSS() {
        const cssPath = path.join(this.buildDir, 'style.css');
        
        if (fs.existsSync(cssPath)) {
            let css = fs.readFileSync(cssPath, 'utf8');
            
            // 移除注释和多余空白
            css = css.replace(/\/\*[\s\S]*?\*\//g, '');
            css = css.replace(/\s+/g, ' ');
            css = css.replace(/;\s*}/g, '}');
            css = css.replace(/\s*{\s*/g, '{');
            css = css.replace(/;\s*/g, ';');
            
            fs.writeFileSync(cssPath, css);
            console.log('✅ CSS文件已优化');
        }
    }

    // 创建部署配置
    createDeployConfig() {
        const deployConfig = {
            name: "云云星羽网络科技工作室",
            description: "简约科技风官网",
            buildTime: new Date().toISOString(),
            version: "1.0.0",
            files: this.requiredFiles,
            environment: {
                NODE_ENV: "production",
                SITE_URL: "https://starssr.com"
            }
        };

        fs.writeFileSync(
            path.join(this.buildDir, 'deploy-config.json'),
            JSON.stringify(deployConfig, null, 2)
        );
        console.log('✅ 部署配置已创建');
    }

    // 生成文件清单
    generateManifest() {
        const manifest = {
            name: "云云星羽网络科技工作室",
            short_name: "云云星羽",
            description: "专业提供网络技术服务、软件开发、人工智能解决方案",
            start_url: "/",
            display: "standalone",
            background_color: "#0f172a",
            theme_color: "#00D4FF",
            icons: [
                {
                    src: "https://q1.qlogo.cn/g?b=qq&nk=521001121&s=192",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "https://q1.qlogo.cn/g?b=qq&nk=521001121&s=512",
                    sizes: "512x512",
                    type: "image/png"
                }
            ]
        };

        fs.writeFileSync(
            path.join(this.buildDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        console.log('✅ PWA清单已生成');
    }

    // 执行构建
    build() {
        console.log('🚀 开始构建云云星羽网络科技工作室官网...\n');
        
        try {
            this.createBuildDir();
            this.copyFiles();
            this.optimizeHTML();
            this.optimizeCSS();
            this.createDeployConfig();
            this.generateManifest();
            
            console.log('\n🎉 构建完成！');
            console.log(`📦 构建文件位于: ${this.buildDir}`);
            console.log('🌐 可以部署到任何静态网站托管服务');
            
        } catch (error) {
            console.error('❌ 构建失败:', error.message);
            process.exit(1);
        }
    }
}

// 执行构建
const builder = new StaticSiteBuilder();
builder.build();