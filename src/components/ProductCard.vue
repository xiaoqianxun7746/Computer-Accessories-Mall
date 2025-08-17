<template>
  <div class="product-card">
    <!-- 商品图片 -->
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image">
      
      <!-- 标签 -->
      <div class="product-badges">
        <span v-if="product.isNew" class="badge badge-new">新品</span>
        <span v-if="product.isBestseller" class="badge badge-bestseller">热销</span>
        <span v-if="product.discount" class="badge badge-discount">-{{ product.discount }}%</span>
      </div>

      <!-- 快速操作 -->
      <div class="product-actions">
        <button class="action-btn" @click="addToWishlist" title="加入收藏">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="action-btn" @click="quickView" title="快速查看">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button class="action-btn" @click="addToCart" title="加入购物车">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <router-link :to="`/product/${product.id}`" class="product-name">
        {{ product.name }}
      </router-link>
      
      <!-- 评分 -->
      <div class="product-rating">
        <div class="stars">
          <span 
            v-for="i in 5" 
            :key="i" 
            class="star"
            :class="{ filled: i <= Math.floor(product.rating) }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">{{ product.rating }}</span>
        <span class="reviews-count">({{ product.reviews }})</span>
      </div>

      <!-- 价格 -->
      <div class="product-price">
        <span class="current-price">¥{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ¥{{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <!-- 购买按钮 -->
      <button class="buy-btn" @click="buyNow">
        立即购买
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const formatPrice = (price) => {
      return price.toLocaleString()
    }

    const addToWishlist = () => {
      // 添加到收藏夹的逻辑
      console.log('添加到收藏夹:', props.product.name)
    }

    const quickView = () => {
      // 快速查看的逻辑
      console.log('快速查看:', props.product.name)
    }

    const addToCart = () => {
      // 添加到购物车的逻辑
      console.log('添加到购物车:', props.product.name)
    }

    const buyNow = () => {
      // 立即购买的逻辑
      router.push(`/product/${props.product.id}`)
    }

    return {
      formatPrice,
      addToWishlist,
      quickView,
      addToCart,
      buyNow
    }
  }
}
</script>

<style scoped>
.product-card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.product-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-gray-light);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-new {
  background: var(--color-accent-blue);
  color: var(--color-white);
}

.badge-bestseller {
  background: var(--color-danger);
  color: var(--color-white);
}

.badge-discount {
  background: var(--color-success);
  color: var(--color-white);
}

.product-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  opacity: 0;
  transform: translateX(10px);
  transition: all var(--transition-normal);
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: var(--color-white);
  color: var(--color-accent-blue);
  transform: scale(1.1);
}

.product-info {
  padding: var(--spacing-lg);
}

.product-name {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.product-name:hover {
  color: var(--color-accent-blue);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.reviews-count {
  font-size: var(--font-size-xs);
  color: var(--color-gray);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-danger);
}

.original-price {
  font-size: var(--font-size-base);
  color: var(--color-gray);
  text-decoration: line-through;
}

.buy-btn {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.buy-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-actions {
    opacity: 1;
    transform: translateX(0);
    flex-direction: row;
    top: auto;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: var(--font-size-base);
  }

  .current-price {
    font-size: var(--font-size-lg);
  }
}
</style>