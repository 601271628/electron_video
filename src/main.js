import { createApp } from "vue";
import "@/assets/css/common.css";
import App from "./App.vue";
import router from "./router";
// 自定义指令
import mouseDrag from "@/directives/mouseDrag.js";

const app = createApp(App);
app.use(router);

// 自定义指令
mouseDrag(app);

app.mount("#app");
