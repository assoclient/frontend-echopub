<template>
  <div class="campaigns-page">
    <div class="page-header">
      <!-- <h1>Mes Campagnes</h1>
      <p>Gérez vos campagnes publicitaires</p> -->
    </div>

    <div class="card">
      <div class="table-header">
        <h3>Liste des campagnes</h3>
        <el-button type="primary" @click="$router.push('/advertiser/campaigns/create')">
          <el-icon><Plus /></el-icon>
          Nouvelle campagne
        </el-button>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-input
              v-model="searchQuery"
              placeholder="Rechercher une campagne..."
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
              v-model="statusFilter"
              placeholder="Filtrer par statut"
              clearable
              @change="handleFilter"
            >
              <el-option label="Tous les statuts" value="" />
              <el-option label="Active" value="active" />
              <el-option label="Brouillon" value="draft" />
              <el-option label="Terminée" value="completed" />
              <el-option label="Pausée" value="paused" />
            </el-select>
          </el-col>
          
          <el-col :span="6">
            <el-select
              v-model="sortBy"
              placeholder="Trier par"
              @change="handleSort"
            >
              <el-option label="Date de création" value="createdAt" />
              <el-option label="Budget" value="budget" />
              <el-option label="Vues" value="views" />
              <el-option label="Clics" value="clicks" />
            </el-select>
          </el-col>
          
          <el-col :span="4">
            <el-button @click="resetFilters" type="info" plain>
              Réinitialiser
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-table :data="paginatedCampaigns" style="width: 100%">
        <el-table-column prop="title" label="Titre" />
        <el-table-column prop="status" label="Statut">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="Budget">
          <template #default="scope">
            {{ formatMoney(scope.row.budget) }}
          </template>
        </el-table-column>
        <el-table-column prop="views" label="Vues" />
        <el-table-column prop="clicks" label="Clics" />
        <el-table-column prop="progress" label="Progression">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button size="small" @click="editCampaign(scope.row)">
              Modifier
            </el-button>
            <el-button 
              size="small" 
              type="warning" 
              @click="toggleCampaign(scope.row)"
            >
              {{ scope.row.status === 'active' ? 'Pauser' : 'Activer' }}
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
          :total="filteredCampaigns.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const campaigns = ref([
  {
    id: 1,
    title: 'Promo Été 2024',
    status: 'active',
    budget: 150000,
    views: 12500,
    clicks: 450,
    progress: 75,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Nouveau Produit',
    status: 'draft',
    budget: 80000,
    views: 0,
    clicks: 0,
    progress: 0,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 3,
    title: 'Black Friday',
    status: 'completed',
    budget: 200000,
    views: 32000,
    clicks: 1200,
    progress: 100,
    createdAt: new Date('2023-11-25')
  },
  {
    id: 4,
    title: 'Campagne Test',
    status: 'paused',
    budget: 50000,
    views: 2500,
    clicks: 120,
    progress: 45,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 5,
    title: 'Promotion Hiver',
    status: 'active',
    budget: 120000,
    views: 8500,
    clicks: 320,
    progress: 60,
    createdAt: new Date('2024-01-05')
  }
])

// Filtres et recherche
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Campagnes filtrées
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Filtre par recherche
  if (searchQuery.value) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'budget':
        return b.budget - a.budget
      case 'views':
        return b.views - a.views
      case 'clicks':
        return b.clicks - a.clicks
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

// Campagnes paginées
const paginatedCampaigns = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCampaigns.value.slice(start, end)
})

// Handlers
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  sortBy.value = 'createdAt'
  currentPage.value = 1
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    draft: 'info',
    completed: 'primary',
    paused: 'warning'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Active',
    draft: 'Brouillon',
    completed: 'Terminée',
    paused: 'Pausée'
  }
  return labels[status] || status
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const editCampaign = (campaign) => {
  ElMessage.info('Fonctionnalité en cours de développement')
}

const toggleCampaign = (campaign) => {
  ElMessage.success(`Campagne ${campaign.status === 'active' ? 'pausée' : 'activée'}`)
}
</script>

<style lang="scss" scoped>
.campaigns-page {
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