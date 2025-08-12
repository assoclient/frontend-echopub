<template>
  <div class="transactions-page">
    <div class="page-header">
     <!--  <h1>Transactions</h1> -->
      <p>Historique des transactions de la plateforme</p>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Rechercher par type, statut ou référence..."
            clearable
            @input="handleSearch"
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="filters">
          <el-select
            v-model="typeFilter"
            placeholder="Type de transaction"
            clearable
            @change="handleFilter"
            style="width: 150px"
          >
            <el-option label="Dépôt" value="deposit" />
            <el-option label="Retrait" value="withdrawal" />
            <el-option label="Paiement" value="payment" />
            <el-option label="Commission" value="commission" />
          </el-select>

          <el-select
            v-model="statusFilter"
            placeholder="Statut"
            clearable
            @change="handleFilter"
            style="width: 150px"
          >
            <el-option label="Terminé" value="confirmed" />
            <el-option label="En attente" value="pending" />
            <el-option label="Échoué" value="failed" />
          </el-select>

          <el-select
            v-model="userFilter"
            placeholder="Utilisateur"
            clearable
            filterable
            @change="handleFilter"
            style="width: 200px"
          >
            <el-option
              v-for="user in users"
              :key="user._id"
              :label="user.name"
              :value="user._id"
            />
          </el-select>

          <el-button @click="resetFilters" type="info" :icon="Refresh">
            Réinitialiser
          </el-button>
        </div>
      </div>
    </div>

    <!-- Table des transactions -->
    <div class="card">
      <el-table :data="transactions" style="width: 100%" v-loading="loading">
        <el-table-column prop="reference" label="Référence" width="200" />
        <el-table-column prop="user" label="Utilisateur" width="200">
          <template #default="scope">
            <div v-if="scope.row.user">
              <div class="user-info">
                <span class="user-name">{{ scope.row.user.name }}</span>
                <span class="user-email">{{ scope.row.user.email }}</span>
              </div>
            </div>
            <span v-else class="text-muted">Utilisateur supprimé</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Type" width="120">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Montant" width="150">
          <template #default="scope">
            {{ formatMoney(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="method" label="Méthode" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.method" size="small" type="info">
              {{ getMethodLabel(scope.row.method) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Statut" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="campaign" label="Campagne" width="200">
          <template #default="scope">
            <span v-if="scope.row.campaign">{{ scope.row.campaign.title }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Date" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { transactionService, userService } from '@/services/api'

const loading = ref(false)
const transactions = ref([])
const users = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Filtres
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const userFilter = ref('')

const getTypeColor = (type) => {
  const colors = {
    deposit: 'success',
    withdrawal: 'warning',
    payment: 'primary',
    commission: 'info'
  }
  return colors[type] || 'info'
}

const getTypeLabel = (type) => {
  const labels = {
    deposit: 'Dépôt',
    withdrawal: 'Retrait',
    payment: 'Paiement',
    commission: 'Commission'
  }
  return labels[type] || type
}

const getMethodLabel = (method) => {
  const labels = {
    'cm.orange': 'Orange Money',
    'cm.mtn': 'MTN Mobile Money',
    'MTN': 'MTN Mobile Money'
  }
  return labels[method] || method
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

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTransactions = async () => {
  try {
    loading.value = true
    
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      type: typeFilter.value,
      status: statusFilter.value,
      user: userFilter.value
    }
    
    const response = await transactionService.getAllTransactions(params)
    
    transactions.value = response.data || []
    totalCount.value = response.totalCount || 0
    
  } catch (error) {
    console.error('Erreur lors du chargement des transactions:', error)
    ElMessage.error('Erreur lors du chargement des transactions')
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await userService.getAllUsers({ pageSize: 1000 })
    users.value = response.data || []
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadTransactions()
}

const handleFilter = () => {
  currentPage.value = 1
  loadTransactions()
}

const resetFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  statusFilter.value = ''
  userFilter.value = ''
  currentPage.value = 1
  loadTransactions()
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadTransactions()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadTransactions()
}

onMounted(() => {
  loadUsers()
  loadTransactions()
})
</script>

<style lang="scss" scoped>
.transactions-page {
  .filters-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      .search-box {
        flex: 1;
        min-width: 300px;
      }

      .filters {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }

  .card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .user-name {
      font-weight: 500;
      color: var(--dark-grey);
    }

    .user-email {
      font-size: 12px;
      color: var(--dark-grey);
      opacity: 0.7;
    }
  }

  .text-muted {
    color: var(--dark-grey);
    opacity: 0.5;
  }

  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--light-grey);
  }
}

// Responsive
@media (max-width: 768px) {
  .transactions-page {
    .filters-section {
      .filters-row {
        flex-direction: column;
        align-items: stretch;

        .search-box {
          min-width: auto;
        }

        .filters {
          justify-content: center;
        }
      }
    }
  }
}
</style> 