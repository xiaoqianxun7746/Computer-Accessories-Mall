<template>
  <div class="product-list-page">
    <div class="container">
      <!-- 页面标题和面包屑 -->
      <div class="page-header">
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span class="current">商品列表</span>
        </nav>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle">共找到 {{ totalProducts }} 件商品</p>
      </div>

      <div class="content-wrapper">
        <!-- 侧边栏筛选 -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h3>筛选条件</h3>
            <button class="clear-filters" @click="clearFilters">清除全部</button>
          </div>

          <!-- 分类筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">商品分类</h4>
            <div class="filter-options">
              <label 
                v-for="category in categories" 
                :key="category.slug"
                class="filter-option"
              >
                <input 
                  v-model="selectedCategories"
                  :value="category.slug"
                  type="checkbox"
                  class="filter-checkbox"
                >
                <span class="filter-label">{{ category.name }}</span>
                <span class="filter-count">({{ category.count }})</span>
              </label>
            </div>
          </div>

          <!-- 品牌筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">品牌</h4>
            <div class="filter-options">
              <label 
                v-for="brand in brands" 
                :key="brand.slug"
                class="filter-option"
              >
                <input 
                  v-model="selectedBrands"
                  :value="brand.slug"
                  type="checkbox"
                  class="filter-checkbox"
                >
                <span class="filter-label">{{ brand.name }}</span>
                <span class="filter-count">({{ brand.count }})</span>
              </label>
            </div>
          </div>

          <!-- 价格筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">价格范围</h4>
            <div class="price-range">
              <div class="price-inputs">
                <input 
                  v-model="priceRange.min"
                  type="number"
                  placeholder="最低价"
                  class="price-input"
                >
                <span class="price-separator">-</span>
                <input 
                  v-model="priceRange.max"
                  type="number"
                  placeholder="最高价"
                  class="price-input"
                >
              </div>
              <div class="price-presets">
                <button 
                  v-for="preset in pricePresets"
                  :key="preset.label"
                  class="price-preset"
                  @click="setPriceRange(preset.min, preset.max)"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 其他筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">其他</h4>
            <div class="filter-options">
              <label class="filter-option">
                <input 
                  v-model="onlyInStock"
                  type="checkbox"
                  class="filter-checkbox"
                >
                <span class="filter-label">仅显示有库存</span>
              </label>
              <label class="filter-option">
                <input 
                  v-model="onlyOnSale"
                  type="checkbox"
                  class="filter-checkbox"
                >
                <span class="filter-label">仅显示促销商品</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="products-main">
          <!-- 工具栏 -->
          <div class="products-toolbar">
            <div class="view-options">
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button 
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="sort-options">
              <select v-model="sortBy" class="sort-select">
                <option value="default">默认排序</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="rating">评分最高</option>
                <option value="newest">最新上架</option>
                <option value="bestselling">销量最高</option>
              </select>
            </div>

            <div class="results-info">
              显示 {{ startIndex }}-{{ endIndex }} 共 {{ totalProducts }} 件商品
            </div>
          </div>

          <!-- 活跃筛选标签 -->
          <div v-if="hasActiveFilters" class="active-filters">
            <span class="active-filters-label">当前筛选：</span>
            <div class="filter-tags">
              <span 
                v-for="category in selectedCategories"
                :key="`cat-${category}`"
                class="filter-tag"
              >
                {{ getCategoryName(category) }}
                <button @click="removeCategory(category)" class="remove-tag">×</button>
              </span>
              <span 
                v-for="brand in selectedBrands"
                :key="`brand-${brand}`"
                class="filter-tag"
              >
                {{ getBrandName(brand) }}
                <button @click="removeBrand(brand)" class="remove-tag">×</button>
              </span>
              <span v-if="priceRange.min || priceRange.max" class="filter-tag">
                ¥{{ priceRange.min || 0 }} - ¥{{ priceRange.max || '∞' }}
                <button @click="clearPriceRange" class="remove-tag">×</button>
              </span>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="products-container" :class="{ 'list-view': viewMode === 'list' }">
            <div v-if="isLoading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>加载中...</p>
            </div>
            
            <div v-else-if="filteredProducts.length === 0" class="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <h3>未找到相关商品</h3>
              <p>请尝试调整筛选条件或搜索关键词</p>
              <button class="btn btn-primary" @click="clearFilters">清除筛选条件</button>
            </div>

            <template v-else>
              <ProductCard 
                v-for="product in paginatedProducts" 
                :key="product.id"
                :product="product"
                :view-mode="viewMode"
              />
            </template>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              上一页
            </button>
            
            <div class="pagination-numbers">
              <button 
                v-for="page in visiblePages"
                :key="page"
                class="pagination-number"
                :class="{ active: page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const isLoading = ref(false)
    const viewMode = ref('grid')
    const sortBy = ref('default')
    const currentPage = ref(1)
    const pageSize = ref(12)
    
    // 筛选条件
    const selectedCategories = ref([])
    const selectedBrands = ref([])
    const priceRange = ref({ min: null, max: null })
    const onlyInStock = ref(false)
    const onlyOnSale = ref(false)
    
    // API配置
    const API_BASE = 'http://localhost:3001/api'
    
    // 数据状态
    const categories = ref([])
    const brands = ref([])
    const allProducts = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    const pricePresets = [
      { label: '500以下', min: 0, max: 500 },
      { label: '500-1000', min: 500, max: 1000 },
      { label: '1000-3000', min: 1000, max: 3000 },
      { label: '3000-5000', min: 3000, max: 5000 },
      { label: '5000以上', min: 5000, max: null }
    ]
    
    // API调用函数
    const fetchProducts = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await fetch(`${API_BASE}/products`)
        if (!response.ok) throw new Error('获取商品数据失败')
        const data = await response.json()
        allProducts.value = data.data || []
      } catch (err) {
        error.value = err.message
        console.error('获取商品数据失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/categories`)
        if (!response.ok) throw new Error('获取分类数据失败')
        const data = await response.json()
        categories.value = data.data || []
      } catch (err) {
        console.error('获取分类数据失败:', err)
      }
    }
    
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE}/brands`)
        if (!response.ok) throw new Error('获取品牌数据失败')
        const data = await response.json()
        brands.value = data.data || []
      } catch (err) {
        console.error('获取品牌数据失败:', err)
      }
    }
    
    // 初始化数据
    const initData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands()
      ])
    }
    
    // 计算属性
    const pageTitle = computed(() => {
      const category = route.query.category
      if (category) {
        const cat = categories.find(c => c.slug === category)
        return cat ? cat.name : '商品列表'
      }
      return '全部商品'
    })
    
    const filteredProducts = computed(() => {
      let products = allProducts.value
      
      // 分类筛选
      if (selectedCategories.value.length > 0) {
        products = products.filter(p => selectedCategories.value.includes(p.category))
      }
      
      // 品牌筛选
      if (selectedBrands.value.length > 0) {
        products = products.filter(p => selectedBrands.value.includes(p.brand))
      }
      
      // 价格筛选
      if (priceRange.value.min !== null) {
        products = products.filter(p => p.price >= priceRange.value.min)
      }
      if (priceRange.value.max !== null) {
        products = products.filter(p => p.price <= priceRange.value.max)
      }
      
      // 库存筛选
      if (onlyInStock.value) {
        products = products.filter(p => p.inStock)
      }
      
      // 促销筛选
      if (onlyOnSale.value) {
        products = products.filter(p => p.onSale)
      }
      
      // 排序
      switch (sortBy.value) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          products.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          products.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          products.sort((a, b) => b.isNew - a.isNew)
          break
        case 'bestselling':
          products.sort((a, b) => b.reviews - a.reviews)
          break
      }
      
      return products
    })
    
    const totalProducts = computed(() => filteredProducts.value.length)
    const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))
    const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
    const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalProducts.value))
    
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredProducts.value.slice(start, end)
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...', total)
        } else if (current >= total - 3) {
          pages.push(1, '...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1, '...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...', total)
        }
      }
      
      return pages
    })
    
    const hasActiveFilters = computed(() => {
      return selectedCategories.value.length > 0 ||
             selectedBrands.value.length > 0 ||
             priceRange.value.min !== null ||
             priceRange.value.max !== null ||
             onlyInStock.value ||
             onlyOnSale.value
    })
    
    // 方法
    const clearFilters = () => {
      selectedCategories.value = []
      selectedBrands.value = []
      priceRange.value = { min: null, max: null }
      onlyInStock.value = false
      onlyOnSale.value = false
      currentPage.value = 1
    }
    
    const setPriceRange = (min, max) => {
      priceRange.value = { min, max }
    }
    
    const clearPriceRange = () => {
      priceRange.value = { min: null, max: null }
    }
    
    const removeCategory = (category) => {
      const index = selectedCategories.value.indexOf(category)
      if (index > -1) {
        selectedCategories.value.splice(index, 1)
      }
    }
    
    const removeBrand = (brand) => {
      const index = selectedBrands.value.indexOf(brand)
      if (index > -1) {
        selectedBrands.value.splice(index, 1)
      }
    }
    
    const getCategoryName = (slug) => {
      const category = categories.find(c => c.slug === slug)
      return category ? category.name : slug
    }
    
    const getBrandName = (slug) => {
      const brand = brands.find(b => b.slug === slug)
      return brand ? brand.name : slug
    }
    
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    
    // 监听路由变化
    watch(() => route.query, (newQuery) => {
      if (newQuery.category) {
        selectedCategories.value = [newQuery.category]
      }
      currentPage.value = 1
    }, { immediate: true })
    
    // 监听筛选条件变化，重置页码
    watch([selectedCategories, selectedBrands, priceRange, onlyInStock, onlyOnSale], () => {
      currentPage.value = 1
    })
    
    onMounted(() => {
      initData()
    })
    
    return {
      isLoading,
      loading,
      error,
      viewMode,
      sortBy,
      currentPage,
      selectedCategories,
      selectedBrands,
      priceRange,
      onlyInStock,
      onlyOnSale,
      categories,
      brands,
      pricePresets,
      pageTitle,
      filteredProducts,
      totalProducts,
      totalPages,
      startIndex,
      endIndex,
      paginatedProducts,
      visiblePages,
      hasActiveFilters,
      clearFilters,
      setPriceRange,
      clearPriceRange,
      removeCategory,
      removeBrand,
      getCategoryName,
      getBrandName,
      goToPage
    }
  }
}
</script>

<style scoped>
.product-list-page {
  padding: var(--spacing-xl) 0;
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
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

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  color: var(--color-gray);
}

.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-2xl);
}

/* 筛选侧边栏 */
.filters-sidebar {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  height: fit-content;
  box-shadow: var(--shadow-sm);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.filters-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
}

.clear-filters {
  background: none;
  border: none;
  color: var(--color-accent-blue);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.clear-filters:hover {
  color: var(--color-primary);
}

.filter-section {
  margin-bottom: var(--spacing-xl);
}

.filter-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-fast);
}

.filter-option:hover {
  background: var(--color-gray-light);
}

.filter-checkbox {
  accent-color: var(--color-accent-blue);
}

.filter-label {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
}

.filter-count {
  font-size: var(--font-size-xs);
  color: var(--color-gray);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.price-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.price-separator {
  color: var(--color-gray);
}

.price-presets {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.price-preset {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-gray-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.price-preset:hover {
  border-color: var(--color-accent-blue);
  color: var(--color-accent-blue);
}

/* 主内容区 */
.products-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.view-options {
  display: flex;
  gap: var(--spacing-xs);
}

.view-btn {
  width: 40px;
  height: 40px;
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

.view-btn:hover,
.view-btn.active {
  border-color: var(--color-accent-blue);
  color: var(--color-accent-blue);
}

.sort-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-white);
}

.results-info {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.active-filters {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-gray-light);
  border-radius: var(--border-radius-md);
}

.active-filters-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-accent-blue);
  color: var(--color-white);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
}

.remove-tag {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  font-size: var(--font-size-sm);
  line-height: 1;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.products-container.list-view {
  grid-template-columns: 1fr;
}

.loading-state,
.empty-state {
  grid-column: 1 / -1;
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

.empty-state svg {
  margin-bottom: var(--spacing-lg);
  color: var(--color-gray);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.pagination-btn,
.pagination-number {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled),
.pagination-number:hover {
  border-color: var(--color-accent-blue);
  color: var(--color-accent-blue);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-number.active {
  background: var(--color-accent-blue);
  color: var(--color-white);
  border-color: var(--color-accent-blue);
}

.pagination-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    order: 2;
  }

  .products-main {
    order: 1;
  }

  .products-toolbar {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .products-container {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>