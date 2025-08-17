<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <nav class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <router-link to="/products">商品</router-link>
        <span class="separator">/</span>
        <span class="current">{{ product?.name || '商品详情' }}</span>
      </nav>

      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="!product" class="error-state">
        <h2>商品未找到</h2>
        <p>抱歉，您查找的商品不存在或已下架。</p>
        <router-link to="/products" class="btn btn-primary">返回商品列表</router-link>
      </div>

      <div v-else class="product-detail">
        <!-- 商品主要信息 -->
        <div class="product-main">
          <!-- 商品图片 -->
          <div class="product-images">
            <div class="main-image">
              <img :src="selectedImage" :alt="product?.name || '商品图片'" />
              <div v-if="product?.onSale" class="sale-badge">促销</div>
              <div v-if="product?.isNew" class="new-badge">新品</div>
            </div>
            <div class="image-thumbnails">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImageIndex === index }"
                @click="selectImage(index)"
              >
                <img :src="image" :alt="`${product?.name || '商品'} 图片 ${index + 1}`" />
              </button>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <div class="product-header">
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-rating">
                <div class="stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= Math.floor(product.rating) }"
                  >★</span>
                </div>
                <span class="rating-text">{{ product.rating }}</span>
                <span class="reviews-count">({{ product.reviews }}条评价)</span>
              </div>
            </div>

            <div class="product-price">
              <span class="current-price">¥{{ product.price.toLocaleString() }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice.toLocaleString() }}
              </span>
              <span v-if="product.originalPrice" class="discount">
                省¥{{ (product.originalPrice - product.price).toLocaleString() }}
              </span>
            </div>

            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>

            <!-- 规格选择 -->
            <div v-if="product.variants" class="product-variants">
              <div
                v-for="variant in product.variants"
                :key="variant.name"
                class="variant-group"
              >
                <h4 class="variant-title">{{ variant.name }}</h4>
                <div class="variant-options">
                  <button
                    v-for="option in variant.options"
                    :key="option.value"
                    class="variant-option"
                    :class="{ 
                      active: selectedVariants[variant.name] === option.value,
                      disabled: !option.available
                    }"
                    :disabled="!option.available"
                    @click="selectVariant(variant.name, option.value)"
                  >
                    {{ option.label }}
                    <span v-if="option.price" class="option-price">
                      +¥{{ option.price }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 库存状态 -->
            <div class="stock-status">
              <span v-if="product.inStock" class="in-stock">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                现货
              </span>
              <span v-else class="out-of-stock">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                缺货
              </span>
            </div>

            <!-- 数量选择和购买按钮 -->
            <div class="purchase-section">
              <div class="quantity-selector">
                <label>数量：</label>
                <div class="quantity-controls">
                  <button 
                    class="quantity-btn"
                    :disabled="quantity <= 1"
                    @click="decreaseQuantity"
                  >-</button>
                  <input 
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    max="99"
                    class="quantity-input"
                  />
                  <button 
                    class="quantity-btn"
                    :disabled="quantity >= 99"
                    @click="increaseQuantity"
                  >+</button>
                </div>
              </div>

              <div class="action-buttons">
                <button 
                  class="btn btn-secondary add-to-cart"
                  :disabled="!product.inStock"
                  @click="addToCart"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  加入购物车
                </button>
                <button 
                  class="btn btn-primary buy-now"
                  :disabled="!product.inStock"
                  @click="buyNow"
                >
                  立即购买
                </button>
              </div>

              <div class="wishlist-section">
                <button 
                  class="wishlist-btn"
                  :class="{ active: isInWishlist }"
                  @click="toggleWishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {{ isInWishlist ? '已收藏' : '收藏' }}
                </button>
              </div>
            </div>

            <!-- 服务保障 -->
            <div class="service-guarantees">
              <h4>服务保障</h4>
              <div class="guarantees-list">
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
                <div class="guarantee-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17,11 19,13 23,9"></polyline>
                  </svg>
                  <span>专业客服</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细信息标签页 -->
        <div class="product-details">
          <div class="tabs-header">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-btn"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-content">
            <!-- 商品详情 -->
            <div v-if="activeTab === 'details'" class="tab-panel">
              <div class="specifications">
                <h3>技术规格</h3>
                <table class="specs-table">
                  <tbody>
                    <tr v-for="spec in product.specifications" :key="spec.name">
                      <td class="spec-name">{{ spec.name }}</td>
                      <td class="spec-value">{{ spec.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="detailed-description">
                <h3>详细描述</h3>
                <div v-html="product.detailedDescription"></div>
              </div>
            </div>

            <!-- 用户评价 -->
            <div v-if="activeTab === 'reviews'" class="tab-panel">
              <div class="reviews-summary">
                <div class="rating-overview">
                  <div class="overall-rating">
                    <span class="rating-number">{{ product.rating }}</span>
                    <div class="stars">
                      <span
                        v-for="i in 5"
                        :key="i"
                        class="star"
                        :class="{ filled: i <= Math.floor(product.rating) }"
                      >★</span>
                    </div>
                    <span class="total-reviews">基于{{ product.reviews }}条评价</span>
                  </div>
                  
                  <div class="rating-breakdown">
                    <div
                      v-for="(count, rating) in ratingBreakdown"
                      :key="rating"
                      class="rating-bar"
                    >
                      <span class="rating-label">{{ rating }}星</span>
                      <div class="bar-container">
                        <div 
                          class="bar-fill"
                          :style="{ width: `${(count / product.reviews) * 100}%` }"
                        ></div>
                      </div>
                      <span class="rating-count">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="reviews-list">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="review-item"
                >
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">
                        {{ review.author.charAt(0) }}
                      </div>
                      <div class="reviewer-details">
                        <span class="reviewer-name">{{ review.author }}</span>
                        <div class="review-rating">
                          <span
                            v-for="i in 5"
                            :key="i"
                            class="star"
                            :class="{ filled: i <= review.rating }"
                          >★</span>
                        </div>
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                  </div>
                  
                  <div class="review-content">
                    <p>{{ review.content }}</p>
                    <div v-if="review.images" class="review-images">
                      <img
                        v-for="(image, index) in review.images"
                        :key="index"
                        :src="image"
                        :alt="`评价图片 ${index + 1}`"
                        class="review-image"
                      />
                    </div>
                  </div>
                  
                  <div v-if="review.reply" class="review-reply">
                    <div class="reply-header">
                      <span class="reply-label">商家回复：</span>
                      <span class="reply-date">{{ formatDate(review.reply.date) }}</span>
                    </div>
                    <p class="reply-content">{{ review.reply.content }}</p>
                  </div>
                </div>
              </div>

              <div class="load-more-reviews">
                <button class="btn btn-secondary" @click="loadMoreReviews">
                  加载更多评价
                </button>
              </div>
            </div>

            <!-- 配送与售后 -->
            <div v-if="activeTab === 'shipping'" class="tab-panel">
              <div class="shipping-info">
                <h3>配送信息</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <h4>配送范围</h4>
                    <p>全国大部分地区（港澳台及偏远地区除外）</p>
                  </div>
                  <div class="info-item">
                    <h4>配送时间</h4>
                    <p>现货商品：1-3个工作日发货<br>预售商品：按预售时间发货</p>
                  </div>
                  <div class="info-item">
                    <h4>配送费用</h4>
                    <p>订单满299元免运费<br>不满299元收取15元运费</p>
                  </div>
                  <div class="info-item">
                    <h4>配送方式</h4>
                    <p>顺丰快递、京东物流、德邦物流</p>
                  </div>
                </div>
              </div>

              <div class="after-sales-info">
                <h3>售后服务</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <h4>退换货政策</h4>
                    <p>7天无理由退货，15天免费换货<br>商品需保持原包装完整</p>
                  </div>
                  <div class="info-item">
                    <h4>质保服务</h4>
                    <p>提供厂家质保服务<br>具体质保期限以厂家规定为准</p>
                  </div>
                  <div class="info-item">
                    <h4>技术支持</h4>
                    <p>提供专业技术咨询<br>协助解决使用问题</p>
                  </div>
                  <div class="info-item">
                    <h4>联系方式</h4>
                    <p>客服热线：400-123-4567<br>在线客服：9:00-22:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关推荐 -->
        <div class="related-products">
          <h3>相关推荐</h3>
          <div class="products-grid">
            <ProductCard
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              :product="relatedProduct"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../stores/cart.js'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'ProductDetail',
  components: {
    ProductCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { addToCart: addToCartStore } = useCart()
    
    // 响应式数据
    const isLoading = ref(true)
    const product = ref(null)
    const selectedImageIndex = ref(0)
    const selectedVariants = ref({})
    const quantity = ref(1)
    const activeTab = ref('details')
    const isInWishlist = ref(false)
    const reviews = ref([])
    const relatedProducts = ref([])
    
    // 计算属性
    const selectedImage = computed(() => {
      return product.value?.images?.[selectedImageIndex.value] || ''
    })
    
    const tabs = [
      { key: 'details', label: '商品详情' },
      { key: 'reviews', label: '用户评价' },
      { key: 'shipping', label: '配送与售后' }
    ]
    
    const ratingBreakdown = computed(() => {
      // 模拟评分分布
      return {
        5: 85,
        4: 28,
        3: 12,
        2: 3,
        1: 0
      }
    })
    
    // 方法
    const selectImage = (index) => {
      selectedImageIndex.value = index
    }
    
    const selectVariant = (variantName, value) => {
      selectedVariants.value[variantName] = value
    }
    
    const increaseQuantity = () => {
      if (quantity.value < 99) {
        quantity.value++
      }
    }
    
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }
    
    const addToCart = () => {
      if (!product.value) {
        alert('商品信息加载中，请稍后再试')
        return
      }
      
      // 添加到购物车
      addToCartStore(product.value, selectedVariants.value, quantity.value)
      
      // 显示成功提示
      alert('商品已添加到购物车')
      
      console.log('添加到购物车:', {
        product: product.value,
        variants: selectedVariants.value,
        quantity: quantity.value
      })
    }

    const buyNow = () => {
      if (!product.value) {
        alert('商品信息加载中，请稍后再试')
        return
      }
      
      // 立即购买逻辑：先添加到购物车，然后跳转
      addToCartStore(product.value, selectedVariants.value, quantity.value)
      router.push('/cart')
    }
    
    const toggleWishlist = () => {
      isInWishlist.value = !isInWishlist.value
      // 这里可以调用 API 更新收藏状态
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-CN')
    }
    
    const loadMoreReviews = () => {
      // 加载更多评价
      console.log('加载更多评价')
    }
    
    // API配置
    const API_BASE = 'http://localhost:3001/api'
    
    const loadProductData = async () => {
      try {
        isLoading.value = true
        const productId = route.params.id
        
        // 获取商品详情
        const productResponse = await fetch(`${API_BASE}/products/${productId}`)
        if (!productResponse.ok) throw new Error('获取商品详情失败')
        const productData = await productResponse.json()
        
        if (productData.success && productData.data) {
          // 扩展商品数据，添加详细信息
          product.value = {
            ...productData.data,
            images: [
              productData.data.image,
              productData.data.image,
              productData.data.image
            ],
            variants: [
              {
                name: '版本',
                options: [
                  { label: '标准版', value: 'standard', available: true },
                  { label: 'OC版', value: 'oc', available: true, price: 500 },
                  { label: '水冷版', value: 'liquid', available: false, price: 1000 }
                ]
              }
            ],
            specifications: [
              { name: 'GPU架构', value: 'Ada Lovelace' },
              { name: 'CUDA核心', value: '16384' },
              { name: '显存容量', value: '24GB GDDR6X' },
              { name: '显存位宽', value: '384-bit' },
              { name: '基础频率', value: '2230 MHz' },
              { name: '加速频率', value: '2520 MHz' },
              { name: '功耗', value: '450W' },
              { name: '接口', value: '3x DisplayPort 1.4a, 1x HDMI 2.1' }
            ],
            detailedDescription: `
              <h4>产品特色</h4>
              <ul>
                <li>全新一代架构，为游戏玩家和创作者提供极致性能体验</li>
                <li>大容量显存，轻松应对 4K 游戏和内容创作</li>
                <li>支持最新技术，大幅提升游戏帧率</li>
                <li>光线追踪技术，带来逼真的光影效果</li>
                <li>高效的视频编码性能</li>
              </ul>
              
              <h4>适用场景</h4>
              <ul>
                <li>4K 高画质游戏</li>
                <li>3D 渲染和建模</li>
                <li>视频编辑和直播</li>
                <li>AI 和机器学习</li>
              </ul>
            `
          }
        } else {
          throw new Error('商品不存在')
        }
        
        // 获取相关商品
        const relatedResponse = await fetch(`${API_BASE}/products/${productId}/related`)
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          relatedProducts.value = relatedData.data || []
        }
        
        // 模拟评价数据
        reviews.value = [
          {
            id: 1,
            author: '游戏玩家***',
            rating: 5,
            date: '2024-01-15',
            content: '性能非常强劲，4K游戏完全无压力，温度控制也很好。包装很仔细，物流很快。',
            images: null,
            reply: {
              date: '2024-01-16',
              content: '感谢您的好评！我们会继续为您提供优质的产品和服务。'
            }
          },
          {
            id: 2,
            author: '设计师***',
            rating: 5,
            date: '2024-01-10',
            content: '用来做3D渲染，速度提升明显，显存很够用。值得推荐！',
            images: null,
            reply: null
          }
        ]
        
      } catch (error) {
        console.error('加载商品数据失败:', error)
        product.value = null
      } finally {
        isLoading.value = false
      }
    }
    
    onMounted(() => {
      loadProductData()
    })
    
    return {
      isLoading,
      product,
      selectedImageIndex,
      selectedImage,
      selectedVariants,
      quantity,
      activeTab,
      isInWishlist,
      reviews,
      relatedProducts,
      tabs,
      ratingBreakdown,
      selectImage,
      selectVariant,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      buyNow,
      toggleWishlist,
      formatDate,
      loadMoreReviews
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  padding: var(--spacing-xl) 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
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

.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 商品主要信息 */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.main-image {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-white);
  box-shadow: var(--shadow-md);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sale-badge,
.new-badge {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-white);
}

.sale-badge {
  background: var(--color-accent-red);
}

.new-badge {
  background: var(--color-accent-blue);
  left: calc(var(--spacing-md) + 60px);
}

.image-thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.thumbnail.active {
  border-color: var(--color-accent-blue);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-lg);
}

.product-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--color-border);
  font-size: var(--font-size-lg);
}

