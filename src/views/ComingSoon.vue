<template>
  <div class="coming-soon-page">
    <div class="container">
      <div class="coming-soon-content">
        <div class="icon-container">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
        </div>
        
        <h1 class="title">敬请期待</h1>
        <p class="subtitle">{{ pageTitle }}功能正在紧张开发中</p>
        <p class="description">
          我们正在努力为您打造更好的购物体验，<br>
          该功能即将上线，请您耐心等待。
        </p>
        
        <div class="features-preview">
          <h3>即将推出的功能</h3>
          <div class="features-grid">
            <div 
              v-for="feature in upcomingFeatures" 
              :key="feature.title"
              class="feature-item"
            >
              <div class="feature-icon">
                <component :is="feature.icon" />
              </div>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="notification-signup">
          <h3>第一时间获取更新</h3>
          <p>留下您的邮箱，我们会在功能上线时第一时间通知您</p>
          <form @submit.prevent="subscribeNotification" class="signup-form">
            <div class="input-group">
              <input 
                v-model="email"
                type="email"
                placeholder="请输入您的邮箱地址"
                class="email-input"
                required
              >
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSubscribing"
              >
                {{ isSubscribing ? '提交中...' : '订阅通知' }}
              </button>
            </div>
            <p v-if="subscriptionMessage" class="subscription-message" :class="subscriptionStatus">
              {{ subscriptionMessage }}
            </p>
          </form>
        </div>
        
        <div class="action-buttons">
          <button @click="goBack" class="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            返回上页
          </button>
          <router-link to="/" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            返回首页
          </router-link>
        </div>
        
        <div class="contact-info">
          <p>如有疑问，请联系我们：</p>
          <div class="contact-methods">
            <a href="mailto:support@example.com" class="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              support@example.com
            </a>
            <span class="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              400-123-4567
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ComingSoon',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const email = ref('')
    const isSubscribing = ref(false)
    const subscriptionMessage = ref('')
    const subscriptionStatus = ref('')
    
    // 根据路由确定页面标题
    const pageTitle = computed(() => {
      const pageTitles = {
        '/checkout': '结算',
        '/orders': '订单管理',
        '/profile': '个人中心',
        '/support': '客户支持',
        '/about': '关于我们',
        '/contact': '联系我们'
      }
      return pageTitles[route.path] || '该页面'
    })
    
    // 即将推出的功能（根据不同页面显示不同功能）
    const upcomingFeatures = computed(() => {
      const allFeatures = {
        '/checkout': [
          {
            title: '快速结算',
            description: '一键下单，支持多种支付方式',
            icon: 'CreditCardIcon'
          },
          {
            title: '地址管理',
            description: '保存常用地址，快速选择',
            icon: 'LocationIcon'
          },
          {
            title: '订单跟踪',
            description: '实时查看订单状态和物流信息',
            icon: 'TruckIcon'
          }
        ],
        '/orders': [
          {
            title: '订单历史',
            description: '查看所有历史订单记录',
            icon: 'HistoryIcon'
          },
          {
            title: '退换货',
            description: '便捷的退换货申请流程',
            icon: 'RefreshIcon'
          },
          {
            title: '发票管理',
            description: '在线申请和下载电子发票',
            icon: 'DocumentIcon'
          }
        ],
        '/profile': [
          {
            title: '个人信息',
            description: '管理您的个人资料和偏好设置',
            icon: 'UserIcon'
          },
          {
            title: '安全设置',
            description: '密码修改和账户安全管理',
            icon: 'ShieldIcon'
          },
          {
            title: '收藏夹',
            description: '管理您收藏的商品',
            icon: 'HeartIcon'
          }
        ],
        default: [
          {
            title: '优质服务',
            description: '为您提供更好的购物体验',
            icon: 'StarIcon'
          },
          {
            title: '快速响应',
            description: '及时处理您的需求和反馈',
            icon: 'ZapIcon'
          },
          {
            title: '持续改进',
            description: '不断优化功能和用户体验',
            icon: 'TrendingUpIcon'
          }
        ]
      }
      
      return allFeatures[route.path] || allFeatures.default
    })
    
    // 图标组件
    const iconComponents = {
      CreditCardIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        `
      },
      LocationIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `
      },
      TruckIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        `
      },
      HistoryIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
        `
      },
      RefreshIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23,4 23,10 17,10"></polyline>
            <polyline points="1,20 1,14 7,14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        `
      },
      DocumentIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        `
      },
      UserIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `
      },
      ShieldIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        `
      },
      HeartIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        `
      },
      StarIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon>
          </svg>
        `
      },
      ZapIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
          </svg>
        `
      },
      TrendingUpIcon: {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
            <polyline points="17,6 23,6 23,12"></polyline>
          </svg>
        `
      }
    }
    
    // 方法
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }
    
    const subscribeNotification = async () => {
      if (!email.value.trim()) return
      
      isSubscribing.value = true
      subscriptionMessage.value = ''
      
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟成功响应
        subscriptionMessage.value = '订阅成功！我们会在功能上线时第一时间通知您。'
        subscriptionStatus.value = 'success'
        email.value = ''
      } catch (error) {
        subscriptionMessage.value = '订阅失败，请稍后重试。'
        subscriptionStatus.value = 'error'
      } finally {
        isSubscribing.value = false
        
        // 3秒后清除消息
        setTimeout(() => {
          subscriptionMessage.value = ''
          subscriptionStatus.value = ''
        }, 3000)
      }
    }
    
    // 注册图标组件
    onMounted(() => {
      Object.entries(iconComponents).forEach(([name, component]) => {
        if (!getCurrentInstance().appContext.app.component(name)) {
          getCurrentInstance().appContext.app.component(name, component)
        }
      })
    })
    
    return {
      email,
      isSubscribing,
      subscriptionMessage,
      subscriptionStatus,
      pageTitle,
      upcomingFeatures,
      goBack,
      subscribeNotification
    }
  }
}
</script>

<style scoped>
.coming-soon-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;
}

.coming-soon-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.icon-container {
  margin-bottom: var(--spacing-2xl);
  color: var(--color-accent-blue);
}

.title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-gray-dark);
  margin-bottom: var(--spacing-lg);
}

.description {
  font-size: var(--font-size-base);
  color: var(--color-gray);
  line-height: 1.6;
  margin-bottom: var(--spacing-3xl);
}

/* 功能预览 */
.features-preview {
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.features-preview h3 {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
}

.feature-item {
  text-align: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  transition: transform var(--transition-fast);
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-md);
  color: var(--color-accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
}

.feature-item h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.feature-item p {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  line-height: 1.5;
}

/* 通知订阅 */
.notification-signup {
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-lg);
}

.notification-signup h3 {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.notification-signup > p {
  font-size: var(--font-size-base);
  color: var(--color-gray-dark);
  margin-bottom: var(--spacing-lg);
}

.signup-form {
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.email-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
}

.email-input:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.subscription-message {
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  text-align: center;
}

.subscription-message.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.subscription-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-accent-red);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.action-buttons .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
}

/* 联系信息 */
.contact-info {
  padding: var(--spacing-xl);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.contact-info p {
  font-size: var(--font-size-base);
  color: var(--color-gray-dark);
  margin-bottom: var(--spacing-md);
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-accent-blue);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-link:hover {
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .coming-soon-page {
    padding: var(--spacing-xl) 0;
  }

  .title {
    font-size: var(--font-size-3xl);
  }

  .subtitle {
    font-size: var(--font-size-lg);
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .input-group {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons .btn {
    width: 100%;
    max-width: 200px;
  }

  .contact-methods {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .features-preview,
  .notification-signup,
  .contact-info {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .icon-container svg {
    width: 80px;
    height: 80px;
  }

  .title {
    font-size: var(--font-size-2xl);
  }

  .subtitle {
    font-size: var(--font-size-base);
  }
}
</style>