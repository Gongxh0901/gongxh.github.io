---
layout: main
title: 博客文章
permalink: /blog/
---

<style>
/* 博客页面特定样式 */
.blog-home {
    padding: 40px;
}

.blog-header {
    text-align: center;
    margin-bottom: 60px;
}

.blog-title {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: var(--text-primary);
}

.blog-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
}

.blog-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
}

.category-card {
    background: var(--card-bg);
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.category-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.category-name {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--text-primary);
}

.category-description {
    color: var(--text-secondary);
    line-height: 1.6;
}

.category-count {
    margin-top: 15px;
    font-size: 0.9rem;
    color: var(--text-light);
}

.recent-posts {
    background: var(--card-bg);
    padding: 40px;
    border-radius: 10px;
}

.recent-posts-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
    text-align: center;
}

.posts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.post-item {
    background: white;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.post-item:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.post-info h3 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
}

.post-info h3 a {
    color: var(--text-primary);
    text-decoration: none;
}

.post-info h3 a:hover {
    color: var(--primary-color);
}

.post-meta {
    display: flex;
    gap: 20px;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.post-date {
    text-align: right;
    color: var(--text-light);
    font-size: 0.9rem;
}
</style>

<div class="blog-home">
    <div class="blog-header">
        <h1 class="blog-title">📚 技术博客</h1>
        <p class="blog-subtitle">分享游戏开发经验，记录技术成长之路</p>
    </div>
    
    <div class="blog-categories">
        <div class="category-card" onclick="document.querySelector('[data-target=\"projects\"]').click()">
            <div class="category-icon">🎮</div>
            <h2 class="category-name">游戏项目</h2>
            <p class="category-description">分享游戏开发过程中的技术实现、架构设计和优化经验</p>
            <p class="category-count">{{ site.posts | where_exp: "post", "post.categories contains '游戏项目'" | size }} 篇文章</p>
        </div>
        
        <div class="category-card" onclick="document.querySelector('[data-target=\"tools\"]').click()">
            <div class="category-icon">🛠️</div>
            <h2 class="category-name">开发工具</h2>
            <p class="category-description">介绍实用的开发工具、插件开发和工作流优化</p>
            <p class="category-count">{{ site.posts | where_exp: "post", "post.categories contains '游戏开发工具'" | size }} 篇文章</p>
        </div>
        
        <div class="category-card" onclick="document.querySelector('[data-target=\"articles\"]').click()">
            <div class="category-icon">📝</div>
            <h2 class="category-name">技术文章</h2>
            <p class="category-description">深入探讨技术原理、最佳实践和问题解决方案</p>
            <p class="category-count">{{ site.posts | where_exp: "post", "post.path contains 'blog-articles'" | size }} 篇文章</p>
        </div>
        
        <div class="category-card" onclick="document.querySelector('[data-target=\"opensource\"]').click()">
            <div class="category-icon">🌟</div>
            <h2 class="category-name">开源项目</h2>
            <p class="category-description">开源项目介绍、使用教程和开发心得</p>
            <p class="category-count">{{ site.posts | where_exp: "post", "post.categories contains '开源项目'" | size }} 篇文章</p>
        </div>
    </div>
    
    <div class="recent-posts">
        <h2 class="recent-posts-title">🔥 最新文章</h2>
        <div class="posts-list">
            {% for post in site.posts limit: 10 %}
            <div class="post-item">
                <div class="post-info">
                    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
                    <div class="post-meta">
                        <span class="post-category">
                            {% if post.categories.size > 0 %}
                                📁 {{ post.categories | first }}
                            {% endif %}
                        </span>
                        {% if post.tags.size > 0 %}
                        <span class="post-tags">
                            🏷️ {{ post.tags | join: ", " }}
                        </span>
                        {% endif %}
                    </div>
                </div>
                <div class="post-date">
                    {{ post.date | date: "%Y-%m-%d" }}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>

