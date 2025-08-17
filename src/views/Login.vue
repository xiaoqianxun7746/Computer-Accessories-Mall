<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-form-wrapper">
          <!-- Logo和标题 -->
          <div class="login-header">
            <router-link to="/" class="logo">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
              </svg>
            </router-link>
            <h1 class="login-title">登录账户</h1>
            <p class="login-subtitle">欢迎回来，请登录您的账户</p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">邮箱地址</label>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱地址"
                required
              >
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入密码"
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="form-options">
              <label class="checkbox-wrapper">
                <input v-model="loginForm.remember" type="checkbox" class="checkbox">
                <span class="checkbox-label">记住我</span>
              </label>
              <router-link to="/coming-soon" class="forgot-password">忘记密码？</router-link>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
              <span v-if="isLoading">登录中...</span>
              <span v-else>登录</span>
            </button>
          </form>

          <!-- 第三方登录 -->
          <div class="social-login">
            <div class="divider">
              <span>或使用以下方式登录</span>
            </div>
            
            <div class="social-buttons">
              <button class="social-btn wechat-btn" @click="loginWithWechat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.852.194-.242-.11-.403-.156-.403-.156-.034-.006-.069-.009-.104-.009C14.691 10.188 8.691 6.188 8.691 2.188z"/>
                </svg>
                微信登录
              </button>
              
              <button class="social-btn alipay-btn" @click="loginWithAlipay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6-.64-.36-1.23-.8-1.76-1.32C12.44 21.36 11.24 22 10 22c-5.52 0-10-4.48-10-10S4.48 2 10 2s10 4.48 10 10c0 1.19-.21 2.34-.6 3.41.36.64.8 1.23 1.32 1.76C21.36 15.56 22 13.36 22 12c0-5.52-4.48-10-10-10z"/>
                </svg>
                支付宝登录
              </button>
            </div>
          </div>

          <!-- 注册链接 -->
          <div class="register-link">
            <span>还没有账户？</span>
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>

        <!-- 右侧图片 -->
        <div class="login-image">
          <div class="image-content">
            <h2>专业的电脑配件商城</h2>
            <p>为您提供高品质的硬件产品和优质的购物体验</p>
            <div class="features-list">
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>正品保证</span>
              </div>
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>快速配送</span>
              </div>
              <div class="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.458V6m0 12v3.542M2.458 12H6m12 0h3.542"></path>
                </svg>
                <span>专业服务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const showPassword = ref(false)
    const isLoading = ref(false)
    
    const loginForm = ref({
      email: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      isLoading.value = true
      
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 登录成功后跳转
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        isLoading.value = false
      }
    }

    const loginWithWechat = () => {
      console.log('微信登录')
      // 实现微信登录逻辑
    }

    const loginWithAlipay = () => {
      console.log('支付宝登录')
      // 实现支付宝登录逻辑
    }

    return {
      showPassword,
      isLoading,
      loginForm,
      handleLogin,
      loginWithWechat,
      loginWithAlipay
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-gray-light) 100%);
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) 0;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  min-height: 600px;
}

.login-form-wrapper {
  padding: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.logo {
  display: inline-flex;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.login-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.login-subtitle {
  color: var(--color-gray);
  font-size: var(--font-size-base);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-gray);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-primary);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent-blue);
}

.checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
}

.forgot-password {
  color: var(--color-accent-blue);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.forgot-password:hover {
  color: var(--color-primary);
}

.social-login {
  margin-top: var(--spacing-xl);
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  background: var(--color-white);
  padding: 0 var(--spacing-md);
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

.social-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.social-btn:hover {
  border-color: var(--color-accent-blue);
  color: var(--color-accent-blue);
}

.wechat-btn:hover {
  border-color: #07c160;
  color: #07c160;
}

.alipay-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.register-link {
  text-align: center;
  margin-top: var(--spacing-xl);
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.register-link a {
  color: var(--color-accent-blue);
  text-decoration: none;
  font-weight: 600;
  margin-left: var(--spacing-xs);
}

.register-link a:hover {
  color: var(--color-primary);
}

.login-image {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  color: var(--color-white);
}

.image-content {
  text-align: center;
}

.image-content h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.image-content p {
  font-size: var(--font-size-base);
  opacity: 0.9;
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    margin: var(--spacing-md);
  }

  .login-image {
    display: none;
  }

  .login-form-wrapper {
    padding: var(--spacing-xl);
  }

  .social-buttons {
    flex-direction: column;
  }
}
</style>