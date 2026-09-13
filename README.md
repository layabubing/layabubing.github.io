# layabubing.github.io

Downloading / layabubing 的个人主页，纯静态站点（HTML / CSS / JS），托管于 GitHub Pages。

## 页面

- `index.html` — 首页（关于摘要 + 精选项目）
- `about.html` — 关于与技术栈
- `projects.html` — 项目列表（数据驱动）
- `blog.html` / `post.html` — 随笔列表与阅读页
- `contact.html` — 联系方式

## 内容与数据

- `data/projects.json` — 项目数据（个人 / 组织 / 归档）
- `posts/*.md` — 随笔，Markdown + YAML front matter（title / date / excerpt / tags）

## 后台（/admin）

站点后台基于 [Sveltia CMS](https://github.com/sveltia/sveltia-cms)，数据直接读写本仓库，无需服务器。

使用方法：

1. 在 GitHub 生成一个 Personal Access Token（fine-grained 即可，只需本仓库的 **Contents: Read and write** 权限）。
2. 打开 `https://layabubing.github.io/admin/`。
3. 用该 Token 登录，即可在线编辑项目列表和撰写随笔；保存会自动提交到 `main` 分支并触发 Pages 部署。

> Token 仅保存在使用者浏览器的 localStorage 中，不会进入仓库。
