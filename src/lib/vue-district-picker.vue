<template>
  <navbar :isExpand.sync="showThis" mask mode="foot" direction="bottom" :zIndex="zIndex">
    <div class="city-selector-box">
      <div class="city-selector-header mr-flex  mr-1px-b mr-1px-t">
        <span class="header-cancel" @click="cancel">取消</span>
        <span class="header-confirm" @click="confirm">确认</span>
      </div>
      <div class="city-selector-body">
        <div class="top-mask mr-1px-b"></div>
        <div class="bottom-mask mr-1px-t"></div>
        <div class="main-body mr-flex">
          <div class="mr-flex1 wheel">
            <ul ref="province">
              <li v-for="item in province.data" :key="item">{{item}}</li>
            </ul>
            <div class="wheel-touch" ref="provinceTarget"></div>
          </div>
          <div class="mr-flex1 wheel">
            <ul ref="city">
              <li v-for="item in city.data" :key="item">{{item}}</li>
            </ul>
            <div class="wheel-touch" ref="cityTarget"></div>
          </div>
          <div class="mr-flex1 wheel">
            <ul ref="area">
              <li v-for="item in area.data" :key="item">{{item}}</li>
            </ul>
            <div class="wheel-touch" ref="areaTarget"></div>
          </div>
        </div>
      </div>
    </div>
  </navbar>
