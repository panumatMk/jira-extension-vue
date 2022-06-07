import { createApp } from "vue";
import App from "./App.vue";
import router from './router/index'
import PrimeVue from "primevue/config";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import TieredMenu from "primevue/tieredmenu";

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import ToggleButton from 'primevue/togglebutton';
import Button from "primevue/button";


const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.component("TieredMenu", TieredMenu)
  .component("Card", Card)
  .component("Divider", Divider)
  .component("ToggleButton", ToggleButton)
  .component("Button", Button)
  .component("InputText", InputText);

app.mount("#app");
