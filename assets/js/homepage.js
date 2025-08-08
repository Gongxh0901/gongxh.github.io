// 代码雨动画（通用函数）
function createCodeRain(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 配置选项
    const config = {
        chars: options.chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789',  // 使用所有英文字符和数字1-9
        fontSize: options.fontSize || 16,
        color: options.color || '#0F0',
        fadeColor: options.fadeColor || 'rgba(26, 26, 26, 0.05)',
        speed: options.speed || 33,
        density: options.density || 1,
        trailLifetime: options.trailLifetime || 3000  // 拖尾生存时间（毫秒）
    };
    
    const columns = canvas.width / config.fontSize;
    const drops = [];
    const trails = [];  // 存储所有拖尾字符的信息
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        // 清空画布
        ctx.fillStyle = 'rgba(26, 26, 26, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = config.fontSize + 'px monospace';
        
        // 更新时间戳
        const currentTime = Date.now();
        
        // 绘制拖尾
        for (let i = trails.length - 1; i >= 0; i--) {
            const trail = trails[i];
            const age = currentTime - trail.timestamp;
            
            // 如果拖尾超过生存时间，移除它
            if (age > config.trailLifetime) {
                trails.splice(i, 1);
                continue;
            }
            
            // 计算拖尾的透明度（随时间递减）
            const fadeProgress = age / config.trailLifetime;
            const alpha = (1 - fadeProgress) * 0.2; // 从0.2渐变到0
            
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.fillText(trail.char, trail.x, trail.y);
        }
        
        // 绘制新的字符
        for (let i = 0; i < drops.length; i++) {
            if (Math.random() > config.density) continue;
            
            const y = drops[i] * config.fontSize;
            
            // 只在字符还在屏幕内时绘制
            if (y < canvas.height + 100 && y > -100) {
                // 计算渐变透明度：顶部和底部更透明
                let alpha = 1;
                if (y < 100) {
                    alpha = y / 100; // 顶部渐入
                } else if (y > canvas.height - 200) {
                    alpha = (canvas.height - y) / 200; // 底部渐出
                }
                alpha = Math.max(0, Math.min(1, alpha)) * 0.3; // 限制最大透明度为0.3
                
                ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                const text = config.chars[Math.floor(Math.random() * config.chars.length)];
                ctx.fillText(text, i * config.fontSize, y);
                
                // 将字符添加到拖尾列表
                trails.push({
                    char: text,
                    x: i * config.fontSize,
                    y: y,
                    timestamp: currentTime
                });
            }
            
            // 当字符到达底部时，有更高概率重置
            if (y > canvas.height) {
                if (Math.random() > 0.5) { // 50%概率重置
                    drops[i] = Math.random() * -20; // 重置到屏幕上方
                }
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, config.speed);
}

// 初始化代码雨
function initCodeRain() {
    // 只使用全局代码雨
    createCodeRain('global-rain', {
        fadeColor: 'rgba(26, 26, 26, 0.08)',  // 调整淡出速度
        fontSize: 14,
        speed: 10,  // 速度加快1倍（从20改为10）
        density: 0.25,  // 稍微提高密度，因为现在有渐变效果
        trailLifetime: 1000  // 拖尾生存时间减少到1秒
    });
}

// 打字机效果
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 数字计数动画
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// 技能条动画
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// 滚动动画
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// 复制邮箱
function copyEmail() {
    const email = 'gong.xinhai@163.com';
    navigator.clipboard.writeText(email).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ 已复制';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// 显示微信二维码
function showWechat() {
    const modal = document.getElementById('wechat-modal');
    modal.style.display = 'block';
}

function showWechatQR() {
    showWechat();
}

// 文章筛选
function initArticleFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.article-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            articles.forEach(article => {
                if (category === 'all' || article.getAttribute('data-category') === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 导航栏滚动效果
function initNavbar() {
    const navbar = document.querySelector('.top-navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航项关闭移动端菜单
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 删除滚动高亮逻辑，因为不再需要
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏
    initNavbar();
    // 初始化各种动画和交互
    initCodeRain();
    animateSkillBars();
    initScrollAnimations();
    initArticleFilter();
    initSmoothScroll();
    
    // 打字机效果
    const nameElement = document.querySelector('.typing-effect');
    if (nameElement) {
        typeWriter(nameElement, 'gongxh', 150);
    }
    
    // 数字动画
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    achievementNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(num, target);
                    observer.unobserve(num);
                }
            });
        });
        observer.observe(num);
    });
    
    // 模态框关闭
    const modal = document.getElementById('wechat-modal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

// 响应式处理
window.addEventListener('resize', function() {
    // 更新全局代码雨画布尺寸
    const canvas = document.getElementById('global-rain');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});