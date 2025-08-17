<template>
  <div class="home">
    <!-- 轮播图 -->
    <section class="hero-section">
      <div class="hero-carousel">
        <div 
          class="hero-slide" 
          v-for="(slide, index) in heroSlides" 
          :key="index"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">{{ slide.title }}</h1>
              <p class="hero-description">{{ slide.description }}</p>
              <router-link :to="slide.link" class="btn btn-primary btn-lg">
                {{ slide.buttonText }}
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 轮播指示器 -->
        <div class="hero-indicators">
          <button 
            v-for="(slide, index) in heroSlides" 
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></button>
        </div>

        <!-- 轮播控制按钮 -->
        <button class="hero-nav prev" @click="prevSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button class="hero-nav next" @click="nextSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </section>

    <!-- 产品分类 -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">热门分类</h2>
        <div class="categories-grid">
          <router-link 
            v-for="category in categories" 
            :key="category.id"
            :to="`/products?category=${category.slug}`"
            class="category-card"
          >
            <div class="category-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path :d="category.icon"></path>
              </svg>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }}+ 商品</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 新品推荐 -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">新品推荐</h2>
          <router-link to="/products?sort=newest" class="view-all-link">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </router-link>
        </div>
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- 热销商品 -->
    <section class="bestsellers-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热销商品</h2>
          <router-link to="/products?sort=bestselling" class="view-all-link">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </router-link>
        </div>
        <div class="products-grid">
          <ProductCard 
            v-for="product in bestsellerProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- 品牌展示 -->
    <section class="brands-section">
      <div class="container">
        <h2 class="section-title">合作品牌</h2>
        <div class="brands-grid">
          <div v-for="brand in brands" :key="brand.id" class="brand-item">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo">
          </div>
        </div>
      </div>
    </section>

    <!-- 服务特色 -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.id" class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path :d="feature.icon"></path>
              </svg>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  setup() {
    const currentSlide = ref(0)
    let slideInterval = null

    // 响应式数据
    const categories = ref([])
    const featuredProducts = ref([])
    const bestsellerProducts = ref([])
    const brands = ref([])
    const loading = ref(true)
    const error = ref(null)

    // API基础URL
    const API_BASE = 'http://localhost:3001'

    // 静态数据（不需要从API获取）
    const heroSlides = [
      {
        title: '全新RTX 4090显卡',
        description: '极致性能，畅享4K游戏体验',
        buttonText: '立即选购',
        link: '/products?category=gpu',
        image: '/src/assets/images/products/gpu-rtx4090.svg'
      },
      {
        title: 'Intel 13代处理器',
        description: '强劲性能，高效办公游戏两不误',
        buttonText: '了解更多',
        link: '/products?category=cpu',
        image: '/src/assets/images/products/cpu-intel-i9.svg'
      },
      {
        title: 'DDR5高速内存',
        description: '超快读写速度，提升系统响应',
        buttonText: '查看详情',
        link: '/products?category=memory',
        image: '/src/assets/images/products/memory-ddr5.svg'
      }
    ]

    const features = [
      {
        id: 1,
        title: '正品保证',
        description: '所有商品均为正品，提供官方质保',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        id: 2,
        title: '快速配送',
        description: '全国主要城市24小时内发货',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
      },
      {
        id: 3,
        title: '专业服务',
        description: '专业技术团队提供售前售后支持',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.458V6m0 12v3.542M2.458 12H6m12 0h3.542'
      },
      {
        id: 4,
        title: '无忧退换',
        description: '7天无理由退货，30天免费换货',
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      }
    ]

    // API调用函数
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/categories`)
        const result = await response.json()
        if (result.success) {
          categories.value = result.data.map(cat => ({
            ...cat,
            icon: getIconForCategory(cat.slug)
          }))
        }
      } catch (err) {
        console.error('获取分类失败:', err)
        error.value = '获取分类数据失败'
      }
    }

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/featured`)
        const result = await response.json()
        if (result.success) {
          featuredProducts.value = result.data
        }
      } catch (err) {
        console.error('获取特色商品失败:', err)
        error.value = '获取特色商品数据失败'
      }
    }

    const fetchBestsellerProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/bestsellers`)
        const result = await response.json()
        if (result.success) {
          bestsellerProducts.value = result.data
        }
      } catch (err) {
        console.error('获取畅销商品失败:', err)
        error.value = '获取畅销商品数据失败'
      }
    }

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/brands`)
        const result = await response.json()
        if (result.success) {
          brands.value = result.data.map(brand => ({
            ...brand,
            logo: getBrandLogo(brand.name)
          }))
        }
      } catch (err) {
        console.error('获取品牌失败:', err)
        error.value = '获取品牌数据失败'
      }
    }

    // 辅助函数
    const getIconForCategory = (slug) => {
      const icons = {
        'cpu': 'M9 3v2.01A6 6 0 1 0 15 11v-1a2 2 0 1 1 4 0v1a10 10 0 1 1-10-10z',
        'graphics-card': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14,2 L14,8 L20,8',
        'motherboard': 'M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z',
        'memory': 'M6 2v20h12V2H6zm2 2h8v16H8V4z',
        'storage': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'power': 'M18.36 6.64a9 9 0 1 1-12.73 0 M12 2v10'
      }
      return icons[slug] || 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    }

    const getBrandLogo = (brandName) => {
      const logos = {
        'ASUS': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzFhMWExYSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+QVNVUzwvdGV4dD4KPC9zdmc+Cg==',
        'MSI': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iI2RjMzU0NSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+TVNJPC90ZXh0Pgo8L3N2Zz4K',
        'Intel': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzFlM2E4YSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SW50ZWw8L3RleHQ+Cjwvc3ZnPgo=',
        'AMD': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iI2RjMzU0NSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+QU1EPC90ZXh0Pgo8L3N2Zz4K',
        'NVIDIA': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzI4YTc0NSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+TlZJRElBPC90ZXh0Pgo8L3N2Zz4K',
        'Corsair': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzFhMWExYSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Q29yc2FpcjwvdGV4dD4KPC9zdmc+Cg==',
        'Samsung': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzFhMWExYSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+U2Ftc3VuZzwvdGV4dD4KPC9zdmc+Cg=='
      }
      return logos[brandName] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjYwIiB5PSIzMCIgZmlsbD0iIzFhMWExYSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+QnJhbmQ8L3RleHQ+Cjwvc3ZnPgo='
    }

    // 初始化数据
    const initData = async () => {
      loading.value = true
      error.value = null
      
      try {
        await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(),
          fetchBestsellerProducts(),
          fetchBrands()
        ])
      } catch (err) {
        console.error('初始化数据失败:', err)
        error.value = '加载数据失败，请刷新页面重试'
      } finally {
        loading.value = false
      }
    }

    const goToSlide = (index) => {
      currentSlide.value = index
    }

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % heroSlides.length
    }

    const prevSlide = () => {
      currentSlide.value = currentSlide.value === 0 ? heroSlides.length - 1 : currentSlide.value - 1
    }

    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, 5000)
    }

    const stopSlideShow = () => {
      if (slideInterval) {
        clearInterval(slideInterval)
        slideInterval = null
      }
    }

    onMounted(() => {
      startSlideShow()
      initData()
    })

    onUnmounted(() => {
      stopSlideShow()
    })

    return {
      currentSlide,
      heroSlides,
      categories,
      featuredProducts,
      bestsellerProducts,
      brands,
      features,
      loading,
      error,
      goToSlide,
      nextSlide,
      prevSlide
    }
  }
}
</script>

