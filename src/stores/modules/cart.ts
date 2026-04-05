import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type CartItem = {
  id: number
  merchantId: number
  name: string
  price: number
  image: string
  count: number
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])

    const totalCount = computed(() => items.value.reduce((sum, i) => sum + i.count, 0))
    const totalAmount = computed(() =>
      items.value.reduce((sum, i) => sum + i.price * i.count, 0),
    )
    const currentMerchantId = computed(() =>
      items.value.length > 0 ? items.value[0].merchantId : null,
    )

    const addItem = (item: CartItem) => {
      // 不同商户先清空
      if (items.value.length > 0 && items.value[0].merchantId !== item.merchantId) {
        items.value = []
      }
      const exist = items.value.find((i) => i.id === item.id)
      if (exist) {
        exist.count += item.count
      } else {
        items.value.push({ ...item })
      }
    }

    const removeItem = (id: number) => {
      const idx = items.value.findIndex((i) => i.id === id)
      if (idx > -1) {
        if (items.value[idx].count > 1) {
          items.value[idx].count--
        } else {
          items.value.splice(idx, 1)
        }
      }
    }

    const clearCart = () => {
      items.value = []
    }

    return {
      items,
      totalCount,
      totalAmount,
      currentMerchantId,
      addItem,
      removeItem,
      clearCart,
    }
  },
  {
    persist: {
      storage: {
        getItem(key: string) {
          return uni.getStorageSync(key)
        },
        setItem(key: string, value: string) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
