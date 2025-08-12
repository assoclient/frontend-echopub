import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdvertiserLayout from '@/layouts/AdvertiserLayout.vue'

// Pages Public
import LandingPage from '@/views/LandingPage.vue'

// Pages Auth
import Register from '@/views/auth/Register.vue'
import AdminLogin from '@/views/auth/AdminLogin.vue'
import AdvertiserLogin from '@/views/auth/AdvertiserLogin.vue'

// Pages Admin
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminUsers from '@/views/admin/Users.vue'
import AdminAdmins from '@/views/admin/Admins.vue'
import AdminCampaigns from '@/views/admin/Campaigns.vue'
import AdminTransactions from '@/views/admin/Transactions.vue'
import AdminReports from '@/views/admin/Reports.vue'
import AdminPublications from '@/views/admin/Publications.vue'
import AdminSettings from '@/views/admin/Settings.vue'

// Pages Advertiser
import AdvertiserDashboard from '@/views/advertiser/Dashboard.vue'
import AdvertiserCampaigns from '@/views/advertiser/Campaigns.vue'
import AdvertiserCreateCampaign from '@/views/advertiser/CreateCampaign.vue'
import AdvertiserProfile from '@/views/advertiser/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login/admin',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/login/advertiser',
    name: 'AdvertiserLogin',
    component: AdvertiserLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers
      },
      {
        path: 'admins',
        name: 'AdminAdmins',
        component: AdminAdmins
      },
      {
        path: 'campaigns',
        name: 'AdminCampaigns',
        component: AdminCampaigns
      },
      {
        path: 'transactions',
        name: 'AdminTransactions',
        component: AdminTransactions
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: AdminReports
      },
      {
        path: 'publications',
        name: 'AdminPublications',
        component: AdminPublications
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: AdminSettings
      }
    ]
  },
  {
    path: '/advertiser',
    component: AdvertiserLayout,
    meta: { requiresAuth: true, role: 'advertiser' },
    children: [
      {
        path: '',
        redirect: '/advertiser/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdvertiserDashboard',
        component: AdvertiserDashboard
      },
      {
        path: 'campaigns',
        name: 'AdvertiserCampaigns',
        component: AdvertiserCampaigns
      },
      {
        path: 'campaigns/create',
        name: 'AdvertiserCreateCampaign',
        component: AdvertiserCreateCampaign
      },
      {
        path: 'profile',
        name: 'AdvertiserProfile',
        component: AdvertiserProfile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification admin via localStorage
  const adminToken = localStorage.getItem('adminToken')
  const admin = localStorage.getItem('admin')
  const userType = localStorage.getItem('userType')
  
  // Vérifier l'authentification générale via Pinia store
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.userRole // Utiliser la computed property

  console.log('🔍 Router Guard:', {
    to: to.path,
    from: from.path,
    isAuthenticated,
    userRole,
    userType,
    adminToken: !!adminToken,
    admin: !!admin
  })

  // Si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    // Vérifier si c'est un admin connecté
    if (userType === 'admin' && adminToken && admin) {
      // Admin authentifié, vérifier le rôle requis
      if (to.meta.role === 'admin') {
        console.log('✅ Admin autorisé à accéder à:', to.path)
        next()
        return
      } else {
        // Admin essaie d'accéder à une route non-admin, rediriger vers dashboard admin
        console.log('🔄 Admin redirigé vers /admin/dashboard')
        next('/admin/dashboard')
        return
      }
    }
    
    // Vérifier l'authentification générale (pour les non-admins)
    if (!isAuthenticated) {
      console.log('❌ Non authentifié, redirection vers login')
      // Rediriger vers la page de connexion appropriée selon le rôle requis
      if (to.meta.role === 'admin') {
        next('/login/admin')
      } else if (to.meta.role === 'advertiser') {
        next('/login/advertiser')
      } else {
        next('/login/advertiser') // Par défaut, rediriger vers la page annonceur
      }
      return
    }

    // Si la route a un rôle spécifique et l'utilisateur n'a pas le bon rôle
    if (to.meta.role && userRole !== to.meta.role) {
      console.log('❌ Mauvais rôle, redirection')
      // Rediriger vers le dashboard approprié selon le rôle de l'utilisateur
      if (userRole === 'admin') {
        next('/admin/dashboard')
      } else if (userRole === 'advertiser') {
        next('/advertiser/dashboard')
      } else {
        next('/login/advertiser')
      }
      return
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder aux pages de connexion
  if ((isAuthenticated || (userType === 'admin' && adminToken)) && 
      (to.path === '/register' || to.path === '/login/admin' || to.path === '/login/advertiser')) {
    console.log('🔄 Utilisateur connecté, redirection vers dashboard')
    // Rediriger vers le dashboard approprié selon le rôle
    if (userType === 'admin' || userRole === 'admin') {
      next('/admin/dashboard')
    } else if (userRole === 'advertiser') {
      next('/advertiser/dashboard')
    } else {
      next('/login/advertiser')
    }
    return
  }

  // Sinon, continuer normalement
  console.log('✅ Navigation autorisée vers:', to.path)
  next()
})

export default router 