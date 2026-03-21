/**
 * 主应用脚本
 * 处理全局交互和功能
 */

class CyberApp {
    constructor() {
        this.theme = 'cyberpunk';
        this.isTerminalMode = false;
        this.isMusicPlaying = false;
        this.currentPage = 'home';
        
        this.init();
    }
    
    init() {
        // 加载用户设置
        this.loadSettings();
        
        // 初始化组件
        this.initComponents();
        
        // 绑定全局事件
        this.bindGlobalEvents();
        
        // 初始化页面特定功能
        this.initPageFeatures();
        
        console.log('🚀 CyberApp 已初始化');
    }
    
    loadSettings() {
        // 加载主题
        this.theme = localStorage.getItem('cyber-theme') || 'cyberpunk';
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // 加载音乐状态
        this.isMusicPlaying = localStorage.getItem('cyber-music') === 'true';
        if (this.isMusicPlaying) {
            this.toggleMusic();
        }
        
        // 加载终端模式
        this.isTerminalMode = localStorage.getItem('cyber-terminal') === 'true';
        if (this.isTerminalMode) {
            document.body.classList.add('terminal-mode');
        }
    }
    
    initComponents() {
        // 初始化移动端菜单
        this.initMobileMenu();
        
        // 初始化主题切换
        this.initThemeSwitcher();
        
        // 初始化音乐播放器
        this.initMusicPlayer();
        
        // 初始化返回顶部按钮
        this.initBackToTop();
        
        // 初始化打字机效果
        this.initTypewriterEffects();
        
        // 初始化粒子系统
        this.initParticleSystem();
        
        // 初始化滚动动画
        this.initScrollAnimations();
    }
    
    initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeBtn && mobileMenu) {
            closeBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // 点击菜单链接关闭菜单
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
        
        // 移动端主题切换
        const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
        mobileThemeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                
                mobileThemeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
    
    initThemeSwitcher() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
    
    switchTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cyber-theme', theme);
        
        this.showNotification(`主题已切换: ${this.getThemeName(theme)}`);
        
        // 触发主题切换事件
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    getThemeName(theme) {
        const names = {
            'cyberpunk': '赛博朋克',
            'retro': '复古未来',
            'soft': '柔和极简'
        };
        return names[theme] || theme.toUpperCase();
    }
    
    initMusicPlayer() {
        const musicToggle = document.getElementById('music-toggle');
        const bgMusic = document.getElementById('bg-music');
        
        if (musicToggle && bgMusic) {
            // 设置初始状态
            if (this.isMusicPlaying) {
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }
            
            musicToggle.addEventListener('click', () => {
                this.toggleMusic();
            });
            
            // 处理音频播放错误
            bgMusic.addEventListener('error', () => {
                console.warn('背景音乐加载失败');
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                musicToggle.classList.add('error');
            });
        }
    }
    
    toggleMusic() {
        const musicToggle = document.getElementById('music-toggle');
        const bgMusic = document.getElementById('bg-music');
        
        if (!musicToggle || !bgMusic) return;
        
        if (this.isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            this.showNotification('音乐已暂停');
        } else {
            // 尝试播放音乐
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                        musicToggle.classList.remove('error');
                        this.showNotification('音乐播放中');
                    })
                    .catch(error => {
                        console.warn('自动播放被阻止:', error);
                        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                        musicToggle.classList.add('error');
                        this.showNotification('请手动点击播放音乐');
                    });
            }
        }
        
        this.isMusicPlaying = !this.isMusicPlaying;
        localStorage.setItem('cyber-music', this.isMusicPlaying);
    }
    
    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    initTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.width = '0';
            
            let i = 0;
            const speed = 50; // 打字速度（毫秒）
            
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // 打字完成后添加光标闪烁
                    element.classList.add('typing-complete');
                }
            }
            
            // 延迟开始打字
            setTimeout(() => {
                typeWriter();
            }, 500);
        });
    }
    
    initParticleSystem() {
        const particleElements = document.querySelectorAll('.particle-container');
        
        particleElements.forEach(container => {
            this.createParticles(container);
        });
    }
    
    createParticles(container) {
        const particleCount = 30;
        const colors = ['#00ffea', '#ff00ff', '#00ff9d', '#ffd166'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机属性
            const size = Math.random() * 4 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 3;
            const delay = Math.random() * 2;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: float ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                filter: blur(1px);
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 触发数字计数动画
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                    
                    // 触发进度条动画
                    if (entry.target.classList.contains('progress-animate')) {
                        this.animateProgressBar(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        const animateElements = document.querySelectorAll(
            '.feature-card, .project-card, .skill-item, .timeline-item, .counter, .progress-animate'
        );
        
        animateElements.forEach(el => observer.observe(el));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count) || 0;
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(progress * target);
            element.textContent = value.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animateProgressBar(element) {
        const targetWidth = parseInt(element.dataset.width) || 100;
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.width = targetWidth + '%';
        }, 100);
    }
    
    initPageFeatures() {
        const path = window.location.pathname;
        
        if (path.includes('about')) {
            this.initAboutPage();
        } else if (path.includes('portfolio')) {
            this.initPortfolioPage();
        } else if (path.includes('blog')) {
            this.initBlogPage();
        } else if (path.includes('lab')) {
            this.initLabPage();
        } else if (path.includes('fun')) {
            this.initFunPage();
        }
    }
    
    initAboutPage() {
        // 时间线动画
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.setProperty('--delay', `${index * 0.1}s`);
        });
        
        // 技能图表
        this.initSkillCharts();
    }
    
    initSkillCharts() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            const level = bar.dataset.level;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = level + '%';
            }, 500);
        });
    }
    
    initPortfolioPage() {
        // 项目筛选
        this.initProjectFilters();
        
        // 灯箱画廊
        this.initLightbox();
    }
    
    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // 更新按钮状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 筛选项目
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, 10);
                    } else {
                        card.classList.remove('visible');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                this.showNotification(`显示 ${filter === 'all' ? '所有' : filter} 项目`);
            });
        });
    }
    
    initLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        let currentIndex = 0;
        const images = Array.from(galleryImages);
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                this.openLightbox(img.src, img.alt);
            });
        });
        
        // 灯箱控制
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                this.closeLightbox();
            } else if (e.target.closest('.lightbox-prev')) {
                this.navigateLightbox(-1);
            } else if (e.target.closest('.lightbox-next')) {
                this.navigateLightbox(1);
            }
        });
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
                if (e.key === 'ArrowRight') this.navigateLightbox(1);
            }
        });
        
        this.openLightbox = (src, alt) => {
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            const caption = lightbox.querySelector('.lightbox-caption');
            
            lightboxImg.src = src;
            caption.textContent = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        this.closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        this.navigateLightbox = (direction) => {
            currentIndex = (currentIndex + direction + images.length) % images.length;
            const nextImg = images[currentIndex];
            this.openLightbox(nextImg.src, nextImg.alt);
        };
    }
    
    initBlogPage() {
        // 文章搜索
        this.initBlogSearch();
        
        // 代码高亮
        this.initCodeHighlighting();
    }
    
    initBlogSearch() {
        const searchInput = document.getElementById('blog-search');
        const articleCards = document.querySelectorAll('.article-card');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                
                articleCards.forEach(card => {
                    const title = card.querySelector('.article-title').textContent.toLowerCase();
                    const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
                    const tags = Array.from(card.querySelectorAll('.article-tag'))
                        .map(tag => tag.textContent.toLowerCase());
                    
                    const matches = title.includes(query) || 
                                  excerpt.includes(query) || 
                                  tags.some(tag => tag.includes(query));
                    
                    if (matches || query === '') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, 10);
                    } else {
                        card.classList.remove('visible');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        }
    }
    
    initCodeHighlighting() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            // 简单的代码高亮
            const code = block.textContent;
            const highlighted = this.highlightCode(code);
            block.innerHTML = highlighted;
            
            // 添加复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
            copyBtn.title = '复制代码';
            
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                    }, 2000);
                });
            });
            
            block.parentElement.appendChild(copyBtn);
        });
    }
    
    highlightCode(code) {
        // 简单的语法高亮
        return code
            .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
            .replace(/\b(function|const|let|var|if|else|for|while|return|class)\b/g, 
                '<span class="keyword">$1</span>')
            .replace(/\/\/.*/g, '<span class="comment">$&</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
    }
    
    initLabPage() {
        // 实验项目演示
        this.initLabDemos();
    }
    
    initLabDemos() {
        const demoButtons = document.querySelectorAll('.demo-launch-btn');
        
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const demoId = button.dataset.demo;
                this.launchDemo(demoId);
            });
        });
    }
    
    launchDemo(demoId) {
        const demos = {
            'particles': this.launchParticleDemo,
            'generative': this.launchGenerativeDemo,
            'audio': this.launchAudioDemo
        };
        
        if (demos[demoId]) {
            demos[demoId].call(this);
        } else {
            this.showNotification('演示功能开发中...');
        }
    }
    
    launchParticleDemo() {
        this.showNotification('启动粒子系统演示...');
        
        const demoWindow = window.open('', 'particleDemo', 'width=800,height=600');
        if (demoWindow) {
            demoWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>粒子系统演示</title>
                    <style>
                        body { margin: 0; overflow: hidden; background: #000; }
                        canvas { display: block; }
                    </style>
                </head>
                <body>
                    <canvas id="particleCanvas"></canvas>
                    <script>
                        const canvas = document.getElementById('particleCanvas');
                        const ctx = canvas.getContext('2d');
                        
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        
                        const particles = [];
                        const colors = ['#00ffea', '#ff00ff', '#00ff9d', '#ffd166'];
                        
                        class Particle {
                            constructor() {
                                this.x = Math.random() * canvas.width;
                                this.y = Math.random() * canvas.height;
                                this.size = Math.random() * 3 + 1;
                                this.speedX = Math.random() * 2 - 1;
                                this.speedY = Math.random() * 2 - 1;
                                this.color = colors[Math.floor(Math.random() * colors.length)];
                            }
                            
                            update() {
                                this.x += this.speedX;
                                this.y += this.speedY;
                                
                                if (this.x > canvas.width) this.x = 0;
                                else if (this.x < 0) this.x = canvas.width;
                                
                                if (this.y > canvas.height) this.y = 0;
                                else if (this.y < 0) this.y = canvas.height;
                            }
                            
                            draw() {
                                ctx.fillStyle = this.color;
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                                ctx.fill();
                                
                                // 发光效果
                                ctx.shadowColor = this.color;
                                ctx.shadowBlur = 10;
                            }
                        }
                        
                        function initParticles() {
                            for (let i = 0; i < 100; i++) {
                                particles.push(new Particle());
                            }
                        }
                        
                        function animate() {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            
                            particles.forEach(particle => {
                                particle.update();
                                particle.draw();
                                
                                // 连接相近的粒子
                                for (let j = 0; j < particles.length; j++) {
                                    const dx = particle.x - particles[j].x;
                                    const dy = particle.y - particles[j].y;
                                    const distance = Math.sqrt(dx * dx + dy * dy);
                                    
                                    if (distance < 100) {
                                        ctx.beginPath();
                                        ctx.strokeStyle = particle.color;
                                        ctx.lineWidth = 0.2;
                                        ctx.moveTo(particle.x, particle.y);
                                        ctx.lineTo(particles[j].x, particles[j].y);
                                        ctx.stroke();
                                    }
                                }
                            });
                            
                            requestAnimationFrame(animate);
                        }
                        
                        initParticles();
                        animate();
                        
                        window.addEventListener('resize', () => {
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                        });
                    <\/script>
                </body>
                </html>
            `);
        }
    }
    
    launchGenerativeDemo() {
        this.showNotification('启动生成艺术演示...');
        // 生成艺术演示代码
    }
    
    launchAudioDemo() {
        this.showNotification('启动音频可视化演示...');
        // 音频可视化演示代码
    }
    
    initFunPage() {
        // 随机展示器
        this.initRandomizer();
        
        // 趣味测试
        this.initQuiz();
        
        // 虚拟房间
        this.initVirtualRoom();
    }
    
    initRandomizer() {
        const randomizerBtn = document.getElementById('randomizer-btn');
        const randomOutput = document.getElementById('random-output');
        
        if (randomizerBtn && randomOutput) {
            const items = [
                '✨ 发现隐藏彩蛋！',
                '🚀 正在加载无限可能...',
                '🎨 生成创意灵感中...',
                '💻 编译梦想代码...',
                '🌟 连接星辰大海...',
                '🎵 调谐宇宙频率...',
                '🔮 预测数字未来...',
                '🎲 掷出幸运骰子...'
            ];
            
            randomizerBtn.addEventListener('click', () => {
                randomOutput.classList.remove('show');
                
                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * items.length);
                    randomOutput.textContent = items[randomIndex];
                    randomOutput.classList.add('show');
                    
                    this.showNotification('随机展示已更新');
                }, 300);
            });
        }
    }
    
    initQuiz() {
        const quizQuestions = [
            {
                question: "我最喜欢的编程语言是？",
                options: ["JavaScript", "Python", "TypeScript", "Go"],
                answer: 2
            },
            {
                question: "我的设计风格偏向？",
                options: ["极简主义", "赛博朋克", "复古未来", "有机形态"],
                answer: 1
            },
            {
                question: "我通常在哪里获得灵感？",
                options: ["深夜写代码时", "大自然中", "艺术展览", "科技新闻"],
                answer: 0
            }
        ];
        
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            let currentQuestion = 0;
            let score = 0;
            
            function showQuestion() {
                const question = quizQuestions[currentQuestion];
                quizContainer.innerHTML = `
                    <div class="quiz-question">
                        <h3>问题 ${currentQuestion + 1}/${quizQuestions.length}</h3>
                        <p>${question.question}</p>
                        <div class="quiz-options">
                            ${question.options.map((option, index) => `
                                <button class="quiz-option" data-index="${index}">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
                
                const options = quizContainer.querySelectorAll('.quiz-option');
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        const selectedIndex = parseInt(option.dataset.index);
                        
                        if (selectedIndex === question.answer) {
                            option.classList.add('correct');
                            score++;
                        } else {
                            option.classList.add('wrong');
                            options[question.answer].classList.add('correct');
                        }
                        
                        options.forEach(opt => opt.disabled = true);
                        
                        setTimeout(() => {
                            currentQuestion++;
                            if (currentQuestion < quizQuestions.length) {
                                showQuestion();
                            } else {
                                showResults();
                            }
                        }, 1500);
                    });
                });
            }
            
            function showResults() {
                const percentage = Math.round((score / quizQuestions.length) * 100);
                let message = '';
                
                if (percentage >= 80) {
                    message = '🎯 太棒了！你真的很了解我！';
                } else if (percentage >= 60) {
                    message = '👍 不错！我们有很多共同点！';
                } else {
                    message = '🤔 没关系，我们还有很多可以互相了解！';
                }
                
                quizContainer.innerHTML = `
                    <div class="quiz-results">
                        <h3>测试完成！</h3>
                        <div class="score-circle">
                            <span>${percentage}%</span>
                        </div>
                        <p>你答对了 ${score}/${quizQuestions.length} 题</p>
                        <p>${message}</p>
                        <button class="cyber-btn primary" onclick="location.reload()">
                            再试一次
                        </button>
                    </div>
                `;
            }
            
            showQuestion();
        }
    }
    
    initVirtualRoom() {
        const roomCanvas = document.getElementById('room-canvas');
        
        if (roomCanvas && roomCanvas.getContext) {
            const ctx = roomCanvas.getContext('2d');
            
            // 设置画布尺寸
            roomCanvas.width = roomCanvas.offsetWidth;
            roomCanvas.height = roomCanvas.offsetHeight;
            
            // 简单的房间渲染
            function drawRoom() {
                // 清空画布
                ctx.clearRect(0, 0, roomCanvas.width, roomCanvas.height);
                
                // 绘制地板
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, roomCanvas.height - 100, roomCanvas.width, 100);
                
                // 绘制墙壁
                ctx.fillStyle = '#0a0a14';
                ctx.fillRect(0, 0, roomCanvas.width, roomCanvas.height - 100);
                
                // 绘制窗户
                ctx.fillStyle = '#00ffea';
                ctx.fillRect(100, 100, 200, 150);
                
                // 绘制窗户细节
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(200, 100);
                ctx.lineTo(200, 250);
                ctx.moveTo(100, 175);
                ctx.lineTo(300, 175);
                ctx.stroke();
                
                // 绘制桌子
                ctx.fillStyle = '#2a2a3e';
                ctx.fillRect(400, roomCanvas.height - 200, 300, 20);
                ctx.fillRect(420, roomCanvas.height - 200, 20, 100);
                ctx.fillRect(660, roomCanvas.height - 200, 20, 100);
                
                // 绘制电脑
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(450, roomCanvas.height - 280, 200, 80);
                ctx.fillStyle = '#00ffea';
                ctx.fillRect(460, roomCanvas.height - 270, 180, 60);
                
                // 绘制代码文本
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px monospace';
                ctx.fillText('const creativity = ∞;', 470, roomCanvas.height - 240);
                ctx.fillText('while (alive) { code(); }', 470, roomCanvas.height - 220);
            }
            
            drawRoom();
            
            // 窗口大小变化时重绘
            window.addEventListener('resize', () => {
                roomCanvas.width = roomCanvas.offsetWidth;
                roomCanvas.height = roomCanvas.offsetHeight;
                drawRoom();
            });
        }
    }
    
    bindGlobalEvents() {
        // 终端模式切换
        const terminalToggle = document.querySelector('.terminal-toggle');
        if (terminalToggle) {
            terminalToggle.addEventListener('click', () => {
                this.toggleTerminalMode();
            });
        }
        
        // 全局快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl + T 切换主题
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.cycleTheme();
            }
            
            // Ctrl + M 切换音乐
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleMusic();
            }
            
            // Ctrl + ` 切换终端模式
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                this.toggleTerminalMode();
            }
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时暂停音乐
                const bgMusic = document.getElementById('bg-music');
                if (bgMusic && !bgMusic.paused) {
                    bgMusic.pause();
                }
            }
        });
    }
    
    cycleTheme() {
        const themes = ['cyberpunk', 'retro', 'soft'];
        const currentIndex = themes.indexOf(this.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.switchTheme(themes[nextIndex]);
    }
    
    toggleTerminalMode() {
        this.isTerminalMode = !this.isTerminalMode;
        
        if (this.isTerminalMode) {
            document.body.classList.add('terminal-mode');
            this.showNotification('终端模式已启用');
        } else {
            document.body.classList.remove('terminal-mode');
            this.showNotification('终端模式已关闭');
        }
        
        localStorage.setItem('cyber-terminal', this.isTerminalMode);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.getElementById('system-notification');
        
        if (notification) {
            const content = notification.querySelector('.notification-content');
            const text = notification.querySelector('.notification-text');
            
            // 设置图标
            const icon = content.querySelector('i');
            icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-terminal';
            
            // 设置文本
            text.textContent = message;
            
            // 显示通知
            notification.classList.remove('show', 'error');
            void notification.offsetWidth; // 触发重排
            notification.classList.add('show');
            if (type === 'error') notification.classList.add('error');
            
            // 自动隐藏
            setTimeout(() => {
                notification.classList.remove('show', 'error');
            }, 3000);
        } else {
            console.log(`通知: ${message}`);
        }
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.cyberApp = new CyberApp();
});

