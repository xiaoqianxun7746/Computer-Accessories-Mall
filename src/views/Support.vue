<template>
  <div class="support-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">客户支持</h1>
        <p class="page-subtitle">我们致力于为您提供最优质的服务体验</p>
      </div>

      <!-- 快速帮助 -->
      <div class="quick-help">
        <h2 class="section-title">快速帮助</h2>
        <div class="help-grid">
          <div 
            v-for="item in quickHelpItems" 
            :key="item.id"
            class="help-item"
            @click="selectHelpItem(item)"
          >
            <div class="help-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <component :is="item.icon" />
              </svg>
            </div>
            <h3 class="help-title">{{ item.title }}</h3>
            <p class="help-description">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-categories">
          <button 
            v-for="category in faqCategories" 
            :key="category.id"
            class="faq-category-btn"
            :class="{ active: activeFaqCategory === category.id }"
            @click="setActiveFaqCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="faq-list">
          <div 
            v-for="faq in filteredFaqs" 
            :key="faq.id"
            class="faq-item"
            :class="{ active: expandedFaq === faq.id }"
            @click="toggleFaq(faq.id)"
          >
            <div class="faq-question">
              <h3>{{ faq.question }}</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
            <div class="faq-answer" v-show="expandedFaq === faq.id">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-section">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-grid">
          <div 
            v-for="contact in contactMethods" 
            :key="contact.id"
            class="contact-card"
          >
            <div class="contact-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <component :is="contact.icon" />
              </svg>
            </div>
            <h3 class="contact-title">{{ contact.title }}</h3>
            <p class="contact-info">{{ contact.info }}</p>
            <p class="contact-time">{{ contact.time }}</p>
            <button class="contact-btn" @click="initiateContact(contact.type)">
              {{ contact.buttonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- 在线客服 -->
      <div class="live-chat-section">
        <h2 class="section-title">在线客服</h2>
        <div class="chat-container">
          <div class="chat-header">
            <div class="agent-info">
              <div class="agent-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="agent-details">
                <h4>客服小助手</h4>
                <span class="status online">在线</span>
              </div>
            </div>
          </div>
          <div class="chat-messages" ref="chatMessages">
            <div 
              v-for="message in chatMessages" 
              :key="message.id"
              class="message"
              :class="{ 'user-message': message.isUser }"
            >
              <div class="message-content">
                {{ message.content }}
              </div>
              <div class="message-time">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
          <div class="chat-input">
            <input 
              v-model="newMessage"
              type="text"
              placeholder="请输入您的问题..."
              @keyup.enter="sendMessage"
              class="message-input"
            >
            <button @click="sendMessage" class="send-btn" :disabled="!newMessage.trim()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 服务保障 -->
      <div class="service-guarantee">
        <h2 class="section-title">服务保障</h2>
        <div class="guarantee-grid">
          <div 
            v-for="guarantee in serviceGuarantees" 
            :key="guarantee.id"
            class="guarantee-card"
          >
            <div class="guarantee-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <component :is="guarantee.icon" />
              </svg>
            </div>
            <h3 class="guarantee-title">{{ guarantee.title }}</h3>
            <p class="guarantee-description">{{ guarantee.description }}</p>
            <ul class="guarantee-features">
              <li v-for="feature in guarantee.features" :key="feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'

export default {
  name: 'Support',
  setup() {
    const activeFaqCategory = ref('general')
    const expandedFaq = ref(null)
    const newMessage = ref('')
    const chatMessages = ref([
      {
        id: 1,
        content: '您好！欢迎来到电脑配件商城，我是您的专属客服小助手。请问有什么可以帮助您的吗？',
        isUser: false,
        timestamp: new Date()
      }
    ])

    // 快速帮助项目
    const quickHelpItems = ref([
      {
        id: 1,
        title: '订单查询',
        description: '查看订单状态、物流信息',
        icon: 'package'
      },
      {
        id: 2,
        title: '退换货',
        description: '申请退换货服务',
        icon: 'refresh-cw'
      },
      {
        id: 3,
        title: '技术支持',
        description: '产品技术问题咨询',
        icon: 'settings'
      },
      {
        id: 4,
        title: '账户问题',
        description: '登录、密码、个人信息',
        icon: 'user'
      },
      {
        id: 5,
        title: '支付问题',
        description: '支付方式、发票开具',
        icon: 'credit-card'
      },
      {
        id: 6,
        title: '配送服务',
        description: '配送范围、时间安排',
        icon: 'truck'
      }
    ])

    // FAQ分类
    const faqCategories = ref([
      { id: 'general', name: '常规问题' },
      { id: 'order', name: '订单相关' },
      { id: 'product', name: '产品问题' },
      { id: 'payment', name: '支付配送' },
      { id: 'after-sales', name: '售后服务' }
    ])

    // FAQ数据
    const faqs = ref([
      {
        id: 1,
        category: 'general',
        question: '如何注册账户？',
        answer: '点击页面右上角的"注册"按钮，填写手机号码和密码即可完成注册。注册后您可以享受会员专属优惠和服务。'
      },
      {
        id: 2,
        category: 'general',
        question: '忘记密码怎么办？',
        answer: '在登录页面点击"忘记密码"，输入注册时的手机号码，系统会发送验证码到您的手机，验证后即可重置密码。'
      },
      {
        id: 3,
        category: 'order',
        question: '如何查看订单状态？',
        answer: '登录账户后，在"我的订单"页面可以查看所有订单的详细状态，包括待付款、待发货、已发货、已完成等状态。'
      },
      {
        id: 4,
        category: 'order',
        question: '可以修改订单吗？',
        answer: '订单提交后，在未付款状态下可以取消订单重新下单。已付款但未发货的订单，请联系客服协助修改。'
      },
      {
        id: 5,
        category: 'product',
        question: '如何选择合适的配件？',
        answer: '我们提供详细的产品参数和兼容性说明。如有疑问，可以咨询在线客服或查看产品详情页的技术规格。'
      },
      {
        id: 6,
        category: 'product',
        question: '产品保修期是多久？',
        answer: '不同品牌和产品的保修期不同，一般为1-3年。具体保修信息请查看产品详情页或咨询客服。'
      },
      {
        id: 7,
        category: 'payment',
        question: '支持哪些支付方式？',
        answer: '我们支持支付宝、微信支付、银行卡支付等多种支付方式，安全便捷。'
      },
      {
        id: 8,
        category: 'payment',
        question: '配送范围和时间？',
        answer: '全国大部分地区支持配送，一般1-3个工作日送达。偏远地区可能需要额外时间，具体请咨询客服。'
      },
      {
        id: 9,
        category: 'after-sales',
        question: '如何申请退换货？',
        answer: '在订单页面点击"申请退换货"，填写退换货原因，我们会在24小时内处理您的申请。'
      },
      {
        id: 10,
        category: 'after-sales',
        question: '退换货需要什么条件？',
        answer: '商品需保持原包装完整，未使用过，在7天无理由退货期内。特殊商品请查看具体退换货政策。'
      }
    ])

    // 联系方式
    const contactMethods = ref([
      {
        id: 1,
        title: '在线客服',
        info: '7×24小时在线服务',
        time: '全天候服务',
        buttonText: '立即咨询',
        type: 'chat',
        icon: 'message-circle'
      },
      {
        id: 2,
        title: '客服热线',
        info: '400-123-4567',
        time: '周一至周日 9:00-21:00',
        buttonText: '拨打电话',
        type: 'phone',
        icon: 'phone'
      },
      {
        id: 3,
        title: '邮件支持',
        info: 'support@pcstore.com',
        time: '24小时内回复',
        buttonText: '发送邮件',
        type: 'email',
        icon: 'mail'
      },
      {
        id: 4,
        title: '技术支持',
        info: 'tech@pcstore.com',
        time: '工作日 9:00-18:00',
        buttonText: '技术咨询',
        type: 'tech',
        icon: 'tool'
      }
    ])

    // 服务保障
    const serviceGuarantees = ref([
      {
        id: 1,
        title: '正品保证',
        description: '所有商品均为正品，假一赔十',
        icon: 'shield-check',
        features: ['品牌官方授权', '正品验证码', '假货赔付保障']
      },
      {
        id: 2,
        title: '快速配送',
        description: '全国范围快速配送服务',
        icon: 'truck',
        features: ['当日发货', '次日达服务', '物流跟踪']
      },
      {
        id: 3,
        title: '售后无忧',
        description: '完善的售后服务体系',
        icon: 'headphones',
        features: ['7天无理由退货', '30天换货保证', '1年质保服务']
      },
      {
        id: 4,
        title: '专业技术',
        description: '专业技术团队支持',
        icon: 'cpu',
        features: ['装机指导', '兼容性检测', '性能优化建议']
      }
    ])

    // 计算过滤后的FAQ
    const filteredFaqs = computed(() => {
      return faqs.value.filter(faq => faq.category === activeFaqCategory.value)
    })

    // 设置活动FAQ分类
    const setActiveFaqCategory = (categoryId) => {
      activeFaqCategory.value = categoryId
      expandedFaq.value = null
    }

    // 切换FAQ展开状态
    const toggleFaq = (faqId) => {
      expandedFaq.value = expandedFaq.value === faqId ? null : faqId
    }

    // 选择帮助项目
    const selectHelpItem = (item) => {
      // 这里可以添加具体的处理逻辑
      console.log('选择帮助项目:', item.title)
    }

    // 发起联系
    const initiateContact = (type) => {
      switch (type) {
        case 'chat':
          // 滚动到聊天区域
          document.querySelector('.live-chat-section').scrollIntoView({ behavior: 'smooth' })
          break
        case 'phone':
          window.open('tel:400-123-4567')
          break
        case 'email':
          window.open('mailto:support@pcstore.com')
          break
        case 'tech':
          window.open('mailto:tech@pcstore.com')
          break
      }
    }

    // 发送消息
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      // 添加用户消息
      chatMessages.value.push({
        id: Date.now(),
        content: newMessage.value,
        isUser: true,
        timestamp: new Date()
      })

      const userMessage = newMessage.value
      newMessage.value = ''

      // 滚动到底部
      await nextTick()
      scrollToBottom()

      // 模拟客服回复
      setTimeout(() => {
        const reply = generateReply(userMessage)
        chatMessages.value.push({
          id: Date.now(),
          content: reply,
          isUser: false,
          timestamp: new Date()
        })
        nextTick(() => scrollToBottom())
      }, 1000)
    }

    // 生成自动回复
    const generateReply = (message) => {
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes('订单') || lowerMessage.includes('查询')) {
        return '您可以在"我的订单"页面查看订单状态，或者提供订单号给我，我来帮您查询。'
      } else if (lowerMessage.includes('退货') || lowerMessage.includes('换货')) {
        return '我们支持7天无理由退货，您可以在订单页面申请退换货，或者我来协助您处理。'
      } else if (lowerMessage.includes('配送') || lowerMessage.includes('物流')) {
        return '我们提供全国配送服务，一般1-3个工作日送达。您可以提供订单号，我帮您查询物流信息。'
      } else if (lowerMessage.includes('支付') || lowerMessage.includes('付款')) {
        return '我们支持支付宝、微信支付、银行卡等多种支付方式。如遇支付问题，请告诉我具体情况。'
      } else {
        return '感谢您的咨询！请详细描述您遇到的问题，我会尽快为您解决。您也可以拨打客服热线400-123-4567。'
      }
    }

    // 滚动到聊天底部
    const scrollToBottom = () => {
      const chatContainer = document.querySelector('.chat-messages')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      activeFaqCategory,
      expandedFaq,
      newMessage,
      chatMessages,
      quickHelpItems,
      faqCategories,
      faqs,
      contactMethods,
      serviceGuarantees,
      filteredFaqs,
      setActiveFaqCategory,
      toggleFaq,
      selectHelpItem,
      initiateContact,
      sendMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.help-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.help-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.help-icon {
  color: #667eea;
  margin-bottom: 1rem;
}

.help-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.help-description {
  color: #718096;
  line-height: 1.6;
}

.faq-section {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.faq-section .section-title {
  color: #2d3748;
}

.faq-categories {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.faq-category-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.faq-category-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.faq-category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #667eea;
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.faq-question h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.faq-question svg {
  transition: transform 0.3s ease;
  color: #667eea;
}

.faq-item.active .faq-question svg {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.faq-answer p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  color: #667eea;
  margin-bottom: 1rem;
}

.contact-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.contact-info {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.contact-time {
  color: #718096;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.contact-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: 500;
}

.contact-btn:hover {
  background: #5a67d8;
}

.live-chat-section {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.live-chat-section .section-title {
  color: #2d3748;
}

.chat-container {
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
}

.chat-header {
  background: #667eea;
  color: white;
  padding: 1rem;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-details h4 {
  margin: 0;
  font-size: 1rem;
}

.status {
  font-size: 0.8rem;
  opacity: 0.8;
}

.status.online::before {
  content: '●';
  color: #48bb78;
  margin-right: 0.25rem;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
}

.message {
  margin-bottom: 1rem;
}

.message.user-message {
  text-align: right;
}

.message-content {
  display: inline-block;
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background: #667eea;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #718096;
  margin-top: 0.25rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  outline: none;
  margin-right: 0.5rem;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guarantee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.guarantee-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.guarantee-icon {
  color: #667eea;
  margin-bottom: 1rem;
}

.guarantee-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.guarantee-description {
  color: #718096;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.guarantee-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guarantee-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.guarantee-features svg {
  color: #48bb78;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .help-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .faq-category-btn {
    white-space: nowrap;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-section,
  .live-chat-section {
    padding: 2rem 1rem;
  }
}
</style>