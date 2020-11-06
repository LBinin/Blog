# Lighthouse 使用入门

## 简介

> Lighthouse: Auditing, performance metrics, and best practices for Progressive Web Apps

Lighthouse 是一个开源的自动化工具，用于改进「网络应用」PWA 的质量。

### 安装

见 [GitHub - GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse)

现有两种安装方式：

- 安装 Chrome 扩展
  
  [Lighthouse - Chrome 网上应用店](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=zh-cn)（需梯子）

- 安装 CLI 工具

  ```bash
  npm install -g lighthouse
  # or use yarn:
  # yarn global add lighthouse
  ```

### 使用

- Chrome 扩展

  打开一个页面后，在右上角的扩展中可以看到一个「灯塔」的蓝色图标。

  点击后可以看到两个按钮：`option` 和 `Generate report`。

  **option**：可以在这里针对性选择你需要的审查内容。

  **Generate report**：开始针对当前打开的页面进行 Lighthouse 测试；测试完毕后将会显示一个检测报告。

- CLI 工具

  ```bash
  lighthouse https://your-url.com/
  ```

## 审计标准

Lighthouse 中的审计包含了五个指标：

- Performance
- Progressive Web App
- Accessibility
- Best Practices
- SEO

## Lighthouse 评分指南

> 本段针对 Lighthouse v3 版本，原文地址：[Lighthouse Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring?hl=zh-cn)，笔者进行翻译和总结。

Lighthouse 会对五项[审计标准](#审计标准)进行评审，每项分数为 0~100 分。

0 分通常表示 Lighthouse 发生了错误，可以尝试重新测试或者提交 issue 给 Lighthouse。

### Performance

### Progressive Web App

### Accessibility

### Best Practices

### SEO

## 参考资料

> [使用 Lighthouse 审查网络应用 | Tools for Web Developers | Google Developers](https://developers.google.com/web/tools/lighthouse/?hl=zh-cn)
> 
> [Lighthouse的使用与Google的移动端最佳实践 - 知乎](https://zhuanlan.zhihu.com/p/33752746)
> 
> [你一定要知道的 Chrome DevTool 新功能 - WEB前端 - 伯乐在线](http://web.jobbole.com/91769/)