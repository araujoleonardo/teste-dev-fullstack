import './style.css'
import App from './App.vue'

import { createApp } from 'vue'
import {createPinia} from "pinia";
import router from "@/router";
import loadingDirective from '@/diretivas/loading';

const app = createApp(App)

app.directive('loading', loadingDirective)
app.use(createPinia())
app.use(router)

app.mount('#app');
