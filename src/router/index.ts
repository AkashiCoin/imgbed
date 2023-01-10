
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import App from './AppXHR.vue'
import Home from '../views/Home.vue'
import Down from '../views/Down.vue'
import Up from '../views/Upload.vue'
import Share from '../views/Share.vue'
import ShareManager from '../views/ShareManager.vue'
import LocalManager from '../views/LocalManager.vue'
// import Upload from '../AppFetch.vue'



const routes: Array<RouteRecordRaw> = [
    { path: '/', name:           "首页", component: Home, meta: { transition: 'fade' }, },
    { path: '/download', name:   "下载", component: Down, meta: { transition: 'slide-left' }, },
    { path: '/upload', name:     "上传", component: Up, meta: { transition: 'slide-right' }, },
    { path: '/s/:shareid', name: "文件分享", component: Share, meta: { transition: 'fade' }, },
    { path: '/manager/share', name: "分享文件管理", component: ShareManager, meta: { transition: 'fade' }, },
    { path: '/manager/local', name: "本地文件管理", component: LocalManager, meta: { transition: 'fade' }, },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
    linkActiveClass: 'linkActiveClass'
})

export default router