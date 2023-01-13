<template>
  <div>
    <Bg></Bg>
    <el-container>
      <toolTip></toolTip>
      <el-main>
        <div class="main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Down from "./views/Down.vue";
import Up from "./views/Upload.vue";
import Share from "./views/Share.vue";
import Home from "./views/Home.vue";
import Bg from "./components/BackgroudLoad.vue";
import toolTip from "./components/ToolTip.vue";

export default defineComponent({
  name: "App",
  components: {
    Down,
    Up,
    Share,
    Home,
    Bg,
    toolTip,
  },
  setup() {
    return {};
  },
});
</script>
<style scoped>
.el-container {
  box-sizing: border-box;
  padding-top: 15vh;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  z-index: 1;
}
.el-main {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  padding: 0 !important;
  min-height: 0;
  flex: none;
}
.main {
  margin-top: 5vh;
  width: min(844px, 88vw);
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
