/**
 * 网站核心加载引擎
 * 负责动态加载组件和内容
 */

class CyberLoader {
    constructor() {
        this.components = {};
        this.pages = {};
        this.currentPage = 'home';
        this.isLoading = false;
        this.theme = localStorage.getItem('cyber-theme') || 'cyberpunk';
        
        this.init();
    }

    async init() {
        // 设置主题
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // 模拟加载进度
        await this.simulateLoading();
        
        // 加载核心组件
        await this.loadCoreComponents();
        
        // 初始化应用
        await this.initializeApp();
        
        // 绑定事件
        this.bindEvents();
        
        // 显示系统通知
        this.showNotification('系统初始化完成。欢迎访问！');
    }

    async simulateLoading() {
        const progressFill = document.querySelector('.progress-fill');
        const loadingStatus = document.querySelector('.loading-status');
        const loadingPercent = document.querySelector('.loading-percent');
        const loadingOverlay = document.getElementById('loading-overlay');
        const appContainer = document.getElementById('app');

        const steps = [
            { text: 'BOOTING CYBER SYSTEM...', duration: 800 },
            { text: 'LOADING CORE MODULES...', duration: 1000 },
            { text: 'INITIALIZING UI COMPONENTS...', duration: 1200 },
            { text: 'ESTABLISHING CONNECTION...', duration: 900 },
            { text: 'SYSTEM READY!', duration: 500 }
        ];

        let totalProgress = 0;
        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            loadingStatus.textContent = step.text;
            
            // 更新进度
            for (let p = 0; p <= 100; p += 2) {
                const progress = totalProgress + (p * (step.duration / 100) / totalDuration * 100);
                progressFill.style.width = `${progress}%`;
                loadingPercent.textContent = `${Math.min(Math.floor(progress), 100)}%`;
                await this.delay(step.duration / 50);
            }
            
            totalProgress += (step.duration / totalDuration) * 100;
        }

        // 完成加载
        progressFill.style.width = '100%';
        loadingPercent.textContent = '100%';
        
        // 淡出加载界面
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.pointerEvents = 'none';
        
