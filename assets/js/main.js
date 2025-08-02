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
    
    // 初始状态
    let sidebarCollapsed = false;
    
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
        }
        
        // 更新导航状态
        updateNavState(targetId);
    }
    
    // 更新导航栏状态
    function updateNavState(activeId) {
        // 清除所有active状态
        navLinks.forEach(link => link.classList.remove('active'));
        navSublinks.forEach(link => link.classList.remove('active'));
        
        // 优先查找子菜单链接
        const activeSublink = document.querySelector(`.nav-sublink[data-target="${activeId}"]`);
        if (activeSublink) {
            // 如果是子菜单链接，只激活子菜单，不激活父菜单
            activeSublink.classList.add('active');
        } else {
            // 如果不是子菜单链接，查找父菜单链接
            const activeMainLink = document.querySelector(`.nav-link[data-target="${activeId}"]`);
            if (activeMainLink) {
                activeMainLink.classList.add('active');
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
            
            // 显示对应内容（只有没有子菜单的一级标题才会执行到这里）
            if (target) {
                showContent(target);
            }
        });
    });
    
    // 子导航链接点击
    navSublinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // 显示对应内容
            if (target) {
                showContent(target);
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
            
            // 移动端默认收起侧边栏
            if (!sidebarCollapsed) {
                sidebar.classList.remove('mobile-open');
            } else {
                sidebar.classList.add('mobile-open');
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
    
    // 默认显示首页内容
    showContent('home');
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