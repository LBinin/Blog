<template>
  <ul>
    <li v-for="(item, index) in list" :key="index">
      <a :href="`${item[0]}.html`">{{item[1]}}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    }
  },
  methods: {
    getList(tab, category) {
      if (!tab) {
        return []
      }

      const sidebar = this.$site.themeConfig.sidebar

      for (let key of Object.keys(sidebar)) {
        if (key === `\/${tab}\/`) {
          const menu = sidebar[key]

          for (let item of menu) {
            if (!(item instanceof Object) || item.title !== category) {
              continue
            }

            const menuChildren = item.children

            if (menuChildren && menuChildren.length > 0) {
              return menuChildren
            }
          }
        }
      }

      return []
    }
  },
  computed: {
    list() {
      return this.getList(this.tab, this.category)
    }
  }
}
</script>