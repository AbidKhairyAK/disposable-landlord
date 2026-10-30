import { ref, watch, type Ref } from 'vue';

export function useCountAnimation(
  targetValue: Ref<number | undefined>,
  duration: number = 1000
) {
  const displayValue = ref(0);
  let animationFrame: number | null = null;

  const animate = (start: number, end: number, startTime: number) => {
    const now = performance.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    displayValue.value = Math.round(start + (end - start) * easeOut);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(() => animate(start, end, startTime));
    }
  };

  watch(
    targetValue,
    (newVal) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      const target = newVal ?? 0;
      const startTime = performance.now();
      animate(displayValue.value, target, startTime);
    },
    { immediate: true }
  );

  return displayValue;
}
