<template>
  <div class="register-page">
    <div class="container">
      <div class="register-container">
        <div class="register-form-wrapper">
          <!-- Logo和标题 -->
          <div class="register-header">
            <router-link to="/" class="logo">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
              </svg>
            </router-link>
            <h1 class="register-title">创建账户</h1>
            <p class="register-subtitle">加入我们，享受专业的购物体验</p>
          </div>

          <!-- 注册表单 -->
          <form @submit.prevent="handleRegister" class="register-form">
            <!-- 用户名输入 -->
            <div class="form-group">
              <label for="username" class="form-label">用户名</label>
              <input
                id="username"
                v-model="registerForm.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                required
              >
            </div>

            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">邮箱地址</label>
              <input
                id="email"
                v-model="registerForm.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱地址"
                required
              >
            </div>

            <!-- 手机号输入 -->
            <div class="form-group">
              <label for="phone" class="form-label">手机号码</label>
              <input
                id="phone"
                v-model="registerForm.phone"
                type="tel"
                class="form-input"
                placeholder="请输入手机号码"
                required
              >
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入密码（至少8位）"
                  required
                  minlength="8"
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
              <div class="password-strength">
                <div class="strength-bar">
                  <div 
                    class="strength-fill" 
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrengthWidth }"
                  ></div>
                </div>
                <span class="strength-text">{{ passwordStrengthText }}</span>
              </div>
            </div>

            <!-- 确认密码输入 -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请再次输入密码"
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <div v-if="registerForm.confirmPassword && !passwordsMatch" class="error-message">
                密码不匹配
              </div>
            </div>

            <!-- 服务条款 -->
            <div class="form-group">
              <label class="checkbox-wrapper">
                <input v-model="registerForm.agreeTerms" type="checkbox" class="checkbox" required>
                <span class="checkbox-label">
                  我已阅读并同意
                  <router-link to="/coming-soon" class="terms-link">《服务条款》</router-link>
                  和
                  <router-link to="/coming-soon" class="terms-link">《隐私政策》</router-link>
                </span>
              </label>
            </div>

            <!-- 注册按钮 -->
            <button 
              type="submit" 
              class="btn btn-primary btn-lg" 
              :disabled="isLoading || !canSubmit"
            >
              <span v-if="isLoading">注册中...</span>
              <span v-else>创建账户</span>
            </button>
          </form>

          <!-- 第三方注册 -->
          <div class="social-register">
            <div class="divider">
              <span>或使用以下方式注册</span>
            </div>
            
            <div class="social-buttons">
              <button class="social-btn wechat-btn" @click="registerWithWechat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.852.194-.242-.11-.403-.156-.403-.156-.034-.006-.069-.009-.104-.009C14.691 10.188 8.691 6.188 8.691 2.188z"/>
                </svg>
                微信注册
              </button>
              
              <button class="social-btn alipay-btn" @click="registerWithAlipay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6-.64-.36-1.23-.8-1.76-1.32C12.44 21.36 11.24 22 10 22c-5.52 0-10-4.48-10-10S4.48 2 10 2s10 4.48 10 10c0 1.19-.21 2.34-.6 3.41.36.64.8 1.23 1.32 1.76C21.36 15.56 22 13.36 22 12c0-5.52-4.48-10-10-10z"/>
                </svg>
                支付宝注册
              </button>
            </div>
          </div>

          <!-- 登录链接 -->
          <div class="login-link">
            <span>已有账户？</span>
            <router-link to="/login">立即登录</router-link>
          </div>
        </div>

        <!-- 右侧图片 -->
        <div class="register-image">
          <div class="image-content">
            <h2>加入我们的社区</h2>
            <p>成为会员，享受更多专属权益和优质服务</p>
            <div class="benefits-list">
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>专属会员价格</span>
              </div>
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>优先客服支持</span>
              </div>
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>积分奖励计划</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const isLoading = ref(false)
    
    const registerForm = ref({
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })

    // 密码强度计算
    const passwordStrength = computed(() => {
      const password = registerForm.value.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 8) strength += 1
      if (/[a-z]/.test(password)) strength += 1
      if (/[A-Z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1
      
      return strength
    })

    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value
      if (strength <= 2) return 'weak'
      if (strength <= 3) return 'medium'
      return 'strong'
    })

    const passwordStrengthWidth = computed(() => {
      return `${(passwordStrength.value / 5) * 100}%`
    })

    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value
      if (strength === 0) return ''
      if (strength <= 2) return '弱'
      if (strength <= 3) return '中等'
      return '强'
    })

    const passwordsMatch = computed(() => {
      return registerForm.value.password === registerForm.value.confirmPassword
    })

    const canSubmit = computed(() => {
      return registerForm.value.username &&
             registerForm.value.email &&
             registerForm.value.phone &&
             registerForm.value.password &&
             registerForm.value.confirmPassword &&
             passwordsMatch.value &&
             registerForm.value.agreeTerms &&
             passwordStrength.value >= 3
    })

    const handleRegister = async () => {
      if (!canSubmit.value) return
      
      isLoading.value = true
      
      try {
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 注册成功后跳转到登录页
        router.push('/login')
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        isLoading.value = false
      }
    }

    const registerWithWechat = () => {
      console.log('微信注册')
      // 实现微信注册逻辑
    }

    const registerWithAlipay = () => {
      console.log('支付宝注册')
      // 实现支付宝注册逻辑
    }

    return {
      showPassword,
      showConfirmPassword,
      isLoading,
      registerForm,
      passwordStrengthClass,
      passwordStrengthWidth,
      passwordStrengthText,
      passwordsMatch,
      canSubmit,
      handleRegister,
      registerWithWechat,
      registerWithAlipay
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent) 100%);
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  min-height: 700px;
}

.register-form-wrapper {
  padding: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 700px;
  overflow-y: auto;
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.logo {
  display: inline-flex;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.register-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.register-subtitle {
  color: var(--color-gray);
  font-size: var(--font-size-base);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all var(--transition-normal);
}

.strength-fill.weak {
  background: var(--color-danger);
}

.strength-fill.medium {
  background: var(--color-warning);
}

.strength-fill.strong {
  background: var(--color-success);
}

.strength-text {
  font-size: var(--font-size-xs);
  font-weight: 600;
  min-width: 30px;
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent-blue);
  margin-top: 2px;
}

.checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
  line-height: 1.4;
}

.terms-link {
  color: var(--color-accent-blue);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.social-register {
  margin-top: var(--spacing-lg);
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

.login-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.login-link a {
  color: var(--color-accent-blue);
  text-decoration: none;
  font-weight: 600;
  margin-left: var(--spacing-xs);
}

.login-link a:hover {
  color: var(--color-primary);
}

.register-image {
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, #1e40af 100%);
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

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
    margin: var(--spacing-md);
  }

  .register-image {
    display: none;
  }

  .register-form-wrapper {
    padding: var(--spacing-xl);
    max-height: none;
  }

  .social-buttons {
    flex-direction: column;
  }
}
</style>