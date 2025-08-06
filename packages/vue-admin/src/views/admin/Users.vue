<template>
  <div class="users-page">
    <div class="page-header">
<!--       <h1>Gestion des utilisateurs</h1> -->
      <p>Gérez les utilisateurs de la plateforme</p>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>Liste des utilisateurs</h3>
      </div>

      <el-table :data="users" style="width: 100%" v-loading="loading">
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
        <el-table-column prop="balance" label="Solde">
          <template #default="scope">
            {{ formatMoney(scope.row.balance) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Statut">
          <template #default="scope">
            <el-tag :type="scope.row.isValid ? 'success' : 'danger'">
              {{ scope.row.isValid ? 'Actif' : 'Inactif' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120">
          <template #default="scope">
            <el-button 
              size="small" 
              :type="scope.row.isValid ? 'warning' : 'success'"
              @click="toggleUserStatus(scope.row)"
            >
              <el-tooltip :content="scope.row.isValid ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'" placement="top">
                <el-icon><SwitchButton /></el-icon>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userService } from '@/services/api'

const users = ref([])
const loading = ref(false)

// Charger les utilisateurs depuis l'API
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getAllUsers()
    users.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    ElMessage.error('Erreur lors du chargement des utilisateurs')
  } finally {
    loading.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadUsers()
})

const toggleUserStatus = async (user) => {
  try {
    await userService.updateUser(user._id, { isValid: !user.isValid })
    user.isValid = !user.isValid
    ElMessage.success(`Utilisateur ${user.isValid ? 'activé' : 'désactivé'} avec succès`)
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
    ElMessage.error('Erreur lors du changement de statut')
  }
}

const getRoleType = (role) => {
  const types = {
    admin: 'danger',
    advertiser: 'primary',
    ambassador: 'success'
  }
  return types[role] || 'info'
}

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrateur',
    advertiser: 'Annonceur',
    ambassador: 'Ambassadeur'
  }
  return labels[role] || role
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}
</script>

<style lang="scss" scoped>
.users-page {
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
}
</style> 