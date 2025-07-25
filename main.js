/**
 * 云云星羽网络科技工作室 - 主应用脚本
 * 功能：加载动画、导航、滚动控制、模态框
 */

// 工具函数
const Utils = {
    // 安全的DOM查询
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),
    
    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 加载动画控制器
class LoadingController {
    constructor() {
        this.overlay = Utils.$('#loading-overlay');
        this.particles = Utils.$('#particles');
        this.progressBarFill = Utils.$('.progress-bar-fill');
        this.progressPercentage = Utils.$('.progress-percentage');
        this.progressContainer = Utils.$('.progress-bar-container');
        
        this.isLoading = true;
        this.isPaused = false;
        this.currentProgress = 0;
        
        if (this.overlay) {
            this.initParticles();
            this.initProgressControls();
            this.startLoading();
        }
    }
    
    initParticles() {
        if (!this.particles) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (3 + Math.random() * 2) + 's';
            this.particles.appendChild(particle);
        }
    }
    
    initProgressControls() {
        if (!this.progressContainer) return;
        
        // 创建控制按钮容器
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'progress-controls';
        
        // 暂停/继续按钮
        const pauseBtn = document.createElement('button');
        pauseBtn.className = 'progress-control-btn';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        pauseBtn.title = '暂停/继续';
        pauseBtn.addEventListener('click', () => this.togglePause());
        
        controlsDiv.appendChild(pauseBtn);
        this.progressContainer.appendChild(controlsDiv);
        
        this.pauseBtn = pauseBtn;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.progressContainer.classList.add('paused');
            this.pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.pauseBtn.title = '继续';
        } else {
            this.progressContainer.classList.remove('paused');
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.pauseBtn.title = '暂停';
        }
    }
    
    startLoading() {
        const duration = 2500;
        let startTime = Date.now();
        let pausedTime = 0;
        
        const updateProgress = () => {
            if (!this.isLoading) return;
            
            if (this.isPaused) {
                pausedTime += 16; // 大约一帧的时间
                requestAnimationFrame(updateProgress);
                return;
            }
            
            const elapsed = Date.now() - startTime - pausedTime;
            this.currentProgress = Math.min((elapsed / duration) * 100, 100);
            
            this.updateProgressDisplay();
            
            if (this.currentProgress < 99.5) {
                requestAnimationFrame(updateProgress);
            } else {
                this.completeLoading();
            }
        };
        
        setTimeout(() => requestAnimationFrame(updateProgress), 500);
    }
    
    updateProgressDisplay() {
        if (this.progressBarFill) {
            this.progressBarFill.style.width = this.currentProgress + '%';
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = Math.round(this.currentProgress) + '%';
        }
    }
    
    completeLoading() {
        this.isLoading = false;
        
        if (this.progressBarFill) {
            this.progressBarFill.style.width = '100%';
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = '100%';
        }
        
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                setTimeout(() => {
                    this.overlay.remove();
                }, 500);
            }
        }, 200);
    }
}

// 导航控制器
class NavigationController {
    constructor() {
        this.header = Utils.$('header');
        this.initNavigation();
        this.initScrollEffect();
    }
    
    initNavigation() {
        const navLinks = Utils.$$('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = Utils.$(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initScrollEffect() {
        if (!this.header) return;
        
        const throttledScroll = Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 导航栏滚动效果
            if (scrollTop > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, 16);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }
}

// 滚动控制器
class ScrollController {
    constructor() {
        this.backToTopBtn = Utils.$('#back-to-top');
        
        if (this.backToTopBtn) {
            this.initScrollListener();
            this.initBackToTop();
        }
    }
    
    initScrollListener() {
        const throttledScroll = Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                this.backToTopBtn.classList.add('show');
            } else {
                this.backToTopBtn.classList.remove('show');
            }
        }, 16);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }
    
    initBackToTop() {
        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 模态框控制器
class ModalController {
    constructor() {
        this.modal = Utils.$('#wechat-modal');
        this.trigger = Utils.$('#wechat-btn');
        this.closeBtn = Utils.$('#close-modal');
        this.overlay = Utils.$('#modal-overlay');
        
        if (this.modal && this.trigger) {
            this.initModal();
        }
    }
    
    initModal() {
        // 打开模态框
        this.trigger.addEventListener('click', () => this.openModal());
        
        // 关闭模态框
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');
        this.trigger.setAttribute('aria-expanded', 'true');
        
        // 焦点管理
        const firstFocusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');
        
        // 恢复焦点
        this.trigger.focus();
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

// 主应用类
class MainApp {
    constructor() {
        this.loadingController = null;
        this.navigationController = null;
        this.scrollController = null;
        this.modalController = null;
        
        this.init();
    }
    
    init() {
        try {
            // 按依赖顺序初始化控制器
            this.loadingController = new LoadingController();
            this.navigationController = new NavigationController();
            this.scrollController = new ScrollController();
            this.modalController = new ModalController();
            
            console.log('云云星羽网络科技工作室 - 应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
        }
    }
}

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

// 如果DOM已经加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MainApp());
} else {
    new MainApp();
}