# Sub-Store 脚本：JustMySocks 流量额度显示

## 接口返回格式

```json
{
  "monthly_bw_limit_b": 500000000000,
  "bw_counter_b": 12300042346,
  "bw_reset_day_of_month": 4
}
```

字段说明：
- `monthly_bw_limit_b`: 月流量总额（字节），示例为 500GB
- `bw_counter_b`: 已使用流量（字节），示例为约 12.3GB
- `bw_reset_day_of_month`: 每月重置日期，示例为每月4号

## 使用方法

### 方法 1：直接使用脚本文件

1. 在 Sub-Store 订阅配置中添加"脚本操作"
2. 选择"本地文件"
3. 选择 `justmysocks-bandwidth.js` 文件
4. 保存订阅配置

### 方法 2：复制粘贴脚本代码

1. 在 Sub-Store 订阅配置中添加"脚本操作"
2. 选择"自定义脚本"
3. 复制 `justmysocks-bandwidth.js` 文件内容并粘贴
4. 保存订阅配置

### 方法 3：通过 URL 引用

将脚本文件上传到 GitHub Gist 或其他可访问的 URL，然后在 Sub-Store 中引用。

## 脚本功能

### 自动获取流量信息
- 从 JustMySocks 流量统计接口获取实时数据
- 自动转换为标准的 `subscription-userinfo` 响应头格式

### 数据映射规则

| JustMySocks 字段 | subscription-userinfo 字段 | 说明 |
|-----------------|--------------------------|------|
| `bw_counter_b` | `download` | 已使用流量（字节） |
| - | `upload` | 固定为 0（接口不提供上行统计） |
| `monthly_bw_limit_b` | `total` | 月流量总额（字节） |
| `bw_reset_day_of_month` | `expire` | 计算下次重置时间戳 |

### Mihomo Party 显示效果

添加脚本后，Mihomo Party 会自动显示：

- ✅ **流量进度条**：可视化显示使用比例
- ✅ **流量数字**：如 `12.30 GB / 500.00 GB`
- ✅ **重置日期**：下次流量重置时间

## 参数配置

**自动从订阅 URL 提取参数**（零配置）

脚本会自动从订阅源 URL 中提取 `service` 和 `id` 参数，无需任何额外配置。

如果你的订阅链接格式为：
```
https://jmssub.net/members/getsub.php?service=123&id=xxx
```

脚本会自动识别并提取：
- `service` = `123`
- `id` = `xxx`

**默认值**：当订阅 URL 不包含这些参数时，会使用脚本中的默认值：
```javascript
let serviceId = 'YOUR_SERVICE_ID' // 默认 service ID（当订阅 URL 不包含参数时使用）
let userId = 'YOUR_USER_ID' // 默认 user ID（当订阅 URL 不包含参数时使用）
```

**效果**：
- ✅ 完全零配置，直接使用即可
- ✅ 自动识别订阅链接中的参数
- ✅ 简单直接，无需额外设置

## 使用示例

### 单个订阅

如果你的订阅链接包含 `service` 和 `id` 参数：
```
https://jmssub.net/members/getsub.php?service=123&id=xxx
```

直接添加脚本即可，无需任何配置。

### 多个订阅

每个订阅的 `service` 和 `id` 会自动从各自的订阅链接中提取，互不干扰。

例如：
- 订阅 A：`https://jmssub.net/members/getsub.php?service=111&id=aaa`
- 订阅 B：`https://jmssub.net/members/getsub.php?service=222&id=bbb`

脚本会自动识别每个订阅的参数。

### 远程托管

将脚本托管在 GitHub Gist：
```
https://gist.githubusercontent.com/your-username/gist-id/raw/justmysocks-bandwidth.js
```

在 Sub-Store 中引用此 URL，参数依然会自动从订阅链接中提取。

## 注意事项

1. **流量单位**：所有数值均为字节（Bytes），脚本会自动转换显示
2. **重置时间**：自动根据 `bw_reset_day_of_month` 计算下一次重置日期
3. **错误处理**：即使获取流量信息失败，也不会影响节点的正常使用
4. **缓存问题**：如需实时更新，在订阅 URL 后添加 `&noCache=true` 参数
5. **请求超时**：默认超时 10 秒，可根据网络情况调整 `timeout` 参数

## 测试验证

### 检查脚本是否生效

1. 在 Sub-Store 中点击"预览"按钮
2. 查看控制台日志，应该看到类似输出：
   ```
   ✅ 流量信息已更新
      已用: 12.30 GB / 500.00 GB
      重置日期: 2026-05-04
   ```

### 在 Mihomo Party 中验证

1. 更新订阅
2. 查看侧边栏的订阅卡片
3. 应该显示流量进度条和使用信息

## 故障排查

### 问题：没有显示流量信息

**检查清单：**
- [ ] 脚本是否正确添加到订阅配置
- [ ] service ID 和 user ID 是否正确
- [ ] 网络是否能访问 `https://justmysocks6.net`
- [ ] 查看 Sub-Store 控制台是否有错误日志

### 问题：流量显示为 0 / 0

**可能原因：**
- 接口返回数据格式变化
- 网络请求失败
- service ID 或 user ID 错误

**解决方法：**
- 在浏览器中直接访问流量接口，确认返回格式
- 查看脚本错误日志

## 相关文档

- [Sub-Store 官方文档](https://github.com/sub-store-org/Sub-Store)
- [Sub-Store 脚本示例](https://github.com/sub-store-org/Sub-Store/blob/master/scripts/example.js)
- [Mihomo Party 文档](./CLAUDE.md)
