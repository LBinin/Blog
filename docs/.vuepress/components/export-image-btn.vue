<template>
  <div class="export-image-btn-wrapper">
    <button
      class="export-image-btn"
      @click="generateImage"
    >导出当前文章为图片</button>
    <div
      v-show="showResult"
      class="export-image-result-wrapper"
    >
      <div
        ref="exportImagesResult" 
        class="export-image-result"
      />
      <button class="export-image-result__close-btn" @click="closeView">
        <i class="iconfont icon-guanbi"></i>
      </button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

// TODO: 生成手机、PC 样式

export default {
  props: {
    selector: {
      type: String,
      default: '.content'
    },
    scale: {
      type: Number,
      default: window.devicePixelRatio
    }
  },
  mounted() {
    this.options = {
      logging: false,
      scale: this.scale,
      onclone: (doc) => {
        const el = doc.querySelector(this.selector)
        el.style.width = "400px"
      },
      ignoreElements: (el) => {
        if (el.classList.contains("export-image-btn-wrapper")) {
          return true
        }
      }
    }
  },
  data() {
    return {
      showResult: false,
      loading: false
    }
  },
  methods: {
    generateImage() {
      this.loading = true
      const el = this.target
      const options = this.options
      html2canvas(el, options).then((canvas) => {
        this.showResult = true
        this.$refs.exportImagesResult.innerHTML = ""
        this.$refs.exportImagesResult.appendChild(canvas)
        this.loading = false
      });
    },

    closeView() {
      this.showResult = false
    }
  },
  computed: {
    target() {
      return document.querySelector(this.selector)
    }
  },
  watch: {
    showResult(newValue) {
      document.body.style.overflow = newValue ? "hidden" : "auto"
    }
  }
}
</script>

<style lang="scss">
.export-image-btn-wrapper {
  .export-image-btn {
    background: #3eaf7c;
    color: #fff;
    padding: 0.5em;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.3s;
    border: none;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    i {
      font-size: 1.5em;
      vertical-align: sub;
    }

    &:hover {
      text-decoration: none !important;
      background: #59c795;
    }
  }

  .export-image-result-wrapper {
    z-index: 999;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba($color: #000000, $alpha: 0.3);
    display: flex;
    justify-content: center;

    .export-image-result {
      height: 100%;
      width: 100%;
      overflow: auto;
      text-align: center;

      canvas {
        border-radius: 5px;
        margin: 20px 0 90px;
        display: inline-block;
        box-shadow: 0 5px 20px rgba($color: #000000, $alpha: 0.3);
        // transform: scale(0.5)
        // zoom: 0.5;
      }
    }

    .export-image-result__close-btn {
      position: absolute;
      bottom: 20px;
      background: transparent;
      border: none;
      color: #3eaf7c;
      cursor: pointer;
      padding: 0;

      i {
        opacity: .9;
        font-size: 50px;
      }
    }
  }
}
</style>