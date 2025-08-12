import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Configuration de la base URL pour axios
const API_BASE_URL = 'http://localhost:5000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)

  // Configuration axios avec token
  const setupAxios = () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Initialiser axios au démarrage
  setupAxios()

  const login = async (credentials) => {
    loading.value = true
    try {
      console.log('🔐 Store: Tentative de connexion avec:', credentials)
      console.log('🔗 Store: URL de connexion:', `${API_BASE_URL}/auth/login`)
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
      console.log('📋 Store: Réponse du serveur:', response.data)
      
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setupAxios()
      
      console.log('✅ Store: Connexion réussie, utilisateur stocké')
      return { success: true }
    } catch (error) {
      console.error('❌ Store: Erreur de connexion:', error)
      console.error('📋 Store: Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion' 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    setupAxios()
  }

  const checkAuth = async () => {
    if (!token.value || !user.value) return false
    
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return true
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
      return false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
      return { success: true, message: 'Inscription réussie' }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur d\'inscription' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userRole,
    login,
    logout,
    checkAuth,
    register
  }
}) 