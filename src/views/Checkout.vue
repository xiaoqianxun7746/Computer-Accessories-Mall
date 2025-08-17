<template>
  <div class="checkout-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <nav class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <router-link to="/cart">购物车</router-link>
        <span class="separator">/</span>
        <span class="current">结算</span>
      </nav>

      <div class="checkout-content">
        <div class="checkout-main">
          <!-- 收货地址 -->
          <div class="section address-section">
            <div class="section-header">
              <h2>收货地址</h2>
              <button @click="showAddressModal = true" class="btn btn-secondary btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                新增地址
              </button>
            </div>
            
            <div v-if="addresses.length === 0" class="empty-address">
              <p>您还没有收货地址，请先添加地址</p>
              <button @click="showAddressModal = true" class="btn btn-primary">添加收货地址</button>
            </div>
            
            <div v-else class="address-list">
              <div 
                v-for="address in addresses" 
                :key="address.id"
                class="address-item"
                :class="{ active: selectedAddressId === address.id }"
                @click="selectedAddressId = address.id"
              >
                <div class="address-info">
                  <div class="recipient">
                    <span class="name">{{ address.name }}</span>
                    <span class="phone">{{ address.phone }}</span>
                    <span v-if="address.isDefault" class="default-tag">默认</span>
                  </div>
                  <div class="address-detail">
                    {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                  </div>
                </div>
                <div class="address-actions">
                  <button @click.stop="editAddress(address)" class="action-btn">编辑</button>
                  <button @click.stop="deleteAddress(address.id)" class="action-btn">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 配送方式 -->
          <div class="section delivery-section">
            <h2>配送方式</h2>
            <div class="delivery-options">
              <label 
                v-for="option in deliveryOptions" 
                :key="option.id"
                class="delivery-option"
                :class="{ active: selectedDeliveryId === option.id }"
              >
                <input 
                  type="radio" 
                  :value="option.id" 
                  v-model="selectedDeliveryId"
                  class="delivery-radio"
                >
                <div class="option-content">
                  <div class="option-info">
                    <span class="option-name">{{ option.name }}</span>
                    <span class="option-time">{{ option.time }}</span>
                  </div>
                  <div class="option-price">
                    {{ option.price === 0 ? '免费' : `¥${option.price}` }}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- 支付方式 -->
          <div class="section payment-section">
            <h2>支付方式</h2>
            <div class="payment-methods">
              <label 
                v-for="method in paymentMethods" 
                :key="method.id"
                class="payment-method"
                :class="{ active: selectedPaymentId === method.id }"
              >
                <input 
                  type="radio" 
                  :value="method.id" 
                  v-model="selectedPaymentId"
                  class="payment-radio"
                >
                <div class="method-content">
                  <div class="method-icon">
                    <img :src="method.icon" :alt="method.name">
                  </div>
                  <span class="method-name">{{ method.name }}</span>
                  <span v-if="method.discount" class="method-discount">{{ method.discount }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 发票信息 -->
          <div class="section invoice-section">
            <div class="section-header">
              <h2>发票信息</h2>
              <label class="invoice-toggle">
                <input type="checkbox" v-model="needInvoice">
                <span class="toggle-text">需要发票</span>
              </label>
            </div>
            
            <div v-if="needInvoice" class="invoice-form">
              <div class="form-row">
                <div class="form-group">
                  <label>发票类型</label>
                  <select v-model="invoiceInfo.type" class="form-select">
                    <option value="personal">个人</option>
                    <option value="company">企业</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>发票抬头</label>
                  <input 
                    type="text" 
                    v-model="invoiceInfo.title" 
                    placeholder="请输入发票抬头"
                    class="form-input"
                  >
                </div>
              </div>
              <div v-if="invoiceInfo.type === 'company'" class="form-row">
                <div class="form-group">
                  <label>纳税人识别号</label>
                  <input 
                    type="text" 
                    v-model="invoiceInfo.taxNumber" 
                    placeholder="请输入纳税人识别号"
                    class="form-input"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 备注信息 -->
          <div class="section note-section">
            <h2>备注信息</h2>
            <textarea 
              v-model="orderNote" 
              placeholder="如有特殊要求，请在此留言（选填）"
              class="note-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- 订单摘要 -->
        <div class="checkout-sidebar">
          <div class="order-summary">
            <h3>订单摘要</h3>
            
            <!-- 商品列表 -->
            <div class="summary-items">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="summary-item"
              >
                <img :src="item.image" :alt="item.name" class="item-image">
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-spec">{{ item.spec }}</p>
                  <div class="item-price-qty">
                    <span class="item-price">¥{{ item.price }}</span>
                    <span class="item-qty">×{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 优惠券 -->
            <div class="coupon-section">
              <div class="coupon-input">
                <input 
                  type="text" 
                  v-model="couponCode" 
                  placeholder="请输入优惠券代码"
                  class="coupon-field"
                >
                <button @click="applyCoupon" class="btn btn-secondary btn-sm">使用</button>
              </div>
              <div v-if="appliedCoupon" class="applied-coupon">
                <span class="coupon-name">{{ appliedCoupon.name }}</span>
                <span class="coupon-discount">-¥{{ appliedCoupon.discount }}</span>
                <button @click="removeCoupon" class="remove-coupon">×</button>
              </div>
            </div>

            <!-- 价格明细 -->
            <div class="price-details">
              <div class="price-row">
                <span>商品总价</span>
                <span>¥{{ subtotal }}</span>
              </div>
              <div class="price-row">
                <span>运费</span>
                <span>{{ shippingFee === 0 ? '免费' : `¥${shippingFee}` }}</span>
              </div>
              <div v-if="appliedCoupon" class="price-row discount">
                <span>优惠券</span>
                <span>-¥{{ appliedCoupon.discount }}</span>
              </div>
              <div class="price-row total">
                <span>应付总额</span>
                <span class="total-amount">¥{{ totalAmount }}</span>
              </div>
            </div>

            <!-- 提交订单 -->
            <button 
              @click="submitOrder" 
              class="btn btn-primary btn-lg submit-btn"
              :disabled="!canSubmit || isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : `提交订单 ¥${totalAmount}` }}
            </button>

            <!-- 购物保障 -->
            <div class="shopping-guarantee">
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>正品保障</span>
              </div>
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span>7天无理由退货</span>
              </div>
              <div class="guarantee-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>快速配送</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 地址弹窗 -->
    <div v-if="showAddressModal" class="modal-overlay" @click="closeAddressModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingAddress ? '编辑地址' : '新增地址' }}</h3>
          <button @click="closeAddressModal" class="modal-close">×</button>
        </div>
        <form @submit.prevent="saveAddress" class="address-form">
          <div class="form-row">
            <div class="form-group">
              <label>收货人姓名 *</label>
              <input 
                type="text" 
                v-model="addressForm.name" 
                placeholder="请输入收货人姓名"
                class="form-input"
                required
              >
            </div>
            <div class="form-group">
              <label>手机号码 *</label>
              <input 
                type="tel" 
                v-model="addressForm.phone" 
                placeholder="请输入手机号码"
                class="form-input"
                required
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>省份 *</label>
              <select v-model="addressForm.province" class="form-select" required>
                <option value="">请选择省份</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广东省">广东省</option>
                <option value="浙江省">浙江省</option>
                <option value="江苏省">江苏省</option>
              </select>
            </div>
            <div class="form-group">
              <label>城市 *</label>
              <select v-model="addressForm.city" class="form-select" required>
                <option value="">请选择城市</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广州市">广州市</option>
                <option value="深圳市">深圳市</option>
                <option value="杭州市">杭州市</option>
              </select>
            </div>
            <div class="form-group">
              <label>区县 *</label>
              <select v-model="addressForm.district" class="form-select" required>
                <option value="">请选择区县</option>
                <option value="朝阳区">朝阳区</option>
                <option value="海淀区">海淀区</option>
                <option value="黄浦区">黄浦区</option>
                <option value="浦东新区">浦东新区</option>
                <option value="天河区">天河区</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>详细地址 *</label>
            <textarea 
              v-model="addressForm.detail" 
              placeholder="请输入详细地址，如街道、门牌号等"
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="addressForm.isDefault">
              <span>设为默认地址</span>
            </label>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeAddressModal" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Checkout',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const addresses = ref([])
    const selectedAddressId = ref(null)
    const selectedDeliveryId = ref(1)
    const selectedPaymentId = ref(1)
    const needInvoice = ref(false)
    const orderNote = ref('')
    const couponCode = ref('')
    const appliedCoupon = ref(null)
    const isSubmitting = ref(false)
    const showAddressModal = ref(false)
    const editingAddress = ref(null)
    
    // 表单数据
    const invoiceInfo = ref({
      type: 'personal',
      title: '',
      taxNumber: ''
    })
    
    const addressForm = ref({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    })
    
    // 模拟数据
    const cartItems = ref([
      {
        id: 1,
        name: 'ROG STRIX RTX 4080 显卡',
        spec: '16GB GDDR6X',
        price: 8999,
        quantity: 1,
        image: '/src/assets/images/products/gpu-rtx4090.svg'
      },
      {
        id: 2,
        name: 'Intel Core i7-13700K',
        spec: '16核24线程',
        price: 2999,
        quantity: 1,
        image: '/src/assets/images/products/cpu-intel-i9.svg'
      }
    ])
    
    const deliveryOptions = ref([
      { id: 1, name: '标准配送', time: '3-5个工作日', price: 0 },
      { id: 2, name: '次日达', time: '次日送达', price: 15 },
      { id: 3, name: '当日达', time: '当日送达', price: 25 }
    ])
    
    const paymentMethods = ref([
      { id: 1, name: '支付宝', icon: '/src/assets/images/payment/alipay.svg', discount: null },
      { id: 2, name: '微信支付', icon: '/src/assets/images/payment/wechat.svg', discount: null },
      { id: 3, name: '银行卡', icon: '/src/assets/images/payment/bank-card.svg', discount: null },
      { id: 4, name: '花呗', icon: '/src/assets/images/payment/alipay.svg', discount: '免息分期' }
    ])
    
    // 计算属性
    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })
    
    const shippingFee = computed(() => {
      const selectedOption = deliveryOptions.value.find(option => option.id === selectedDeliveryId.value)
      return selectedOption ? selectedOption.price : 0
    })
    
    const totalAmount = computed(() => {
      let total = subtotal.value + shippingFee.value
      if (appliedCoupon.value) {
        total -= appliedCoupon.value.discount
      }
      return Math.max(0, total)
    })
    
    const canSubmit = computed(() => {
      return selectedAddressId.value && selectedDeliveryId.value && selectedPaymentId.value
    })
    
    // 方法
    const loadAddresses = () => {
      // 模拟加载地址数据
      addresses.value = [
        {
          id: 1,
          name: '张三',
          phone: '138****8888',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '三里屯街道工体北路8号院',
          isDefault: true
        }
      ]
      
      if (addresses.value.length > 0) {
        selectedAddressId.value = addresses.value.find(addr => addr.isDefault)?.id || addresses.value[0].id
      }
    }
    
    const editAddress = (address) => {
      editingAddress.value = address
      addressForm.value = { ...address }
      showAddressModal.value = true
    }
    
    const deleteAddress = (addressId) => {
      if (confirm('确定要删除这个地址吗？')) {
        addresses.value = addresses.value.filter(addr => addr.id !== addressId)
        if (selectedAddressId.value === addressId) {
          selectedAddressId.value = addresses.value[0]?.id || null
        }
      }
    }
    
    const closeAddressModal = () => {
      showAddressModal.value = false
      editingAddress.value = null
      addressForm.value = {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      }
    }
    
    const saveAddress = () => {
      if (editingAddress.value) {
        // 编辑地址
        const index = addresses.value.findIndex(addr => addr.id === editingAddress.value.id)
        if (index !== -1) {
          addresses.value[index] = { ...addressForm.value, id: editingAddress.value.id }
        }
      } else {
        // 新增地址
        const newAddress = {
          ...addressForm.value,
          id: Date.now()
        }
        addresses.value.push(newAddress)
        selectedAddressId.value = newAddress.id
      }
      
      // 如果设为默认地址，取消其他地址的默认状态
      if (addressForm.value.isDefault) {
        addresses.value.forEach(addr => {
          if (addr.id !== (editingAddress.value?.id || Date.now())) {
            addr.isDefault = false
          }
        })
      }
      
      closeAddressModal()
    }
    
    const applyCoupon = () => {
      if (!couponCode.value.trim()) return
      
      // 模拟优惠券验证
      const coupons = {
        'SAVE100': { name: '满减优惠券', discount: 100 },
        'FIRST50': { name: '新用户优惠券', discount: 50 },
        'VIP200': { name: 'VIP专享券', discount: 200 }
      }
      
      const coupon = coupons[couponCode.value.toUpperCase()]
      if (coupon) {
        appliedCoupon.value = coupon
        couponCode.value = ''
      } else {
        alert('优惠券无效或已过期')
      }
    }
    
    const removeCoupon = () => {
      appliedCoupon.value = null
    }
    
    const submitOrder = async () => {
      if (!canSubmit.value) return
      
      isSubmitting.value = true
      
      try {
        // 模拟提交订单
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 构建订单数据
        const orderData = {
          items: cartItems.value,
          address: addresses.value.find(addr => addr.id === selectedAddressId.value),
          delivery: deliveryOptions.value.find(option => option.id === selectedDeliveryId.value),
          payment: paymentMethods.value.find(method => method.id === selectedPaymentId.value),
          invoice: needInvoice.value ? invoiceInfo.value : null,
          note: orderNote.value,
          coupon: appliedCoupon.value,
          subtotal: subtotal.value,
          shippingFee: shippingFee.value,
          totalAmount: totalAmount.value
        }
        
        console.log('订单数据:', orderData)
        
        // 跳转到支付页面或订单成功页面
        alert('订单提交成功！')
        router.push('/orders')
        
      } catch (error) {
        console.error('提交订单失败:', error)
        alert('订单提交失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }
    
    // 生命周期
    onMounted(() => {
      loadAddresses()
    })
    
    return {
      addresses,
      selectedAddressId,
      selectedDeliveryId,
      selectedPaymentId,
      needInvoice,
      orderNote,
      couponCode,
      appliedCoupon,
      isSubmitting,
      showAddressModal,
      editingAddress,
      invoiceInfo,
      addressForm,
      cartItems,
      deliveryOptions,
      paymentMethods,
      subtotal,
      shippingFee,
      totalAmount,
      canSubmit,
      editAddress,
      deleteAddress,
      closeAddressModal,
      saveAddress,
      applyCoupon,
      removeCoupon,
      submitOrder
    }
  }
}
</script>

<style scoped>
.checkout-page {
  padding: var(--spacing-xl) 0;
}

.breadcrumb {
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.breadcrumb a {
  color: var(--color-accent-blue);
  text-decoration: none;
}

.breadcrumb .separator {
  margin: 0 var(--spacing-sm);
}

.breadcrumb .current {
  color: var(--color-primary);
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-2xl);
}

/* 主要内容区域 */
.checkout-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.section {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

/* 地址部分 */
.empty-address {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-gray);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.address-item:hover {
  border-color: var(--color-accent-blue);
}

.address-item.active {
  border-color: var(--color-accent-blue);
  background: rgba(59, 130, 246, 0.05);
}

.recipient {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.recipient .name {
  font-weight: 600;
  color: var(--color-primary);
}

.recipient .phone {
  color: var(--color-gray);
}

.default-tag {
  background: var(--color-accent-blue);
  color: var(--color-white);
  padding: 2px var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
}

.address-detail {
  color: var(--color-gray-dark);
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  background: none;
  border: none;
  color: var(--color-accent-blue);
  cursor: pointer;
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs);
}

.action-btn:hover {
  color: var(--color-primary);
}

/* 配送方式 */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.delivery-option {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.delivery-option:hover {
  border-color: var(--color-accent-blue);
}

.delivery-option.active {
  border-color: var(--color-accent-blue);
  background: rgba(59, 130, 246, 0.05);
}

.delivery-radio {
  margin-right: var(--spacing-md);
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-name {
  font-weight: 600;
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.option-time {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

.option-price {
  font-weight: 600;
  color: var(--color-accent-blue);
}

/* 支付方式 */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.payment-method {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.payment-method:hover {
  border-color: var(--color-accent-blue);
}

.payment-method.active {
  border-color: var(--color-accent-blue);
  background: rgba(59, 130, 246, 0.05);
}

.payment-radio {
  margin-right: var(--spacing-md);
}

.method-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.method-icon img {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
}

.method-name {
  font-weight: 600;
  color: var(--color-primary);
}

.method-discount {
  color: var(--color-accent-red);
  font-size: var(--font-size-xs);
  background: rgba(239, 68, 68, 0.1);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

/* 发票信息 */
.invoice-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.invoice-form {
  margin-top: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 备注信息 */
.note-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
  resize: vertical;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 侧边栏 */
.checkout-sidebar {
  position: sticky;
  top: var(--spacing-xl);
  height: fit-content;
}

.order-summary {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.order-summary h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

/* 商品列表 */
.summary-items {
  margin-bottom: var(--spacing-lg);
}

.summary-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.item-spec {
  font-size: var(--font-size-xs);
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

/* 优惠券 */
.coupon-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-md);
}

.coupon-input {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
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
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--border-radius-sm);
  color: #10b981;
  font-size: var(--font-size-sm);
}

.remove-coupon {
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  font-size: var(--font-size-lg);
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 价格明细 */
.price-details {
  margin-bottom: var(--spacing-lg);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}

.price-row.discount {
  color: #10b981;
}

.price-row.total {
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.total-amount {
  color: var(--color-accent-red);
  font-size: var(--font-size-lg);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  margin-bottom: var(--spacing-lg);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 购物保障 */
.shopping-guarantee {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-gray);
}

.guarantee-item svg {
  color: var(--color-accent-blue);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.modal-header h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-gray);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .checkout-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: var(--spacing-lg) 0;
  }
  
  .section {
    padding: var(--spacing-lg);
  }
  
  .order-summary {
    padding: var(--spacing-lg);
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    padding: var(--spacing-lg);
    width: 95%;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .address-item {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .address-actions {
    align-self: flex-end;
  }
  
  .delivery-option,
  .payment-method {
    padding: var(--spacing-md);
  }
  
  .coupon-input {
    flex-direction: column;
  }
}
</style>