import { createApp } from "vue";
import App from "./App.vue";
// import router from './router/index.ts.temp'
import PrimeVue from "primevue/config";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";

const app = createApp(App);

// app.use(router)
app.use(PrimeVue);

app.component("InputNumber", InputNumber);
app.component("Calendar", Calendar);

app.mount("#app");
