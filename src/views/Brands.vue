<template>
  <div class="brands-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">合作品牌</h1>
        <p class="page-subtitle">与全球知名品牌合作，为您提供优质的电脑配件产品</p>
      </div>

      <!-- 品牌分类 -->
      <div class="brand-categories">
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="category-tab"
            :class="{ active: activeCategory === category.id }"
            @click="setActiveCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 品牌展示 -->
      <div class="brands-grid">
        <div 
          v-for="brand in filteredBrands" 
          :key="brand.id"
          class="brand-card"
          @click="viewBrandProducts(brand.id)"
        >
          <div class="brand-logo">
            <img :src="brand.logo" :alt="brand.name" />
          </div>
          <div class="brand-info">
            <h3 class="brand-name">{{ brand.name }}</h3>
            <p class="brand-description">{{ brand.description }}</p>
            <div class="brand-stats">
              <span class="product-count">{{ brand.productCount }} 款产品</span>
              <span class="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ brand.rating }}
              </span>
            </div>
            <div class="brand-tags">
              <span 
                v-for="tag in brand.tags" 
                :key="tag"
                class="brand-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 品牌故事 -->
      <div class="brand-stories">
        <h2 class="section-title">品牌故事</h2>
        <div class="stories-grid">
          <div 
            v-for="story in brandStories" 
            :key="story.id"
            class="story-card"
          >
            <div class="story-image">
              <img :src="story.image" :alt="story.title" />
            </div>
            <div class="story-content">
              <h3 class="story-title">{{ story.title }}</h3>
              <p class="story-excerpt">{{ story.excerpt }}</p>
              <button class="read-more-btn">阅读更多</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作优势 -->
      <div class="partnership-benefits">
        <h2 class="section-title">合作优势</h2>
        <div class="benefits-grid">
          <div 
            v-for="benefit in benefits" 
            :key="benefit.id"
            class="benefit-card"
          >
            <div class="benefit-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <component :is="benefit.icon" />
              </svg>
            </div>
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-description">{{ benefit.description }}</p>
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
  name: 'Brands',
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')

    // 品牌分类
    const categories = ref([
      { id: 'all', name: '全部品牌' },
      { id: 'cpu', name: 'CPU处理器' },
      { id: 'gpu', name: '显卡' },
      { id: 'motherboard', name: '主板' },
      { id: 'memory', name: '内存' },
      { id: 'storage', name: '存储' },
      { id: 'power', name: '电源' },
      { id: 'cooling', name: '散热' }
    ])

    // 品牌数据
    const brands = ref([
      {
        id: 1,
        name: 'Intel',
        category: 'cpu',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMwMDcxQzUiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW50ZWw8L3RleHQ+Cjwvc3ZnPg==',
        description: '全球领先的半导体公司，专注于处理器和芯片组技术',
        productCount: 45,
        rating: 4.8,
        tags: ['处理器', '芯片组', '创新技术']
      },
      {
        id: 2,
        name: 'AMD',
        category: 'cpu',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNFRDFDMjQiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QU1EPC90ZXh0Pgo8L3N2Zz4=',
        description: '高性能计算和图形解决方案的全球领导者',
        productCount: 38,
        rating: 4.7,
        tags: ['Ryzen', '高性能', '游戏优化']
      },
      {
        id: 3,
        name: 'NVIDIA',
        category: 'gpu',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiM3NkI5MDAiLz4KPHRleHQgeD0iNTAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TlZJRElBPC90ZXh0Pgo8dGV4dCB4PSI1MCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdlRm9yY2U8L3RleHQ+Cjwvc3ZnPg==',
        description: 'GPU技术和人工智能计算的先驱者',
        productCount: 52,
        rating: 4.9,
        tags: ['RTX', 'AI计算', '光线追踪']
      },
      {
        id: 4,
        name: 'ASUS',
        category: 'motherboard',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMwMDAwMDAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QVNVUzwvdGV4dD4KPC9zdmc+',
        description: '全球领先的主板和电脑硬件制造商',
        productCount: 67,
        rating: 4.6,
        tags: ['ROG', '主板', '游戏硬件']
      },
      {
        id: 5,
        name: 'MSI',
        category: 'gpu',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNGRjAwMDAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TVNJPC90ZXh0Pgo8L3N2Zz4=',
        description: '专业游戏硬件和高性能计算解决方案提供商',
        productCount: 43,
        rating: 4.7,
        tags: ['Gaming', '显卡', '主板']
      },
      {
        id: 6,
        name: 'Corsair',
        category: 'memory',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHRleHQgeD0iNTAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29yc2FpcjwvdGV4dD4KPHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7mtbfnm5fohb48L3RleHQ+Cjwvc3ZnPg==',
        description: '高性能内存、电源和散热解决方案专家',
        productCount: 35,
        rating: 4.8,
        tags: ['内存', '电源', '散热器']
      },
      {
        id: 7,
        name: 'Samsung',
        category: 'storage',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMxNDI4QTAiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Ftc3VuZzwvdGV4dD4KPC9zdmc+',
        description: '全球领先的存储技术和半导体解决方案提供商',
        productCount: 28,
        rating: 4.9,
        tags: ['SSD', '存储', '半导体']
      },
      {
        id: 8,
        name: 'Gigabyte',
        category: 'motherboard',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNGRjY2MDAiLz4KPHRleHQgeD0iNTAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2lnYWJ5dGU8L3RleHQ+CjwvdGV4dD4KPC9zdmc+',
        description: '创新主板和显卡技术的领导者',
        productCount: 41,
        rating: 4.5,
        tags: ['AORUS', '主板', '显卡']
      }
    ])

    // 品牌故事
    const brandStories = ref([
      {
        id: 1,
        title: 'Intel：创新驱动未来',
        excerpt: '从1968年成立至今，Intel一直致力于推动计算技术的发展，为全球用户带来更强大的处理能力。',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmOWZmIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgZmlsbD0iIzAwNzFDNSIvPgo8dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkludGVsIFN0b3J5PC90ZXh0Pgo8L3N2Zz4='
      },
      {
        id: 2,
        title: 'AMD：突破性能极限',
        excerpt: 'AMD凭借Ryzen系列处理器重新定义了高性能计算，为用户提供卓越的多核性能体验。',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmVmMmYyIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgZmlsbD0iI0VEMUMyNCIvPgo8dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFNRCBTdG9yeTwvdGV4dD4KPC9zdmc+'
      },
      {
        id: 3,
        title: 'NVIDIA：引领图形革命',
        excerpt: 'NVIDIA的RTX技术带来了实时光线追踪，彻底改变了游戏和专业图形渲染的体验。',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmZmYwIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgZmlsbD0iIzc2QjkwMCIvPgo8dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5WSURJQSBTVG9yeTwvdGV4dD4KPC9zdmc+'
      }
    ])

    // 合作优势
    const benefits = ref([
      {
        id: 1,
        title: '正品保证',
        description: '所有产品均为品牌官方授权，确保100%正品',
        icon: 'shield-check'
      },
      {
        id: 2,
        title: '技术支持',
        description: '专业技术团队提供全方位的技术支持服务',
        icon: 'headphones'
      },
      {
        id: 3,
        title: '快速发货',
        description: '与品牌方直接合作，确保库存充足，快速发货',
        icon: 'truck'
      },
      {
        id: 4,
        title: '售后保障',
        description: '完善的售后服务体系，让您购买无忧',
        icon: 'award'
      }
    ])

    // 计算过滤后的品牌
    const filteredBrands = computed(() => {
      if (activeCategory.value === 'all') {
        return brands.value
      }
      return brands.value.filter(brand => brand.category === activeCategory.value)
    })

    // 设置活动分类
    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId
    }

    // 查看品牌产品
    const viewBrandProducts = (brandId) => {
      router.push(`/products?brand=${brandId}`)
    }

    return {
      activeCategory,
      categories,
      brands,
      brandStories,
      benefits,
      filteredBrands,
      setActiveCategory,
      viewBrandProducts
    }
  }
}
</script>

<style scoped>
.brands-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.brand-categories {
  margin-bottom: 3rem;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.category-tab:hover {
  border-color: #3182ce;
  color: #3182ce;
}

.category-tab.active {
  background: #3182ce;
  border-color: #3182ce;
  color: white;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.brand-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.brand-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.brand-logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.brand-logo img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.brand-info {
  text-align: center;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.brand-description {
  color: #718096;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.brand-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-count {
  color: #4a5568;
  font-size: 0.9rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f6ad55;
  font-size: 0.9rem;
}

.brand-tags {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.brand-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  color: #2d3748;
  margin-bottom: 3rem;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.story-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.story-card:hover {
  transform: translateY(-3px);
}

.story-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.story-content {
  padding: 1.5rem;
}

.story-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.story-excerpt {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.read-more-btn:hover {
  background: #2c5aa0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  color: #3182ce;
  margin-bottom: 1rem;
}

.benefit-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.benefit-description {
  color: #718096;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .brands-grid {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .category-tab {
    white-space: nowrap;
  }
}
</style>