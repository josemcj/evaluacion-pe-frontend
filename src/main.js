import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import './style.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(LoadingPlugin, { color: '#010f60' });
app.use(VueSweetalert2);

app.mount('#app');
