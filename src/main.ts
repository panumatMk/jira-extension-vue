import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import PrimeVue from "primevue/config";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import DataView from "primevue/dataview";
import TieredMenu from "primevue/tieredmenu";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import ToggleButton from "primevue/togglebutton";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row";
import Dialog from "primevue/dialog"; //optional for row
import Calendar from "primevue/calendar";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Carousel from "primevue/carousel";
import Fieldset from "primevue/fieldset";
import ProgressSpinner from "primevue/progressspinner";
import { hightlight } from "@/directives/Hightlight";

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
  .component("Calendar", Calendar)
  .component("Toast", Toast)
  .component("Carousel", Carousel)
  .component("Fieldset", Fieldset)
  .component("ProgressSpinner", ProgressSpinner)
  .component("DataView", DataView);

app.use(VueSweetalert2);
app.use(ToastService);

app.directive("tooltip", Tooltip)
  .directive("hightlight", hightlight)

app.mount("#app");
