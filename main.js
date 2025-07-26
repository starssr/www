/**
 * 云云星羽网络科技工作室 - 简约科技风官网脚本
 * 功能：加载动画、导航、滚动控制、模态框、Hero粒子效果
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
            
            // 随机颜色
            const colors = ['#00D4FF', '#00FF88', '#0EA5E9'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.appendChild(particle);
        }
    }
    
    startLoading() {
        const duration = 500;
        let startTime = Date.now();
        
        const updateProgress = () => {
            if (!this.isLoading) return;
            
            const elapsed = Date.now() - startTime;
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

// Hero粒子效果控制器
class HeroParticlesController {
    constructor() {
        this.canvas = Utils.$('#hero-particles');
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.mousePosition = { x: 0, y: 0 };
        
        if (this.canvas) {
            this.init();
        }
    }
    
    init() {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.offsetWidth,
                y: Math.random() * this.canvas.offsetHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#00D4FF' : '#00FF88'
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.resizeCanvas();
            this.createParticles();
        }, 250));
        
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
        
        this.particles.forEach((particle, index) => {
            // 更新粒子位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.offsetWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.offsetHeight) particle.vy *= -1;
            
            // 鼠标交互
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.01;
                particle.y -= dy * 0.01;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // 连接附近的粒子
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 浮动科技元素控制器
class FloatingElementsController {
    constructor() {
        this.container = Utils.$('.floating-elements');
        if (this.container) {
            this.createFloatingElements();
        }
    }
    
    createFloatingElements() {
        for (let i = 0; i < 12; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #00D4FF, #00FF88);
                border-radius: 50%;
                box-shadow: 0 0 15px currentColor;
                animation: float ${3 + i * 0.2}s ease-in-out infinite;
                animation-delay: ${i * 0.2}s;
                top: ${30 + Math.sin(i * Math.PI / 6) * 25}%;
                left: ${50 + Math.cos(i * Math.PI / 6) * 25}%;
            `;
            this.container.appendChild(element);
        }
    }
}

// 鼠标跟随光效控制器
class MouseGlowController {
    constructor() {
        this.mouseGlow = Utils.$('#mouse-glow');
        this.mousePosition = { x: 0, y: 0 };
        
        if (this.mouseGlow) {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            this.mouseGlow.style.left = (this.mousePosition.x - 192) + 'px';
            this.mouseGlow.style.top = (this.mousePosition.y - 192) + 'px';
            this.mouseGlow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouseGlow.style.opacity = '0';
        });
    }
}

// 导航控制器
class NavigationController {
    constructor() {
        this.header = Utils.$('header');
        this.mobileMenuBtn = Utils.$('#mobile-menu-btn');
        this.navLinks = Utils.$('.nav-links');
        
        this.initNavigation();
        this.initScrollEffect();
        this.initMobileMenu();
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
    
    initMobileMenu() {
        if (!this.mobileMenuBtn || !this.navLinks) return;
        
        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = Utils.$$('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuBtn.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        const isActive = this.navLinks.classList.contains('active');
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.navLinks.classList.add('active');
        this.mobileMenuBtn.classList.add('active');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
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

// 交互动画控制器
class InteractionController {
    constructor() {
        this.initHoverEffects();
        this.initClickEffects();
    }
    
    initHoverEffects() {
        // Hero标签悬浮效果
        const heroTags = Utils.$$('.hero-tag');
        heroTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // 服务卡片悬浮效果
        const serviceCards = Utils.$$('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // 统计数据悬浮效果
        const statItems = Utils.$$('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const number = item.querySelector('.stat-number');
                if (number) {
                    number.style.transform = 'scale(1.1)';
                    number.style.textShadow = '0 0 20px currentColor';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const number = item.querySelector('.stat-number');
                if (number) {
                    number.style.transform = 'scale(1)';
                    number.style.textShadow = 'none';
                }
            });
        });
    }
    
    initClickEffects() {
        // 按钮点击波纹效果
        const buttons = Utils.$$('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// 性能优化控制器
class PerformanceController {
    constructor() {
        this.initLazyLoading();
        this.initIntersectionObserver();
    }
    
    initLazyLoading() {
        const images = Utils.$$('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    initIntersectionObserver() {
        const animatedElements = Utils.$$('.service-card, .stat-item, .advantage-item');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    }
}

// 主应用类
class MainApp {
    constructor() {
        this.controllers = {};
        this.init();
    }
    
    init() {
        try {
            // 按依赖顺序初始化控制器
            this.controllers.loading = new LoadingController();
            this.controllers.navigation = new NavigationController();
            this.controllers.scroll = new ScrollController();
            this.controllers.modal = new ModalController();
            this.controllers.heroParticles = new HeroParticlesController();
            this.controllers.floatingElements = new FloatingElementsController();
            this.controllers.mouseGlow = new MouseGlowController();
            this.controllers.interaction = new InteractionController();
            this.controllers.performance = new PerformanceController();
            
            console.log('云云星羽网络科技工作室');
        } catch (error) {
            console.error('应用初始化失败:', error);
        }
    }
    
    destroy() {
        // 清理资源
        if (this.controllers.heroParticles) {
            this.controllers.heroParticles.destroy();
        }
    }
}

// 添加波纹动画CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

// 应用启动
let app;

function initApp() {
    app = new MainApp();
}

// DOM加载完成后启动应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});