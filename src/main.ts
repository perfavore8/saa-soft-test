import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import store from './stores';
import router from './router';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, { theme: { preset: Aura } })
  .mount('#app');
