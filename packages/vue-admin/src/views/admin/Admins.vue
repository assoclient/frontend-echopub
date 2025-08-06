<template>
  <div class="admins-page">
    <div class="page-header">
      <p>Gérez les administrateurs de la plateforme</p>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>Liste des administrateurs</h3>
        <el-button type="primary" @click="showCreateAdmin = true">
          <el-icon><Plus /></el-icon>
          Ajouter un administrateur
        </el-button>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input
              v-model="searchQuery"
              placeholder="Rechercher un admin..."
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          
          <el-col :span="6">
            <el-select
              v-model="roleFilter"
              placeholder="Filtrer par rôle"
              clearable
              @change="handleFilter"
            >
              <el-option label="Tous les rôles" value="" />
              <el-option label="Super Admin" value="superadmin" />
              <el-option label="Manager" value="manager" />
            </el-select>
          </el-col>
          
          <el-col :span="6">
            <el-select
              v-model="statusFilter"
              placeholder="Filtrer par statut"
              clearable
              @change="handleFilter"
            >
              <el-option label="Tous les statuts" value="" />
              <el-option label="Actif" value="actif" />
              <el-option label="Inactif" value="inactif" />
            </el-select>
          </el-col>
          
          <el-col :span="4">
            <el-select
              v-model="sortBy"
              placeholder="Trier par"
              @change="handleSort"
            >
              <el-option label="Date de création" value="createdAt" />
              <el-option label="Nom" value="name" />
              <el-option label="Email" value="email" />
              <el-option label="Rôle" value="role" />
            </el-select>
          </el-col>
          
          <el-col :span="2">
            <el-button @click="resetFilters" type="info" plain>
              <el-tooltip content="Réinitialiser les filtres" placement="top">
                <el-icon><Refresh /></el-icon>
              </el-tooltip>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-table :data="admins" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="Nom" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Téléphone" />
        <el-table-column prop="role" label="Rôle">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleLabel(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="Permissions">
          <template #default="scope">
            <el-tag 
              v-for="permission in scope.row.permissions" 
              :key="permission"
              size="small"
              type="info"
              style="margin-right: 4px;"
            >
              {{ permission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="Statut">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
              {{ scope.row.isActive ? 'Actif' : 'Inactif' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="Dernière connexion">
          <template #default="scope">
            {{ formatDate(scope.row.lastLogin) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Date de création">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="editAdmin(scope.row)"
              :icon="Edit"
            >
              <el-tooltip content="Modifier l'administrateur" placement="top">
                
              </el-tooltip>
            </el-button>
            
            <el-button 
              size="small" 
              :type="scope.row.isActive ? 'warning' : 'success'"
              @click="toggleAdminStatus(scope.row)"
              :icon="SwitchButton"
            >
              <el-tooltip :content="scope.row.isActive ? 'Désactiver l\'administrateur' : 'Activer l\'administrateur'" placement="top">
                
              </el-tooltip>
            </el-button>
            
            <el-button 
              size="small" 
              type="danger" 
              @click="deleteAdmin(scope.row)"
              :disabled="scope.row.role === 'superadmin'"
              :icon="Delete"
            >
              <el-tooltip content="Supprimer l'administrateur" placement="top">
                
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- Modal de création/édition d'admin -->
    <el-dialog
      v-model="showCreateAdmin"
      :title="editingAdmin ? 'Modifier l\'administrateur' : 'Ajouter un administrateur'"
      width="600px"
    >
      <el-form :model="adminForm" :rules="adminRules" ref="adminFormRef" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Nom complet" prop="name">
              <el-input v-model="adminForm.name" placeholder="Nom complet" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="adminForm.email" type="email" placeholder="Email" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Téléphone" prop="phone">
              <el-input v-model="adminForm.phone" placeholder="Téléphone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Statut" prop="isActive">
              <el-switch v-model="adminForm.isActive" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Rôle" prop="role">
              <el-select v-model="adminForm.role" style="width: 100%">
                <el-option label="Manager" value="manager" />
                <el-option label="Super Admin" value="superadmin" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Permissions" prop="permissions">
          <el-checkbox-group v-model="adminForm.permissions">
            <el-checkbox label="users_manage" value="users_manage">
              Gestion des utilisateurs
            </el-checkbox>
            <el-checkbox label="campaigns_manage" value="campaigns_manage">
              Gestion des campagnes
            </el-checkbox>
            <el-checkbox label="admins_manage" value="admins_manage">
              Gestion des administrateurs
            </el-checkbox>
            <el-checkbox label="reports_view" value="reports_view">
              Voir les rapports
            </el-checkbox>
            <el-checkbox label="settings_manage" value="settings_manage">
              Gestion des paramètres
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Mot de passe" prop="password">
          <el-input 
            v-model="adminForm.password" 
            type="password" 
            placeholder="Mot de passe"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateAdmin = false">Annuler</el-button>
        <el-button type="primary" @click="saveAdmin" :loading="saving">
          {{ editingAdmin ? 'Modifier' : 'Créer' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Search, Refresh, Edit, Delete, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminService } from '@/services/api'

const admins = ref([])
const loading = ref(false)

// Filtres et recherche
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// Modal
const showCreateAdmin = ref(false)
const editingAdmin = ref(null)
const saving = ref(false)
const adminFormRef = ref(null)

const adminForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'manager',
  permissions: [],
  isActive: true,
  password: ''
})

const adminRules = {
  name: [
    { required: true, message: 'Le nom est requis', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'L\'email est requis', trigger: 'blur' },
    { type: 'email', message: 'Format d\'email invalide', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Le téléphone est requis', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Le rôle est requis', trigger: 'change' }
  ],
  password: [
    { required: true, message: 'Le mot de passe est requis', trigger: 'blur' },
    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères', trigger: 'blur' }
  ]
}

// Admins filtrés
const filteredAdmins = computed(() => {
  let filtered = admins.value

  // Filtre par recherche
  if (searchQuery.value) {
    filtered = filtered.filter(admin =>
      admin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filtre par rôle
  if (roleFilter.value) {
    filtered = filtered.filter(admin => admin.role === roleFilter.value)
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(admin => admin.isActive === (statusFilter.value === 'actif'))
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'email':
        return a.email.localeCompare(b.email)
      case 'role':
        return a.role.localeCompare(b.role)
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

// Admins paginés
const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAdmins.value.slice(start, end)
})

// Handlers
const handleSearch = () => {
  currentPage.value = 1
  loadAdmins()
}

const handleFilter = () => {
  currentPage.value = 1
  loadAdmins()
}

const handleSort = () => {
  currentPage.value = 1
  loadAdmins()
}

const resetFilters = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = '' // Reset status filter
  sortBy.value = 'createdAt'
  currentPage.value = 1
  loadAdmins()
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadAdmins()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadAdmins()
}

const getRoleType = (role) => {
  const types = {
    superadmin: 'danger',
    manager: 'primary'
  }
  return types[role] || 'info'
}

const getRoleLabel = (role) => {
  const labels = {
    superadmin: 'Super Admin',
    manager: 'Manager'
  }
  return labels[role] || role
}

const formatDate = (date) => {
  if (!date) return 'Jamais'
  return new Date(date).toLocaleDateString('fr-FR') + ' ' + 
         new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const editAdmin = (admin) => {
  editingAdmin.value = admin
  adminForm.value = {
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
    permissions: [...admin.permissions],
    isActive: admin.isActive,
    password: ''
  }
  showCreateAdmin.value = true
}

const saveAdmin = async () => {
  if (!adminFormRef.value) return
  
  try {
    await adminFormRef.value.validate()
    saving.value = true
    
    if (editingAdmin.value) {
      // Modification
      await adminService.updateAdmin(editingAdmin.value._id, {
        name: adminForm.value.name,
        email: adminForm.value.email,
        phone: adminForm.value.phone,
        role: adminForm.value.role,
        permissions: adminForm.value.permissions,
        isActive: adminForm.value.isActive,
      })
      ElMessage.success('Administrateur modifié avec succès')
    } else {
      // Création
      await adminService.createAdmin({
        name: adminForm.value.name,
        email: adminForm.value.email,
        phone: adminForm.value.phone,
        role: adminForm.value.role,
        permissions: adminForm.value.permissions,
        isActive: adminForm.value.isActive,
        password: adminForm.value.password
      })
      ElMessage.success('Administrateur créé avec succès')
    }
    
    showCreateAdmin.value = false
    resetAdminForm()
    loadAdmins() // Recharger les données
  } catch (error) {
    console.error('Error saving admin:', error)
    ElMessage.error('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

const deleteAdmin = async (admin) => {
  if (admin.role === 'superadmin') {
    ElMessage.error('Impossible de supprimer un Super Admin')
    return
  }

  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.',
      'Confirmation',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'error'
      }
    )
    
    await adminService.deleteAdmin(admin._id)
    ElMessage.success('Administrateur supprimé avec succès')
    loadAdmins() // Recharger les données
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting admin:', error)
      ElMessage.error('Erreur lors de la suppression')
    }
  }
}

const toggleAdminStatus = async (admin) => {
  try {
    await ElMessageBox.confirm(
      `Êtes-vous sûr de vouloir ${admin.isActive ? 'désactiver' : 'activer'} cet administrateur ?`,
      'Confirmation',
      {
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        type: 'warning'
      }
    )

    await adminService.updateAdmin(admin._id, { isActive: !admin.isActive })
    admin.isActive = !admin.isActive // Mettre à jour l'état local
    ElMessage.success(`Administrateur ${admin.isActive ? 'activé' : 'désactivé'} avec succès`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error toggling admin status:', error)
      ElMessage.error('Erreur lors de la modification du statut')
    }
  }
}

const resetAdminForm = () => {
  adminForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'manager',
    permissions: [],
    isActive: true,
    password: ''
  }
  editingAdmin.value = null
}

// Reset form when modal closes
watch(showCreateAdmin, (newVal) => {
  if (!newVal) {
    resetAdminForm()
  }
})

// Charger les admins depuis l'API
const loadAdmins = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      role: roleFilter.value,
      isActive: statusFilter.value === 'actif' ? true : statusFilter.value === 'inactif' ? false : undefined // Pass status filter to backend
    }
    const response = await adminService.getAllAdmins(params)
    admins.value = response.data
    totalCount.value = response.totalCount // Mettre à jour le total pour la pagination
  } catch (error) {
    console.error('Erreur lors du chargement des admins:', error)
    ElMessage.error('Erreur lors du chargement des administrateurs')
  } finally {
    loading.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadAdmins()
})
</script>

<style lang="scss" scoped>
.admins-page {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-grey);
    }
  }

  .filters-section {
    margin-bottom: 20px;
    padding: 16px;
    background-color: var(--light-grey);
    border-radius: 8px;

    .el-row {
      align-items: center;
    }
  }

  .pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style> 