.star.filled {
  color: #fbbf24;
}

.rating-text {
  font-weight: 600;
  color: var(--color-primary);
}

.reviews-count {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
}

.current-price {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-accent-red);
}

.original-price {
  font-size: var(--font-size-lg);
  color: var(--color-gray);
  text-decoration: line-through;
}

.discount {
  font-size: var(--font-size-sm);
  color: var(--color-accent-red);
  background: rgba(239, 68, 68, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.product-description {
  color: var(--color-gray-dark);
  line-height: 1.6;
}

.product-variants {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.variant-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.variant-title {
  font-weight: 600;
  color: var(--color-primary);
}

.variant-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.variant-option {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
}

.variant-option:hover:not(:disabled) {
  border-color: var(--color-accent-blue);
}

.variant-option.active {
  border-color: var(--color-accent-blue);
  background: var(--color-accent-blue);
  color: var(--color-white);
}

.variant-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-price {
  font-size: var(--font-size-xs);
  margin-left: var(--spacing-xs);
}

.stock-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.in-stock {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: #10b981;
  font-weight: 600;
}

.out-of-stock {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-red);
  font-weight: 600;
}

.purchase-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-lg);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--color-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
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
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: var(--font-size-base);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.add-to-cart,
.buy-now {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
}

.wishlist-section {
  text-align: center;
}

.wishlist-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-gray-dark);
}

