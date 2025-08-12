<template>
  <div class="profile-page">
    <div class="page-header">
      <!-- <h1>Mon Profil</h1>
      <p>Gérez vos informations personnelles</p> -->
    </div>

    <div class="profile-grid">
      <!-- Informations personnelles -->
      <div class="card">
        <h3>Informations personnelles</h3>
        <el-form :model="profile" label-width="120px" v-loading="profileLoading">
          <el-form-item label="Nom complet">
            <el-input v-model="profile.name" />
          </el-form-item>
          
          <el-form-item label="Email">
            <el-input v-model="profile.email" type="email" />
          </el-form-item>
          
          <el-form-item label="Téléphone">
            <el-input v-model="profile.phone" />
          </el-form-item>
          
          <el-form-item label="WhatsApp">
            <el-input v-model="profile.whatsapp_number" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="updateProfile" :loading="updating">
              Mettre à jour
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- Historique des transactions -->
    <div class="card">
      <h3>Historique des transactions</h3>
      <el-table :data="transactions" style="width: 100%" v-loading="transactionsLoading">
        <el-table-column prop="createdAt" label="Date">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Type">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'deposit' ? 'success' : 'warning'">
              {{ scope.row.type === 'deposit' ? 'Dépôt' : 'Retrait' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Montant">
          <template #default="scope">
            {{ formatMoney(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Statut">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { profileService } from '@/services/api'

const profileLoading = ref(false)
const transactionsLoading = ref(false)
const updating = ref(false)

const profile = reactive({
  _id: '',
  name: '',
  email: '',
  phone: '',
  whatsapp_number: ''
})

const transactions = ref([])

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatusType = (status) => {
  const types = {
    confirmed: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    confirmed: 'Terminé',
    pending: 'En attente',
    failed: 'Échoué'
  }
  return labels[status] || status
}

const loadProfile = async () => {
  try {
    profileLoading.value = true
    const userData = await profileService.getMyProfile()
    
    // Mettre à jour les informations du profil
    Object.assign(profile, userData)
    
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    ElMessage.error('Erreur lors du chargement du profil')
  } finally {
    profileLoading.value = false
  }
}

const loadTransactions = async () => {
  try {
    transactionsLoading.value = true
    const response = await profileService.getMyTransactions()
    
    if (response.data) {
      transactions.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des transactions:', error)
    ElMessage.error('Erreur lors du chargement des transactions')
  } finally {
    transactionsLoading.value = false
  }
}

const updateProfile = async () => {
  try {
    updating.value = true
    
    // Préparer les données à envoyer (exclure les champs calculés)
    const updateData = {
      _id: profile._id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      whatsapp_number: profile.whatsapp_number
    }
    
    await profileService.updateProfile(updateData)
    
    ElMessage.success('Profil mis à jour avec succès')
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    ElMessage.error('Erreur lors de la mise à jour du profil')
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadTransactions()
})
</script>

<style lang="scss" scoped>
.profile-page {
  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stats-info {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--light-grey);

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: var(--dark-grey);
        font-weight: 500;
      }

      .amount {
        font-weight: 600;
        color: var(--primary-blue);
        font-size: 16px;
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .profile-page {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 