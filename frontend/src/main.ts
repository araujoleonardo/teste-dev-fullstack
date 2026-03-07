import './style.css'
import App from './App.vue'

import { createApp } from 'vue'
import {createPinia} from "pinia";
import router from "@/router";
import loadingDirective from '@/diretivas/loading';
import ToastContainer from "@/components/toast/ToastContainer.vue";

const app = createApp(App)

app.directive('loading', loadingDirective)
app.use(createPinia())
app.use(router)

app.component('ToastContainer', ToastContainer)

app.mount('#app');
