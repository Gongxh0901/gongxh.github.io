// 安全的CSS选择器函数 - 处理包含特殊字符的属性值
function safeCSSSelector(selector, attributeValue) {
    // 转义CSS选择器中的特殊字符
    const escaped = attributeValue.replace(/["\\]/g, '\\$&');
    return selector.replace('${value}', escaped);
}

// 安全查询带有data-target属性的元素
function findByDataTarget(targetValue, className = null) {
    // 使用属性选择器，避免直接字符串插值的问题
    const elements = document.querySelectorAll('[data-target]');
    for (const element of elements) {
        if (element.getAttribute('data-target') === targetValue) {
            // 如果指定了className，检查元素是否包含该类
            if (className === null || element.classList.contains(className)) {
                return element;
            }
        }
    }
    return null;
}

// URL路由系统
class URLRouter {
    constructor() {
        this.routes = new Map([
            ['', 'about'],  // 默认显示关于页面
            ['about', 'about'],
            ['projects', 'projects'],
            ['project-showcase', 'project-showcase'],
            ['project-details', 'project-details'],
            ['tools', 'tools'],
            ['dev-tools', 'dev-tools'],
            ['plugins', 'plugins'],
            ['articles', 'articles'],
            ['tech-articles', 'tech-articles'],
            ['experience', 'experience'],
            ['opensource', 'opensource'],
            ['my-opensource', 'my-opensource'],
            ['contributions', 'contributions']
        ]);
        
        this.contentLoader = new ContentLoader();
        this.currentRoute = '';
        
        // 监听浏览器前进/后退
        window.addEventListener('popstate', (e) => {
            this.handlePopState(e);
        });
        
        // 页面加载时处理初始路由
        this.handleInitialRoute();
    }
    
    handleInitialRoute() {
        const hash = window.location.hash.substring(1); // 移除 # 号
        // 解码URL编码的中文字符，添加错误处理
        let decodedHash = '';
        if (hash) {
            try {
                decodedHash = decodeURIComponent(hash);
            } catch (e) {
                // 如果解码失败，使用原始hash
                console.warn('URL解码失败，使用原始hash:', hash);
                decodedHash = hash;
            }
        }
        // 如果没有指定路径，默认导航到"关于我"页面
        const path = decodedHash || window.location.pathname.substring(1) || 'about';
        this.navigate(path, false); // 不更新历史记录
    }
    
    navigate(path, updateHistory = true) {
        path = path.replace(/^\/+|\/+$/g, '');
        
        let targetId = this.routes.get(path) || this.handleDynamicRoutes(path) || this.handleSpecialRoutes(path);
        
        if (targetId) {
            this.currentRoute = path;
            
            if (updateHistory) {
                const newUrl = path ? `#${path}` : '#';
                if (window.location.hash !== newUrl) {
                    history.pushState({route: path}, '', newUrl);
                }
            }
            
            this.showContent(targetId);
            this.handleDynamicNavigation(path, targetId);
            
            // 对于动态路由，需要用完整路径更新导航状态
            const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(.+)$/;
            if (dynamicRoutePattern.test(path)) {
                setTimeout(() => {
                    if (window.updateNavStateFunction) {
                        window.updateNavStateFunction(path);
                    }
                }, 150); // 确保在showContent完成后执行
            }
            return true;
        } else {
            console.warn('未找到路由:', path);
            this.navigate('home', updateHistory);
            return false;
        }
    }
    
    handleDynamicRoutes(path) {
        // 处理动态子菜单路由：如 projects-1, tools-2, articles-3 等
        // 支持中文字符，使用更宽松的匹配模式
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(.+)$/;
        const match = path.match(dynamicRoutePattern);
        
        if (match) {
            const [, category, index] = match;
            return category; // 返回主类别作为内容区域
        }
        
        return null;
    }
    
    handleDynamicNavigation(path, targetId) {
        // 处理动态子菜单的选中状态
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(.+)$/;
        const match = path.match(dynamicRoutePattern);
        
        if (match) {
            const [, category, index] = match;
            
            // 选中对应的动态子菜单项
            setTimeout(() => {
                const dynamicSublink = findByDataTarget(path, 'nav-sublink');
                if (dynamicSublink) {
                    // 只移除子菜单的选中状态，保持父菜单状态
                    const parentNavItem = dynamicSublink.closest('.nav-item');
                    if (parentNavItem) {
                        // 移除同级子菜单的选中状态
                        const siblingSublinks = parentNavItem.querySelectorAll('.nav-sublink');
                        siblingSublinks.forEach(link => {
                            link.classList.remove('active');
                        });
                        
                        // 确保父菜单展开但不改变其选中状态
                        const submenu = parentNavItem.querySelector('.nav-submenu');
                        const arrow = parentNavItem.querySelector('.nav-arrow');
                        if (submenu && !submenu.classList.contains('expanded')) {
                            submenu.classList.add('expanded');
                            if (arrow) {
                                arrow.textContent = '▼';
                            }
                        }
                    }
                    
                    // 选中当前子菜单项
                    dynamicSublink.classList.add('active');
                    
                    // 直接显示文章内容，而不是子页签选择界面
                    this.showArticleContent(category, index);
                }
            }, 50); // 减少延迟时间
        }
    }
    
    showArticleContent(category, index) {
        // 直接切换到对应的子页签，显示完整文章内容
        const mainContentSection = document.getElementById(`${category}-content`);
        if (mainContentSection) {
            // 显示page-header和dynamic-content（恢复正常的子页签界面）
            const pageHeader = mainContentSection.querySelector('.page-header');
            const dynamicContent = mainContentSection.querySelector('.dynamic-content');
            
            if (pageHeader) pageHeader.style.display = '';
            if (dynamicContent) dynamicContent.style.display = '';
            
            // 隐藏文章显示区域（如果存在）
            const articleDisplay = mainContentSection.querySelector('.article-display');
            if (articleDisplay) {
                articleDisplay.style.display = 'none';
            }
            
            // 直接切换到对应的子内容，不依赖按钮
            this.switchSubTabContent(mainContentSection, `${category}-${index}`);
        }
    }
    
    switchSubTabContent(parentSection, targetId) {
        // 隐藏所有子内容
        const subContents = parentSection.querySelectorAll('.sub-content');
        subContents.forEach(content => content.classList.remove('active'));
        
        // 显示目标子内容
        const targetContent = parentSection.querySelector(`#${targetId}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // 切换后立即滚动到内容区顶部
        const immediateSuccess = scrollToTop();
        
        // 如果立即滚动失败，使用多层延迟重试机制
        if (!immediateSuccess) {
            setTimeout(() => {
                const firstRetry = scrollToTop();
                if (!firstRetry) {
                    setTimeout(() => {
                        const secondRetry = scrollToTop();
                        if (!secondRetry) {
                            setTimeout(() => {
                                scrollToTop();
                            }, 300);
                        }
                    }, 150);
                }
            }, 50);
        }
    }
    
    handleSpecialRoutes(path) {
        // 处理特殊路由，如 posts/article-name 或 projects/project-name
        const segments = path.split('/');
        
        if (segments[0] === 'posts' && segments[1]) {
            // 文章路由：posts/article-name
            const dynamicRoute = this.contentLoader.loadPost(segments[1]);
            
            // 如果是动态路由ID（格式：category-slug），直接重定向
            if (dynamicRoute.includes('-') && dynamicRoute !== 'tech-articles') {
                // 直接重定向到正确的动态路由，替换当前历史记录
                window.location.hash = `#${dynamicRoute}`;
                return null; // 返回null，让页面重新加载处理
            }
            
            return dynamicRoute;
        }
        
        if (segments[0] === 'projects' && segments[1]) {
            // 项目路由：projects/project-name
            return this.contentLoader.loadProject(segments[1]);
        }
        
        return null;
    }
    
    handlePopState(event) {
        const hash = window.location.hash.substring(1);
        // 解码URL编码的中文字符，添加错误处理
        let decodedHash = '';
        if (hash) {
            try {
                decodedHash = decodeURIComponent(hash);
            } catch (e) {
                // 如果解码失败，使用原始hash
                console.warn('URL解码失败，使用原始hash:', hash);
                decodedHash = hash;
            }
        }
        const path = decodedHash || '';
        this.navigate(path, false);
    }
    
    showContent(targetId) {
        if (window.showContentFunction) {
            window.showContentFunction(targetId);
        } else {
            setTimeout(() => {
                if (window.showContentFunction) {
                    window.showContentFunction(targetId);
                }
            }, 100);
        }
    }
}

// 内容加载器 - 简化版
class ContentLoader {
    constructor() {
        // 根据文章slug和分类映射到正确的导航ID
        this.postMapping = new Map([
            // 游戏开发工具文章
            ['creator-build-tools', 'tools'],
            ['实体配置插件', 'tools'],
            ['窗口属性关联', 'tools'],
            
            // 游戏项目文章
            ['kunpo-library-project', 'projects'],
            
            // 博客文章
            ['cocos-creator-performance-tips', 'articles'],
            
            // 开源项目文章
            ['开源项目集合', 'opensource']
        ]);
    }
    
    loadPost(slug) {
        // 根据文章slug查找对应的分类
        const category = this.postMapping.get(slug);
        if (category) {
            // 返回完整的动态路由ID
            return `${category}-${slug}`;
        }
        
        // 如果找不到映射，返回技术文章页面
        return 'tech-articles';
    }
    
    loadProject(id) {
        return 'project-showcase';
    }
}

// 网站主要交互功能
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const rightContentArea = document.querySelector('.right-content-area');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const navSublinks = document.querySelectorAll('.nav-sublink');
    const contentSections = document.querySelectorAll('.content-section');
    
    // 初始化路由系统
    const router = new URLRouter();
    
    // 暴露router到全局作用域
    window.router = router;
    
    // 初始状态 - 移动端默认收起，PC端默认展开
    let sidebarCollapsed = window.innerWidth <= 768;
    
    // 切换侧边栏状态
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端逻辑：使用overlay模式
            if (sidebarCollapsed) {
                sidebar.classList.remove('mobile-open');
            } else {
                sidebar.classList.add('mobile-open');
            }
        } else {
            // PC端逻辑：使用推拉模式
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                if (rightContentArea) {
                    rightContentArea.classList.add('expanded');
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (rightContentArea) {
                    rightContentArea.classList.remove('expanded');
                }
            }
        }
    }
    
    // 显示内容区域
    function showContent(targetId) {
        // 隐藏所有内容区域
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示目标内容区域
        const targetSection = document.getElementById(targetId + '-content');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // 检查是否是动态路由，如果不是，恢复正常显示
            const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(.+)$/;
            if (!dynamicRoutePattern.test(targetId)) {
                // 恢复page-header和dynamic-content的显示
                const pageHeader = targetSection.querySelector('.page-header');
                const dynamicContent = targetSection.querySelector('.dynamic-content');
                const articleDisplay = targetSection.querySelector('.article-display');
                
                if (pageHeader) pageHeader.style.display = '';
                if (dynamicContent) dynamicContent.style.display = '';
                if (articleDisplay) articleDisplay.style.display = 'none';
            }
            
            // 切换内容后滚动到顶部
            setTimeout(() => {
                const scrollSuccess = scrollToTop();
                
                // 如果第一次滚动失败，再次尝试
                if (!scrollSuccess) {
                    setTimeout(() => {
                        scrollToTop();
                    }, 100);
                }
            }, 50);
        }
        
        // 更新导航状态
        updateNavState(targetId);
    }
    
    // 将showContent函数暴露给路由系统
    window.showContentFunction = showContent;
    
    // 将updateNavState函数暴露给路由系统
    window.updateNavStateFunction = updateNavState;
    
    // 注意：子页签切换通过侧边栏导航和路由系统实现，不需要页面内按钮
    // switchSubTab函数已删除 - 功能由路由系统的switchSubTabContent实现
    // activateFirstSubTabs函数已删除 - 默认激活状态由HTML模板处理
    // 子页签相关初始化已删除 - 功能由路由系统处理
    
    // 更新导航栏状态
    function updateNavState(activeId) {
        // 检查是否是动态子菜单ID（如 projects-1, tools-1）
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(.+)$/;
        const isDynamicRoute = dynamicRoutePattern.test(activeId);
        
        // 清除所有active状态
        navLinks.forEach(link => link.classList.remove('active'));
        navSublinks.forEach(link => link.classList.remove('active'));
        
        if (isDynamicRoute) {
            // 对于动态子菜单，只激活子菜单项，不激活父菜单
            const activeSublink = findByDataTarget(activeId, 'nav-sublink');
            if (activeSublink) {
                activeSublink.classList.add('active');
                
                // 确保父菜单展开，但不激活
                const parentNavItem = activeSublink.closest('.nav-item');
                if (parentNavItem) {
                    const parentSubmenu = parentNavItem.querySelector('.nav-submenu');
                    const parentArrow = parentNavItem.querySelector('.nav-arrow');
                    if (parentSubmenu && !parentSubmenu.classList.contains('expanded')) {
                        parentSubmenu.classList.add('expanded');
                        if (parentArrow) {
                            parentArrow.textContent = '▼';
                        }
                    }
                }
            }
        } else {
            // 对于普通导航项，使用原有逻辑
            // 优先查找子菜单链接
            const activeSublink = findByDataTarget(activeId, 'nav-sublink');
            if (activeSublink) {
                // 如果是子菜单链接，激活子菜单和对应的父菜单
                activeSublink.classList.add('active');
                
                // 展开父菜单
                const parentNavItem = activeSublink.closest('.nav-item');
                if (parentNavItem) {
                    const parentSubmenu = parentNavItem.querySelector('.nav-submenu');
                    const parentArrow = parentNavItem.querySelector('.nav-arrow');
                    if (parentSubmenu && !parentSubmenu.classList.contains('expanded')) {
                        parentSubmenu.classList.add('expanded');
                        if (parentArrow) {
                            parentArrow.textContent = '▼';
                        }
                    }
                }
            } else {
                // 如果不是子菜单链接，查找父菜单链接
                const activeMainLink = findByDataTarget(activeId, 'nav-link');
                if (activeMainLink) {
                    const parentNavItem = activeMainLink.closest('.nav-item');
                    
                    // 只有没有子菜单的父菜单才能被选中
                    if (parentNavItem && !parentNavItem.classList.contains('has-children')) {
                        activeMainLink.classList.add('active');
                    } else if (parentNavItem && parentNavItem.classList.contains('has-children')) {
                        // 如果父菜单有子菜单，只确保展开状态，不激活
                        const submenu = parentNavItem.querySelector('.nav-submenu');
                        const arrow = parentNavItem.querySelector('.nav-arrow');
                        if (submenu && !submenu.classList.contains('expanded')) {
                            submenu.classList.add('expanded');
                            if (arrow) {
                                arrow.textContent = '▼';
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 切换子菜单展开状态
    function toggleSubmenu(navItem) {
        const submenu = navItem.querySelector('.nav-submenu');
        const arrow = navItem.querySelector('.nav-arrow');
        
        if (submenu) {
            submenu.classList.toggle('expanded');
            arrow.textContent = submenu.classList.contains('expanded') ? '▼' : '▶';
        }
    }
    
    // 事件监听器
    
    // 侧边栏切换按钮
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // 主导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const navItem = this.closest('.nav-item');
            
            // 如果有子菜单，只切换展开状态，不更新内容区域
            if (navItem && navItem.classList.contains('has-children')) {
                toggleSubmenu(navItem);
                return; // 有子菜单时直接返回，不执行后续内容显示
            }
            
            // 使用路由系统导航（只有没有子菜单的一级标题才会执行到这里）
            if (target) {
                router.navigate(target);
            }
        });
    });
    
    // 子导航链接点击
    navSublinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // 使用路由系统导航
            if (target) {
                router.navigate(target);
                // 确保滚动到顶部（额外保障）
                setTimeout(() => {
                    scrollToTop();
                }, 100);
            }
        });
    });
    
    // 响应式处理 - 移动端和PC端使用不同逻辑
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端使用overlay模式
            sidebar.classList.remove('collapsed'); // 移除PC端的类
            if (rightContentArea) {
                rightContentArea.classList.remove('expanded'); // 移除PC端的类
            }
            
            // 移动端根据状态显示/隐藏侧边栏
            if (sidebarCollapsed) {
                sidebar.classList.remove('mobile-open'); // 收起状态：隐藏
            } else {
                sidebar.classList.add('mobile-open'); // 展开状态：显示
            }
        } else {
            // PC端使用推拉模式
            sidebar.classList.remove('mobile-open'); // 移除移动端的类
            
            // PC端逻辑
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                if (rightContentArea) {
                    rightContentArea.classList.add('expanded');
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (rightContentArea) {
                    rightContentArea.classList.remove('expanded');
                }
            }
        }
    }
    
    // 移动端点击遮罩关闭侧边栏 - 使用统一逻辑
    function handleMobileOverlayClick(e) {
        const isMobile = window.innerWidth <= 768;
        // 在移动端，如果侧边栏展开且点击了遮罩区域，则收起侧边栏
        if (isMobile && !sidebarCollapsed && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            toggleSidebar();
        }
    }
    
    // 初始化
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleMobileOverlayClick);
    handleResize(); // 初始调用
    
    // 路由系统会自动处理初始页面显示，不需要手动调用showContent
});

