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
        <el-form :model="profile" label-width="120px">
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
            <el-input v-model="profile.whatsapp" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="updateProfile">
              Mettre à jour
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Statistiques des campagnes -->
      <div class="card">
        <h3>Statistiques des campagnes</h3>
        <div class="stats-info">
          <div class="stat-item">
            <span class="label">Campagnes créées</span>
            <span class="amount">{{ profile.campaignsCount }}</span>
          </div>
          
          <div class="stat-item">
            <span class="label">Total dépensé</span>
            <span class="amount">{{ formatMoney(profile.totalSpent) }}</span>
          </div>
          
          <div class="stat-item">
            <span class="label">Campagnes actives</span>
            <span class="amount">{{ profile.activeCampaigns }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique des transactions -->
    <div class="card">
      <h3>Historique des transactions</h3>
      <el-table :data="transactions" style="width: 100%">
        <el-table-column prop="date" label="Date">
          <template #default="scope">
            {{ formatDate(scope.row.date) }}
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const profile = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+237 123456789',
  whatsapp: '+237 123456789',
  balance: 150000,
  totalSpent: 850000,
  campaignsCount: 12,
  activeCampaigns: 5
})

const transactions = ref([
  {
    id: 1,
    date: new Date(),
    type: 'deposit',
    amount: 50000,
    status: 'completed'
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000),
    type: 'deposit',
    amount: 100000,
    status: 'completed'
  }
])

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'Terminé',
    pending: 'En attente',
    failed: 'Échoué'
  }
  return labels[status] || status
}

const updateProfile = () => {
  ElMessage.success('Profil mis à jour avec succès')
}
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