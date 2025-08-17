<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">购物车</h1>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span class="current">购物车</span>
        </nav>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3>购物车是空的</h3>
        <p>快去挑选您喜欢的商品吧！</p>
        <router-link to="/products" class="btn btn-primary">去购物</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-main">
          <!-- 购物车头部 -->
          <div class="cart-header">
            <div class="select-all">
              <label class="checkbox-label">
                <input 
                  v-model="selectAll"
                  type="checkbox"
                  class="checkbox"
                  @change="toggleSelectAll"
                >
                <span class="checkmark"></span>
                <span>全选</span>
              </label>
            </div>
            <div class="cart-actions">
              <button 
                class="btn-text"
                :disabled="selectedItems.length === 0"
                @click="removeSelectedItems"
              >
                删除选中商品
              </button>
              <button class="btn-text" @click="clearCart">清空购物车</button>
            </div>
          </div>

          <!-- 购物车商品列表 -->
          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
              :class="{ 'out-of-stock': !item.product.inStock }"
            >
              <div class="item-select">
                <label class="checkbox-label">
                  <input 
                    v-model="selectedItems"
                    :value="item.id"
                    type="checkbox"
                    class="checkbox"
                    :disabled="!item.product.inStock"
                  >
                  <span class="checkmark"></span>
                </label>
              </div>

              <div class="item-image">
                <router-link :to="`/product/${item.product.id}`">
                  <img :src="item.product.image" :alt="item.product.name" />
                </router-link>
              </div>

              <div class="item-info">
                <router-link :to="`/product/${item.product.id}`" class="item-name">
                  {{ item.product.name }}
                </router-link>
                <div v-if="item.variants" class="item-variants">
                  <span
                    v-for="(value, key) in item.variants"
                    :key="key"
                    class="variant-tag"
                  >
                    {{ key }}: {{ value }}
                  </span>
                </div>
                <div class="item-status">
                  <span v-if="item.product.inStock" class="in-stock">现货</span>
                  <span v-else class="out-of-stock">缺货</span>
                </div>
              </div>

              <div class="item-price">
                <span class="current-price">¥{{ item.product.price.toLocaleString() }}</span>
                <span v-if="item.product.originalPrice" class="original-price">
                  ¥{{ item.product.originalPrice.toLocaleString() }}
                </span>
              </div>

              <div class="item-quantity">
                <div class="quantity-controls">
                  <button 
                    class="quantity-btn"
                    :disabled="item.quantity <= 1 || !item.product.inStock"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                  >-</button>
                  <input 
                    :value="item.quantity"
                    type="number"
                    min="1"
                    max="99"
                    class="quantity-input"
                    :disabled="!item.product.inStock"
                    @change="updateQuantity(item.id, parseInt($event.target.value))"
                  />
                  <button 
                    class="quantity-btn"
                    :disabled="item.quantity >= 99 || !item.product.inStock"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                  >+</button>
                </div>
              </div>

              <div class="item-total">
                <span class="total-price">
                  ¥{{ (item.product.price * item.quantity).toLocaleString() }}
                </span>
              </div>

              <div class="item-actions">
                <button 
                  class="action-btn"
                  @click="toggleFavorite(item.id)"
                  :title="item.isFavorite ? '取消收藏' : '移入收藏'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button 
                  class="action-btn"
                  @click="removeItem(item.id)"
                  title="删除"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 推荐商品 -->
          <div class="recommended-products">
            <h3>为您推荐</h3>
            <div class="products-grid">
              <div
                v-for="product in recommendedProducts"
                :key="product.id"
                class="recommended-item"
              >
                <router-link :to="`/product/${product.id}`" class="product-link">
                  <img :src="product.image" :alt="product.name" />
                  <div class="product-info">
                    <h4>{{ product.name }}</h4>
                    <div class="product-price">
                      <span class="price">¥{{ product.price.toLocaleString() }}</span>
                      <span v-if="product.originalPrice" class="original-price">
                        ¥{{ product.originalPrice.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </router-link>
                <button 
                  class="btn btn-sm btn-secondary add-to-cart-btn"
                  @click="addRecommendedToCart(product)"
                >
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 购物车侧边栏 -->
        <div class="cart-sidebar">
          <div class="cart-summary">
            <h3>订单摘要</h3>
            
            <div class="summary-item">
              <span>商品件数：</span>
              <span>{{ selectedItemsCount }}件</span>
            </div>
            
            <div class="summary-item">
              <span>商品总价：</span>
              <span>¥{{ subtotal.toLocaleString() }}</span>
            </div>
            
            <div v-if="discount > 0" class="summary-item discount">
              <span>优惠金额：</span>
              <span>-¥{{ discount.toLocaleString() }}</span>
            </div>
            
            <div class="summary-item shipping">
              <span>运费：</span>
              <span v-if="shippingFee === 0" class="free-shipping">免运费</span>
              <span v-else>¥{{ shippingFee.toLocaleString() }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-total">
              <span>应付总额：</span>
              <span class="total-amount">¥{{ total.toLocaleString() }}</span>
            </div>

            <!-- 优惠券 -->
            <div class="coupon-section">
              <div class="coupon-input">
                <input 
                  v-model="couponCode"
                  type="text"
                  placeholder="请输入优惠券代码"
                  class="coupon-field"
                >
                <button 
                  class="btn btn-sm btn-secondary"
                  @click="applyCoupon"
                  :disabled="!couponCode.trim()"
                >
                  使用
                </button>
              </div>
              <div v-if="appliedCoupon" class="applied-coupon">
                <span class="coupon-name">{{ appliedCoupon.name }}</span>
                <button class="remove-coupon" @click="removeCoupon">×</button>
              </div>
            </div>

            <!-- 结算按钮 -->
            <div class="checkout-section">
              <button 
                class="btn btn-primary btn-lg checkout-btn"
                :disabled="selectedItems.length === 0 || hasOutOfStockItems"
                @click="goToCheckout"
              >
                去结算 ({{ selectedItemsCount }})
              </button>
              <p v-if="hasOutOfStockItems" class="checkout-warning">
                购物车中有缺货商品，请移除后再结算
              </p>
            </div>
          </div>

          <!-- 购物保障 -->
          <div class="shopping-guarantee">
            <h4>购物保障</h4>
            <div class="guarantee-list">
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>正品保证</span>
              </div>
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                <span>7天无理由退货</span>
              </div>
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <span>全国联保</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../stores/cart.js'

export default {
  name: 'Cart',
  setup() {
    const router = useRouter()
    const { cartItems, addToCart: addToCartStore, removeFromCart, updateQuantity: updateCartQuantity, clearCart: clearCartStore } = useCart()
    
    // API配置
    const API_BASE = 'http://localhost:3001/api'
    
    // 响应式数据
    const selectedItems = ref([])
    const couponCode = ref('')
    const appliedCoupon = ref(null)
    const recommendedProducts = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    // API调用函数
    const fetchRecommendedProducts = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await fetch(`${API_BASE}/products/featured`)
        if (!response.ok) throw new Error('获取推荐商品失败')
        const data = await response.json()
        recommendedProducts.value = data.data?.slice(0, 4) || []
      } catch (err) {
        error.value = err.message
        console.error('获取推荐商品失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    // 初始化选中项目（选中所有有库存的商品）
    const initSelectedItems = () => {
      selectedItems.value = cartItems.value
        .filter(item => item.product.inStock)
        .map(item => item.id)
    }
    
    // 计算属性
    const selectAll = computed({
      get: () => {
        const availableItems = cartItems.value.filter(item => item.product.inStock)
        return availableItems.length > 0 && 
               availableItems.every(item => selectedItems.value.includes(item.id))
      },
      set: (value) => {
        if (value) {
          selectedItems.value = cartItems.value
            .filter(item => item.product.inStock)
            .map(item => item.id)
        } else {
          selectedItems.value = []
        }
      }
    })
    
    const selectedItemsCount = computed(() => {
      return cartItems.value
        .filter(item => selectedItems.value.includes(item.id))
        .reduce((total, item) => total + item.quantity, 0)
    })
    
    const subtotal = computed(() => {
      return cartItems.value
        .filter(item => selectedItems.value.includes(item.id))
        .reduce((total, item) => total + (item.product.price * item.quantity), 0)
    })
    
    const discount = computed(() => {
      let discountAmount = 0
      
      // 应用优惠券折扣
      if (appliedCoupon.value) {
        if (appliedCoupon.value.type === 'percentage') {
          discountAmount += subtotal.value * (appliedCoupon.value.value / 100)
        } else if (appliedCoupon.value.type === 'fixed') {
          discountAmount += appliedCoupon.value.value
        }
      }
      
      return Math.min(discountAmount, subtotal.value)
    })
    
    const shippingFee = computed(() => {
      // 满299免运费
      return subtotal.value >= 299 ? 0 : 15
    })
    
    const total = computed(() => {
      return Math.max(0, subtotal.value - discount.value + shippingFee.value)
    })
    
    const hasOutOfStockItems = computed(() => {
      return cartItems.value
        .filter(item => selectedItems.value.includes(item.id))
        .some(item => !item.product.inStock)
    })
    
    // 方法
    const toggleSelectAll = () => {
      // selectAll 的 setter 会自动处理
    }
    
    const updateQuantity = (itemId, newQuantity) => {
      if (newQuantity < 1 || newQuantity > 99) return
      updateCartQuantity(itemId, newQuantity)
    }
    
    const removeItem = (itemId) => {
      removeFromCart(itemId)
      // 从选中列表中移除
      const selectedIndex = selectedItems.value.indexOf(itemId)
      if (selectedIndex > -1) {
        selectedItems.value.splice(selectedIndex, 1)
      }
    }
    
    const removeSelectedItems = () => {
      selectedItems.value.forEach(itemId => {
        removeFromCart(itemId)
      })
      selectedItems.value = []
    }
    
    const clearCart = () => {
      if (confirm('确定要清空购物车吗？')) {
        clearCartStore()
        selectedItems.value = []
      }
    }
    
    const toggleFavorite = (itemId) => {
      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.isFavorite = !item.isFavorite
        // 这里可以调用 API 更新收藏状态
      }
    }
    
    const applyCoupon = () => {
      // 模拟优惠券验证
      const coupons = {
        'SAVE10': { name: '新用户优惠券', type: 'percentage', value: 10 },
        'SAVE100': { name: '满减优惠券', type: 'fixed', value: 100 }
      }
      
      const coupon = coupons[couponCode.value.toUpperCase()]
      if (coupon) {
        appliedCoupon.value = coupon
        couponCode.value = ''
      } else {
        alert('优惠券代码无效')
      }
    }
    
    const removeCoupon = () => {
      appliedCoupon.value = null
    }
    
    const addRecommendedToCart = (product) => {
      // 使用全局购物车状态添加商品
      addToCartStore(product, {}, 1)
      alert('商品已添加到购物车')
    }
    
    const goToCheckout = () => {
      if (selectedItems.value.length === 0) return
      
      // 将选中的商品信息传递给结算页面
      const checkoutItems = cartItems.value.filter(item => selectedItems.value.includes(item.id))
      
      // 这里可以使用 Pinia store 来存储结算信息
      // 或者通过路由参数传递
      router.push({
        path: '/checkout',
        query: {
          items: JSON.stringify(checkoutItems.map(item => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            variants: item.variants
          })))
        }
      })
    }
   // 生命周期
    onMounted(() => {
      initSelectedItems()
      fetchRecommendedProducts()
    })
    
    // 监听购物车变化，更新选中项目
    watch(cartItems, () => {
      // 移除不存在的选中项目
      selectedItems.value = selectedItems.value.filter(id => 
        cartItems.value.some(item => item.id === id)
      )
    }, { deep: true })
    
    return {
      cartItems,
      selectedItems,
      couponCode,
      appliedCoupon,
      recommendedProducts,
      loading,
      error,
      selectAll,
      selectedItemsCount,
      subtotal,
      discount,
      shippingFee,
      total,
      hasOutOfStockItems,
      toggleSelectAll,
      updateQuantity,
      removeItem,
      removeSelectedItems,
      clearCart,
      toggleFavorite,
      applyCoupon,
      removeCoupon,
      addRecommendedToCart,
      goToCheckout
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: var(--spacing-xl) 0;
  min-height: 60vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.breadcrumb a {
  color: var(--color-accent-blue);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--color-gray);
}

.current {
  color: var(--color-gray);
}

/* 空购物车状态 */
.empty-cart {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  margin-bottom: var(--spacing-lg);
  color: var(--color-gray);
}

.empty-cart h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.empty-cart p {
  color: var(--color-gray);
  margin-bottom: var(--spacing-lg);
}

/* 购物车内容 */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-2xl);
}

.cart-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 购物车头部 */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.select-all {
  display: flex;
  align-items: center;
}

.cart-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-accent-blue);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.btn-text:hover:not(:disabled) {
  color: var(--color-primary);
}

