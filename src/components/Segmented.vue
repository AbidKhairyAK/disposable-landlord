<script setup lang="ts">
import { useLayout } from "@/layouts/_composables/layout";
import { merge_class } from "@/lib/utils";
import { ref, computed, watch, nextTick, onMounted } from "vue";

const { isDarkTheme } = useLayout();

interface SegmentedOption {
  label?: string | number;
  value: string | number;
  disabled?: boolean;
}

type SegmentedValue = string | number;
type SegmentedOptionType = SegmentedValue | SegmentedOption;

interface Props {
  options?: SegmentedOptionType[];
  modelValue?: SegmentedValue;
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  block?: boolean;
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  optionClass?: string;
  containerClass?: string;
  onChange?: (value: SegmentedValue) => void;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  block: false,
  size: "middle",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: SegmentedValue): void;
  (e: "change", value: SegmentedValue): void;
}>();

// Refs
const containerRef = ref<HTMLDivElement | null>(null);
const itemRefs = ref<Record<SegmentedValue, HTMLDivElement>>({});
const indicatorStyle = ref<{ width: string; transform: string }>({
  width: "0px",
  transform: "translateX(0px)",
});

// Get initial value
const getInitialValue = (): SegmentedValue => {
  if (props.modelValue !== undefined) return props.modelValue;
  if (props.value !== undefined) return props.value;
  if (props.defaultValue !== undefined) return props.defaultValue;
  const firstOption = props.options[0];
  return typeof firstOption === "object" ? firstOption.value : firstOption;
};

const selectedValue = ref<SegmentedValue>(getInitialValue());

// Watch for modelValue changes (controlled mode with v-model)
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      selectedValue.value = newValue;
    }
  },
);

// Watch for value changes (controlled mode with :value)
watch(
  () => props.value,
  (newValue) => {
    if (newValue !== undefined) {
      selectedValue.value = newValue;
    }
  },
);

// Helper functions
const getOptionValue = (option: SegmentedOptionType): SegmentedValue => {
  return typeof option === "object" ? option.value : option;
};

const getOptionLabel = (option: SegmentedOptionType): string | number => {
  if (typeof option === "object") {
    return option.label || option.value;
  }
  return option;
};

const isOptionDisabled = (option: SegmentedOptionType): boolean => {
  return props.disabled || (typeof option === "object" && !!option.disabled);
};

// Update indicator position
const updateIndicator = async () => {
  await nextTick();
  const selectedElement = itemRefs.value[selectedValue.value];
  if (selectedElement && containerRef.value) {
    const containerRect = containerRef.value.getBoundingClientRect();
    const itemRect = selectedElement.getBoundingClientRect();

    indicatorStyle.value = {
      width: `${itemRect.width}px`,
      transform: `translateX(${itemRect.left - containerRect.left}px)`,
    };
  }
};

// Watch for changes that need indicator update
watch([selectedValue, () => props.options], updateIndicator);

// Handle option click
const handleClick = (option: SegmentedOptionType) => {
  const optionValue = getOptionValue(option);
  const disabled = isOptionDisabled(option);

  if (disabled) return;

  // Update internal state if not controlled
  if (props.modelValue === undefined && props.value === undefined) {
    selectedValue.value = optionValue;
  }

  // Call onChange callback if provided
  if (props.onChange) {
    props.onChange(optionValue);
  }

  // Emit events for v-model and @change
  emit("update:modelValue", optionValue);
  emit("change", optionValue);
};

// Set item ref
const setItemRef = (el: HTMLDivElement | null, value: SegmentedValue) => {
  if (el) {
    itemRefs.value[value] = el;
  }
};

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    small: "h-6 text-xs px-2",
    middle: "h-8 text-sm px-3",
    large: "h-12 text-base px-5",
  };
  return sizes[props.size];
});

// Initialize indicator on mount
onMounted(() => {
  updateIndicator();
});
</script>

<template>
  <div
    ref="containerRef"
    :class="
      merge_class(
        'relative rounded-lg p-1',
        block ? 'flex w-full' : 'inline-flex w-auto',
        isDarkTheme ? 'bg-surface-900' : 'bg-white',
        props.containerClass,
      )
    "
  >
    <!-- Sliding indicator -->
    <div
      class="absolute top-1 bottom-1 left-1 right-1 bg-primary-500 rounded-md shadow-sm transition-all duration-300 ease-out pointer-events-none"
      :style="indicatorStyle"
    />

    <!-- Options -->
    <div
      v-for="option in options"
      :key="getOptionValue(option)"
      :ref="(el) => setItemRef(el as HTMLDivElement, getOptionValue(option))"
      :class="
        merge_class(
          'relative z-10 flex items-center justify-center transition-colors duration-300 select-none whitespace-nowrap',
          sizeClasses,
          props.optionClass,
          block ? 'flex-1' : 'flex-none',
          isOptionDisabled(option)
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer',
          isOptionDisabled(option)
            ? 'text-gray-300'
            : selectedValue === getOptionValue(option)
              ? `${isDarkTheme ? 'text-surface-800' : 'text-white'} font-medium`
              : 'text-primary-500 hover:text-primary-600',
        )
      "
      @click="handleClick(option)"
    >
      {{ getOptionLabel(option) }}
    </div>
  </div>
</template>
