<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="currentColor"/>
            <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
          </svg>
          <span class="logo-text">电脑配件商城</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>
          <router-link to="/products" class="nav-link" @click="closeMenu">商品</router-link>
          <router-link to="/brands" class="nav-link" @click="closeMenu">品牌</router-link>
          <router-link to="/support" class="nav-link" @click="closeMenu">支持</router-link>
          <router-link to="/contact" class="nav-link" @click="closeMenu">联系我们</router-link>
        </nav>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <!-- 搜索 -->
          <div class="search-box">
            <input 
              type="text" 
              placeholder="搜索商品..." 
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            >
            <button class="search-btn" @click="handleSearch">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          <!-- 购物车 -->
          <router-link to="/cart" class="cart-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
            </svg>
            <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>

          <!-- 用户菜单 -->
          <div class="user-menu" v-if="!isLoggedIn">
            <router-link to="/login" class="btn btn-secondary btn-sm">登录</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">注册</router-link>
          </div>
          <div class="user-menu" v-else>
            <div class="user-dropdown" @click="toggleUserMenu">
              <div class="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="dropdown-menu" v-show="showUserMenu">
                <router-link to="/orders" class="dropdown-item">我的订单</router-link>
                <router-link to="/coming-soon" class="dropdown-item">个人资料</router-link>
                <router-link to="/coming-soon" class="dropdown-item">设置</router-link>
                <button class="dropdown-item" @click="logout">退出登录</button>
              </div>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button class="menu-toggle" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const isMenuOpen = ref(false)
    const showUserMenu = ref(false)
    const isLoggedIn = ref(false) // 这里应该从状态管理中获取
    const cartCount = computed(() => 3) // 这里应该从状态管理中获取

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
        searchQuery.value = ''
      }
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const logout = () => {
      isLoggedIn.value = false
      showUserMenu.value = false
      router.push('/')
    }

    return {
      searchQuery,
      isMenuOpen,
      showUserMenu,
      isLoggedIn,
      cartCount,
      handleSearch,
      toggleMenu,
      closeMenu,
      toggleUserMenu,
      logout
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.logo-text {
  display: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.nav-link {
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 500;
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-accent-blue);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-accent-blue);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--color-gray);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-fast);
}

.search-btn:hover {
  color: var(--color-accent-blue);
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-md);
  color: var(--color-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.cart-btn:hover {
  background-color: var(--color-gray-light);
  color: var(--color-accent-blue);
}

.cart-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-danger);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-dropdown {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-avatar:hover {
  background-color: var(--color-accent);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--color-primary);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-gray-light);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background-color: var(--color-primary);
  transition: all var(--transition-fast);
}

/* 响应式设计 */
@media (min-width: 769px) {
  .logo-text {
    display: block;
  }
}

@media (max-width: 768px) {
  .nav {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }

  .nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .search-input {
    width: 200px;
  }

  .menu-toggle {
    display: flex;
  }

  .user-menu .btn {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-box {
    display: none;
  }
  
  .header-actions {
    gap: var(--spacing-sm);
  }
}
</style>