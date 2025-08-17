<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 公司信息 -->
        <div class="footer-section">
          <div class="footer-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="currentColor"/>
              <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
            </svg>
            <span class="footer-logo-text">电脑配件商城</span>
          </div>
          <p class="footer-description">
            专业的电脑配件销售平台，为您提供高品质的硬件产品和优质的购物体验。
          </p>
          <div class="social-links">
            <a href="#" class="social-link" title="微信">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.852.194-.242-.11-.403-.156-.403-.156-.034-.006-.069-.009-.104-.009C14.691 10.188 8.691 6.188 8.691 2.188z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="微博">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.31 16.242c-2.206 0-4.126-1.143-4.126-2.663 0-1.113 1.27-2.1 2.954-2.1 1.917 0 4.032 1.077 4.032 2.663 0 1.407-1.188 2.1-2.86 2.1z"/>
              </svg>
            </a>
            <a href="#" class="social-link" title="QQ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1.5-1.5L10 14l2-2 2 2 1.5 1.5L14 17l-2-2-2 2z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- 产品分类 -->
        <div class="footer-section">
          <h3 class="footer-title">产品分类</h3>
          <ul class="footer-links">
            <li><router-link to="/products?category=cpu">处理器</router-link></li>
            <li><router-link to="/products?category=gpu">显卡</router-link></li>
            <li><router-link to="/products?category=motherboard">主板</router-link></li>
            <li><router-link to="/products?category=memory">内存</router-link></li>
            <li><router-link to="/products?category=storage">存储</router-link></li>
            <li><router-link to="/products?category=power">电源</router-link></li>
          </ul>
        </div>

        <!-- 客户服务 -->
        <div class="footer-section">
          <h3 class="footer-title">客户服务</h3>
          <ul class="footer-links">
            <li><router-link to="/coming-soon">帮助中心</router-link></li>
            <li><router-link to="/coming-soon">退换货政策</router-link></li>
            <li><router-link to="/coming-soon">配送信息</router-link></li>
            <li><router-link to="/coming-soon">支付方式</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
            <li><router-link to="/coming-soon">售后服务</router-link></li>
          </ul>
        </div>

        <!-- 关于我们 -->
        <div class="footer-section">
          <h3 class="footer-title">关于我们</h3>
          <ul class="footer-links">
            <li><router-link to="/coming-soon">公司简介</router-link></li>
            <li><router-link to="/coming-soon">招聘信息</router-link></li>
            <li><router-link to="/coming-soon">新闻资讯</router-link></li>
            <li><router-link to="/coming-soon">投资者关系</router-link></li>
            <li><router-link to="/coming-soon">隐私政策</router-link></li>
            <li><router-link to="/coming-soon">服务条款</router-link></li>
          </ul>
        </div>

        <!-- 联系信息 -->
        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <div class="contact-info">
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>400-888-9999</span>
            </div>
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>service@pcstore.com</span>
            </div>
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>北京市朝阳区科技园区</span>
            </div>
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <span>周一至周日 9:00-21:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © 2024 电脑配件商城. 保留所有权利.
          </p>
          <div class="footer-bottom-links">
            <router-link to="/coming-soon">隐私政策</router-link>
            <router-link to="/coming-soon">服务条款</router-link>
            <router-link to="/coming-soon">网站地图</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: var(--color-white);
  margin-top: var(--spacing-3xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-2xl);
  padding: var(--spacing-3xl) 0 var(--spacing-2xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.footer-logo-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  color: var(--color-white);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.social-link:hover {
  background-color: var(--color-accent-blue);
  transform: translateY(-2px);
}

.footer-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-white);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg) 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
}

.footer-bottom-links {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.footer-bottom-links a:hover {
  color: var(--color-white);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    padding: var(--spacing-2xl) 0 var(--spacing-xl);
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }
}
</style>