<template>
  <div>
    <details :open="open" v-for="(item, index) in menu" :key="index">
      <summary><strong>{{item}}</strong></summary>

      <list :tab="tab" :category="item"/>

    </details>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: true
    },
    tab: {
      type: String,
      default: ''
    },
    menu: {
      type: Array,
      default: ''
    }
  }
}
</script>