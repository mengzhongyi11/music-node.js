# CloudMusic Backend — 云上乐后端服务

微信小程序「云上乐」的后端 API 服务，基于 Node.js + Express + MongoDB。

## 技术栈

| 技术               | 用途          |
| ------------------ | ------------- |
| Node.js / Express  | 服务端框架    |
| MongoDB / Mongoose | 数据库        |
| JWT (jsonwebtoken) | Token 认证    |
| bcrypt             | 密码加密      |
| Axios              | 微信 API 调用 |

## 环境要求

- **Node.js**: 18.x+
- **MongoDB**: 6.x+（本地运行，默认端口 27017）
- **npm**: 9.x+

## 快速启动

```bash
# 安装依赖
npm install

# 确认 MongoDB 已运行（默认配置即可）
# 启动服务
node app.js

# 输出：Running
# 监听端口：3001
```

## 项目结构

```
project/
├── app.js                # Express 入口，挂载路由
├── config.js             # JWT 密钥和有效期配置
├── db.js                 # MongoDB 连接、Schema 定义、Model 导出
├── package.json
│
├── router/
│   ├── user.js           # 用户注册 / 登录 / 微信登录
│   ├── userinfo.js       # 用户信息查询 / 修改 / 发布查询
│   ├── red_heart.js      # 收藏管理（添加 / 删除 / 查询 / 标记）
│   ├── data.js           # 数据管理（视频 / 歌曲 / 发布 / 搜索）
│   ├── dynamics.js       # 动态（分享 / 查询）
│   └── validator.js      # 校验函数（账号 / 密码 / 手机号）
│
└── image/                # 静态资源
```

## 数据库

> ⚠️ **注意**：当前数据库数据已清空（无数据），需要自行导入或通过功能逐步填充。

### 数据库: `songList` (MongoDB)

### Collections

| Model                | 集合名       | 说明                                   |
| -------------------- | ------------ | -------------------------------------- |
| `userInfoSchema`     | users        | 用户（账号、密码、昵称、头像、签名等） |
| `songListSchema`     | hesrt        | 红心歌曲                               |
| `playListSchema`     | play         | 红心歌单                               |
| `focusVideoSchema`   | video        | 红心视频                               |
| `friendListSchema`   | friend       | 好友关注                               |
| `FocusSyncSchema`    | focus        | 关注列表                               |
| `pubilshDataSchema`  | pubilshData  | 用户发布                               |
| `dynamicsDataSchema` | dynamicsData | 用户动态                               |
| `videoDataSchema`    | videoDatas   | 视频数据                               |
| `songDataSchema`     | songDatas    | 歌曲数据（搜索用）                     |
| `histroyDataSchema`  | histroyDatas | 搜索历史                               |

## API 接口

### 用户认证 (`/api`)

| 方法 | 路径             | 说明                    | 认证 |
| ---- | ---------------- | ----------------------- | ---- |
| POST | `/api/register`  | 账号注册                | ❌   |
| POST | `/api/login`     | 账号密码登录            | ❌   |
| POST | `/api/Login_wei` | 微信登录（获取 openId） | ❌   |
| POST | `/api/weixin`    | 微信登录（签发 token）  | ❌   |

### 用户信息 (`/user`)

| 方法 | 路径                  | 说明                                               | 认证 |
| ---- | --------------------- | -------------------------------------------------- | ---- |
| POST | `/user/queryInfo`     | 查询当前用户信息                                   | ✅   |
| POST | `/user/updateInfo`    | 更新用户信息（昵称/账号/密码/手机/头像/签名/生日） | ✅   |
| POST | `/user/querytPubilsh` | 查询用户发布                                       | ✅   |
| POST | `/user/upPass`        | 通过手机号重置密码                                 | ❌   |
| POST | `/user/querytPhone`   | 发送验证码（验证手机号是否存在）                   | ❌   |
| POST | `/user/contrast`      | 校验验证码                                         | ❌   |

### 收藏管理 (`/red`)

| 方法 | 路径              | 说明                                                      | 认证 |
| ---- | ----------------- | --------------------------------------------------------- | ---- |
| POST | `/red/addData`    | 添加/取消收藏（切换式：存在则删除，不存在则添加）         | ✅   |
| POST | `/red/deleteData` | 删除收藏                                                  | ✅   |
| POST | `/red/querytlist` | 查询收藏列表（支持 heart/play/video/friend/focus 等类型） | ✅   |
| POST | `/red/tagquery`   | 标记查询（遍历列表标记已收藏/未收藏状态）                 | ✅   |