</template>
<script>
import Navbar from './navbar'
import AlloyTouch from './alloy_touch'
import Transform from './transform'
// import citydata from '../../../static/area.json' // 省市区数据
export default {
  name: 'VueDistrictPicker',
  components: {
    Navbar
  },
  props: {
    // 省市区数据
    citydata: {
      type: Object
    },
    // 双向绑定显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    zIndex: [Number],

    //初始化数据（对应省市区数据ID）
    areaData: {
      type: Array,
      default: () => {
        return ["340000", "340100", "340103"]
      }
    }
  },
  computed: {
    showThis: {
      set (newValue) {
        this.$emit('update:show', newValue)
      },
      get () {
        return this.show
      }
    }
  },
  data () {
    return {
      changeCityData: false,
      province: {
        data: this.citydata['86'],
        index: 0,
        target: null,
        touch: null,
        keys: [],
        id: '',
        value: ''
      },
      city: {
        data: null,
        index: 0,
        target: null,
        touch: null,
        keys: [],
        cityTouch: null,
        id: '',
        value: ''
      },
      area: {
        data: null,
        index: 0,
        target: null,
        touch: null,
        keys: [],
        area: null,
        id: '',
        value: ''
      }
    }
  },
  created () {
    this.province.keys = Object.keys(this.province.data)
    this.province.id = this.areaData[0]
    this.city.id = this.areaData[1]
    this.area.id = this.areaData[2]
    if (this.areaData.length) {
      this.province.index = this.idToIndex('86', this.areaData[0])
      this.city.index = this.areaData[1] && this.idToIndex(this.areaData[0], this.areaData[1])
      this.area.index = this.areaData[2] && this.idToIndex(this.areaData[1], this.areaData[2])
    }
  },
  mounted () {
    let {province, city, area} = this
    province.target = this.$refs.province
    province.touch = this.$refs.provinceTarget
    city.target = this.$refs.city
    city.touch = this.$refs.cityTarget
    area.target = this.$refs.area
    area.touch = this.$refs.areaTarget
    Transform(this.province.target)
    Transform(this.city.target)
    Transform(this.area.target)
    this.initialProvince()
    this.initialCity(this.city.id)
    this.initialArea(this.area.id)
  },

  methods: {
    // 初始化省份数据
    initialProvince () {
      this.province.id = this.indexToId('86', this.province.index)
      this.province.value = this.getNameById('86', this.province.id)
      let provinceConfig = this.config(this.province.touch, this.province.target, this.province.index, () => {
        this.province.index = proTouch.currentPage
        this.city.index = 0
        this.area.index = 0
        this.province.id = this.indexToId('86', this.province.index)
        this.province.value = this.getNameById('86', this.province.id)
        this.city.id = this.indexToId(this.province.id, 0)
        this.area.id = this.indexToId(this.city.id, 0)
        this.initialCity(this.city.id)
        this.initialArea(this.area.id)
      })
      let proTouch = new AlloyTouch(provinceConfig)
    },

    initialCity (id) {
      this.city.data = this.citydata[this.province.id] && {...this.citydata[this.province.id]}
      this.city.id = id
      this.city.value = this.getNameById(this.province.id, this.city.id)
      if (this.cityTouch) {
        this.cityTouch.stop()
        this.cityTouch.destroy()
        this.city.target.translateY = 0 // 强制让city栏translateY为0
      }
      if (this.city.data) {
        this.$nextTick(() => {
          let cityConfig = this.config(this.city.touch, this.city.target, this.city.index, () => {
            this.city.index = this.cityTouch.currentPage
            this.area.index = 0
            this.city.id = this.indexToId(this.province.id, this.city.index)
            this.city.value = this.getNameById(this.province.id, this.city.id)
            this.area.id = this.indexToId(this.city.id, 0)
            this.initialArea(this.area.id)
          })
          this.cityTouch = new AlloyTouch(cityConfig)
        })
      }
    },

    initialArea (id) {
      this.area.data = this.citydata[this.city.id] && {...this.citydata[this.city.id]}
      this.area.id = id
      this.area.value = this.getNameById(this.city.id, this.area.id)
      if (this.areaTouch) {
        this.areaTouch.stop()
        this.areaTouch.destroy()
        this.area.target.translateY = 0
      }
      if (this.area.data) {
        this.$nextTick(() => {
          let areaConfig = this.config(this.area.touch, this.area.target, this.area.index, () => {
            this.area.index = this.areaTouch.currentPage
            this.area.id = this.indexToId(this.city.id, this.area.index)
            this.area.value = this.getNameById(this.city.id, this.area.id)
          })
          this.areaTouch = new AlloyTouch(areaConfig)
        })
      }
    },

    idToIndex (parentId, currentId) {
      let index = this.citydata[parentId] && Object.keys(this.citydata[parentId]).indexOf(currentId)
      return ~index ? index : 0
    },

    indexToId (parentId, index) {
      return this.citydata[parentId] && Object.keys(this.citydata[parentId])[index]
    },

    getNameById (parentId, id) {
      return this.citydata[parentId] && this.citydata[parentId][id]
    },

    config (touch, target, index, animationEnd, touchStart) {
      let targetHeight = target.getBoundingClientRect().height
      return {
        touch,
        target,
        vertical: 'true',
        property: 'translateY',
        initialValue: -index * 35,
        min: -(targetHeight - 35),
        max: 0,
        bindSelf: true,
        lockDirection: true,
        step: 35,
        touchStart () {
          touchStart && touchStart()
        },
        animationEnd (e) {
          animationEnd && animationEnd()
        }
      }
    },
    cancel () {
      this.$emit('update:show', !this.show)
    },
    confirm () {
      let {province, city, area} = this
      this.$emit('confirm', [province.id, city.id, area.id], [province.value, city.value, area.value])
      this.$emit('update:show', !this.show)
    }
  }
}
</script>
<style lang="less">
@import '../assets/1px.less';
.city-selector-box {
  height: 273px;
  box-sizing: border-box;
  position: relative;
  background: #fff;
}
.city-selector-header {
  height: 60px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  .header-cancel {
    color: #999;
  }
  .header-confirm {
    color: #007bff;
  }
}
.city-selector-body {
  .wheel {
    height: 173px;
    overflow: hidden;
    position: relative;
  }
  ul {
    margin-top: 69px;
    padding: 0 10px;
  }
  li {
    list-style: none;
    font-size: 20px;
    height: 35px;
    line-height: 35px;
    white-space: nowrap;
    text-align: center;
    color: #333;
  }
  position: relative;
  top: 20px;
  .top-mask,
  .bottom-mask {
    left: 0;
    right: 0;
    height: 68px;
    position: absolute;
    z-index: 5001;
    background: rgba(255, 255, 255, 0.7);
  }
  .top-mask {
    top: 0;
  }
  .bottom-mask {
    bottom: 0;
  }
  .wheel-touch {
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 5002;
  }
}
.mr-flex {
  display: flex;
}

.mr-flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mr-flex-center {
  justify-content: center;
}

.mr-flex1 {
  flex: 1;
}
</style>
