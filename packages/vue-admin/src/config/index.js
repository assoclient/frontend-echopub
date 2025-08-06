// Configuration de l'application
export const config = {
  // URL de l'API backend
  apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  
  // Titre de l'application
  appTitle: process.env.VUE_APP_TITLE || 'WhatsApp Ads Platform - Admin',
  
  // Configuration des couleurs du thème
  colors: {
    primaryBlue: '#4D869C',
    lightBlue: '#7AB2B2',
    white: '#EEF7FF',
    softGreen: '#CDE8E5',
    darkGrey: '#444444',
    lightGrey: '#E0E0E0',
    alertRed: '#FF5B5B',
    success: '#43A047'
  },
  
  // Configuration des paiements
  payments: {
    minAmount: 1000,
    methods: ['mtn', 'orange']
  },
  
  // Configuration des campagnes
  campaigns: {
    minCPV: 14,
    minViews: 100
  }
}

export default config 