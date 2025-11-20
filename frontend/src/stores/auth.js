import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAPIStore } from './api'
import { useSocketStore } from './socket'

export const useAuthStore = defineStore('auth', () => {
    const apiStore = useAPIStore()
    const socketStore = useSocketStore()

    const currentUser = ref(undefined)

    const isLoggedIn = computed(() => {
        return currentUser.value !== undefined
    })

    const currentUserID = computed(() => {
        return currentUser.value?.id
    })

    const login = async (credentials) => {
        await apiStore.postLogin(credentials)
        const response = await apiStore.getAuthUser()
        
        currentUser.value = response.data
        
        socketStore.emitJoin(currentUser.value) // Socket Join (Passo 13)

        return response.data
    }

    const logout = async () => {
        socketStore.emitLeave() // Socket Leave (Passo 13)

        await apiStore.postLogout()
        currentUser.value = undefined
    }

    const getUser = async () => {
        if (!isLoggedIn.value) return;
        try {
            const response = await apiStore.getAuthUser();
            currentUser.value = response.data;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            // Se o token for inválido, limpa a sessão
            currentUser.value = undefined; 
        }
    }

    return {
        currentUser,
        isLoggedIn,
        currentUserID,
        login,
        logout,
        getUser,
    }
})