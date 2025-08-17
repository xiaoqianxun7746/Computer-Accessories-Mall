<template>
  <div class="orders-page">
    <div class="container">
      <div class="page-header">
        <h1>我的订单</h1>
        <div class="header-actions">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索订单号、商品名称"
              class="search-input"
              @keyup.enter="searchOrders"
            >
            <button @click="searchOrders" class="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 订单状态筛选 -->
      <div class="order-tabs">
        <button 
          v-for="tab in orderTabs" 
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- 订单列表 -->
      <div class="orders-content">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>暂无订单</h3>
          <p>您还没有相关订单，去看看有什么想买的吧</p>
          <router-link to="/" class="btn btn-primary">去购物</router-link>
        </div>

        <div v-else class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="order-card"
          >
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">订单号：{{ order.orderNumber }}</span>
                <span class="order-date">{{ formatDate(order.createTime) }}</span>
              </div>
              <div class="order-status">
                <span class="status-badge" :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>

            <!-- 订单商品 -->
            <div class="order-items">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="order-item"
              >
                <img :src="item.image" :alt="item.name" class="item-image">
                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-spec">{{ item.spec }}</p>
                  <div class="item-price-qty">
                    <span class="item-price">¥{{ item.price }}</span>
                    <span class="item-qty">×{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 订单金额 -->
            <div class="order-amount">
              <div class="amount-details">
                <span class="amount-label">实付款：</span>
                <span class="amount-value">¥{{ order.totalAmount }}</span>
              </div>
              <div v-if="order.items.length > 1" class="items-count">
                共{{ order.items.length }}件商品
              </div>
            </div>

            <!-- 订单操作 -->
            <div class="order-actions">
              <button @click="viewOrderDetail(order)" class="btn btn-secondary btn-sm">
                查看详情
              </button>
              
              <template v-if="order.status === 'pending'">
                <button @click="payOrder(order)" class="btn btn-primary btn-sm">
                  立即支付
                </button>
                <button @click="cancelOrder(order)" class="btn btn-secondary btn-sm">
                  取消订单
                </button>
              </template>
              
              <template v-else-if="order.status === 'shipped'">
                <button @click="confirmReceived(order)" class="btn btn-primary btn-sm">
                  确认收货
                </button>
                <button @click="trackOrder(order)" class="btn btn-secondary btn-sm">
                  查看物流
                </button>
              </template>
              
              <template v-else-if="order.status === 'completed'">
                <button @click="reviewOrder(order)" class="btn btn-primary btn-sm">
                  评价商品
                </button>
                <button @click="buyAgain(order)" class="btn btn-secondary btn-sm">
                  再次购买
                </button>
              </template>
              
              <template v-else-if="order.status === 'cancelled'">
                <button @click="buyAgain(order)" class="btn btn-primary btn-sm">
                  再次购买
                </button>
              </template>
            </div>

            <!-- 物流信息（仅在已发货状态显示） -->
            <div v-if="order.status === 'shipped' && order.logistics" class="logistics-info">
              <div class="logistics-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>{{ order.logistics.company }} {{ order.logistics.trackingNumber }}</span>
              </div>
              <p class="logistics-status">{{ order.logistics.latestStatus }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Orders',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const searchKeyword = ref('')
    const activeTab = ref('all')
    const orders = ref([])
    
    // 订单状态标签
    const orderTabs = ref([
      { key: 'all', label: '全部', count: 0 },
      { key: 'pending', label: '待支付', count: 0 },
      { key: 'paid', label: '待发货', count: 0 },
      { key: 'shipped', label: '待收货', count: 0 },
      { key: 'completed', label: '已完成', count: 0 },
      { key: 'cancelled', label: '已取消', count: 0 }
    ])
    
    // 计算属性
    const filteredOrders = computed(() => {
      let filtered = orders.value
      
      // 按状态筛选
      if (activeTab.value !== 'all') {
        filtered = filtered.filter(order => order.status === activeTab.value)
      }
      
      // 按关键词搜索
      if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.orderNumber.toLowerCase().includes(keyword) ||
          order.items.some(item => item.name.toLowerCase().includes(keyword))
        )
      }
      
      return filtered
    })
    
    // 方法
    const loadOrders = async () => {
      loading.value = true
      
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟订单数据
        orders.value = [
          {
            id: 1,
            orderNumber: 'PC202312150001',
            status: 'shipped',
            createTime: new Date('2023-12-15 14:30:00'),
            totalAmount: 11998,
            items: [
              {
                id: 1,
                name: 'ROG STRIX RTX 4080 显卡',
                spec: '16GB GDDR6X',
                price: 8999,
                quantity: 1,
                image: '/src/assets/images/products/gpu-rtx4090.svg'
              }
            ],
            logistics: {
              company: '顺丰速运',
              trackingNumber: 'SF1234567890',
              latestStatus: '快件已到达【北京朝阳分拣中心】'
            }
          },
          {
            id: 2,
            orderNumber: 'PC202312140001',
            status: 'completed',
            createTime: new Date('2023-12-14 10:15:00'),
            totalAmount: 1299,
            items: [
              {
                id: 3,
                name: 'Kingston FURY 32GB DDR4',
                spec: '3200MHz 套装',
                price: 1299,
                quantity: 1,
                image: '/src/assets/images/products/memory-ddr5.svg'
              }
            ]
          }
        ]
        
        // 更新标签计数
        updateTabCounts()
      } catch (error) {
        console.error('加载订单失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const updateTabCounts = () => {
      orderTabs.value.forEach(tab => {
        if (tab.key === 'all') {
          tab.count = orders.value.length
        } else {
          tab.count = orders.value.filter(order => order.status === tab.key).length
        }
      })
    }
    
    const switchTab = (tabKey) => {
      activeTab.value = tabKey
    }
    
    const searchOrders = () => {
      // 搜索逻辑已在 computed 中处理
    }
    
    const formatDate = (date) => {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        pending: '待支付',
        paid: '待发货',
        shipped: '待收货',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知状态'
    }
    
    const getStatusClass = (status) => {
      const classMap = {
        pending: 'status-pending',
        paid: 'status-paid',
        shipped: 'status-shipped',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
      }
      return classMap[status] || ''
    }
    
    const viewOrderDetail = (order) => {
      console.log('查看订单详情:', order)
    }
    
    const payOrder = (order) => {
      console.log('支付订单:', order)
    }
    
    const cancelOrder = (order) => {
      console.log('取消订单:', order)
    }
    
    const confirmReceived = (order) => {
      console.log('确认收货:', order)
    }
    
    const trackOrder = (order) => {
      console.log('查看物流:', order)
    }
    
    const reviewOrder = (order) => {
      console.log('评价订单:', order)
    }
    
    const buyAgain = (order) => {
      console.log('再次购买:', order)
    }
    
    // 生命周期
    onMounted(() => {
      loadOrders()
    })
    
    return {
      loading,
      searchKeyword,
      activeTab,
      orderTabs,
      filteredOrders,
      switchTab,
      searchOrders,
      formatDate,
      getStatusText,
      getStatusClass,
      viewOrderDetail,
      payOrder,
      cancelOrder,
      confirmReceived,
      trackOrder,
      reviewOrder,
      buyAgain
    }
  }
}
</script>

