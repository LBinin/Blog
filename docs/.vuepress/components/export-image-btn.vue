<template>
  <div class="export-image-btn-wrapper">
    <button
      class="export-image-btn"
      @click="generateImage"
      :disabled="loading"
    >
      <i v-if="loading" class="el-icon-loading"></i>
      {{label}}
    </button>
    <div
      v-show="showResult"
      class="export-image-result-wrapper"
    >
      <div
        ref="exportImagesResult"
        class="export-image-result"
      />
      <div class="export-image-result__tooltip">
        <span>👇🏻 长按或右键保存图片</span>
      </div>
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
    label: {
      type: String,
      default: '导出当前文章为图片'
    },
    selector: {
      type: String,
      default: '.content'
    },
    scale: {
      type: Number,
      default: null
    }
  },
  mounted() {
    this.options = {
      logging: false,
      onclone: (doc) => {
        const el = doc.querySelector(this.selector)
        el.style.width = "400px"
        el.style.paddingBottom = "50px"
      },
      ignoreElements: (el) => {
        if (el.classList.contains("export-image-btn-wrapper")) {
          return true
        }
      }
    }

    if (this.scale) {
      Object.assign(this.options, {scale: this.scale})
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
        const canvasWidth = parseInt(canvas.style.width)
        console.log(window.innerWidth, canvasWidth)
        if (window.innerWidth - 10 <= canvasWidth) {
          const targetWidth = window.innerWidth * 0.8
          const ratio = targetWidth / canvasWidth
          console.log(ratio)
          canvas.style.zoom = ratio
        }
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

    &:disabled {
      opacity: .7;
      cursor: not-allowed;
    }

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
      text-align: center;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding-top: 90px;
      box-sizing: border-box;
      z-index: 2;

      canvas {
        margin: 20px 0 110px;
        border-radius: 5px;
        display: inline-block;
        box-shadow: 0 5px 20px rgba($color: #000000, $alpha: 0.3);
        // transform: scale(0.5)
        // zoom: 0.5;
      }
    }

    .export-image-result__tooltip {
      position: absolute;
      border-radius: 10px;
      top: 20px;
      box-shadow: 0 5px 15px rgba($color: #000000, $alpha: 0.2);
      display: flex;
      justify-content: center;
      z-index: 1;

      span {
        font-size: 18px;
        font-weight: bold;
        border-radius: 10px;
        z-index: 2;
        background: #fff;
        padding: 0.6em 1.5em;
      }

      &::after {
        content: "";
        display: block;
        height: 30px;
        width: 30px;
        position: absolute;
        bottom: -10px;
        background: #fff;
        transform: rotate(45deg);
        box-shadow: 0 5px 15px rgba($color: #000000, $alpha: 0.2);
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
      z-index: 3;

      i {
        opacity: .9;
        font-size: 45px;
      }
    }
  }
}
</style>