// 智能滚动到顶部功能 - 自动检测滚动容器
function scrollToTop() {
    // 候选滚动容器列表，按优先级排序
    const scrollContainerCandidates = [
        // 首先尝试主内容区域
        document.getElementById('mainContent'),
        // 然后尝试当前活动的content-section
        document.querySelector('.content-section.active'),
        // 再尝试dynamic-content
        document.querySelector('.content-section.active .dynamic-content'),
        // 最后尝试sub-content-area
        document.querySelector('.content-section.active .sub-content-area'),
        // body作为最后的fallback
        document.body
    ];
    
    for (let i = 0; i < scrollContainerCandidates.length; i++) {
        const container = scrollContainerCandidates[i];
        
        if (!container) {
            continue;
        }
        
        // 检查是否是真正的滚动容器，放宽检测条件
        const canScroll = container.scrollHeight > container.clientHeight || container.scrollTop > 0;
        
        if (canScroll || i === 0) {  // 主内容区域强制尝试滚动
            try {
                // 记录滚动前的位置
                const beforeScroll = container.scrollTop;
                
                // 使用多种方法确保滚动成功
                container.scrollTop = 0;
                
                // 如果仍有滚动位置，使用 scrollTo
                if (container.scrollTop > 0) {
                    container.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                    
                    // 如果 smooth 行为无效，使用 instant
                    setTimeout(() => {
                        if (container.scrollTop > 0) {
                            container.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: 'instant'
                            });
                        }
                    }, 100);
                }
                
                const afterScroll = container.scrollTop;
                
                // 成功标准：滚动到了0位置，或者是主内容容器
                if (afterScroll === 0 || i === 0) {
                    return true;
                }
                
            } catch (error) {
                // 静默处理错误，继续尝试下一个容器
            }
        }
    }
    
    // 如果所有方法都失败，尝试window.scrollTo作为最后手段
    try {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        // 备用instant方法
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return true;
    } catch (error) {
        return false;
    }
}

