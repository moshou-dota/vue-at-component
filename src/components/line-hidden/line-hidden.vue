<template>
  <p class="content-container" :class="className" style="-webkit-box-orient: vertical">
    <span class="content-card">{{containerContent}}</span>
  </p>
</template>

<script>
export default {
  name: 'LineHidden',
  props: {
    containerStyle: {
      type: Object,
      require: false,
      default () {
        return {
          rows: 2,
          lineHeight: 18,
          className: 'content'
        }
      }
    },
    containerContent: {
      type: String,
      require: false
    }
  },
  data() {
    return {
      className: '',
      containerElement: ''
    }
  },
  mounted() {
    this.optimizeUI()
  },
  activated() {
    this.optimizeUI()
  },
  methods: {
    optimizeUI() {
      let userAgent = window.navigator.userAgent
      if (this.containerStyle && JSON.stringify(this.containerStyle) !== '{}') {
        this.$nextTick(() => {
          if (
            userAgent.indexOf('Chrome') > -1 ||
            userAgent.indexOf('Safari') > -1
          ) {
            let rows = this.containerStyle.rows
            let clsName = `block-hidden ${this.containerStyle.className || ''}`
            switch (rows) {
              case 1 : 
                clsName += ' limit-one'
                break
              case 2 :
                clsName += ' limit-two'
                break
              case 3 :
                clsName += ' limit-three'
                break
            }
            this.className = clsName
          } else if (
            this.$el.children[0].offsetHeight > (this.containerStyle.rows * this.containerStyle.lineHeight)
          ) {
            this.className = `text-hidden ${this.containerStyle.className  || ''}`
          } else {
            this.className = `${this.containerStyle.className  || ''}`
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.content-container {
  overflow: hidden;
  position: relative;
  &.text-hidden {
    &::after {
      content: '...';
      position: absolute;
      bottom: 0;
      right: 0;
      padding-left: 20px;
    }
  }
  &.block-hidden {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    &.limit-one {
      -webkit-line-clamp: 1;
    }
    &.limit-three {
      -webkit-line-clamp: 3;
    }
  }
  .content-card {
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
  }
}
</style>
