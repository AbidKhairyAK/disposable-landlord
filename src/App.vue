<script setup lang="ts">
import { useOnline } from "@vueuse/core";
import { RouterView } from "vue-router";
import { watch } from "vue";
import { useToast } from "primevue/usetoast";
import OfflineStatus from "./layouts/_components/OfflineStatus.vue";
import {
  dismissRouteLoadingTimeout,
  isRouteLoading,
  routeLoadingTimedOut,
} from "./router/utils/navigation-loading";

const isOnline = useOnline();
const toast = useToast();

watch(routeLoadingTimedOut, (timedOut) => {
  if (!timedOut) return;

  toast.add({
    severity: "error",
    summary: "Page failed to load",
    detail: "Navigation took too long. Please check your connection or reload the page.",
    life: 8000,
  });

  dismissRouteLoadingTimeout();
});
</script>

<template>
  <!-- <OfflineStatus v-if="!isOnline" /> -->
  <RouterView />
  <Transition name="route-loading">
    <div
      v-if="isRouteLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[0.7px]"
    >
      <div class="loader"></div>
    </div>
  </Transition>
  <Toast position="bottom-center" />
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
.route-loading-enter-active,
.route-loading-leave-active {
  transition: opacity 150ms ease;
}

.route-loading-enter-from,
.route-loading-leave-to {
  opacity: 0;
}

:global(.loader) {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  animation: l14 4s infinite;
}

:global(.loader::before),
:global(.loader::after) {
  content: "";
  grid-area: 1 / 1;
  border: 6px solid;
  border-radius: 50%;
  border-color: var(--theme-primary-500, #3b82f6) var(--theme-primary-500, #3b82f6) #0000 #0000;
  mix-blend-mode: darken;
  animation: l14 1s infinite linear;
}

:global(.loader::after) {
  border-color: #0000 #0000 var(--theme-primary-300, #93c5fd) var(--theme-primary-300, #93c5fd);
  animation-direction: reverse;
}

@keyframes l14 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
