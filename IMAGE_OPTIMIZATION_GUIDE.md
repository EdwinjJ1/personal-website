# 图片优化指南 - Photography Portfolio

## 📊 GitHub Pages 限制

- **仓库大小**: 建议 < 1GB
- **单个文件**: 建议 < 100MB  
- **月流量**: 软限制 100GB
- **构建时间**: 超时限制 10分钟

## 🎯 推荐方案

### 方案1: 压缩图片后上传到GitHub ⭐ 推荐
**适合**: 10-30张照片的作品集

#### 图片规格建议：
```
缩略图 (Grid View):
- 尺寸: 800x600px
- 质量: 80%
- 格式: WebP (或 JPEG)
- 大小: 50-150KB

大图 (Modal View):
- 尺寸: 1920x1440px
- 质量: 85%
- 格式: WebP (或 JPEG)
- 大小: 200-500KB
```

#### 在线压缩工具：
1. **TinyPNG** - https://tinypng.com/
   - 支持批量压缩
   - 保持高质量
   - 免费版每次20张

2. **Squoosh** - https://squoosh.app/
   - Google开发
   - 支持WebP转换
   - 可精确控制质量

3. **ImageOptim** (Mac) - https://imageoptim.com/
   - 本地工具
   - 无损压缩
   - 批量处理

#### 使用步骤：
```bash
# 1. 创建photos文件夹
mkdir -p public/photos/thumbnails
mkdir -p public/photos/full

# 2. 压缩并放置图片
# - 缩略图放到 public/photos/thumbnails/
# - 大图放到 public/photos/full/

# 3. 命名规范
# photo-1-thumb.webp
# photo-1-full.webp
```

### 方案2: 使用免费图床 🌐
**适合**: 大量照片或高分辨率作品集

#### 推荐图床服务：

1. **Cloudinary** ⭐ 最推荐
   - 免费额度: 25GB存储 + 25GB流量/月
   - 自动优化和CDN
   - 支持动态调整大小
   - 注册: https://cloudinary.com/

2. **ImgBB**
   - 免费无限存储
   - 简单易用
   - 上传: https://imgbb.com/

3. **GitHub Issues** (技巧)
   - 利用GitHub自己的图床
   - 无限制
   - 方法: 在任意issue中上传图片，复制链接

4. **Imgur**
   - 老牌图床
   - 免费稳定
   - 上传: https://imgur.com/

#### Cloudinary 使用示例：
```typescript
// 上传到Cloudinary后，使用URL
const photos = [
  {
    id: 1,
    title: 'Golden Hour',
    // Cloudinary自动优化的URL
    image: 'https://res.cloudinary.com/your-cloud/image/upload/c_scale,w_800/v1/photos/photo1.jpg',
    imageFull: 'https://res.cloudinary.com/your-cloud/image/upload/c_scale,w_1920/v1/photos/photo1.jpg',
  }
];
```

### 方案3: 混合方案 🎨
**最佳实践**

```
少量精选照片 (6-10张):
→ 压缩后放GitHub (public/photos/)

大量作品集 (20+张):
→ 使用Cloudinary等图床

视频/动图:
→ 必须使用外部服务 (YouTube, Vimeo)
```

## 🛠 实施步骤

### 如果选择方案1 (GitHub):

1. **准备图片**:
   ```bash
   # 使用TinyPNG或Squoosh压缩所有照片
   # 目标: 每张 < 500KB
   ```

2. **更新代码**:
   ```typescript
   // src/app/photography/page.tsx
   const photos: Photo[] = [
     {
       id: 1,
       title: 'Golden Hour at the Harbour',
       image: '/photos/thumbnails/harbour-thumb.webp',
       imageFull: '/photos/full/harbour-full.webp',
       // ... 其他信息
     },
   ];
   ```

3. **上传到GitHub**:
   ```bash
   git add public/photos/
   git commit -m "Add optimized photography portfolio images"
   git push origin main
   ```

### 如果选择方案2 (Cloudinary):

1. **注册Cloudinary**:
   - 访问 https://cloudinary.com/
   - 免费注册账号
   - 获取 Cloud Name

2. **上传照片**:
   - 在Cloudinary控制台上传所有照片
   - 或使用批量上传工具

3. **获取URL并更新代码**:
   ```typescript
   const photos: Photo[] = [
     {
       id: 1,
       title: 'Golden Hour',
       image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/c_scale,w_800/photos/harbour.jpg',
       imageFull: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/c_scale,w_1920/photos/harbour.jpg',
     },
   ];
   ```

## 📏 图片尺寸参考

### 当前网站布局：
```
Grid View (3列):
- 容器宽度: ~400px
- 推荐图片: 800x600px (2x for retina)

Modal View:
- 最大宽度: 1200px
- 推荐图片: 1920x1440px
```

### 压缩目标：
```
原图: 5-20MB (5000x3750px)
↓ 压缩
缩略图: 50-150KB (800x600px, 80% quality)
大图: 200-500KB (1920x1440px, 85% quality)

总计6张照片:
- 缩略图: ~600KB
- 大图: ~2.4MB
- 总共: ~3MB ✅ 完全可接受
```

## ⚡ 性能优化建议

### 1. 使用WebP格式
```bash
# 转换JPEG到WebP (质量85%)
cwebp -q 85 input.jpg -o output.webp

# 批量转换
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

### 2. 懒加载
```typescript
// Next.js Image组件自动支持
<Image
  src="/photos/photo1.webp"
  alt="Photo"
  loading="lazy"  // 自动懒加载
  quality={85}
/>
```

### 3. 响应式图片
```typescript
// 根据屏幕大小加载不同尺寸
<Image
  src="/photos/photo1.webp"
  alt="Photo"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## 📊 容量计算

### 示例计算：
```
6张照片 (压缩后):
- 缩略图: 6 × 100KB = 600KB
- 大图: 6 × 400KB = 2.4MB
- 总计: 3MB

20张照片 (压缩后):
- 缩略图: 20 × 100KB = 2MB
- 大图: 20 × 400KB = 8MB
- 总计: 10MB ✅ 仍然可接受

50张照片 (压缩后):
- 总计: ~25MB ⚠️ 建议使用图床
```

## 🎯 我的建议

**对于你的情况**:

1. **如果 < 20张照片**: 
   - ✅ 使用方案1 (压缩后上传GitHub)
   - 简单、免费、无需额外服务

2. **如果 20-50张照片**:
   - ✅ 使用方案2 (Cloudinary)
   - 更好的性能和CDN

3. **如果 > 50张照片**:
   - ✅ 必须使用图床
   - 考虑分页或懒加载

## 🚀 快速开始

### 最简单的方法：
1. 访问 https://tinypng.com/
2. 上传你的6-10张精选照片
3. 下载压缩后的图片
4. 放到 `public/photos/` 文件夹
5. 更新 `src/app/photography/page.tsx` 中的路径
6. 提交到GitHub

**预计总大小**: 3-5MB ✅ 完全没问题！

---

**需要帮助?** 告诉我你有多少张照片，我可以帮你选择最佳方案！