### 数据管理 (`/data`)

| 方法 | 路径                  | 说明                      | 认证 |
| ---- | --------------------- | ------------------------- | ---- |
| POST | `/data/addData`       | 批量添加（视频/歌曲数据） | ❌   |
| POST | `/data/querytlist`    | 查询数据列表              | ❌   |
| POST | `/data/updateData`    | 更新视频数据              | ❌   |
| POST | `/data/addPubilsh`    | 发布视频                  | ❌   |
| POST | `/data/querytPubilsh` | 查询发布列表              | ❌   |
| POST | `/data/search`        | 模糊搜索（使用 Fuse.js）  | ❌   |
| POST | `/data/histroy`       | 查询搜索历史              | ❌   |
| POST | `/data/Addhistroy`    | 添加搜索历史              | ❌   |
| POST | `/data/Rankdomsearch` | 随机搜索                  | ❌   |

### 动态 (`/dynamics`)

| 方法 | 路径                  | 说明             | 认证 |
| ---- | --------------------- | ---------------- | ---- |
| POST | `/dynamics/share`     | 发布动态         | ❌   |
| POST | `/dynamics/data`      | 查询用户动态     | ❌   |
| POST | `/dynamics/queryInfo` | 查询动态用户信息 | ❌   |

### 其他

| 路径       | 说明     |
| ---------- | -------- |
| `/tranfer` | 数据迁移 |

## 关键设计

### Token 认证

使用 JWT + express-jwt 中间件：

```js
// JWT 配置（通过环境变量注入）
module.exports = {
  jwtsSecreKey: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES || "1000h",
};
```

- Token 通过 `Authorization: Bearer <token>` 传递
- 白名单路径（`/api/`、`/data/`、`/user/` 下的部分接口）无需认证
- 验证失败返回 401

### 收藏切换逻辑

`/red/addData` 实现了"切换式"的添加/取消：

1. 查询数据库中是否已有该数据
2. 不存在 → 添加
3. 存在 → 删除（取消收藏）
4. 前端根据返回的 `message`（"添加成功" / "取消成功"）更新 UI

### 搜索实现

使用 Fuse.js 实现模糊搜索：

```js
const fuse = new Fuse(result, {
  keys: ["data.name"],
  threshold: 0.3, // 模糊度阈值
});
```

### 数据校验

在 `validator.js` 中提供：

- `validateAccount` — 3-20 位字母/数字/下划线，字母开头
- `validatePassword` — 3-32 位，至少含字母+数字/特殊字符
- `validatePhone` — 11 位手机号格式验证

## 开发说明

### 隐秘数据保护

当前项目中的敏感信息已替换为环境变量：

| 位置 | 敏感数据 | 替换方案 |
|------|---------|--------|
| `config.js` | JWT 密钥 | `process.env.JWT_SECRET` |
| `router/user.js` | 微信 AppID | `process.env.WX_APPID` |
| `router/user.js` | 微信 AppSecret | `process.env.WX_SECRET` |

**推荐包装方式**：

```js
// config.js
module.exports = {
  jwtsSecreKey: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES || "1000h",
};
```

```js
// router/user.js
const WX_APPID = process.env.WX_APPID;
const WX_SECRET = process.env.WX_SECRET;
```

> 当前代码中已删除所有硬编码默认值，必须通过环境变量注入才能运行。

**必须配置的环境变量**：

| 变量名        | 说明                             | 示例值                      |
| ------------- | -------------------------------- | --------------------------- |
| `MONGO_URI`  | MongoDB 连接地址（选填，默认本机） | `mongodb://localhost:27017/songList` |
| `JWT_SECRET`  | JWT 签名密钥（必填）             | `your-random-secret-string` |
| `JWT_EXPIRES` | Token 有效期（选填，默认 1000h） | `1000h`                     |
| `WX_APPID`    | 微信小程序 AppID（必填）         | `your-wechat-appid`         |
| `WX_SECRET`   | 微信小程序 AppSecret（必填）     | `your-app-secret`           |

**`.env` 文件示例**（不应提交到 Git）：

```
MONGO_URI=mongodb://localhost:27017/songList
JWT_SECRET=your-random-secret-string
JWT_EXPIRES=1000h
WX_APPID=your-wechat-appid
WX_SECRET=your-app-secret
```

### 添加新 API

1. 在 `router/` 下新建路由文件
2. 在 `db.js` 定义 Schema 和 Model
3. 在 `app.js` 挂载路由
4. 按需要在 `expressJWT.unless` 白名单中添加路径

