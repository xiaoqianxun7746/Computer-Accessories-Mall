import { ref, computed } from 'vue'

// 购物车状态管理
const cartItems = ref([])

// 从localStorage加载购物车数据
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('cart-items')
    if (stored) {
      cartItems.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载购物车数据失败:', error)
    cartItems.value = []
  }
}

// 保存购物车数据到localStorage
const saveCartToStorage = () => {
  try {
    localStorage.setItem('cart-items', JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('保存购物车数据失败:', error)
  }
}

// 添加商品到购物车
const addToCart = (product, variants = {}, quantity = 1) => {
  // 检查是否已存在相同的商品和规格
  const existingItem = cartItems.value.find(item => 
    item.product.id === product.id && 
    JSON.stringify(item.variants) === JSON.stringify(variants)
  )
  
  if (existingItem) {
    // 如果已存在，增加数量
    existingItem.quantity += quantity
  } else {
    // 如果不存在，添加新项目
    const newItem = {
      id: Date.now() + Math.random(), // 生成唯一ID
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock
      },
      quantity,
      variants,
      isFavorite: false
    }
    cartItems.value.push(newItem)
  }
  
  saveCartToStorage()
}

// 移除购物车商品
const removeFromCart = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    saveCartToStorage()
  }
}

// 更新商品数量
const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) {
    removeFromCart(itemId)
    return
  }
  
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity = Math.min(newQuantity, 99) // 限制最大数量
    saveCartToStorage()
  }
}

// 清空购物车
const clearCart = () => {
  cartItems.value = []
  saveCartToStorage()
}

// 计算属性
const cartItemsCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

// 初始化时加载数据
loadCartFromStorage()

// 导出购物车状态和方法
export const useCart = () => {
  return {
    cartItems: cartItems,
    cartItemsCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromStorage,
    saveCartToStorage
  }
}