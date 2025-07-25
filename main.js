// 简化的加载动画控制器
class SimpleLoadingController {
    constructor() {
        this.overlay = document.getElementById('loading-overlay');
        this.particles = document.getElementById('particles');
        
        this.isLoading = true;
        this.animationId = null;
        
        // 初始化组件
        this.initParticles();
        this.startLoading();
    }
    
    // 初始化粒子效果
    initParticles() {
        if (!this.particles) return;
        
        // 创建少量粒子，减少视觉干扰
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            this.particles.appendChild(particle);
        }
    }
    
    // 开始加载动画
    startLoading() {
        // 1秒后自动隐藏加载动画
        setTimeout(() => {
            this.hideLoading();
        }, 1000);
    }
    
    // 隐藏加载动画
    hideLoading() {
        if (!this.isLoading || !this.overlay) return;
        
        this.isLoading = false;
        
        // 添加淡出效果
        this.overlay.classList.add('fade-out');
        
        // 300ms后完全移除
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            console.log('加载动画已完成');
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
        if (!this.wechatBtn || !this.modal || !this.closeBtn) {
            console.error('微信弹窗元素未找到');
            return;
        }
        
        // 微信按钮点击事件 - 增强版
        this.wechatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('微信按钮点击事件触发');
            this.showModal();
        });
        
        // 移动端触摸支持
        this.wechatBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        
        this.wechatBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('微信按钮触摸事件触发');
            this.showModal();
        });
        
        // 额外的鼠标事件支持
        this.wechatBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        // 关闭按钮
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal();
        });
        
        // 点击背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        if (!this.modal) return;
        
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        
        // 聚焦到关闭按钮
        setTimeout(() => {
            if (this.closeBtn) {
                this.closeBtn.focus();
            }
        }, 100);
        
        console.log('微信弹窗已显示');
    }
    
    hideModal() {
        if (!this.modal) return;
        
        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');
        
        console.log('微信弹窗已隐藏');
    }
}

// 回到顶部按钮控制器
class BackToTopController {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.initEventListeners();
        this.initScrollListener();
    }
    
    initEventListeners() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    }
    
    initScrollListener() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                this.backToTopBtn.classList.add('show');
            } else {
                this.backToTopBtn.classList.remove('show');
            }
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 导航栏控制器
class NavigationController {
    constructor() {
        this.header = document.querySelector('header');
        this.navLinks = document.querySelectorAll('.nav-links a');
        
        this.initScrollEffect();
        this.initSmoothScroll();
    }
    
    initScrollEffect() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
    
    initSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = this.header ? this.header.offsetHeight : 0;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// 主应用控制器
class MainApp {
    constructor() {
        this.loadingController = null;
        this.wechatModalController = null;
        this.backToTopController = null;
        this.navigationController = null;
        
        this.init();
    }
    
    init() {
        // 初始化加载动画
        this.loadingController = new SimpleLoadingController();
        
        // 页面加载完成后初始化其他组件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initComponents();
            });
        } else {
            this.initComponents();
        }
        
        // 确保所有资源加载完成
        window.addEventListener('load', () => {
            console.log('页面所有资源加载完成');
        });
    }
    
    initComponents() {
        try {
            // 初始化微信弹窗
            this.wechatModalController = new WeChatModalController();
            
            // 初始化回到顶部按钮
            this.backToTopController = new BackToTopController();
            
            // 初始化导航栏
            this.navigationController = new NavigationController();
            
            console.log('所有组件初始化完成');
        } catch (error) {
            console.error('组件初始化失败:', error);
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，启动应用...');
    new MainApp();
});

// 防止页面加载错误
window.addEventListener('error', (e) => {
    console.error('页面加载错误:', e.error);
});

// 防止未处理的Promise错误
window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise错误:', e.reason);
});