<script setup lang="ts">
import { merge_class } from "@/lib/utils";

defineProps<{
  title: string;
  subtitle?: string;
  titleClass?: string;
  subtitleClass?: string;
  withDivider?: boolean;
  isLoading?: boolean;
  additionalText?: string;
  additionalTextClass?: string;
}>();
</script>

<template>
  <section
    class="flex justify-between flex-col sm:flex-row sm:items-end mb-4 gap-4"
  >
    <div>
      <h1
        :class="
          merge_class('text-2xl leading-8 text-color font-[325]', titleClass)
        "
      >
        {{ title }}
      </h1>
      <p
        :class="
          merge_class(
            'mt-1 leading-6 text-base font-thin text-muted-color',
            subtitleClass,
          )
        "
      >
        {{ subtitle }}
      </p>
      <p
        :class="
          merge_class(
            'mt-1 leading-6 text-base font-thin text-muted-color',
            additionalTextClass,
          )
        "
      >
        {{ additionalText }}
      </p>
    </div>

    <slot></slot>
  </section>

  <ProgressBar
    v-if="withDivider && isLoading"
    mode="indeterminate"
    class="h-[1px]! mb-4"
  />
  <hr v-if="withDivider && !isLoading" class="mb-4 border-surface" />
</template>
