// 全屏加载动画控制器 - 使用新的进度条组件
class FullscreenLoadingController {
    constructor() {
        this.overlay = document.getElementById('loading-overlay');
        this.particles = document.getElementById('particles');
        this.progressContainer = document.getElementById('loading-progress-container');
        
        this.progress = 0;
        this.targetProgress = 0;
        this.isLoading = true;
        this.loadingStartTime = Date.now();
        this.progressBar = null;
        
        // 强制禁用任何智能适配
        this.disableResponsiveFeatures();
        this.createParticles();
        this.initProgressBar();
        this.startProgressAnimation();
    }
    
    // 禁用响应式特性，确保跨终端一致
    disableResponsiveFeatures() {
        // 禁用触摸缩放
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // 强制固定样式
        document.body.style.setProperty('overflow', 'hidden', 'important');
        document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    }
    
    // 创建粒子效果
    createParticles() {
        if (!this.particles) return;
        
        // 固定粒子数量，不响应屏幕尺寸
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            this.particles.appendChild(particle);
        }
    }
    
    // 开始进度动画
    startProgressAnimation() {
        const duration = 3000; // 固定3秒加载时间
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使进度更自然
            const easedProgress = this.easeOutCubic(progress);
            this.setProgress(easedProgress * 100);
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            } else {
                // 确保显示100%
                this.setProgress(100);
                setTimeout(() => this.hideLoading(), 500);
            }
        };
        
        requestAnimationFrame(updateProgress);
    }
    
    // 缓动函数
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // 设置进度 - 使用平滑动画效果
    setProgress(value) {
        this.targetProgress = Math.min(Math.max(value, 0), 100);
        
        // 使用平滑过渡动画
        if (this.progressBar) {
            this.progressBar.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.progressBar.style.width = `${this.targetProgress}%`;
        }
        
        if (this.progressPercentage) {
            // 数字动画效果
            this.animateNumber(this.progress, this.targetProgress, (current) => {
                this.progressPercentage.textContent = `${Math.round(current)}%`;
            });
        }
        
        this.progress = this.targetProgress;
    }
    
    // 数字动画效果
    animateNumber(start, end, callback) {
        const duration = 300;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = this.easeOutCubic(progress);
            const current = start + (end - start) * easedProgress;
            
            callback(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // 隐藏加载动画
    hideLoading() {
        if (!this.isLoading || !this.overlay) return;
        
        this.isLoading = false;
        this.overlay.classList.add('fade-out');
        
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            // 恢复页面滚动
            document.body.style.removeProperty('overflow');
            document.documentElement.style.removeProperty('overflow');
        }, 300);
    }
}

// 微信弹窗控制器
class WeChatModalController {
    constructor() {
        this.modal = document.getElementById('wechat-modal');
        this.wechatBtn = document.getElementById('wechat-btn');
        this.closeBtn = document.getElementById('close-modal');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 打开弹窗
        if (this.wechatBtn) {
            this.wechatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
        }
        
        // 关闭弹窗
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        // 点击背景关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
        }
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'flex') {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.modal.setAttribute('aria-hidden', 'false');
            
            // 聚焦到关闭按钮
            setTimeout(() => {
                if (this.closeBtn) {
                    this.closeBtn.focus();
                }
            }, 100);
        }
    }
    
    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }
}

// 回到顶部按钮控制器
class BackToTopController {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 滚动监听
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (this.backToTopBtn) {
                if (scrollTop > 300) {
                    this.backToTopBtn.classList.add('show');
                } else {
                    this.backToTopBtn.classList.remove('show');
                }
            }
        });
        
        // 点击回到顶部
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// 导航栏滚动效果
class NavigationController {
    constructor() {
        this.header = document.querySelector('header');
        this.initScrollEffect();
        this.initSmoothScroll();
    }
    
    initScrollEffect() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (this.header) {
                if (scrollTop > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            }
        });
    }
    
    initSmoothScroll() {
        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// 全局变量
let loadingController;
let wechatModalController;
let backToTopController;
let navigationController;

// DOMContentLoaded事件 - 自动开始播放动画
document.addEventListener('DOMContentLoaded', function() {
    // 立即初始化全屏加载动画
    loadingController = new FullscreenLoadingController();
    
    // 初始化其他控制器
    wechatModalController = new WeChatModalController();
    backToTopController = new BackToTopController();
    navigationController = new NavigationController();
    
    console.log('全屏加载动画已启动 - 跨终端一致显示');
});

// 页面完全加载后的处理
window.addEventListener('load', function() {
    console.log('页面资源加载完成');
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 防止页面缩放（确保跨终端一致）
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
    e.preventDefault();
});

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

console.log('云云星羽网络科技工作室 - 全屏加载动画系统已就绪');