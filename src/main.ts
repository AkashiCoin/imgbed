import { createApp } from "vue";
// import App from './AppXHR.vue'
// import App from './AppDown.vue'
// import App from './AppUpload.vue'
// import Upload from './AppFetch.vue'
import App from "./App.vue";
import router from "./router";
import "element-plus/lib/theme-chalk/index.css";
import "./assets/global.css";
import {
  ElIcon,
  ElContainer,
  ElMain,
  ElUpload,
  ElHeader,
  ElSelect,
  ElOption,
  ElRadio,
  ElTabs,
  ElTabPane,
  ElInput,
  ElTag,
  ElFooter,
  ElLink,
  ElButton,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup
} from "element-plus";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const app = createApp(App);

// Vue.prototype.api = "https://"

const components = [
  ElIcon,
  ElContainer,
  ElMain,
  ElHeader,
  ElUpload,
  ElRadio,
  ElTabs,
  ElTabPane,
  ElInput,
  ElTag,
  ElLink,
  ElButton,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElFooter
];
// const plugins = []

NProgress.configure({ trickle: false });

app.config.globalProperties.$NProgress = NProgress;
app.config.globalProperties.$api = "https://img.smoe.top/api";

components.forEach((component) => {
  app.component(component.name, component);
});

// plugins.forEach(plugin => {
//     app.use(plugin)
// })

app.use(router);
app.mount("#app");
