import { createApp } from 'vue'
// import App from './AppXHR.vue'
// import App from './AppDown.vue'
// import App from './AppUpload.vue'
// import Upload from './AppFetch.vue'
import App from './App.vue'
import router from './router'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/global.css'
import { ElIcon, ElContainer, ElMain, ElUpload, ElHeader, ElSelect, ElOption, ElRadio, ElTabs, ElTabPane, ElInput, ElTag, ElFooter, ElLink } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const app = createApp(App)

// Vue.prototype.api = "https://"

const components = [
  ElIcon, ElContainer, ElMain, ElHeader,
  ElUpload, ElRadio,
  ElTabs, ElTabPane,
  ElInput, ElTag, ElLink,
]
// const plugins = []

NProgress.configure({ trickle: false });



components.forEach(component => {
  app.component(component.name, component)
})

// plugins.forEach(plugin => {
//     app.use(plugin)
// })



app.use(router)
app.mount('#app')
