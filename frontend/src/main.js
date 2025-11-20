import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import { io } from 'socket.io-client'

const API_BASE_URL = 'http://localhost:8000/api'
const SERVER_BASE_URL = 'http://localhost:8000'
const SOCKET_BASE_URL = 'http://localhost:3000' // Assumindo porta 3000

// Inicializar Socket.io
const socket = io(SOCKET_BASE_URL)

const app = createApp(App)
const pinia = createPinia()

app.provide('apiBaseURL', API_BASE_URL)
app.provide('serverBaseURL', SERVER_BASE_URL)
app.provide('socket', socket) // Fornecer o socket

app.use(pinia)
app.use(router)

app.mount('#app')