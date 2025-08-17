import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/global.css'

// 导入页面组件
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ProductList from './views/ProductList.vue'
import ProductDetail from './views/ProductDetail.vue'
import Cart from './views/Cart.vue'
import Checkout from './views/Checkout.vue'
import Orders from './views/Orders.vue'
import Brands from './views/Brands.vue'
import Support from './views/Support.vue'

import ComingSoon from './views/ComingSoon.vue'

// 路由配置
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: ProductList },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/orders', component: Orders },
  { path: '/brands', component: Brands },
  { path: '/support', component: Support },
  { path: '/profile', component: ComingSoon },
  { path: '/about', component: ComingSoon },
  { path: '/contact', component: ComingSoon },
  { path: '/coming-soon', component: ComingSoon }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')