<style scoped>
/* 轮播图样式 */
.hero-section {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.hero-slide.active {
  opacity: 1;
}

.hero-content {
  max-width: 600px;
  color: var(--color-white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.hero-description {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2xl);
  opacity: 0.9;
}

.hero-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-sm);
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.indicator.active {
  background: var(--color-white);
  border-color: var(--color-white);
}

.hero-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-white);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.hero-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-nav.prev {
  left: 30px;
}

.hero-nav.next {
  right: 30px;
}

/* 分类样式 */
.categories-section {
  padding: var(--spacing-3xl) 0;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  color: var(--color-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-decoration: none;
  color: var(--color-primary);
  transition: all var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.category-icon {
  width: 80px;
  height: 80px;
  background: var(--color-accent);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-accent-blue);
}

.category-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.category-count {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

/* 产品区域样式 */
.featured-section,
.bestsellers-section {
  padding: var(--spacing-3xl) 0;
}

.bestsellers-section {
  background: var(--color-gray-light);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-blue);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.view-all-link:hover {
  color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* 品牌展示样式 */
.brands-section {
  padding: var(--spacing-3xl) 0;
  background: var(--color-white);
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.brand-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.brand-item:hover {
  background: var(--color-accent);
}

.brand-logo {
  max-width: 100%;
  height: 60px;
  object-fit: contain;
}

/* 服务特色样式 */
.features-section {
  padding: var(--spacing-3xl) 0;
  background: var(--color-accent);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
}

.feature-item {
  text-align: center;
  padding: var(--spacing-xl);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  color: var(--color-accent-blue);
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.feature-description {
  color: var(--color-gray);
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-description {
    font-size: var(--font-size-lg);
  }

  .hero-nav {
    width: 40px;
    height: 40px;
  }

  .hero-nav.prev {
    left: 15px;
  }

  .hero-nav.next {
    right: 15px;
  }

  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>