// 添加滚动监听，显示返回顶部按钮
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const backToTop = document.querySelector('.back-to-top');
    
    if (mainContent && backToTop) {
        mainContent.addEventListener('scroll', function() {
            const scrollTop = mainContent.scrollTop;
            
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }
    
    // 视频自动暂停功能 - 当视频滚动出屏幕时暂停播放
    initVideoAutoPause();
});

// 初始化视频自动暂停功能
function initVideoAutoPause() {
    // 检查视频是否在屏幕内
    function isVideoVisible(video) {
        const rect = video.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        // 检查视频是否在窗口可视区域内
        return (
            rect.top < windowHeight &&
            rect.bottom > 0 &&
            rect.left < windowWidth &&
            rect.right > 0
        );
    }
    
    // 检查并暂停不可见的视频
    function checkAndPauseVideos() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(function(video) {
            const isVisible = isVideoVisible(video);
            const isPaused = video.paused;
            
            if (!isVisible && !isPaused) {
                video.pause();
                video.setAttribute('data-auto-paused', 'true');
            } else if (isVisible && video.hasAttribute('data-auto-paused')) {
                video.removeAttribute('data-auto-paused');
            }
        });
    }
    
    // 立即检查一次
    setTimeout(function() {
        checkAndPauseVideos();
    }, 1000);
    
    // 滚动监听
    let scrollContainer = document.getElementById('mainContent') || document.body;
    let scrollTimer = null;
    
    function handleScroll() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(function() {
            checkAndPauseVideos();
        }, 150);
    }
    
    // 添加滚动监听
    scrollContainer.addEventListener('scroll', handleScroll, {passive: true});
    window.addEventListener('scroll', handleScroll, {passive: true});
} 