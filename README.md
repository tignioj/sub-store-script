# Sub-Store 实用脚本集合

> 一系列适用于 Sub-Store 的实用脚本，增强你的订阅管理体验

## 📖 项目简介

本项目收集了多个针对 Sub-Store 的实用脚本，旨在简化订阅配置流程、增强功能体验。所有脚本均经过测试验证，可直接用于 Mihomo Party 等客户端。

## 🚀 脚本列表

### 1. [JustMySocks 流量额度显示](./justmysocks-bandwidth.js)

自动获取 JustMySocks 的流量使用情况，并在客户端显示流量进度条、已用流量和重置日期。

**主要特性：**
- ✅ **零配置**：自动从订阅 URL 提取 `service` 和 `id` 参数
- ✅ **实时流量**：显示已用流量和总流量额度
- ✅ **可视化进度**：在 Mihomo Party 中显示进度条
- ✅ **重置日期**：自动计算下次流量重置时间

**使用场景：**
- JustMySocks 用户需要实时查看流量使用情况
- 希望在订阅列表中直观显示流量信息

**详细文档：** [justmysocks-bandwidth-README.md](./justmysocks-bandwidth-README.md)

## 📦 快速开始

### 方式一：直接使用（推荐）

1. 在 Sub-Store 中打开订阅配置
2. 添加"脚本操作"
3. 选择"本地文件"并选择对应的 `.js` 文件
4. 保存配置

### 方式二：远程引用

将脚本文件上传至 GitHub Gist 或其他可访问的 URL，然后在 Sub-Store 中引用该 URL。

### 方式三：复制粘贴

复制脚本内容，在 Sub-Store 的"自定义脚本"中粘贴使用。

## 📂 项目结构

```
sub-store-script/
├── README.md                        # 项目说明文档（本文件）
├── LICENSE                          # 开源协议
├── justmysocks-bandwidth.js         # JustMySocks 流量统计脚本
└── justmysocks-bandwidth-README.md  # JustMySocks 脚本详细文档
```

## 🛠️ 技术栈

- **运行环境**：Sub-Store 脚本引擎
- **支持的客户端**：Mihomo Party、Clash Verge 等
- **开发语言**：JavaScript (ES6+)

## 📝 使用要求

- Sub-Store 版本：支持脚本操作功能
- 客户端：支持 `subscription-userinfo` 响应头解析

## 🤝 贡献指南

欢迎提交新的脚本或改进现有脚本！

### 贡献方式

1. Fork 本仓库
2. 创建新的功能分支 (`git checkout -b feature/new-script`)
3. 提交更改 (`git commit -m 'feat: add new script'`)
4. 推送到分支 (`git push origin feature/new-script`)
5. 创建 Pull Request

### 脚本开发规范

- 遵循 JavaScript ES6+ 语法规范
- 添加详细的注释说明
- 提供配套的 README 文档
- 包含错误处理机制
- 输出必要的日志信息


## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

## 🔗 相关链接

- [Sub-Store 官方仓库](https://github.com/sub-store-org/Sub-Store)
- [Sub-Store 官方文档](https://github.com/sub-store-org/Sub-Store/wiki)
- [Mihomo Party](https://github.com/mihomo-party/mihomo-party)

## ⚠️ 免责声明

本项目中的脚本仅供学习和研究使用，请勿用于任何违法用途。使用本脚本产生的一切后果由使用者自行承担，与开发者无关。

## 💬 问题反馈

如果在使用过程中遇到问题，请通过以下方式反馈：

1. 提交 [Issue](../../issues)
2. 查看相关脚本的详细文档
3. 参考 [Sub-Store 官方文档](https://github.com/sub-store-org/Sub-Store)

---

**如果这个项目对你有帮助，欢迎 ⭐ Star 支持！**
