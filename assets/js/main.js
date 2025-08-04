// URL路由系统
class URLRouter {
    constructor() {
        this.routes = new Map([
            ['', 'home'],
            ['home', 'home'],
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
        const path = hash || window.location.pathname.substring(1) || '';
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
            return true;
        } else {
            console.warn('未找到路由:', path);
            this.navigate('home', updateHistory);
            return false;
        }
    }
    
    handleDynamicRoutes(path) {
        // 处理动态子菜单路由：如 projects-1, tools-2, articles-3 等
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(\d+)$/;
        const match = path.match(dynamicRoutePattern);
        
        if (match) {
            const [, category, index] = match;
            return category; // 返回主类别作为内容区域
        }
        
        return null;
    }
    
    handleDynamicNavigation(path, targetId) {
        // 处理动态子菜单的选中状态
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(\d+)$/;
        const match = path.match(dynamicRoutePattern);
        
        if (match) {
            const [, category, index] = match;
            
            // 选中对应的动态子菜单项
            setTimeout(() => {
                const dynamicSublink = document.querySelector(`.nav-sublink[data-target="${path}"]`);
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
            
            // 激活对应的子页签按钮
            const targetBtn = mainContentSection.querySelector(`.sub-tab-btn[data-target="${category}-${index}"]`);
            if (targetBtn) {
                // 移除所有子页签的激活状态
                const allSubTabBtns = mainContentSection.querySelectorAll('.sub-tab-btn');
                allSubTabBtns.forEach(btn => btn.classList.remove('active'));
                
                // 激活目标按钮
                targetBtn.classList.add('active');
                
                // 切换到对应的子内容
                this.switchSubTabContent(mainContentSection, `${category}-${index}`);
            }
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
            
            // 确保内容区域可见
            targetContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }
    }
    
    handleSubTabSelection(category, index) {
        // 处理主内容区的子页签选中状态
        const mainContentSection = document.getElementById(`${category}-content`);
        if (mainContentSection) {
            const subTabBtn = mainContentSection.querySelector(`.sub-tab-btn[data-target="${category}-${index}"]`);
            if (subTabBtn && window.switchSubTab) {
                window.switchSubTab(subTabBtn, `${category}-${index}`);
            }
        }
    }
    
    handleSpecialRoutes(path) {
        // 处理特殊路由，如 posts/article-name 或 projects/project-name
        const segments = path.split('/');
        
        if (segments[0] === 'posts' && segments[1]) {
            // 文章路由：posts/article-name
            return this.contentLoader.loadPost(segments[1]);
        }
        
        if (segments[0] === 'projects' && segments[1]) {
            // 项目路由：projects/project-name
            return this.contentLoader.loadProject(segments[1]);
        }
        
        return null;
    }
    
    handlePopState(event) {
        const hash = window.location.hash.substring(1);
        const path = hash || '';
        this.navigate(path, false);
    }
    
    showContent(targetId) {
        window.showContentFunction?.(targetId);
    }
}

// 内容加载器 - 简化版
class ContentLoader {
    loadPost(slug) {
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
            const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(\d+)$/;
            if (!dynamicRoutePattern.test(targetId)) {
                // 恢复page-header和dynamic-content的显示
                const pageHeader = targetSection.querySelector('.page-header');
                const dynamicContent = targetSection.querySelector('.dynamic-content');
                const articleDisplay = targetSection.querySelector('.article-display');
                
                if (pageHeader) pageHeader.style.display = '';
                if (dynamicContent) dynamicContent.style.display = '';
                if (articleDisplay) articleDisplay.style.display = 'none';
            }
        }
        
        // 更新导航状态
        updateNavState(targetId);
    }
    
    // 将showContent函数暴露给路由系统
    window.showContentFunction = showContent;
    
    // 子页签功能
    function initSubTabs() {
        // 为所有子页签按钮添加点击事件
        const subTabBtns = document.querySelectorAll('.sub-tab-btn');
        subTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                switchSubTab(this, targetId);
            });
        });
    }
    
    function switchSubTab(clickedBtn, targetId) {
        // 找到当前激活的页签容器
        const parentSection = clickedBtn.closest('.content-section');
        if (!parentSection) return;
        
        // 移除同组内所有按钮的激活状态
        const siblingBtns = parentSection.querySelectorAll('.sub-tab-btn');
        siblingBtns.forEach(btn => btn.classList.remove('active'));
        
        // 激活点击的按钮
        clickedBtn.classList.add('active');
        
        // 使用路由系统的switchSubTabContent方法
        if (window.router && window.router.switchSubTabContent) {
            window.router.switchSubTabContent(parentSection, targetId);
        } else {
            // 备用方法：直接切换内容
            const subContents = parentSection.querySelectorAll('.sub-content');
            subContents.forEach(content => content.classList.remove('active'));
            
            const targetContent = parentSection.querySelector(`#${targetId}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                targetContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }
        
        // 更新URL以反映当前选择的子页签
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(\d+)$/;
        if (dynamicRoutePattern.test(targetId)) {
            const newUrl = `#${targetId}`;
            if (window.location.hash !== newUrl) {
                history.pushState({route: targetId}, '', newUrl);
            }
        }
    }
    
    // 初始化时激活第一个子页签
    function activateFirstSubTabs() {
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            const firstBtn = section.querySelector('.sub-tab-btn');
            if (firstBtn && !firstBtn.classList.contains('active')) {
                firstBtn.classList.add('active');
            }
        });
    }
    
    // 初始化子页签功能
    initSubTabs();
    activateFirstSubTabs();
    
    // 将switchSubTab函数暴露给路由系统
    window.switchSubTab = switchSubTab;
    
    // 更新导航栏状态
    function updateNavState(activeId) {
        // 检查是否是动态子菜单ID（如 projects-1, tools-1）
        const dynamicRoutePattern = /^(projects|tools|articles|opensource)-(\d+)$/;
        const isDynamicRoute = dynamicRoutePattern.test(activeId);
        
        // 清除所有active状态
        navLinks.forEach(link => link.classList.remove('active'));
        navSublinks.forEach(link => link.classList.remove('active'));
        
        if (isDynamicRoute) {
            // 对于动态子菜单，只激活子菜单项，不激活父菜单
            const activeSublink = document.querySelector(`.nav-sublink[data-target="${activeId}"]`);
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
            const activeSublink = document.querySelector(`.nav-sublink[data-target="${activeId}"]`);
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
                const activeMainLink = document.querySelector(`.nav-link[data-target="${activeId}"]`);
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

// 平滑滚动到顶部功能
function scrollToTop() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
}); 