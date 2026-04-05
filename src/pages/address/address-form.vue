<script setup lang="ts">
import { getAddressListAPI, postAddressAPI, putAddressAPI } from '@/services/address'
import type { AddressItem } from '@/types/address'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const isEdit = ref(false)
const form = ref<Partial<AddressItem>>({
  receiverName: '',
  phone: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  detailAddress: '',
  addressLabel: undefined,
  isDefault: 0,
})

const labelOptions = ['�?, '公司', '学校']
const labelValues = [1, 2, 3]
const labelIndex = ref(-1)

const onLabelChange = (e: any) => {
  labelIndex.value = Number(e.detail.value)
  form.value.addressLabel = labelValues[labelIndex.value]
}

onLoad(async (options) => {
  const id = Number(options?.id)
  if (!id) return
  isEdit.value = true
  uni.setNavigationBarTitle({ title: '编辑地址' })
  const res = await getAddressListAPI()
  const found = (res.data || []).find((a: AddressItem) => a.id === id)
  if (found) {
    form.value = { ...found }
    if (found.addressLabel) {
      labelIndex.value = labelValues.indexOf(found.addressLabel)
    }
  }
})

const onSubmit = async () => {
  if (!form.value.receiverName?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入收货人姓名' })
    return
  }
  if (!form.value.phone?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入手机号' })
    return
  }
  if (!form.value.detailAddress?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入详细地址' })
    return
  }
  try {
    if (isEdit.value) {
      await putAddressAPI(form.value as AddressItem)
    } else {
      await postAddressAPI(form.value as AddressItem)
    }
    uni.showToast({ icon: 'success', title: isEdit.value ? '修改成功' : '添加成功' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch {
    uni.showToast({ icon: 'none', title: '操作失败，请重试' })
  }
}
</script>

<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="form-label">收货�?/text>
        <input class="form-input" v-model="form.receiverName" placeholder="请输入收货人姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">手机�?/text>
        <input class="form-input" v-model="form.phone" type="number" placeholder="请输入手机号" />
      </view>
      <view class="form-item">
        <text class="form-label">省份</text>
        <input class="form-input" v-model="form.provinceName" placeholder="省份（如：广东省�? />
      </view>
      <view class="form-item">
        <text class="form-label">城市</text>
        <input class="form-input" v-model="form.cityName" placeholder="城市（如：深圳市�? />
      </view>
      <view class="form-item">
        <text class="form-label">�?�?/text>
        <input class="form-input" v-model="form.districtName" placeholder="�?县（如：南山区）" />
      </view>
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <input class="form-input" v-model="form.detailAddress" placeholder="请输入详细地址" />
      </view>
      <view class="form-item">
        <text class="form-label">地址标签</text>
        <picker mode="selector" :range="labelOptions" :value="labelIndex" @change="onLabelChange">
          <view class="form-input" style="color: #333">
            {{ labelIndex >= 0 ? labelOptions[labelIndex] : '请选择（选填�? }}
          </view>
        </picker>
      </view>
      <view class="form-item switch-item">
        <text class="form-label">设为默认</text>
        <switch
          :checked="form.isDefault === 1"
          color="#F76B1C"
          @change="(e: any) => (form.isDefault = e.detail.value ? 1 : 0)"
        />
      </view>
    </view>

    <button class="submit-btn" @tap="onSubmit">{{ isEdit ? '保存修改' : '保存地址' }}</button>
  </view>
</template>

<style lang="scss">
$primary: #f76b1c;
$bg: #f4f5f9;
$card: #ffffff;
$text-1: #1a1a2e;
$text-2: #64748b;
$text-3: #94a3b8;
$border: #e8ebf2;

page {
  background-color: $bg;
}

.container {
  padding-bottom: 40rpx;
}

.form {
  background-color: $card;
  margin: 20rpx 0 0;
  border-radius: 0;

  .form-item {
    display: flex;
    align-items: center;
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid $bg;

    &.switch-item {
      justify-content: space-between;
    }

    .form-label {
      font-size: 26rpx;
      color: $text-2;
      width: 140rpx;
      flex-shrink: 0;
      font-weight: 500;
    }

    .form-input {
      flex: 1;
      font-size: 28rpx;
      color: $text-1;
    }
  }
}

.submit-btn {
  margin: 40rpx 30rpx;
  width: calc(100% - 60rpx);
  height: 92rpx;
  background: linear-gradient(135deg, $primary, #ffa42b);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(247, 107, 28, 0.35);
}
</style>
