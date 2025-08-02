---
layout: main
title: 游戏开发技术分享平台
---

<!-- 左侧导航菜单 -->
<nav class="sidebar-nav">
  <div class="nav-toggle">
    <span class="nav-toggle-icon">☰</span>
  </div>
  <div class="nav-content">
    <ul class="nav-tree">
      <li class="nav-item">
        <a href="#home" class="nav-link active">🏠 主页</a>
      </li>
      <li class="nav-item has-children">
        <span class="nav-toggle-btn">📂 项目介绍</span>
        <ul class="nav-children" style="display: block;">
          <li><a href="#cocos-framework" class="nav-link">Cocos Creator开发框架</a></li>
          <li><a href="#h5-games" class="nav-link">H5小游戏合集</a></li>
          <li><a href="#performance-tools" class="nav-link">性能优化工具集</a></li>
        </ul>
      </li>
      <li class="nav-item has-children">
        <span class="nav-toggle-btn">📂 技术文章</span>
        <ul class="nav-children" style="display: block;">
          <li><a href="#game-engine" class="nav-link">游戏引擎架构</a></li>
          <li><a href="#performance-optimization" class="nav-link">性能优化技巧</a></li>
          <li><a href="#development-tools" class="nav-link">开发工具分享</a></li>
          <li><a href="#best-practices" class="nav-link">最佳实践案例</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="/about/" class="nav-link">👤 关于我</a>
      </li>
    </ul>
  </div>
</nav>

<div class="main-content">

<!-- 主页内容 -->
<div class="content-section active" id="home-content">
  <div class="hero-section">
    <h1 class="hero-title">{{ site.author.name }}</h1>
    <p class="hero-subtitle">{{ site.description }}</p>
    <p class="hero-bio">{{ site.author.bio }}</p>
  </div>
  
  <section class="quick-overview">
    <h2 class="section-title">🌟 快速概览</h2>
    <div class="overview-grid">
      <div class="overview-card">
        <h3>🎮 精选项目</h3>
        <p>{{ site.featured_projects.size }}个优质项目，涵盖Cocos Creator开发框架、H5游戏和性能优化工具</p>
      </div>
      <div class="overview-card">
        <h3>📝 技术文章</h3>
        <p>深度分享游戏开发经验，包括引擎架构、性能优化、开发工具等核心技术</p>
      </div>
      <div class="overview-card">
        <h3>🏆 专业经验</h3>
        <p>10+年游戏开发经验，专注Cocos Creator技术栈和最佳实践</p>
      </div>
    </div>
  </section>
</div>

<!-- 项目介绍内容 -->
<div class="content-section" id="projects-content">
  <h1 class="page-title">🎮 项目介绍</h1>
  <section class="projects-section" id="projects">
  <h2 class="section-title">🎮 精选项目</h2>
  <div class="projects-grid">
    <div class="project-card" id="cocos-framework">
      <h3 class="project-name">{{ site.featured_projects[0].name }}</h3>
      <p class="project-description">{{ site.featured_projects[0].description }}</p>
      <span class="project-tech">{{ site.featured_projects[0].tech }}</span>
    </div>
    <div class="project-card" id="h5-games">
      <h3 class="project-name">{{ site.featured_projects[1].name }}</h3>
      <p class="project-description">{{ site.featured_projects[1].description }}</p>
      <span class="project-tech">{{ site.featured_projects[1].tech }}</span>
    </div>
    <div class="project-card" id="performance-tools">
      <h3 class="project-name">{{ site.featured_projects[2].name }}</h3>
      <p class="project-description">{{ site.featured_projects[2].description }}</p>
      <span class="project-tech">{{ site.featured_projects[2].tech }}</span>
    </div>
  </div>
</section>
</div>

