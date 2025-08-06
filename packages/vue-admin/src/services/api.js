import axios from 'axios'
import { ElMessage } from 'element-plus'

// Configuration de base pour axios
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Vérifier d'abord le token admin, puis le token général
    const adminToken = localStorage.getItem('adminToken')
    const generalToken = localStorage.getItem('token')
    const token = adminToken || generalToken
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      const userType = localStorage.getItem('userType')
      
      if (userType === 'admin') {
        // Nettoyer les données admin
        localStorage.removeItem('adminToken')
        localStorage.removeItem('admin')
        localStorage.removeItem('userType')
        window.location.href = '/login/admin'
      } else {
        // Nettoyer les données générales
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      ElMessage.error('Accès refusé')
    } else if (error.response?.status >= 500) {
      ElMessage.error('Erreur serveur')
    }
    return Promise.reject(error)
  }
)

// Service Admin
export const adminService = {
  // Connexion admin
  login: async (credentials) => {
    const response = await api.post('/admins/login', credentials)
    return response.data
  },

  // Récupérer tous les admins
  getAllAdmins: async (params = {}) => {
    const response = await api.get('/admins', { params })
    return response.data
  },

  // Créer un admin
  createAdmin: async (adminData) => {
    const response = await api.post('/admins', adminData)
    return response.data
  },

  // Mettre à jour un admin
  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/admins/${id}`, adminData)
    return response.data
  },

  // Supprimer un admin
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admins/${id}`)
    return response.data
  }
}

// Service pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs avec pagination et recherche
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw error
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      throw error
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      throw error
    }
  }
}

// Service pour les campagnes
export const campaignService = {
  // Récupérer toutes les campagnes avec pagination et recherche
  getAllCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des campagnes:', error)
      throw error
    }
  },

  // Récupérer les détails d'une campagne
  getCampaignDetails: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la campagne:', error)
      throw error
    }
  },

  // Changer le statut d'une campagne
  changeCampaignStatus: async (id, status) => {
    try {
      const response = await api.post(`/campaigns/changestatus/${id}`, { status })
      return response.data
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
      throw error
    }
  },

  // Supprimer une campagne
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la campagne:', error)
      throw error
    }
  }
}

// Service pour les transactions
export const transactionService = {
  // Récupérer toutes les transactions avec pagination
  getAllTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error)
      throw error
    }
  },

  // Créer une transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error)
      throw error
    }
  },

  // Mettre à jour une transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error)
      throw error
    }
  },

  // Supprimer une transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error)
      throw error
    }
  }
}

// Service pour le dashboard
export const dashboardService = {
  // Récupérer les statistiques du dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  // Marquer une activité comme lue
  markActivityAsRead: async (activityId) => {
    try {
      const response = await api.put(`/dashboard/activities/${activityId}/read`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'activité:', error)
      throw error
    }
  },

  // Marquer toutes les activités comme lues
  markAllActivitiesAsRead: async () => {
    try {
      const response = await api.put('/dashboard/activities/read-all')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des activités:', error)
      throw error
    }
  }
}

// Service pour les paramètres
export const settingsService = {
  // Récupérer tous les paramètres
  getSettings: async () => {
    try {
      const response = await api.get('/settings')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      throw error
    }
  },

  // Mettre à jour les paramètres généraux
  updateGeneralSettings: async (settings) => {
    try {
      const response = await api.put('/settings/general', settings)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres généraux:', error)
      throw error
    }
  },

  // Mettre à jour les paramètres de paiement
  updatePaymentSettings: async (settings) => {
    try {
      const response = await api.put('/settings/payment', settings)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de paiement:', error)
      throw error
    }
  },

  // Mettre à jour les paramètres de sécurité
  updateSecuritySettings: async (settings) => {
    try {
      const response = await api.put('/settings/security', settings)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de sécurité:', error)
      throw error
    }
  },

  // Mettre à jour les paramètres de notification
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/settings/notification', settings)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error)
      throw error
    }
  },

  // Mettre à jour les paramètres de maintenance
  updateMaintenanceSettings: async (settings) => {
    try {
      const response = await api.put('/settings/maintenance', settings)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de maintenance:', error)
      throw error
    }
  },

  // Réinitialiser tous les paramètres
  resetSettings: async () => {
    try {
      const response = await api.post('/settings/reset')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des paramètres:', error)
      throw error
    }
  }
}

export default api 