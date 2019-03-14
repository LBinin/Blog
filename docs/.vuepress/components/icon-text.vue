<template>
  <span class="icon-text">
    <span v-if="!reverse" class="icon-text__text" :class="{bold: bold}">{{text}}</span>
    <img class="icon-text__icon" :class="{border: border}" :src="imgSrc" :alt="text">
    <img v-if="test" v-for="item in items" :key="item" :src="`http://lol.qq.com/act/a20170926preseason/img/runeBuilder/runes/108x108/${item}.png`" />
    <span v-if="reverse" class="icon-text__text" :class="{bold: bold}">{{text}}</span>
  </span>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    bold: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    },
    test: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // for (let i = 8200; i <= 8300; i++) {
    //   this.items.push(i);
    // }
    // console.log(this.items)
  },
  data () {
    return {
      items: []
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-text {
  font-size: inherit;

  .icon-text__text {
    font-size: inherit;
    vertical-align: middle;

    &.bold {
      font-weight: bold;
    }
  }

  .icon-text__icon {
    height: 2em;
    vertical-align: middle;
    margin-right: 0.3em;

    &.border {
      border-radius: 50%;
      border: 2px solid #c8aa6e;
    }
  }
}
</style>