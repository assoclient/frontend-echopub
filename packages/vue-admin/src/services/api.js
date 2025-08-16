import axios from 'axios'
import { ElMessage } from 'element-plus'

// Configuration de base pour axios
const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000000,
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
        window.location.href = '/login/advertiser'
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

  // Récupérer les campagnes de l'annonceur connecté
  getMyCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns/my-campaigns', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de mes campagnes:', error)
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

  // Récupérer les détails d'une campagne pour l'annonceur connecté
  getMyCampaignDetails: async (id) => {
    try {
      const response = await api.get(`/campaigns/my-campaigns/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de ma campagne:', error)
      throw error
    }
  },

  // Créer une nouvelle campagne
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns', campaignData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error)
      throw error
    }
  },

  // Créer une campagne avec média (multipart/form-data)
  createCampaignWithMedia: async (formData) => {
    try {
      // Configuration spéciale pour multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      // Ajouter le token d'authentification
      const adminToken = localStorage.getItem('adminToken')
      const generalToken = localStorage.getItem('token')
      const token = adminToken || generalToken
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      const response = await api.post('/campaigns', formData, config)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la campagne avec média:', error)
      throw error
    }
  },

  // Mettre à jour une campagne
  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la campagne:', error)
      throw error
    }
  },

  // Mettre à jour une campagne avec média (multipart/form-data)
  updateCampaignWithMedia: async (id, formData) => {
    try {
      // Configuration spéciale pour multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      // Ajouter le token d'authentification
      const adminToken = localStorage.getItem('adminToken')
      const generalToken = localStorage.getItem('token')
      const token = adminToken || generalToken
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      const response = await api.put(`/campaigns/${id}`, formData, config)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la campagne avec média:', error)
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
  // Créer une transaction (paiement, validation de campagne, etc.)
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error)
      throw error
    }
  },

  // Récupérer toutes les transactions (admin uniquement)
  getAllTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error)
      throw error
    }
  },

  // Mettre à jour une transaction (admin uniquement)
  updateTransaction: async (id, updateData) => {
    try {
      const response = await api.put(`/transactions/${id}`, updateData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error)
      throw error
    }
  },

  // Supprimer une transaction (admin uniquement)
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
  // Récupérer les statistiques du dashboard admin
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques dashboard:', error)
      throw error
    }
  },

  // Récupérer les statistiques du dashboard annonceur
  getAdvertiserDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/advertiser-stats')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques annonceur:', error)
      throw error
    }
  },

  // Récupérer les rapports détaillés
  getDetailedReports: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/reports', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error)
      throw error
    }
  },

  // Marquer une activité comme lue
  markActivityAsRead: async (activityId) => {
    try {
      const response = await api.put(`/dashboard/activities/${activityId}/read`)
      return response.data
    } catch (error) {
      console.error('Erreur lors du marquage de l\'activité:', error)
      throw error
    }
  },

  // Marquer toutes les activités comme lues
  markAllActivitiesAsRead: async () => {
    try {
      const response = await api.put('/dashboard/activities/read-all')
      return response.data
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les activités:', error)
      throw error
    }
  }
}

// Service pour le profil utilisateur
export const profileService = {
  // Récupérer les informations du profil utilisateur connecté
  getMyProfile: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      throw error
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(`/users/${profileData._id}`, profileData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  },

  // Récupérer les transactions de l'utilisateur
  getMyTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions/my-transactions', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error)
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

// Service d'authentification pour les utilisateurs généraux
export const authService = {
  // Connexion utilisateur
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  },

  // Inscription utilisateur
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    }
  },

  // Récupérer les informations de l'utilisateur connecté
  getMe: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      throw error
    }
  }
}

// Service pour les campagnes ambassadeur
export const ambassadorCampaignService = {
  // Récupérer toutes les publications des ambassadeurs
  getAllAmbassadorCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/publications', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error)
      throw error
    }
  },

  // Valider une publication d'ambassadeur avec nombre de vues
  validatePublication: async (publicationId, validationData = {}) => {
    try {
      const response = await api.put(`/publications/${publicationId}/validate`, validationData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la validation de la publication:', error)
      throw error
    }
  },

  // Créer une attribution ambassadeur-campagne
  createAmbassadorCampaign: async (data) => {
    try {
      const response = await api.post('/publications', data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de l\'attribution:', error)
      throw error
    }
  },

  // Mettre à jour une attribution ambassadeur-campagne
  updateAmbassadorCampaign: async (id, data) => {
    try {
      const response = await api.put(`/publications/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'attribution:', error)
      throw error
    }
  },

  // Supprimer une attribution ambassadeur-campagne
  deleteAmbassadorCampaign: async (id) => {
    try {
      const response = await api.delete(`/publications/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'attribution:', error)
      throw error
    }
  }
}
export const redirectService={
   updateClicks: async (shortId,ambassadorId) => {
    try {
      const response = await api.get(`/publications/add-click/${shortId}/${ambassadorId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error)
      throw error
    }
  }
}
export default api 