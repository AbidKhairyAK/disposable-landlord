<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  nav?: any,
  prevRoute?: { name: string, params: Record<string, any> },
  nextRoute?: { name: string, params: Record<string, any> },
  isMarkNextButton?: boolean,
  hidePrev?: boolean,
  hideNext?: boolean
}>();

const router = useRouter();

const goPrev = () => {
  if (props.prevRoute) {
    router.push(props.prevRoute);
  }
};
const goNext = () => {
  if (props.nextRoute) {
    router.push(props.nextRoute);
  }
};
</script>

<template>
  <div class="border-1 border-surface-200 rounded-xl p-4 md:p-5">
    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center justify-between gap-4">
      <div class="min-w-[140px]">
        <button
          :style="{ visibility: hidePrev ? 'hidden' : 'visible'}"
          :disabled="!(nav?.prevTopicId && prevRoute)"
          @click="goPrev"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>Previous</span>
        </button>
      </div>

      <div class="flex-1 flex items-center justify-center">
        <slot />
      </div>

      <div class="min-w-[140px] flex justify-end">
        <button
          :style="{ visibility: hideNext ? 'hidden' : 'visible'}"
          :disabled="!(nav?.nextTopicId && nextRoute)"
          @click="goNext"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium',
            isMarkNextButton 
              ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600'
              : 'border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:text-white'
          ]"
        >
          <span>Next</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="flex md:hidden flex-col gap-3">
      <div class="flex items-center justify-center">
        <slot />
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <button
          :style="{ visibility: hidePrev ? 'hidden' : 'visible'}"
          :disabled="!(nav?.prevTopicId && prevRoute)"
          @click="goPrev"
          class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          :style="{ visibility: hideNext ? 'hidden' : 'visible'}"
          :disabled="!(nav?.nextTopicId && nextRoute)"
          @click="goNext"
          :class="[
            'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm',
            isMarkNextButton 
              ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600'
              : 'border-orange-500 text-orange-600 bg-white hover:bg-orange-500 hover:text-white'
          ]"
        >
          <span>Next</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