.btn-text:disabled {
  color: var(--color-gray);
  cursor: not-allowed;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  position: relative;
  transition: all var(--transition-fast);
}

.checkbox:checked + .checkmark {
  background: var(--color-accent-blue);
  border-color: var(--color-accent-blue);
}

.checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:disabled + .checkmark {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 购物车商品列表 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item {
  display: grid;
  grid-template-columns: auto 100px 1fr auto auto auto auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: opacity var(--transition-fast);
}

.cart-item.out-of-stock {
  opacity: 0.6;
}

.item-select {
  display: flex;
  align-items: center;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.item-name {
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-base);
}

.item-name:hover {
  color: var(--color-accent-blue);
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.variant-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-gray-dark);
}

.item-status .in-stock {
  color: #10b981;
  font-size: var(--font-size-xs);
}

.item-status .out-of-stock {
  color: var(--color-accent-red);
  font-size: var(--font-size-xs);
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.current-price {
  font-weight: 600;
  color: var(--color-accent-red);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  text-decoration: line-through;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  transition: background-color var(--transition-fast);
}

.quantity-btn:hover:not(:disabled) {
  background: var(--color-gray-light);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-size: var(--font-size-sm);
}

.item-total {
  text-align: right;
}

.total-price {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-accent-blue);
  color: var(--color-accent-blue);
}

