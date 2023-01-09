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

export default defineComponent({
    naem: "App",
    components: {
    },
    setup() {
        return {};
    },
})
</script>
