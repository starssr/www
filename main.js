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

// 微信弹窗控制器 - 增强版
class WechatModalController {
    constructor() {
        this.modal = document.getElementById('wechat-modal');
        this.wechatBtn = document.getElementById('wechat-btn');
        this.closeBtn = document.getElementById('close-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        
        this.isOpen = false;
        this.focusableElements = [];
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
        
        this.initEventListeners();
        this.initAccessibility();
    }
    
    initEventListeners() {
        // 微信按钮多重事件监听
        if (this.wechatBtn) {
            // 点击事件
            this.wechatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('微信按钮点击事件触发');
                this.showModal();
            });
            
            // 键盘事件
            this.wechatBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('微信按钮键盘事件触发');
                    this.showModal();
                }
            });
            
            // 移动端触摸事件
            this.wechatBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('微信按钮触摸开始');
            });
            
            this.wechatBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('微信按钮触摸结束，显示弹窗');
                this.showModal();
            });
            
            // 鼠标事件
            this.wechatBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                console.log('微信按钮鼠标按下');
            });
        }
        
        // 关闭按钮事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('关闭按钮被点击');
                this.hideModal();
            });
            
            this.closeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.hideModal();
                }
            });
        }
        
        // 背景遮罩点击关闭
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('背景遮罩被点击');
                this.hideModal();
            });
        }
        
        // 弹窗容器点击事件（防止冒泡）
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    console.log('弹窗背景被点击');
                    this.hideModal();
                }
            });
        }
        
        // 全局键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    console.log('ESC键被按下，关闭弹窗');
                    this.hideModal();
                } else if (e.key === 'Tab') {
                    this.handleTabKey(e);
                }
            }
        });
    }
    
    initAccessibility() {
        // 初始化可聚焦元素
        this.updateFocusableElements();
    }
    
    updateFocusableElements() {
        if (this.modal) {
            const focusableSelectors = [
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                'a[href]',
                '[tabindex]:not([tabindex="-1"])'
            ];
            
            this.focusableElements = this.modal.querySelectorAll(focusableSelectors.join(', '));
            this.firstFocusableElement = this.focusableElements[0];
            this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
        }
    }
    
    handleTabKey(e) {
        if (this.focusableElements.length === 0) return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === this.firstFocusableElement) {
                e.preventDefault();
                this.lastFocusableElement?.focus();
            }
        } else {
            // Tab
            if (document.activeElement === this.lastFocusableElement) {
                e.preventDefault();
                this.firstFocusableElement?.focus();
            }
        }
    }
    
    showModal() {
        if (this.modal && !this.isOpen) {
            console.log('显示微信弹窗');
            
            // 更新按钮状态
            if (this.wechatBtn) {
                this.wechatBtn.setAttribute('aria-expanded', 'true');
            }
            
            // 显示弹窗
            this.modal.style.display = 'flex';
            this.modal.classList.add('show');
            this.modal.setAttribute('aria-hidden', 'false');
            
            // 禁用背景滚动
            document.body.style.overflow = 'hidden';
            
            // 更新状态
            this.isOpen = true;
            
            // 焦点管理
            this.updateFocusableElements();
            setTimeout(() => {
                this.closeBtn?.focus();
            }, 100);
            
            console.log('微信弹窗已显示');
        }
    }
    
    hideModal() {
        if (this.modal && this.isOpen) {
            console.log('隐藏微信弹窗');
            
            // 更新按钮状态
            if (this.wechatBtn) {
                this.wechatBtn.setAttribute('aria-expanded', 'false');
            }
            
            // 隐藏弹窗
            this.modal.classList.remove('show');
            this.modal.setAttribute('aria-hidden', 'true');
            
            // 恢复背景滚动
            document.body.style.overflow = 'auto';
            
            // 更新状态
            this.isOpen = false;
            
            // 延迟隐藏
            setTimeout(() => {
                this.modal.style.display = 'none';
            }, 300);
            
            // 返回焦点
            setTimeout(() => {
                this.wechatBtn?.focus();
            }, 50);
            
            console.log('微信弹窗已隐藏');
        }
    }
    
    // 公共方法
    toggle() {
        if (this.isOpen) {
            this.hideModal();
        } else {
            this.showModal();
        }
    }
    
    isModalOpen() {
        return this.isOpen;
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
            this.wechatModalController = new WechatModalController();
            
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