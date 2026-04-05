<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
// 字体图标
@import '@/styles/fonts.scss';
// 云驰享设计规范系统
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';
@import '@/styles/common.scss';
// 基础重置（已合并至 common.scss，保留做向下兼容）
@import '@/styles/base.scss';
</style>