        // 显示主界面
        await this.delay(300);
        appContainer.style.opacity = '1';
        loadingOverlay.style.display = 'none';
    }

    async loadCoreComponents() {
        try {
            // 加载头部
            this.components.header = await this.loadComponent('components/_shared/layout/header.html');
            
            // 加载页脚
            this.components.footer = await this.loadComponent('components/_shared/layout/footer.html');
            
            // 加载首页组件
            this.components.hero = await this.loadComponent('components/_pages/home/hero.html');
            this.components.features = await this.loadComponent('components/_pages/home/features.html');
            this.components.cta = await this.loadComponent('components/_pages/home/cta.html');
            
        } catch (error) {
            console.error('组件加载失败:', error);
            this.showError('系统组件加载失败，请刷新页面重试。');
        }
    }

    async loadComponent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } catch (error) {
            // 如果文件不存在，使用备用组件
            return this.getFallbackComponent(path);
        }
    }

    getFallbackComponent(path) {
        const componentName = path.split('/').pop().replace('.html', '');
        
        const fallbacks = {
            'header': `
                <header class="cyber-header">
                    <nav class="nav-container">
                        <div class="nav-logo">
                            <a href="/" class="logo-link">
                                <span class="logo-cyber">◢◤CYBER◥◣</span>
                                <span class="logo-sub">DIGITAL SPACE</span>
                            </a>
                        </div>
                        <div class="nav-menu">
                            <a href="/" class="nav-link active" data-page="home">
                                <i class="fas fa-home"></i>
                                <span>首页</span>
                            </a>
                            <a href="pages/about/" class="nav-link" data-page="about">
                                <i class="fas fa-user-astronaut"></i>
                                <span>关于</span>
                            </a>
                            <a href="pages/portfolio/" class="nav-link" data-page="portfolio">
                                <i class="fas fa-code"></i>
                                <span>作品</span>
                            </a>
                            <a href="pages/blog/" class="nav-link" data-page="blog">
                                <i class="fas fa-blog"></i>
                                <span>博客</span>
                            </a>
                            <a href="pages/lab/" class="nav-link" data-page="lab">
                                <i class="fas fa-flask"></i>
                                <span>实验室</span>
                            </a>
                        </div>
                        <div class="nav-actions">
                            <button class="cyber-btn small" onclick="window.location.href='pages/contact/'">
                                <i class="fas fa-paper-plane"></i>
                                <span>联系</span>
                            </button>
                        </div>
                    </nav>
                </header>
            `,
            'footer': `
                <footer class="cyber-footer">
                    <div class="footer-grid">
                        <div class="footer-col">
                            <div class="footer-logo">
                                <span class="logo-icon">◢◤</span>
                                <h3>数字空间</h3>
                            </div>
                            <p class="footer-tagline">探索代码与设计的无限可能</p>
                            <div class="footer-social">
                                <a href="#" class="social-link" aria-label="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Instagram">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Email">
                                    <i class="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                        <div class="footer-col">
                            <h4>快速链接</h4>
                            <ul class="footer-links">
                                <li><a href="/">首页</a></li>
                                <li><a href="pages/about/">关于我</a></li>
                                <li><a href="pages/portfolio/">作品集</a></li>
                                <li><a href="pages/blog/">博客</a></li>
                                <li><a href="pages/lab/">实验室</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>资源</h4>
                            <ul class="footer-links">
                                <li><a href="pages/resources/">工具资源</a></li>
                                <li><a href="pages/resources/templates/resume.html">简历模板</a></li>
                                <li><a href="pages/fun/now.html">此刻的我</a></li>
                                <li><a href="pages/fun/quiz.html">趣味测试</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>连接</h4>
                            <div class="footer-newsletter">
                                <p>订阅我的动态</p>
                                <form class="newsletter-form">
                                    <input type="email" placeholder="输入你的邮箱" class="cyber-input">
                                    <button type="submit" class="cyber-btn small">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>© 2024 我的数字空间. 保留所有权利.</p>
                        <p>由 ❤️ 与代码驱动</p>
                    </div>
                </footer>
            `,
            'hero': `
                <section class="cyber-hero">
                    <div class="hero-grid">
                        <div class="hero-content">
                            <div class="hero-badge">
                                <span class="badge-icon">✦</span>
                                <span class="badge-text">CYBER EXPLORER</span>
                            </div>
                            <h1 class="hero-title">
                                <span class="title-line">你好，我是</span>
                                <span class="title-name glitch" data-text="数字旅人">数字旅人</span>
                            </h1>
                            <p class="hero-subtitle">
                                在<span class="highlight">代码</span>与<span class="highlight">设计</span>的边界探索，
                                用<span class="highlight">创造力</span>构建数字未来。
                            </p>
                            <div class="hero-actions">
                                <a href="pages/about/" class="cyber-btn primary">
                                    <i class="fas fa-user-astronaut"></i>
                                    <span>探索更多</span>
                                </a>
                                <a href="pages/portfolio/" class="cyber-btn secondary">
                                    <i class="fas fa-rocket"></i>
                                    <span>查看作品</span>
                                </a>
                                <button class="cyber-btn ghost terminal-toggle">
                                    <i class="fas fa-terminal"></i>
                                    <span>终端模式</span>
                                </button>
                            </div>
                            <div class="hero-stats">
                                <div class="stat-item">
                                    <span class="stat-number" data-count="42">0</span>
                                    <span class="stat-label">项目完成</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="128">0</span>
                                    <span class="stat-label">代码提交</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="24">0</span>
                                    <span class="stat-label">博客文章</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="∞">0</span>
                                    <span class="stat-label">无限可能</span>
                                </div>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="cyber-avatar">
                                <div class="avatar-container">
                                    <div class="avatar-image">
                                        <!-- 动态粒子背景 -->
                                        <canvas id="avatar-canvas" class="avatar-canvas"></canvas>
                                    </div>
                                    <div class="avatar-frame">
                                        <div class="frame-corner tl"></div>
                                        <div class="frame-corner tr"></div>
                                        <div class="frame-corner bl"></div>
                                        <div class="frame-corner br"></div>
                                        <div class="frame-glow"></div>
                                    </div>
                                </div>
                                <div class="avatar-status">
                                    <span class="status-dot online"></span>
                                    <span class="status-text">在线 | 灵感迸发中</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hero-scroll">
                        <div class="scroll-hint">
                            <i class="fas fa-chevron-down"></i>
                            <span>继续探索</span>
                        </div>
                    </div>
                </section>
            `,
            'features': `
                <section class="cyber-features">
                    <div class="section-header">
                        <h2 class="section-title">
                            <span class="title-decoration">//</span>
                            核心领域
                            <span class="title-decoration">//</span>
                        </h2>
                        <p class="section-subtitle">探索我的数字技能与创造力边界</p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-code"></i>
                                <div class="icon-glow"></div>
                            </div>
                            <h3 class="feature-title">前端开发</h3>
                            <p class="feature-description">
                                构建现代、响应式、高性能的Web应用，
                                专注于用户体验与代码质量。
                            </p>
                            <div class="feature-tech">
                                <span class="tech-tag">Vue.js</span>
                                <span class="tech-tag">React</span>
                                <span class="tech-tag">TypeScript</span>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-palette"></i>
                                <div class="icon-glow"></div>
                            </div>
                            <h3 class="feature-title">UI/UX设计</h3>
                            <p class="feature-description">
                                创造美观实用的用户界面，
                                结合美学与功能性的完美平衡。
                            </p>
                            <div class="feature-tech">
                                <span class="tech-tag">Figma</span>
                                <span class="tech-tag">Blender</span>
                                <span class="tech-tag">After Effects</span>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-gamepad"></i>
                                <div class="icon-glow"></div>
                            </div>
                            <h3 class="feature-title">创意编程</h3>
                            <p class="feature-description">
                                探索生成艺术、交互式体验，
                                用代码创造视觉与情感的表达。
                            </p>
                            <div class="feature-tech">
                                <span class="tech-tag">p5.js</span>
                                <span class="tech-tag">Three.js</span>
                                <span class="tech-tag">GLSL</span>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-vial"></i>
                                <div class="icon-glow"></div>
                            </div>
                            <h3 class="feature-title">实验项目</h3>
                            <p class="feature-description">
                                尝试新技术、新工具，
                                在实验室中孵化创新想法。
                            </p>
                            <div class="feature-tech">
                                <span class="tech-tag">AI/ML</span>
                                <span class="tech-tag">WebGL</span>
                                <span class="tech-tag">Web Audio</span>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            'cta': `
                <section class="cyber-cta">
                    <div class="cta-container">
                        <div class="cta-content">
                            <h2 class="cta-title">准备好一起创造了吗？</h2>
                            <p class="cta-description">
                                无论你是有趣的项目想法，还是想交流技术，或是单纯想交个朋友，
                                我都非常欢迎你的联系！
                            </p>
                            <div class="cta-actions">
                                <a href="pages/contact/" class="cyber-btn primary large">
                                    <i class="fas fa-paper-plane"></i>
                                    <span>发送消息</span>
                                </a>
                                <a href="pages/portfolio/" class="cyber-btn secondary large">
                                    <i class="fas fa-eye"></i>
                                    <span>查看作品</span>
                                </a>
                            </div>
                        </div>
                        <div class="cta-visual">
                            <div class="cyber-terminal">
                                <div class="terminal-header">
                                    <div class="terminal-buttons">
                                        <span class="term-btn close"></span>
                                        <span class="term-btn minimize"></span>
                                        <span class="term-btn maximize"></span>
                                    </div>
                                    <div class="terminal-title">terminal@cyber-space:~</div>
                                </div>
                                <div class="terminal-body">
                                    <div class="terminal-content">
                                        <p><span class="term-prompt">$</span> connect --to visitor</p>
                                        <p><span class="term-output">正在建立连接...</span></p>
                                        <p><span class="term-output">✓ 连接成功！</span></p>
                                        <p><span class="term-prompt">$</span> send --message "你好！"</p>
                                        <p><span class="term-output">消息已发送 ✓</span></p>
                                        <p><span class="term-prompt">$</span> <span class="cursor">█</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `
        };
        
        return fallbacks[componentName] || `<div class="component-error">组件加载失败: ${componentName}</div>`;
    }

    async initializeApp() {
        // 插入头部
        const headerContainer = document.createElement('header');
        headerContainer.innerHTML = this.components.header;
        document.querySelector('#app').prepend(headerContainer);
        
        // 插入主内容
        const contentContainer = document.getElementById('content-container');
        if (contentContainer) {
            contentContainer.innerHTML = `
                ${this.components.hero || ''}
                ${this.components.features || ''}
                ${this.components.cta || ''}
            `;
        }
        
        // 插入页脚
        const footerContainer = document.createElement('footer');
        footerContainer.innerHTML = this.components.footer;
        document.querySelector('#app').appendChild(footerContainer);
        
        // 初始化动画
        this.initAnimations();
        
        // 初始化统计数字动画
        this.animateNumbers();
        
        // 初始化粒子效果
        this.initParticles();
    }

    bindEvents() {
        // 导航链接点击
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && !navLink.classList.contains('active')) {
                e.preventDefault();
                const page = navLink.dataset.page;
                this.navigateTo(page);
            }
        });
        
        // 主题切换
        const themeSwitcher = document.getElementById('theme-switcher');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', () => {
                document.querySelector('.theme-options').classList.toggle('show');
            });
        }
        
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                document.querySelector('.theme-options').classList.remove('show');
            });
        });
        
        // 返回顶部
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });
        }
        
        // 终端模式切换
        const terminalToggle = document.querySelector('.terminal-toggle');
        if (terminalToggle) {
            terminalToggle.addEventListener('click', () => {
                this.toggleTerminalMode();
            });
        }
        
        // 音乐播放器
        const musicToggle = document.getElementById('music-toggle');
        const bgMusic = document.getElementById('bg-music');
        
        if (musicToggle && bgMusic) {
            musicToggle.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play();
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    bgMusic.pause();
                    musicToggle.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
    }

    switchTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cyber-theme', theme);
        this.showNotification(`主题已切换: ${theme.toUpperCase()}`);
    }

    toggleTerminalMode() {
        document.body.classList.toggle('terminal-mode');
        const isTerminal = document.body.classList.contains('terminal-mode');
        this.showNotification(`终端模式 ${isTerminal ? '开启' : '关闭'}`);
    }

    initAnimations() {
        // 初始化滚动动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.feature-card, .hero-stats, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    animateNumbers() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (target === Infinity) {
                    counter.textContent = '∞';
                } else {
                    const value = Math.floor(progress * target);
                    counter.textContent = value.toLocaleString();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            setTimeout(animate, 500);
        });
    }

    initParticles() {
        const canvas = document.getElementById('avatar-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }

    async navigateTo(page) {
        if (this.isLoading || this.currentPage === page) return;
        
        this.isLoading = true;
        this.currentPage = page;
        
        // 更新导航激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        // 显示加载状态
        this.showNotification(`加载 ${page} 页面...`);
        
        try {
            // 这里可以添加页面切换的动画和内容加载逻辑
            await this.delay(500);
            this.showNotification(`${page} 页面加载完成`);
        } catch (error) {
            console.error('页面导航失败:', error);
            this.showError('页面加载失败');
        } finally {
            this.isLoading = false;
        }
    }

    showNotification(message) {
        const notification = document.getElementById('system-notification');
        const text = notification.querySelector('.notification-text');
        
        text.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    showError(message) {
        const notification = document.getElementById('system-notification');
        const text = notification.querySelector('.notification-text');
        
        text.textContent = `错误: ${message}`;
        notification.classList.add('show', 'error');
        
        setTimeout(() => {
            notification.classList.remove('show', 'error');
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化加载器
document.addEventListener('DOMContentLoaded', () => {
    window.cyberLoader = new CyberLoader();
});