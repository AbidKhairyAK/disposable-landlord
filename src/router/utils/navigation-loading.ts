import { ref } from "vue";

export const isRouteLoading = ref(false);
export const routeLoadingTimedOut = ref(false);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

export function startRouteLoading(delay = 100, timeout = 15000) {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
  }

  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
  }

  routeLoadingTimedOut.value = false;

  loadingTimer = setTimeout(() => {
    isRouteLoading.value = true;
    loadingTimer = null;
  }, delay);

  timeoutTimer = setTimeout(() => {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }

    isRouteLoading.value = false;
    routeLoadingTimedOut.value = true;
    timeoutTimer = null;
  }, timeout);
}

export function stopRouteLoading() {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }

  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }

  isRouteLoading.value = false;
  routeLoadingTimedOut.value = false;
}

export function dismissRouteLoadingTimeout() {
  routeLoadingTimedOut.value = false;
}