// 工具函数
//class Cyber
// 继续 app.js 的剩余部分

// 在文件末尾添加以下代码，补充缺失的功能

// 工具类和方法
class CyberUtils {
    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
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

    // 深拷贝
    static deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof RegExp) return new RegExp(obj);
        
        const clone = Array.isArray(obj) ? [] : {};
        
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = this.deepCopy(obj[key]);
            }
        }
        
        return clone;
    }

    // 生成随机ID
    static generateId(length = 8) {
        return Math.random().toString(36).substr(2, length);
    }

    // 格式化日期
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    // 检查元素是否在视窗内
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 获取滚动百分比
    static getScrollPercent() {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }
}

// 存储管理器
class StorageManager {
    constructor(namespace = 'cyber') {
        this.namespace = namespace;
    }

    set(key, value, ttl = null) {
        const item = {
            value: value,
            expires: ttl ? Date.now() + ttl * 1000 : null
        };
        
        try {
            localStorage.setItem(`${this.namespace}_${key}`, JSON.stringify(item));
            return true;
        } catch (error) {
            console.warn('LocalStorage 存储失败:', error);
            return false;
        }
    }

    get(key) {
        try {
            const itemStr = localStorage.getItem(`${this.namespace}_${key}`);
            if (!itemStr) return null;
            
            const item = JSON.parse(itemStr);
            
            if (item.expires && Date.now() > item.expires) {
                this.remove(key);
                return null;
            }
            
            return item.value;
        } catch (error) {
            console.warn('LocalStorage 读取失败:', error);
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(`${this.namespace}_${key}`);
    }

    clear() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${this.namespace}_`)) {
                keys.push(key);
            }
        }
        
        keys.forEach(key => localStorage.removeItem(key));
    }
}

// 动画控制器
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.isAnimating = false;
    }

    // 添加动画
    addAnimation(name, animationFn, options = {}) {
        this.animations.set(name, {
            fn: animationFn,
            options: {
                duration: 1000,
                easing: 'easeOutCubic',
                ...options
            }
        });
    }

    // 播放动画
    play(name, callback) {
        if (!this.animations.has(name)) {
            console.warn(`动画 ${name} 不存在`);
            return;
        }

        if (this.isAnimating) {
            console.warn('已有动画正在播放');
            return;
        }

        this.isAnimating = true;
        const { fn, options } = this.animations.get(name);
        
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / options.duration, 1);
            
            // 计算缓动值
            const easedProgress = this.ease(progress, options.easing);
            
            // 执行动画函数
            fn(easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 缓动函数
    ease(t, type) {
        const easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
        
        return easingFunctions[type] ? easingFunctions[type](t) : t;
    }
}

// 网络状态监控
class NetworkMonitor {
    constructor() {
        this.online = navigator.onLine;
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    handleOnline() {
        this.online = true;
        this.showNotification('网络已连接', 'success');
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('networkonline'));
    }

    handleOffline() {
        this.online = false;
        this.showNotification('网络已断开', 'error');
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('networkoffline'));
    }

    showNotification(message, type) {
        const notification = document.getElementById('system-notification');
        if (notification) {
            const text = notification.querySelector('.notification-text');
            const icon = notification.querySelector('i');
            
            icon.className = type === 'error' ? 'fas fa-wifi-slash' : 'fas fa-wifi';
            text.textContent = message;
            
            notification.classList.add('show');
            if (type === 'error') notification.classList.add('error');
            
            setTimeout(() => {
                notification.classList.remove('show', 'error');
            }, 3000);
        }
    }
}

// 性能监控
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.setupObservers();
        }
        
        // 记录页面加载时间
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.measurePerformance();
            }, 0);
        });
    }

    setupObservers() {
        // 监控最大内容绘制
        const paintObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                } else if (entry.name === 'largest-contentful-paint') {
                    this.metrics.lcp = entry.startTime;
                }
            }
        });
        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // 监控布局偏移
        const layoutShiftObserver = new PerformanceObserver((list) => {
            let cls = 0;
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
            this.metrics.cls = cls;
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

        // 监控首次输入延迟
        const fcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.fid = entry.startTime;
            }
        });
        fcpObserver.observe({ entryTypes: ['first-input'] });
    }

    measurePerformance() {
        // 获取页面加载时间
        if (performance.timing) {
            const timing = performance.timing;
            this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domReadyTime = timing.domComplete - timing.domLoading;
            this.metrics.pageRenderTime = timing.loadEventEnd - timing.responseEnd;
        }

        // 获取内存使用情况
        if (performance.memory) {
            this.metrics.memory = {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }

        console.log('性能指标:', this.metrics);
        
        // 发送到分析服务（如果有的话）
        this.sendMetrics();
    }

    sendMetrics() {
        // 这里可以添加发送到分析服务的代码
        // 例如：fetch('/api/metrics', { method: 'POST', body: JSON.stringify(this.metrics) });
    }
}

// 错误监控
class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.init();
    }

    init() {
        // 监听JavaScript错误
        window.addEventListener('error', (event) => {
            this.captureError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack
            });
        });

        // 监听Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                type: 'promise',
                message: event.reason?.message || 'Promise rejected',
                error: event.reason?.stack
            });
        });

        // 监听资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target && event.target.tagName) {
                this.captureError({
                    type: 'resource',
                    tagName: event.target.tagName,
                    src: event.target.src || event.target.href
                });
            }
        }, true);
    }

    captureError(errorInfo) {
        const error = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...errorInfo
        };

        this.errors.push(error);
        
        // 保持错误数量不超过最大值
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // 在控制台输出错误
        console.error('捕获到错误:', error);

        // 发送错误到服务器
        this.sendError(error);
    }

    sendError(error) {
        // 这里可以添加发送错误到服务器的代码
        // 注意：生产环境中应该限制发送频率
        if (process.env.NODE_ENV === 'production') {
            // fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) });
        }
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }
}

// 主题管理器
class ThemeManager {
    constructor() {
        this.themes = ['cyberpunk', 'retro', 'soft'];
        this.currentTheme = localStorage.getItem('cyber-theme') || 'cyberpunk';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => this.handleSystemThemeChange());
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('cyber-theme', theme);
        
        // 触发主题变化事件
        document.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    }

    cycleThemes() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }

    handleSystemThemeChange() {
        // 如果用户没有明确选择主题，跟随系统
        if (!localStorage.getItem('cyber-theme-manual')) {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(isDark ? 'cyberpunk' : 'soft');
        }
    }

    setManualTheme(theme) {
        this.applyTheme(theme);
        localStorage.setItem('cyber-theme-manual', 'true');
    }
}

// 键盘快捷键管理器
class KeyboardManager {
    constructor() {
        this.shortcuts = new Map();
        this.pressedKeys = new Set();
        this.init();
    }

    init() {
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    registerShortcut(keys, callback, description = '') {
        const keyCombination = Array.isArray(keys) ? keys : [keys];
        this.shortcuts.set(keyCombination.join('+'), {
            keys: keyCombination,
            callback,
            description
        });
    }

    handleKeyDown(event) {
        this.pressedKeys.add(event.key.toLowerCase());
        
        // 构建当前按下的组合键
        const combination = Array.from(this.pressedKeys)
            .sort()
            .join('+');
        
        // 检查是否有匹配的快捷键
        for (const [shortcut, { callback }] of this.shortcuts) {
            if (combination === shortcut) {
                event.preventDefault();
                callback();
                return;
            }
        }
    }

    handleKeyUp(event) {
        this.pressedKeys.delete(event.key.toLowerCase());
    }

    getShortcuts() {
        return Array.from(this.shortcuts.entries()).map(([key, { description }]) => ({
            key,
            description
        }));
    }
}

// 全局导出
window.CyberApp = CyberApp;
window.CyberUtils = CyberUtils;
window.StorageManager = StorageManager;
window.AnimationController = AnimationController;
window.NetworkMonitor = NetworkMonitor;
window.PerformanceMonitor = PerformanceMonitor;
window.ErrorMonitor = ErrorMonitor;
window.ThemeManager = ThemeManager;
window.KeyboardManager = KeyboardManager;

// 页面完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化所有模块
        window.cyberApp = new CyberApp();
        window.networkMonitor = new NetworkMonitor();
        window.performanceMonitor = new PerformanceMonitor();
        window.errorMonitor = new ErrorMonitor();
        window.themeManager = new ThemeManager();
        window.keyboardManager = new KeyboardManager();
        
        // 注册全局快捷键
        window.keyboardManager.registerShortcut(['Control', 't'], () => {
            window.themeManager.cycleThemes();
        }, '切换主题');
        
        window.keyboardManager.registerShortcut(['Control', 'm'], () => {
            if (window.cyberApp) {
                window.cyberApp.toggleMusic();
            }
        }, '切换音乐');
        
        window.keyboardManager.registerShortcut(['Control', '`'], () => {
            if (window.cyberApp) {
                window.cyberApp.toggleTerminalMode();
            }
        }, '切换终端模式');
        
        window.keyboardManager.registerShortcut(['Control', 'h'], () => {
            window.location.href = '/';
        }, '返回首页');
        
        window.keyboardManager.registerShortcut(['Control', 's'], () => {
            if (window.cyberApp) {
                window.cyberApp.showNotification('已保存设置');
            }
        }, '保存设置');
        
        // 显示欢迎信息
        setTimeout(() => {
            console.log(`
                ██████╗ ██╗   ██╗██████╗ ███████╗██████╗ 
                ██╔══██╗╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
                ██████╔╝ ╚████╔╝ ██████╔╝█████╗  ██████╔╝
                ██╔══██╗  ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
                ██████╔╝   ██║   ██████╔╝███████╗██║  ██║
                ╚═════╝    ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝
                
                欢迎使用数字空间！
                已加载所有核心模块。
                使用 Ctrl+T 切换主题，Ctrl+M 控制音乐，Ctrl+\` 切换终端模式。
            `);
        }, 1000);
    });
} else {
    // 如果文档已经加载完成，直接初始化
    window.cyberApp = new CyberApp();
}