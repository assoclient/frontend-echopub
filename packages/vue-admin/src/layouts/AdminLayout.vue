<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <img src="/assets/EchoPub-removebg-preview.png"  alt="Logo" class="logo" />
       <!--  <h3 v-if="!sidebarCollapsed">Admin Panel</h3> -->
      </div>
      
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <el-button 
            @click="toggleSidebar"
            type="text"
            class="sidebar-toggle"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
          <h2>{{ currentPageTitle }}</h2>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleUserMenu">
            <span class="user-menu">
              <el-avatar :size="32" :src="user?.avatar">
                {{ user?.name?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ user?.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">Mon Profil</el-dropdown-item>
                <el-dropdown-item command="settings">Paramètres</el-dropdown-item>
                <el-dropdown-item divided command="logout">Déconnexion</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Menu, 
  ArrowDown, 
  DataBoard, 
  User, 
  Promotion, 
  Money, 
  Setting,
  UserFilled,
  Document,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const sidebarCollapsed = ref(false)

const user = computed(() => authStore.user)

const menuItems = [
  { path: '/admin/dashboard', label: 'Tableau de bord', icon: 'DataBoard' },
  { path: '/admin/users', label: 'Utilisateurs', icon: 'User' },
  { path: '/admin/admins', label: 'Administrateurs', icon: 'UserFilled' },
  { path: '/admin/campaigns', label: 'Campagnes', icon: 'Promotion' },
  { path: '/admin/publications', label: 'Publications', icon: 'Document' },
  { path: '/admin/transactions', label: 'Transactions', icon: 'Money' },
  { path: '/admin/reports', label: 'Rapports', icon: 'TrendCharts' },
  { path: '/admin/settings', label: 'Paramètres', icon: 'Setting' }
]

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.path === router.currentRoute.value.path)
  return currentItem?.label || 'Admin'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleUserMenu = (command) => {
  switch (command) {
    case 'logout':
      // Déconnexion admin - supprimer les données admin et rediriger vers login admin
      localStorage.removeItem('admin')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('userType')
      router.push('/login/admin')
      break
    case 'profile':
      // TODO: Naviguer vers le profil
      break
    case 'settings':
      router.push('/admin/settings')
      break
  }
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 280px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%);
  color: white;
  transition: width 0.3s ease;
  
  &.sidebar-collapsed {
    width: 80px;
    
    .sidebar-header h3 {
      display: none;
    }
    
    .nav-item span {
      display: none;
    }
  }
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo {
    //width: 40px;
    height: 40px;
  }
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-right: 4px solid white;
  }
  
  .el-icon {
    font-size: 20px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
}

.header {
  height: 70px;
  background: white;
  border-bottom: 1px solid var(--light-grey);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--dark-grey);
    }
  }
  
  .header-right {
    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: var(--light-grey);
      }
      
      .user-name {
        font-weight: 500;
        color: var(--dark-grey);
      }
    }
  }
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.sidebar-toggle {
  color: var(--primary-blue);
  font-size: 20px;
}
</style> 