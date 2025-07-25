/**
 * 平滑动画进度条组件
 * 支持自定义颜色、尺寸和缓动动画效果
 */
class AnimatedProgressBar {
    constructor(container, options = {}) {
        // 默认配置
        this.defaultOptions = {
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            progressColor: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            animationDuration: 800, // 动画持续时间(ms)
            showPercentage: true,
            percentagePosition: 'right', // 'right', 'center', 'inside'
            percentageColor: '#333',
            percentageFontSize: '14px',
            percentageFontWeight: '600',
            glowEffect: true,
            stripedAnimation: false,
            easingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', // 缓动函数
            onProgress: null, // 进度更新回调
            onComplete: null // 完成回调
        };
        
        // 合并配置
        this.options = { ...this.defaultOptions, ...options };
        
        // 初始化属性
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.animationId = null;
        this.isAnimating = false;
        
        // 创建组件
        this.createElement();
        this.bindEvents();
    }
    
    /**
     * 创建进度条元素
     */
    createElement() {
        // 创建主容器
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'animated-progress-wrapper';
        this.wrapper.style.cssText = `
            position: relative;
            width: ${this.options.width};
            margin-bottom: ${this.options.showPercentage ? '25px' : '0'};
        `;
        
        // 创建进度条背景
        this.background = document.createElement('div');
        this.background.className = 'progress-background';
        this.background.style.cssText = `
            width: 100%;
            height: ${this.options.height};
            background: ${this.options.backgroundColor};
            border-radius: ${this.options.borderRadius};
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        
        // 创建进度条填充
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: ${this.options.progressColor};
            border-radius: ${this.options.borderRadius};
            transition: width ${this.options.animationDuration}ms ${this.options.easingFunction};
            position: relative;
            ${this.options.glowEffect ? `box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);` : ''}
        `;
        
        // 添加条纹动画效果
        if (this.options.stripedAnimation) {
            this.progressBar.style.backgroundImage = `
                linear-gradient(45deg, 
                    rgba(255, 255, 255, 0.15) 25%, 
                    transparent 25%, 
                    transparent 50%, 
                    rgba(255, 255, 255, 0.15) 50%, 
                    rgba(255, 255, 255, 0.15) 75%, 
                    transparent 75%, 
                    transparent)
            `;
            this.progressBar.style.backgroundSize = '20px 20px';
            this.progressBar.style.animation = 'progressStripes 1s linear infinite';
        }
        
