// ================================================================
// 云驰享低空物流配送平台 · 自定义 TabBar 逻辑
// Custom TabBar Logic — YunChiXiang Delivery Platform
// ================================================================

/* global Component */

// Tab 配置列表
// icon 字段使用 'erabbit' iconfont Unicode 字符
// home \ue8b9  category \ue616  cart \ue6d1  user \ue6bb
const TAB_LIST = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    icon: '\ue8b9',
    special: false,
  },
  {
    pagePath: '/pages/category/category',
    text: '分类',
    icon: '\ue616',
    special: false,
  },
  {
    pagePath: '/pages/cart/cart',
    text: '下单',
    icon: '\ue6d1',
    special: true,  // 中间凸出特殊按钮
  },
  {
    pagePath: '/pages/my/my',
    text: '我的',
    icon: '\ue6bb',
    special: false,
  },
]

// 每个 Tab 页路径到索引的映射（快速查找）
const PATH_INDEX_MAP = TAB_LIST.reduce((map, item, index) => {
  map[item.pagePath] = index
  return map
}, {})

Component({
  // -- 外部属性 -----------------------------------------------
  properties: {
    // 允许父页面直接传入 selected 索引（可选，优先级低于 setData）
    activeIndex: {
      type: Number,
      value: -1,
      observer(val) {
        if (val >= 0) {
          this.setData({ selected: val })
        }
      },
    },
  },

  // -- 内部数据 -----------------------------------------------
  data: {
    selected: 0,    // 当前选中索引
    animating: -1,  // 当前正在执行点击动效的索引（-1 表示无）
    list: TAB_LIST,
  },

  // -- 生命周期 -----------------------------------------------
  lifetimes: {
    attached() {
      // 组件挂载时根据当前页面路由自动设置 selected
      this._syncSelectedByRoute()
    },
  },

  // -- 页面生命周期 (custom-tab-bar 组件可监听宿主页面事件)
  pageLifetimes: {
    show() {
      // 每次宿主 Tab 页面 show 时同步选中态
      this._syncSelectedByRoute()
    },
  },

  // -- 方法 ---------------------------------------------------
  methods: {
    // -- 公开方法：供各 Tab 页面在 onShow 中主动调用 ----------
    // 用法（Vue3 UniApp 页面）:
    //   import { onShow } from '@dcloudio/uni-app'
    //   onShow(() => {
    //     // #ifdef MP-WEIXIN
    //     const tabBar = getCurrentPages()
    //       .slice(-1)[0]
    //       ?.getTabBar?.()
    //     if (tabBar) tabBar.setData({ selected: <当前页索引> })
    //     // #endif
    //   })
    setSelected(index) {
      if (this.data.selected === index) return
      this.setData({ selected: index })
    },

    // -- 根据当前路由自动同步选中索引 -------------------------
    _syncSelectedByRoute() {
      const pages = getCurrentPages()
      if (!pages.length) return
      const currentPage = pages[pages.length - 1]
      const route = '/' + (currentPage.route || '')
      const index = PATH_INDEX_MAP[route]
      if (index !== undefined && index !== this.data.selected) {
        this.setData({ selected: index })
      }
    },

    // -- Tab 切换主逻辑 ----------------------------------------
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      const currentSelected = this.data.selected

      // 已在当前 Tab，不重复跳转
      if (currentSelected === index) return

      // 触发点击动效
      this._playTapAnimation(index)

      // 执行 switchTab 跳转
      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index })
        },
        fail(err) {
          console.error('[TabBar] switchTab failed:', err)
        },
      })
    },

    // -- 点击弹簧动效（scale 缩放后回弹）----------------------
    _playTapAnimation(index) {
      // 设置 animating 触发 CSS tap 类
      this.setData({ animating: index })
      // 短延迟后清除，让 CSS transition 完成回弹
      setTimeout(() => {
        this.setData({ animating: -1 })
      }, 200)
    },
  },
})