<!-- 技术文章内容 -->
<div class="content-section" id="articles-content">
  <h1 class="page-title">📝 技术文章</h1>
  <section class="articles-section" id="articles">
  <h2 class="section-title">📝 技术文章</h2>
  <ul class="article-list">
    {% for post in site.posts limit:5 %}
    <li class="article-item">
      <a href="{{ post.url | relative_url }}" class="article-title">{{ post.title | escape }}</a>
      <p class="article-excerpt">{{ post.excerpt | strip_html | truncate: 150 }}</p>
      <span class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
    </li>
    {% endfor %}
    {% if site.posts.size == 0 %}
    <li class="article-item" id="game-engine">
      <a href="#" class="article-title">游戏引擎架构设计与实现</a>
      <p class="article-excerpt">深入探讨现代游戏引擎的核心架构，包括渲染管线、资源管理、物理系统等关键组件的设计原理...</p>
      <span class="article-date">2024年12月15日</span>
    </li>
    <li class="article-item" id="performance-optimization">
      <a href="#" class="article-title">Cocos Creator性能优化技巧</a>
      <p class="article-excerpt">分享在Cocos Creator开发过程中常用的性能优化方法，包括内存管理、渲染优化、脚本优化等实用技巧...</p>
      <span class="article-date">2024年12月16日</span>
    </li>
    <li class="article-item" id="development-tools">
      <a href="#" class="article-title">开发工具与插件制作</a>
      <p class="article-excerpt">从工具使用到自制插件，详细介绍如何提升Cocos Creator开发效率的工具链和最佳实践...</p>
      <span class="article-date">2024年12月05日</span>
    </li>
    <li class="article-item" id="best-practices">
      <a href="#" class="article-title">游戏开发最佳实践</a>
      <p class="article-excerpt">总结多年游戏开发经验，涵盖代码规范、架构设计、项目管理在游戏开发中的应用...</p>
      <span class="article-date">2024年11月28日</span>
    </li>
    {% endif %}
  </ul>
</section>
</div>

<!-- 关于我内容 -->
<div class="content-section" id="about-content">
  <h1 class="page-title">👤 关于我</h1>
  <div class="about-hero">
    <h2 class="hero-title">Cocos Creator开发者</h2>
    <p class="hero-subtitle">十年磨一剑，专注Cocos Creator技术分享</p>
  </div>

  <section class="about-section">
    <h2>👨‍💻 个人简介</h2>
    <p>我是一名拥有10+年游戏开发经验的技术分享者，专注于Cocos Creator游戏开发领域。从传统PC游戏到移动端H5小游戏，见证并参与了游戏行业的技术变迁。现在致力于通过技术分享，帮助更多开发者在Cocos Creator的道路上少走弯路，快速成长。</p>
  </section>

  <section class="about-section">
    <h2>🛠 技术专长</h2>
    <div class="skills-grid">
      <div class="skill-category">
        <h3>Cocos Creator生态</h3>
        <ul>
          <li><strong>Cocos Creator 2.x/3.x</strong> - 全栈开发经验</li>
          <li><strong>TypeScript/JavaScript</strong> - 游戏逻辑开发</li>
          <li><strong>渲染优化</strong> - 性能调优与内存管理</li>
          <li><strong>插件开发</strong> - 编辑器扩展与工具制作</li>
        </ul>
      </div>
      <div class="skill-category">
        <h3>平台发布</h3>
        <ul>
          <li><strong>微信小游戏</strong> - 小程序生态深度开发</li>
          <li><strong>H5游戏</strong> - 跨平台Web游戏</li>
          <li><strong>移动原生</strong> - iOS/Android应用发布</li>
          <li><strong>桌面应用</strong> - Windows/Mac客户端</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="contact-section" id="contact">
    <h2 class="section-title">📫 联系交流</h2>
    <p>欢迎与我交流Cocos Creator开发相关的任何问题</p>
    <div class="contact-links">
      <a href="https://github.com/{{ site.github_username }}" class="contact-link">GitHub</a>
      <a href="https://gitee.com/{{ site.gitee_username }}" class="contact-link">Gitee</a>
      <a href="mailto:{{ site.email }}" class="contact-link">邮箱</a>
      <span class="contact-link">微信: {{ site.wechat_id }}</span>
    </div>
  </section>
