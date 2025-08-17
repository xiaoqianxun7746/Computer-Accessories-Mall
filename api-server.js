const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 商品数据
const products = [
  {
    id: 1,
    name: 'NVIDIA GeForce RTX 4090',
    price: 12999,
    originalPrice: 14999,
    image: '/src/assets/images/products/gpu-rtx4090.svg',
    rating: 4.9,
    reviews: 128,
    category: 'graphics-card',
    brand: 'NVIDIA',
    inStock: true,
    isNew: true,
    isBestseller: false,
    tags: ['热销', '新品'],
    description: '顶级游戏显卡，支持4K游戏和光线追踪',
    specs: {
      memory: '24GB GDDR6X',
      coreClock: '2230 MHz',
      boostClock: '2520 MHz',
      memoryInterface: '384-bit'
    }
  },
  {
    id: 2,
    name: 'Intel Core i9-13900K',
    price: 4299,
    originalPrice: 4599,
    image: '/src/assets/images/products/cpu-intel-i9.svg',
    rating: 4.8,
    reviews: 89,
    category: 'cpu',
    brand: 'Intel',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['推荐'],
    description: '第13代Intel酷睿处理器，性能强劲',
    specs: {
      cores: '24核心(8P+16E)',
      threads: '32线程',
      baseClock: '3.0 GHz',
      boostClock: '5.8 GHz',
      cache: '36MB'
    }
  },
  {
    id: 3,
    name: 'Corsair Vengeance DDR5-6000 32GB',
    price: 1299,
    originalPrice: 1499,
    image: '/src/assets/images/products/memory-ddr5.svg',
    rating: 4.7,
    reviews: 156,
    category: 'memory',
    brand: 'Corsair',
    inStock: true,
    isNew: false,
    isBestseller: false,
    tags: ['性价比'],
    description: '高性能DDR5内存，支持超频',
    specs: {
      capacity: '32GB (2x16GB)',
      speed: 'DDR5-6000',
      timing: 'C36',
      voltage: '1.35V'
    }
  },
  {
    id: 4,
    name: 'ASUS ROG STRIX B650E-E',
    price: 2199,
    originalPrice: 2399,
    image: '/src/assets/images/products/motherboard-asus.svg',
    rating: 4.6,
    reviews: 73,
    category: 'motherboard',
    brand: 'ASUS',
    inStock: true,
    isNew: false,
    isBestseller: false,
    tags: ['游戏'],
    description: 'AMD B650E芯片组主板，支持PCIe 5.0',
    specs: {
      socket: 'AM5',
      chipset: 'B650E',
      memorySlots: '4 x DDR5',
      expansion: 'PCIe 5.0 x16, PCIe 4.0 x16'
    }
  },
  {
    id: 5,
    name: 'AMD Ryzen 7 7800X3D',
    price: 3199,
    originalPrice: 3499,
    image: '/src/assets/images/products/cpu-amd-ryzen.svg',
    rating: 4.9,
    reviews: 312,
    category: 'cpu',
    brand: 'AMD',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['游戏优化'],
    description: '游戏专用处理器，配备3D V-Cache技术',
    specs: {
      cores: '8核心',
      threads: '16线程',
      baseClock: '4.2 GHz',
      boostClock: '5.0 GHz',
      cache: '96MB'
    }
  },
  {
    id: 6,
    name: 'MSI GeForce RTX 4070 Ti',
    price: 6999,
    originalPrice: null,
    image: '/src/assets/images/products/gpu-msi-rtx4070ti.svg',
    rating: 4.8,
    reviews: 187,
    category: 'graphics-card',
    brand: 'MSI',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['性价比'],
    description: '高性能游戏显卡，支持DLSS 3',
    specs: {
      memory: '12GB GDDR6X',
      coreClock: '2310 MHz',
      boostClock: '2610 MHz',
      memoryInterface: '192-bit'
    }
  },
  {
    id: 7,
    name: 'Samsung 980 PRO 2TB',
    price: 1299,
    originalPrice: 1499,
    image: '/src/assets/images/products/ssd-samsung-980pro.svg',
    rating: 4.7,
    reviews: 445,
    category: 'storage',
    brand: 'Samsung',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['高速'],
    description: 'PCIe 4.0 NVMe SSD，读写速度极快',
    specs: {
      capacity: '2TB',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7000 MB/s',
      writeSpeed: '6900 MB/s'
    }
  },
  {
    id: 8,
    name: 'Corsair RM850x 850W',
    price: 899,
    originalPrice: null,
    image: '/src/assets/images/products/psu-corsair-rm850x.svg',
    rating: 4.8,
    reviews: 298,
    category: 'power',
    brand: 'Corsair',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['80+ Gold'],
    description: '全模组电源，80+ Gold认证',
    specs: {
      wattage: '850W',
      efficiency: '80+ Gold',
      modular: '全模组',
      warranty: '10年质保'
    }
  }
];

