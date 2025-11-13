// main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. Importar o createPinia
import App from './App.vue'
import router from './router' 

import './index.css'

const API_BASE_URL = 'http://localhost:8000/api'
const SERVER_BASE_URL = 'http://localhost:8000'
const app = createApp(App)

app.provide('apiBaseURL', API_BASE_URL)
app.provide('serverBaseURL', SERVER_BASE_URL)

app.use(createPinia()) // 2. Adicionar o Pinia à aplicação
app.use(router) 
app.mount('#app')