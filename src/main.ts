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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';
import Dialog from "primevue/dialog";                     //optional for row


const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.component("TieredMenu", TieredMenu)
  .component("Card", Card)
  .component("Divider", Divider)
  .component("ToggleButton", ToggleButton)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("ColumnGroup", ColumnGroup)
  .component("Row", Row)
  .component("Dialog", Dialog)

app.mount("#app");