<style scoped>
.orders-page {
  padding: var(--spacing-xl) 0;
  min-height: 80vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.search-input {
  padding: var(--spacing-md);
  border: none;
  outline: none;
  font-size: var(--font-size-base);
  width: 300px;
}

.search-btn {
  padding: var(--spacing-md);
  background: var(--color-accent-blue);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: var(--color-primary);
}

/* 订单标签 */
.order-tabs {
  display: flex;
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--color-gray-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.tab-btn:hover {
  background: var(--color-gray-light);
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-accent-blue);
  color: var(--color-white);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  min-width: 18px;
  text-align: center;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-gray);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  color: var(--color-gray);
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-gray-dark);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.order-card:hover {
  box-shadow: var(--shadow-md);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.order-info {
  display: flex;
  gap: var(--spacing-lg);
}

.order-number {
  font-weight: 600;
  color: var(--color-primary);
}

.order-date {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.status-pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-paid {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-accent-blue);
}

.status-shipped {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-completed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-accent-red);
}

/* 订单商品 */
.order-items {
  margin-bottom: var(--spacing-lg);
}

.order-item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.item-spec {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--spacing-sm);
}

.item-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-weight: 600;
  color: var(--color-accent-red);
}

.item-qty {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

/* 订单金额 */
.order-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-md);
}

.amount-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.amount-label {
  color: var(--color-gray-dark);
}

.amount-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-accent-red);
}

.items-count {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

/* 订单操作 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

/* 物流信息 */
.logistics-info {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: rgba(59, 130, 246, 0.05);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-accent-blue);
}

.logistics-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.logistics-status {
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .orders-page {
    padding: var(--spacing-lg) 0;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .search-input {
    width: 250px;
  }
  
  .order-tabs {
    padding: var(--spacing-xs);
  }
  
  .tab-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
  
  .order-card {
    padding: var(--spacing-lg);
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .order-info {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .order-amount {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .order-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 200px;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-price-qty {
    justify-content: center;
    gap: var(--spacing-md);
  }
}
</style>