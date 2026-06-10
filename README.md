# France Route Atlas

一个以法国为首版示例的交互式旅行路线网站。首页是杂志风入口，地图页使用 OpenStreetMap 展示自定义路线；用户可以自己添加想去的城市，城市会自动显示在地图上并按添加顺序连线。

## 本地运行

```bash
npm install
npm run dev
```

然后打开终端输出的本地地址，通常是 `http://127.0.0.1:5173`。

## 内容扩展

国家基础数据集中放在 `src/data/countries.js`。添加其他国家时，新增一个国家对象即可复用现有组件：

- `countryName`：国家名称
- `center` / `zoom`：地图初始视角
- `heroImage`：首页主视觉
- `routeStops`：默认路线站点，首版保持为空，让用户自己添加
- `guides`：默认攻略内容，首版保持为空

## 在网页里添加城市

进入地图页后，右侧攻略面板底部有“添加城市”表单。填写城市名、停留天数和攻略内容后，点击“添加到路线”，系统会自动查找坐标并把城市显示在地图上。

城市会保存在当前浏览器的 `localStorage` 中；如果想清空路线，点击“清除全部”。

## 发布到 GitHub Pages

项目已经包含 `.github/workflows/deploy.yml`，推送到 GitHub 的 `main` 分支后会自动构建并部署到 GitHub Pages。

1. 在 GitHub 新建一个 public repository。
2. 上传本项目文件，注意不要上传 `node_modules` 和 `dist`。
3. 进入仓库的 `Settings` -> `Pages`。
4. 在 `Build and deployment` 里选择 `GitHub Actions`。
5. 等待 `Actions` 里的部署任务完成。

完成后 GitHub 会给出公网地址，通常类似：

```text
https://你的用户名.github.io/仓库名/
```
