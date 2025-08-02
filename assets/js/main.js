// 网站主要交互功能
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const navSublinks = document.querySelectorAll('.nav-sublink');
    const contentSections = document.querySelectorAll('.content-section');
    
    // 初始状态
    let sidebarCollapsed = false;
    
    // 切换侧边栏状态
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
        
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            sidebarToggle.querySelector('.toggle-icon').textContent = '☰';
            sidebarToggle.querySelector('.toggle-text').textContent = '展开';
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            sidebarToggle.querySelector('.toggle-icon').textContent = '✕';
            sidebarToggle.querySelector('.toggle-text').textContent = '收起';
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
        
        // 设置活动状态
        const activeLink = document.querySelector(`[data-target="${activeId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // 如果是子菜单，同时激活父菜单
            if (activeLink.classList.contains('nav-sublink')) {
                const parentId = activeLink.getAttribute('data-parent');
                const parentLink = document.querySelector(`[data-target="${parentId}"]`);
                if (parentLink) {
                    parentLink.classList.add('active');
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
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // 主导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const navItem = this.closest('.nav-item');
            
            // 如果有子菜单，切换展开状态
            if (navItem.classList.contains('has-children')) {
                toggleSubmenu(navItem);
            }
            
            // 显示对应内容
            showContent(target);
        });
    });
    
    // 子导航链接点击
    navSublinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // 显示对应内容
            showContent(target);
        });
    });
    
    // 响应式处理
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && !sidebarCollapsed) {
            // 移动端默认收起侧边栏
            toggleSidebar();
        }
    }
    
    // 初始化
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调用
    
    // 默认显示首页内容
    showContent('home');
});

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加滚动监听，显示返回顶部按钮
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}); 