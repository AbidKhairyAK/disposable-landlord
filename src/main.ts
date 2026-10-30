import "./styles/main.css";
import "./styles/layout/layout.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Dialog from "primevue/dialog";
import ConfirmationService from "primevue/confirmationservice";

import App from "./App.vue";
import router from "./router";
import Theme from "./styles/theme";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.component("Dialog", Dialog);
// FIXME - kyknya si component dari primevue perlu dikasih prefix biar nggak tabrakan dengan component kita atau bawaan html

app.use(PrimeVue, {
  theme: {
    preset: Theme,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.mount("#app");

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log(
//           "Service Worker registered with scope:",
//           registration.scope
//         );
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }
