<template>
  <SWUpdatePopup>
    <div
      slot-scope="{ enabled, reload, message, buttonText }"
      class="update-popup"
      v-if="enabled"
    >
      <b>{{ message }}</b>
      <button class="blog-btn" @click="reload">{{ buttonText }}</button>
    </div>
  </SWUpdatePopup>
</template>

<script>
import SWUpdatePopup from "@vuepress/plugin-pwa/lib/SWUpdatePopup.vue";

export default {
  components: { SWUpdatePopup }
};
</script>

<style lang="scss" scope>
.update-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  padding: 10px;
  border: 4px solid #3eaf7c;
  border-radius: 8px;
  z-index: 2;
}
</style>