.wishlist-btn:hover,
.wishlist-btn.active {
  border-color: var(--color-accent-red);
  color: var(--color-accent-red);
}

.service-guarantees {
  padding: var(--spacing-lg);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.service-guarantees h4 {
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.guarantees-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
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

/* 详细信息标签页 */
.product-details {
  margin-bottom: var(--spacing-3xl);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
}

.tab-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--color-gray);
  transition: all var(--transition-fast);
}

.tab-btn:hover,
.tab-btn.active {
  color: var(--color-accent-blue);
  border-bottom-color: var(--color-accent-blue);
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.specifications h3,
.detailed-description h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.spec-name {
  font-weight: 600;
  color: var(--color-primary);
  width: 30%;
}

.spec-value {
  color: var(--color-gray-dark);
}

.detailed-description {
  line-height: 1.6;
  color: var(--color-gray-dark);
}

/* 评价相关样式 */
.reviews-summary {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.rating-overview {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-xl);
}

.overall-rating {
  text-align: center;
}

.rating-number {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.total-reviews {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  display: block;
  margin-top: var(--spacing-sm);
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.rating-label {
  width: 40px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
}

.bar-container {
  flex: 1;
  height: 8px;
  background: var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fbbf24;
  transition: width var(--transition-normal);
}

.rating-count {
  width: 30px;
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.review-item {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent-blue);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.reviewer-name {
  font-weight: 600;
  color: var(--color-primary);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.review-rating .stars {
  font-size: var(--font-size-sm);
}

.review-date {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.review-content {
  margin-bottom: var(--spacing-md);
}

.review-images {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
}

.review-reply {
  background: var(--color-gray-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.reply-label {
  font-weight: 600;
  color: var(--color-accent-blue);
  font-size: var(--font-size-sm);
}

.reply-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray);
}

.reply-content {
  font-size: var(--font-size-sm);
  color: var(--color-gray-dark);
}

.load-more-reviews {
  text-align: center;
  margin-top: var(--spacing-xl);
}

/* 配送与售后信息 */
.shipping-info,
.after-sales-info {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.shipping-info h3,
.after-sales-info h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.info-item h4 {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.info-item p {
  color: var(--color-gray-dark);
  line-height: 1.6;
}

/* 相关推荐 */
.related-products h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
  }

  .guarantees-list {
    grid-template-columns: 1fr;
  }

  .rating-overview {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .tabs-header {
    overflow-x: auto;
  }

  .tab-btn {
    white-space: nowrap;
  }
}
</style>