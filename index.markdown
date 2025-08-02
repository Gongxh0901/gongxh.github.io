---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<div class="hero-section">
  <h1 class="hero-title">{{ site.author.name }}</h1>
  <p class="hero-subtitle">{{ site.description }}</p>
  <p class="hero-bio">{{ site.author.bio }}</p>
</div>

<section class="projects-section">
  <h2 class="section-title">🎮 精选项目</h2>
  <div class="projects-grid">
    {% for project in site.featured_projects %}
    <div class="project-card">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-description">{{ project.description }}</p>
      <span class="project-tech">{{ project.tech }}</span>
    </div>
    {% endfor %}
  </div>
</section>

<section class="articles-section">
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
    <li class="article-item">
      <a href="#" class="article-title">游戏引擎架构设计与实现</a>
      <p class="article-excerpt">深入探讨现代游戏引擎的核心架构，包括渲染管线、资源管理、物理系统等关键组件的设计原理...</p>
      <span class="article-date">2024年12月15日</span>
    </li>
    <li class="article-item">
      <a href="#" class="article-title">Vulkan图形编程入门指南</a>
      <p class="article-excerpt">从基础概念到实际应用，详细介绍Vulkan API的使用方法，以及如何利用现代图形API提升渲染性能...</p>
      <span class="article-date">2024年12月10日</span>
    </li>
    <li class="article-item">
      <a href="#" class="article-title">Unity性能优化技巧集锦</a>
      <p class="article-excerpt">分享在Unity开发过程中常用的性能优化方法，包括内存管理、渲染优化、脚本优化等实用技巧...</p>
      <span class="article-date">2024年12月05日</span>
    </li>
    <li class="article-item">
      <a href="#" class="article-title">C++游戏开发最佳实践</a>
      <p class="article-excerpt">总结多年C++游戏开发经验，涵盖代码规范、内存管理、设计模式在游戏开发中的应用...</p>
      <span class="article-date">2024年11月28日</span>
    </li>
    <li class="article-item">
      <a href="#" class="article-title">游戏AI算法探索</a>
      <p class="article-excerpt">探讨游戏中常用的AI算法，包括状态机、行为树、神经网络在游戏NPC行为设计中的应用...</p>
      <span class="article-date">2024年11月20日</span>
    </li>
    {% endif %}
  </ul>
</section>

<section class="contact-section">
  <h2 class="section-title">📫 联系我</h2>
  <p>欢迎交流游戏开发技术，分享创意想法</p>
  <div class="contact-links">
    <a href="https://github.com/{{ site.github_username }}" class="contact-link">GitHub</a>
    <a href="https://gitee.com/{{ site.gitee_username }}" class="contact-link">Gitee</a>
    <a href="mailto:{{ site.email }}" class="contact-link">邮箱</a>
    <a href="/about/" class="contact-link">关于我</a>
  </div>
</section>