/* 推荐商品 */
.recommended-products {
  background: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.recommended-products h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.recommended-item {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}

.recommended-item:hover {
  box-shadow: var(--shadow-md);
}

.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recommended-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.recommended-item .product-info {
  padding: var(--spacing-md);
}

.recommended-item h4 {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.recommended-item .product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.recommended-item .price {
  font-weight: 600;
  color: var(--color-accent-red);
}

.recommended-item .original-price {
  font-size: var(--font-size-xs);
  color: var(--color-gray);
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  margin: 0 var(--spacing-md) var(--spacing-md);
}

/* 购物车侧边栏 */
.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.cart-summary {
  background: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.cart-summary h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.summary-item.discount {
  color: var(--color-accent-red);
}

.summary-item.shipping .free-shipping {
  color: #10b981;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-lg) 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.total-amount {
  color: var(--color-accent-red);
  font-size: var(--font-size-xl);
}

/* 优惠券部分 */
.coupon-section {
  margin-bottom: var(--spacing-lg);
}

.coupon-input {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.coupon-field {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--color-accent-blue);
  color: var(--color-white);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.coupon-name {
  font-weight: 600;
}

.remove-coupon {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  font-size: var(--font-size-lg);
  line-height: 1;
}

/* 结算部分 */
.checkout-section {
  text-align: center;
}

.checkout-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.checkout-warning {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-accent-red);
}

/* 购物保障 */
.shopping-guarantee {
  background: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.shopping-guarantee h4 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.guarantee-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
}

.guarantee-item svg {
  color: var(--color-accent-blue);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    order: -1;
  }

  .cart-item {
    grid-template-columns: auto 80px 1fr;
    grid-template-areas: 
      "select image info"
      "select image price"
      "select image quantity"
      "select image total"
      "select image actions";
    gap: var(--spacing-sm);
  }

  .item-select { grid-area: select; }
  .item-image { grid-area: image; width: 80px; height: 80px; }
  .item-info { grid-area: info; }
  .item-price { grid-area: price; align-items: flex-start; }
  .item-quantity { grid-area: quantity; }
  .item-total { grid-area: total; text-align: left; }
  .item-actions { 
    grid-area: actions; 
    flex-direction: row; 
    justify-content: flex-start;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .cart-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>