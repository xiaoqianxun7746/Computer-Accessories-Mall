# 电脑配件商城

一个基于 Vue 3 + Vite 构建的现代化电脑配件商城项目，包含完整的前端界面和模拟后端 API。

![项目预览](https://img.shields.io/badge/Vue-3.x-green) ![项目预览](https://img.shields.io/badge/Vite-4.x-blue) ![项目预览](https://img.shields.io/badge/Node.js-16+-orange)

## 项目特色

- **现代化 UI 设计** - 响应式布局，支持移动端
- **完整购物流程** - 商品浏览、购物车、订单管理
- **数据持久化** - 购物车数据本地存储
- **智能搜索** - 商品搜索和筛选功能
- **移动端适配** - 完美支持各种设备
- **快速开发** - 热更新，开发体验优秀

## 快速开始

### 环境要求
- Node.js 16.0+
- npm 或 yarn

### 安装运行

```bash
# 1. 安装依赖
npm install

# 2. 启动后端 API 服务器
node api-server.js

# 3. 启动前端开发服务器（新终端）
npm run dev
```

### 访问地址
- 前端：http://localhost:3000
- API：http://localhost:3001

## 新手指南

如果你是新手，建议按以下顺序学习：

1. [新手使用指南](./新手使用指南.md) - 详细的入门教程
2. [快速开始](./快速开始.md) - 5分钟快速运行项目
3. [功能演示](./功能演示.md) - 完整功能演示指南

## 主要功能

### 首页
- 特色商品展示
- 畅销商品推荐
- 商品分类导航
- 品牌展示

### 商品管理
- 商品列表浏览
- 商品详情查看
- 多规格选择
- 库存状态显示

### 购物车
- 商品添加/删除
- 数量修改
- 批量操作
- 优惠券使用
- 数据持久化

### 用户功能
- 用户登录/注册
- 订单管理
- 收藏夹
- 个人中心

### 搜索筛选
- 关键词搜索
- 分类筛选
- 品牌筛选
- 价格排序

## 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **组合式 API** - Vue 3 新特性

### 后端
- **Node.js** - JavaScript 运行环境
- **Express** - Web 应用框架
- **模拟 API** - 完整的 RESTful API

### 开发工具
- **热更新** - 开发时实时更新
- **ESLint** - 代码质量检查
- **响应式设计** - 移动端适配

## 项目结构

```
电脑配件/
├── src/                    # 前端源代码
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── ProductList.vue # 商品列表
│   │   ├── ProductDetail.vue # 商品详情
│   │   ├── Cart.vue       # 购物车
│   │   └── ...
│   ├── components/        # 公共组件
│   │   ├── Header.vue     # 头部导航
│   │   ├── Footer.vue     # 底部信息
│   │   └── ProductCard.vue # 商品卡片
│   ├── stores/           # 状态管理
│   │   └── cart.js       # 购物车状态
│   └── styles/           # 样式文件
├── api-server.js         # 后端 API 服务器
├── package.json          # 项目配置
└── vite.config.js        # Vite 配置
```

## 开发指南

### 添加新商品
在 `api-server.js` 中的 `products` 数组添加商品数据：

```javascript
{
  id: 新ID,
  name: '商品名称',
  price: 价格,
  image: '图片URL',
  category: '分类',
  brand: '品牌',
  description: '商品描述',
  inStock: true
}
```

### 修改样式
- 全局样式：`src/styles/global.css`
- 组件样式：各 `.vue` 文件的 `<style>` 部分

### 添加新页面
1. 在 `src/views/` 创建新组件
2. 在 `src/main.js` 添加路由配置

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/products` | GET | 获取所有商品 |
| `/api/products/featured` | GET | 获取特色商品 |
| `/api/products/bestsellers` | GET | 获取畅销商品 |
| `/api/products/:id` | GET | 获取商品详情 |
| `/api/categories` | GET | 获取商品分类 |
| `/api/brands` | GET | 获取品牌列表 |
| `/api/search?q=关键词` | GET | 搜索商品 |

## 自定义配置

### 修改主题色
在 `src/styles/global.css` 中修改 CSS 变量：

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

### 配置端口
- 前端端口：修改 `vite.config.js`
- 后端端口：修改 `api-server.js` 中的端口配置

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 更新日志

### v1.0.0
- 完整的商城功能
- 响应式设计
- 购物车状态管理
- API 接口完善

## 许可证

MIT License

## 获取帮助

- 查看 [新手使用指南](./新手使用指南.md)
- 参考 [功能演示](./功能演示.md)
- 提交 Issue 反馈问题

---

**如果这个项目对你有帮助，请给个 Star！**