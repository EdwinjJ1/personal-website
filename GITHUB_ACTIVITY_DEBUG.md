# GitHub Activity Card - 诊断和说明

## 🔍 问题诊断

### 你的情况：
- ✅ GitHub API 正常工作
- ✅ 用户名正确：`EdwinJia1`
- ✅ 代码逻辑正确
- ⚠️ **但是**：你最近的活动可能不在显示范围内

### 为什么看不到今天的commits？

**GitHub Events API 的限制**：
```
1. 只返回最近 90天 的事件
2. 最多返回 300个 事件
3. 只包含 public 仓库的活动
4. 需要几分钟才能更新
```

**你的最新活动**（从API获取）：
```
最新事件: 2025-09-27 (9月27日)
今天日期: 2025-10-08 (10月8日)
时间差: 11天前
```

**Activity Card 显示范围**：
```
显示: 最近 12周 (84天)
从: 2025-07-16
到: 2025-10-08
```

## 📊 GitHub Activity Card 工作原理

### 数据来源：
```
GitHub Events API
↓
https://api.github.com/users/EdwinJia1/events/public
↓
返回最近的 public events (最多100个)
↓
按日期统计并显示在图表上
```

### 追踪的活动类型：

✅ **会显示的**：
- `PushEvent` - 推送代码到仓库
- `CreateEvent` - 创建仓库/分支/标签
- `DeleteEvent` - 删除分支/标签
- `WatchEvent` - Star 仓库
- `ForkEvent` - Fork 仓库
- `IssuesEvent` - 创建/关闭/评论 Issue
- `PullRequestEvent` - 创建/合并 PR
- `IssueCommentEvent` - 评论 Issue
- `PullRequestReviewEvent` - Review PR
- `ReleaseEvent` - 发布 Release

❌ **不会显示的**：
- 本地 Git commits（没有push的）
- Private 仓库的活动（除非提供token）
- 超过90天的旧活动
- 非public的操作

### 更新时间：
```
Push代码 → GitHub处理 → Events API更新
         ↓
      通常 2-5分钟
      最多 15分钟
```

## 🧪 测试你的Activity Card

### 方法1: 浏览器控制台检查

1. 打开你的网站：https://edwinjia1.github.io/personal-website/
2. 按 `F12` 打开开发者工具
3. 切换到 `Console` 标签
4. 刷新页面
5. 查看输出：

```javascript
// 应该看到这些日志：
📊 GitHub Events fetched: 10
📅 Latest event: 2025-09-27T03:46:40Z
📅 Oldest event: 2025-09-14T03:19:14Z
✅ Events in last 12 weeks: 10/10
```

### 方法2: 直接测试API

在浏览器打开这个URL：
```
https://api.github.com/users/EdwinJia1/events/public?per_page=10
```

你会看到JSON格式的最近10个事件。

### 方法3: 检查指示器

在网站上查看 "GitHub Activity" 标题旁边：
- 🟢 **绿点** = 成功获取真实数据
- 🟡 **黄点** = 使用备用数据（API失败）
- 无点 = 正在加载

## 🎯 你的实际活动数据

从API获取到的最近活动：

```
2025-09-27: WatchEvent (Star了 github/spec-kit)
2025-09-21: 多次 PushEvent (cortex 项目)
2025-09-21: CreateEvent (创建 cortex 仓库)
2025-09-14: PushEvent (local-ai-demo 项目)
```

**这些活动都在12周范围内，应该会显示！**

## 🔧 为什么可能看不到活动？

### 可能原因1: 活动太少
```
如果12周内只有10个events，分散在84天里
→ 大部分格子会是灰色（0 contributions）
→ 只有少数几天有颜色
```

### 可能原因2: 时区问题
```
GitHub API 使用 UTC 时间
你在悉尼 (UTC+11)
→ 可能日期显示有偏差
```

### 可能原因3: 缓存问题
```
浏览器可能缓存了旧数据
→ 按 Ctrl+Shift+R 强制刷新
```

### 可能原因4: 今天的push还没更新
```
你刚刚push的代码
→ GitHub Events API 需要几分钟更新
→ 等待5-15分钟后刷新
```

## ✅ 解决方案

### 立即测试：

1. **强制刷新网站**：
   ```
   Windows/Linux: Ctrl + Shift + R
   Mac: Cmd + Shift + R
   ```

2. **检查控制台日志**：
   - 打开 F12 开发者工具
   - 查看 Console 标签
   - 应该看到 "📊 GitHub Events fetched: X"

3. **验证绿点**：
   - 如果看到绿点 🟢 = API工作正常
   - 如果看到黄点 🟡 = API失败，使用备用数据

### 增加活动显示：

**方法1: 做更多GitHub活动**
```bash
# 创建一些commits
git commit --allow-empty -m "Test commit"
git push

# Star一些仓库
# Fork一些项目
# 创建Issues
```

**方法2: 等待今天的push更新**
```
你今天push的 personal-website 更新
应该在 5-15分钟内 出现在API中
```

**方法3: 检查是否有private仓库**
```
如果你的commits在private仓库
→ 不会显示在public events中
→ 需要添加GitHub token才能看到
```

## 🚀 改进建议

### 添加GitHub Token（可选）

如果想看到更多数据（包括private仓库）：

1. 创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```

2. 更新代码使用token：
```typescript
const response = await fetch(
  `https://api.github.com/users/${username}/events?per_page=100`,
  {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
    }
  }
);
```

**好处**：
- 可以看到private仓库活动
- 更高的API限制（5000次/小时 vs 60次/小时）
- 更完整的活动历史

## 📈 预期效果

### 正常情况下应该看到：

```
Activity Card:
┌─────────────────────────────────┐
│ 📊 GitHub Activity 🟢          │
│                    10 contributions│
├─────────────────────────────────┤
│ [灰][灰][灰][绿][灰][灰][灰]... │
│ [灰][灰][绿][绿][灰][灰][灰]... │
│ [灰][灰][灰][灰][灰][灰][灰]... │
│ ...                             │
├─────────────────────────────────┤
│ Less [▢][▢][▢][▢][▢] More      │
└─────────────────────────────────┘
```

- 大部分格子是灰色（没有活动）
- 9月21日和9月27日应该有颜色（有活动）
- 鼠标悬停显示具体数字

## 🎯 下一步行动

1. **立即检查**：
   - 访问网站并强制刷新
   - 打开控制台查看日志
   - 确认绿点是否显示

2. **等待更新**：
   - 今天的push可能需要5-15分钟
   - 稍后再刷新查看

3. **增加活动**：
   - 多做一些commits和push
   - Star一些仓库
   - 创建Issues或PR

4. **报告结果**：
   - 告诉我控制台显示了什么
   - 是否看到绿点
   - 是否看到任何有颜色的格子

---

**需要帮助？** 告诉我：
1. 控制台显示了什么日志？
2. 是否看到绿点指示器？
3. 是否看到任何有颜色的格子？

