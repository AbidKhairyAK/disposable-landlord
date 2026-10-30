<script setup lang="ts">
import { IButton } from '@/components'
import { merge_class } from '@/lib/utils'
import { Search, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'clear'): void
}>()

const localValue = ref(props.modelValue)

// Sync external changes to internal input
watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  }
)

function updateValue(val: string) {
  emit('update:modelValue', val)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}

function handleSearch() {
  emit('search')
}
</script>

<template>
  <div :class="merge_class(props.containerClass, 'flex gap-2')">
    <InputText
      v-model="localValue"
      @input="updateValue(localValue)"
      fluid
      :placeholder="placeholder"
    />
    <IButton v-if="localValue" @click="handleClear" :lucide="X" />
    <IButton :lucide="Search" @click="handleSearch" />
  </div>
</template>
