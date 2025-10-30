// main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. Importar o createPinia
import App from './App.vue'
import router from './router' 

import './index.css'

const app = createApp(App)

app.use(createPinia()) // 2. Adicionar o Pinia à aplicação
app.use(router) 
app.mount('#app')