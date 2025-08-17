# 电脑配件商城 API 文档

## 快速开始

### 1. 安装依赖
```bash
# 使用api-package.json安装依赖
npm install --package-lock-only --package-lock=false --prefix . --package-json=api-package.json
# 或者手动安装
npm install express cors nodemon
```

### 2. 启动API服务器
```bash
node api-server.js
# 或者使用nodemon进行开发
npx nodemon api-server.js
```

API服务器将在 `http://localhost:3001` 启动

## API 端点

### 商品相关

#### 获取所有商品
```
GET /api/products
```

**查询参数：**
- `category` - 按分类筛选 (graphics-card, cpu, memory, motherboard, storage, power)
- `brand` - 按品牌筛选 (ASUS, MSI, Intel, AMD, NVIDIA, Corsair, Samsung)
- `minPrice` - 最低价格
- `maxPrice` - 最高价格
- `inStock` - 是否有库存 (true/false)
- `page` - 页码 (默认: 1)
- `limit` - 每页数量 (默认: 10)

**示例：**
```
GET /api/products?category=graphics-card&brand=NVIDIA&page=1&limit=5
```

#### 获取单个商品详情
```
GET /api/products/:id
```

**示例：**
```
GET /api/products/1
```

#### 获取特色商品
```
GET /api/products/featured
```

#### 获取畅销商品
```
GET /api/products/bestsellers
```

#### 获取相关商品
```
GET /api/products/:id/related
```

### 分类和品牌

#### 获取所有分类
```
GET /api/categories
```

#### 获取所有品牌
```
GET /api/brands
```

### 搜索

#### 搜索商品
```
GET /api/search?q=关键词
```

**查询参数：**
- `q` - 搜索关键词 (必需)
- `category` - 按分类筛选
- `brand` - 按品牌筛选

**示例：**
```
GET /api/search?q=RTX&category=graphics-card
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 商品数据结构

```json
{
  "id": 1,
  "name": "NVIDIA GeForce RTX 4090",
  "price": 12999,
  "originalPrice": 14999,
  "image": "/src/assets/images/products/gpu-rtx4090.svg",
  "rating": 4.9,
  "reviews": 128,
  "category": "graphics-card",
  "brand": "NVIDIA",
  "inStock": true,
  "isNew": true,
  "isBestseller": false,
  "tags": ["热销", "新品"],
  "description": "顶级游戏显卡，支持4K游戏和光线追踪",
  "specs": {
    "memory": "24GB GDDR6X",
    "coreClock": "2230 MHz",
    "boostClock": "2520 MHz",
    "memoryInterface": "384-bit"
  }
}
```

## 在前端中使用

### 1. 修改前端代码使用API

在Vue组件中，可以这样使用API：

```javascript
// 获取所有商品
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3001/api/products');
    const result = await response.json();
    if (result.success) {
      products.value = result.data;
    }
  } catch (error) {
    console.error('获取商品失败:', error);
  }
}

// 搜索商品
async function searchProducts(keyword) {
  try {
    const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(keyword)}`);
    const result = await response.json();
    if (result.success) {
      searchResults.value = result.data;
    }
  } catch (error) {
    console.error('搜索失败:', error);
  }
}
```

### 2. 处理跨域问题

API服务器已经配置了CORS，允许前端访问。如果遇到跨域问题，确保：
1. API服务器正在运行
2. 前端和API服务器在不同端口（前端:3000，API:3001）

## 扩展功能

可以根据需要添加更多API端点：
- 用户认证 (`/api/auth/login`, `/api/auth/register`)
- 购物车管理 (`/api/cart`)
- 订单管理 (`/api/orders`)
- 用户管理 (`/api/users`)
- 商品评论 (`/api/products/:id/reviews`)

## 注意事项

1. 当前使用内存存储数据，重启服务器后数据会重置
2. 生产环境建议使用数据库（如MongoDB、MySQL等）
3. 建议添加数据验证和错误处理
4. 考虑添加API限流和安全措施