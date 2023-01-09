<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Down from './views/Down.vue'
import Up from './views/Upload.vue'
import Share from './views/Share.vue'
import Home from './views/Home.vue'

export default defineComponent({
    naem: "App",
    components: {
        Down,
        Up,
        Share,
        Home
    },
    setup() {
        return {};
    },
})
</script>
