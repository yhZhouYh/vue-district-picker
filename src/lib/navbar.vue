<template>
    <div class="navbar">
        <div class="bar-content" :class="[mode,direction,{active: isExpand}]" :style="{zIndex}">
            <slot></slot>
        </div>
        <div class="tf-mask" :class="{active: isExpand}" v-show="mask" @click="close"></div>
    </div>
</template>
<script>
export default {
  name: 'bar',
  props: {
    mode: {
      type: String,
      default: 'side'
    },
    direction: {
      type: String,
      default: 'left'
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: String,
      default: '5000'
    }
  },
  methods: {
    close () {
      this.$emit('update:isExpand', !this.isExpand)
      // this.$emit('colse', false)
    }
  }
}
</script>
<style lang="less">
.navbar {
    position: absolute;
    // width: 100%;
    height:100%;
    bottom:0;
    .bar-content {
        position: fixed;
        z-index: 5000;
        transition-property: transform;
        transition-duration: 400ms;
        transition-timing-function: cubic-bezier(.25, .8, .25, 1);
        &.side {
            height: 100%;
            top:0;
            bottom:0;
            &.left {
                left: 0;
                transform: translate3d(-100%, 0, 0)
            }
            &.right {
                right: 0;
                transform: translate3d(100%, 0, 0)
            }
        }
        &.foot {
            width: 100%;
            left:0;
            right:0;
            &.bottom {
                bottom: 0;
                transform: translate3d(0, 100%, 0)
            }
            &.top {
                top: 0;
                transform: translate3d(0, -100%, 0)
            }
        }
        &.active {
            transform: translate3d(0, 0, 0)!important
        }
    }
}

.tf-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index: 2000;
    visibility: hidden;
    opacity: 0;
    background: rgba(0, 0, 0, 0.6);
    &.active {
        visibility: visible;
        opacity: 1;
    }
}
</style>