// 分类数据
const categories = [
  { id: 1, name: '显卡', slug: 'graphics-card', count: 2, icon: 'gpu' },
  { id: 2, name: 'CPU', slug: 'cpu', count: 2, icon: 'cpu' },
  { id: 3, name: '内存', slug: 'memory', count: 1, icon: 'memory' },
  { id: 4, name: '主板', slug: 'motherboard', count: 1, icon: 'motherboard' },
  { id: 5, name: '存储', slug: 'storage', count: 1, icon: 'storage' },
  { id: 6, name: '电源', slug: 'power', count: 1, icon: 'power' }
];

// 品牌数据
const brands = [
  { id: 1, name: 'ASUS', logo: 'asus-logo.svg' },
  { id: 2, name: 'MSI', logo: 'msi-logo.svg' },
  { id: 3, name: 'Intel', logo: 'intel-logo.svg' },
  { id: 4, name: 'AMD', logo: 'amd-logo.svg' },
  { id: 5, name: 'NVIDIA', logo: 'nvidia-logo.svg' },
  { id: 6, name: 'Corsair', logo: 'corsair-logo.svg' },
  { id: 7, name: 'Samsung', logo: 'samsung-logo.svg' }
];

// API路由

// 获取所有商品
app.get('/api/products', (req, res) => {
  const { category, brand, minPrice, maxPrice, inStock, page = 1, limit = 10 } = req.query;
  
  let filteredProducts = [...products];
  
  // 按分类筛选
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // 按品牌筛选
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand === brand);
  }
  
  // 按价格筛选
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
  }
  
  // 按库存筛选
  if (inStock === 'true') {
    filteredProducts = filteredProducts.filter(p => p.inStock);
  }
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit)
    }
  });
});

// 获取特色商品
app.get('/api/products/featured', (req, res) => {
  const featuredProducts = products.filter(p => p.isNew || p.isBestseller).slice(0, 4);
  
  res.json({
    success: true,
    data: featuredProducts
  });
});

// 获取畅销商品
app.get('/api/products/bestsellers', (req, res) => {
  const bestsellerProducts = products.filter(p => p.isBestseller).slice(0, 4);
  
  res.json({
    success: true,
    data: bestsellerProducts
  });
});

// 获取单个商品详情
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: '商品不存在'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// 获取所有品牌
app.get('/api/brands', (req, res) => {
  res.json({
    success: true,
    data: brands
  });
});

// 搜索商品
app.get('/api/search', (req, res) => {
  const { q, category, brand } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: '搜索关键词不能为空'
    });
  }
  
  let searchResults = products.filter(product => 
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.description.toLowerCase().includes(q.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
  );
  
  // 按分类筛选
  if (category) {
    searchResults = searchResults.filter(p => p.category === category);
  }
  
  // 按品牌筛选
  if (brand) {
    searchResults = searchResults.filter(p => p.brand === brand);
  }
  
  res.json({
    success: true,
    data: searchResults,
    query: q,
    total: searchResults.length
  });
});

// 获取相关商品
app.get('/api/products/:id/related', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: '商品不存在'
    });
  }
  
  // 获取同分类的其他商品
  const relatedProducts = products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, 4);
  
  res.json({
    success: true,
    data: relatedProducts
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
  console.log('可用的API端点：');
  console.log('- GET /api/products - 获取所有商品');
  console.log('- GET /api/products/:id - 获取单个商品详情');
  console.log('- GET /api/products/featured - 获取特色商品');
  console.log('- GET /api/products/bestsellers - 获取畅销商品');
  console.log('- GET /api/categories - 获取所有分类');
  console.log('- GET /api/brands - 获取所有品牌');
  console.log('- GET /api/search?q=关键词 - 搜索商品');
  console.log('- GET /api/products/:id/related - 获取相关商品');
});