</div>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const sidebarNav = document.querySelector('.sidebar-nav');
  const mainContent = document.querySelector('.main-content');
  const navToggle = document.querySelector('.nav-toggle');
  const navToggleIcon = document.querySelector('.nav-toggle-icon');
  const toggleBtns = document.querySelectorAll('.nav-toggle-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');
  
  let isCollapsed = false;
  let isMobile = window.innerWidth <= 768;
  
  // 导航栏整体收起/展开功能
  navToggle.addEventListener('click', function() {
    if (isMobile) {
      // 移动端：显示/隐藏导航栏
      sidebarNav.classList.toggle('mobile-open');
      navToggleIcon.textContent = sidebarNav.classList.contains('mobile-open') ? '✕' : '☰';
    } else {
      // 桌面端：收起/展开导航栏
      isCollapsed = !isCollapsed;
      sidebarNav.classList.toggle('collapsed', isCollapsed);
      mainContent.classList.toggle('expanded', isCollapsed);
             navToggleIcon.textContent = '☰';
    }
  });
  
  // 子菜单开关
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = btn.closest('.nav-item');
      const children = parent.querySelector('.nav-children');
      const isOpen = children.style.display === 'block';
      
      children.style.display = isOpen ? 'none' : 'block';
      btn.innerHTML = btn.innerHTML.replace(isOpen ? '📂' : '📁', isOpen ? '📁' : '📂');
    });
  });
  
  // 内容切换功能
  function showContent(targetId) {
    // 隐藏所有内容区域
    contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // 显示目标内容区域
    const targetContent = document.getElementById(targetId + '-content');
    if (targetContent) {
      targetContent.classList.add('active');
    }
    
    // showContent函数不再处理选中状态，由各个事件处理器负责
    
    // 移动端：自动关闭导航栏
    if (isMobile) {
      sidebarNav.classList.remove('mobile-open');
      navToggleIcon.textContent = '☰';
    }
  }
  
  // 导航链接点击事件
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      // 先清除所有链接的选中状态
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.nav-toggle-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.nav-children .nav-link').forEach(l => l.classList.remove('active'));
      
      if (href.startsWith('#')) {
        const targetId = href.substring(1);
        showContent(targetId);
        // 设置当前链接为选中状态
        this.classList.add('active');
      } else if (href === '/about/') {
        showContent('about');
        // 设置关于我链接为选中状态
        this.classList.add('active');
      }
     });
   });
  
  // 子菜单链接点击事件
  document.querySelectorAll('.nav-children .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const targetId = href.substring(1);
      
      // 先清除所有链接的选中状态
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.nav-toggle-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.nav-children .nav-link').forEach(l => l.classList.remove('active'));
      
             // 如果是项目子项，显示项目页面并滚动到对应项目
       if (['cocos-framework', 'h5-games', 'performance-tools'].includes(targetId)) {
         showContent('projects');
         // 设置当前二级菜单项为选中状态
         this.classList.add('active');
         setTimeout(() => {
           const targetElement = document.getElementById(targetId);
           if (targetElement) {
             targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       }
       // 如果是技术文章子项，显示文章页面并滚动到对应文章
       else if (['game-engine', 'performance-optimization', 'development-tools', 'best-practices'].includes(targetId)) {
         showContent('articles');
         // 设置当前二级菜单项为选中状态
         this.classList.add('active');
         setTimeout(() => {
           const targetElement = document.getElementById(targetId);
           if (targetElement) {
             targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }, 100);
       }
    });
  });
  
  // 响应式处理
  window.addEventListener('resize', function() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== isMobile) {
      // 清理状态
      sidebarNav.classList.remove('mobile-open', 'collapsed');
      mainContent.classList.remove('expanded');
      isCollapsed = false;
      navToggleIcon.textContent = '☰';
    }
  });
  
  // 初始化：设置默认图标和选中状态
  navToggleIcon.textContent = '☰';
  
  // 初始化时设置主页为选中状态
  const homeLink = document.querySelector('[href="#home"]');
  if (homeLink) {
    homeLink.classList.add('active');
  }
});
</script>
