# 基于 Cloudflare Workers 的 Telegram 图床

本项目提供了一个自托管的图床服务，使用 Telegram 作为存储，运行在 Cloudflare Workers 上，并以 D1 作为数据库。

## 功能特性

- 通过网页界面和 API 上传文件
- 支持分页的图片列表
- 删除图片（单个或全部）
- 所有管理端点均受基本身份认证（Basic Authentication）保护
- 使用 Wrangler 轻松部署

## 先决条件

- 一个 Cloudflare 账户
- 已安装 Node.js 和 npm
- 一个 Telegram 机器人及其令牌（Token）
- 一个 Telegram 聊天 ID（机器人需要有权限在该聊天中发送消息）

## 安装与部署

1.  **克隆代码仓库：**
    ```bash
    git clone https://github.com/benzBrake/TGFileBed tg-filebed
    cd tg-filebed
    ```

2.  **安装依赖：**
    ```bash
    npm install
    ```

3.  **登录 Wrangler：**
    ```bash
    npx wrangler login
    ```

关于如何创建

## 支持

如果您觉得这个项目有帮助，请考虑请我喝杯咖啡：

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/buyryanacoffie)