        // 创建光泽效果
        if (this.options.glowEffect) {
            this.shimmer = document.createElement('div');
            this.shimmer.className = 'progress-shimmer';
            this.shimmer.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.4), 
                    transparent);
                animation: shimmer 2s infinite;
            `;
            this.progressBar.appendChild(this.shimmer);
        }
        
        // 创建百分比显示
        if (this.options.showPercentage) {
            this.percentageText = document.createElement('div');
            this.percentageText.className = 'progress-percentage';
            this.percentageText.textContent = '0%';
            
            let percentageStyles = `
                position: absolute;
                font-size: ${this.options.percentageFontSize};
                font-weight: ${this.options.percentageFontWeight};
                color: ${this.options.percentageColor};
                transition: all ${this.options.animationDuration}ms ${this.options.easingFunction};
            `;
            
            // 根据位置设置样式
            switch (this.options.percentagePosition) {
                case 'center':
                    percentageStyles += `
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    `;
                    break;
                case 'inside':
                    percentageStyles += `
                        top: 50%;
                        right: 8px;
                        transform: translateY(-50%);
                        color: white;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                    `;
                    break;
                default: // 'right'
                    percentageStyles += `
                        top: -22px;
                        right: 0;
                    `;
            }
            
            this.percentageText.style.cssText = percentageStyles;
        }
        
        // 组装元素
        this.background.appendChild(this.progressBar);
        this.wrapper.appendChild(this.background);
        
        if (this.options.showPercentage) {
            if (this.options.percentagePosition === 'inside') {
                this.progressBar.appendChild(this.percentageText);
            } else {
                this.wrapper.appendChild(this.percentageText);
            }
        }
        
        // 添加到容器
        this.container.appendChild(this.wrapper);
        
        // 添加CSS动画
        this.addStyles();
    }
    
    /**
     * 添加CSS样式
     */
    addStyles() {
        if (document.getElementById('animated-progress-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animated-progress-styles';
        style.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            @keyframes progressStripes {
                0% { background-position: 0 0; }
                100% { background-position: 20px 0; }
            }
            
            @keyframes progressPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }
            
            .animated-progress-wrapper:hover .progress-bar {
                filter: brightness(1.1);
            }
            
            .progress-percentage {
                user-select: none;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 鼠标悬停效果
        this.wrapper.addEventListener('mouseenter', () => {
            if (this.options.glowEffect) {
                this.progressBar.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.8)';
            }
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            if (this.options.glowEffect) {
                this.progressBar.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.5)';
            }
        });
    }
    
    /**
     * 设置进度值
     * @param {number} progress - 进度值 (0-100)
     * @param {boolean} animate - 是否使用动画
     */
    setProgress(progress, animate = true) {
        // 验证进度值
        progress = Math.min(Math.max(progress, 0), 100);
        this.targetProgress = progress;
        
        if (animate) {
            this.animateToProgress();
        } else {
            this.currentProgress = progress;
            this.updateDisplay();
        }
    }
    
    /**
     * 动画到目标进度
     */
    animateToProgress() {
        if (this.isAnimating) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.isAnimating = true;
        const startProgress = this.currentProgress;
        const progressDiff = this.targetProgress - startProgress;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.options.animationDuration, 1);
            
            // 使用缓动函数
            const easedProgress = this.easeOutCubic(progress);
            this.currentProgress = startProgress + (progressDiff * easedProgress);
            
            this.updateDisplay();
            
            // 调用进度回调
            if (this.options.onProgress) {
                this.options.onProgress(this.currentProgress);
            }
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.currentProgress = this.targetProgress;
                this.updateDisplay();
                
                // 调用完成回调
                if (this.currentProgress >= 100 && this.options.onComplete) {
                    this.options.onComplete();
                }
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    /**
     * 缓动函数 - 三次贝塞尔曲线
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    /**
     * 更新显示
     */
    updateDisplay() {
        // 更新进度条宽度
        this.progressBar.style.width = `${this.currentProgress}%`;
        
        // 更新百分比文本
        if (this.options.showPercentage && this.percentageText) {
            this.percentageText.textContent = `${Math.round(this.currentProgress)}%`;
            
            // 如果百分比在进度条内部，根据进度调整颜色
            if (this.options.percentagePosition === 'inside') {
                const textColor = this.currentProgress > 50 ? 'white' : this.options.percentageColor;
                this.percentageText.style.color = textColor;
            }
        }
    }
    
    /**
     * 增加进度
     * @param {number} increment - 增加的进度值
     */
    increment(increment = 1) {
        this.setProgress(this.targetProgress + increment);
    }
    
    /**
     * 重置进度
     */
    reset() {
        this.setProgress(0, false);
    }
    
    /**
     * 获取当前进度
     */
    getProgress() {
        return this.currentProgress;
    }
    
    /**
     * 更新配置
     * @param {Object} newOptions - 新的配置选项
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // 重新应用样式
        if (newOptions.progressColor) {
            this.progressBar.style.background = newOptions.progressColor;
        }
        
        if (newOptions.backgroundColor) {
            this.background.style.background = newOptions.backgroundColor;
        }
        
        if (newOptions.height) {
            this.background.style.height = newOptions.height;
        }
        
        if (newOptions.percentageColor && this.percentageText) {
            this.percentageText.style.color = newOptions.percentageColor;
        }
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimatedProgressBar;
} else if (typeof window !== 'undefined') {
    window.AnimatedProgressBar = AnimatedProgressBar;
}