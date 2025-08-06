<template>
  <div class="campaigns-page">
    <div class="page-header">
    <!--   <h1>Gestion des campagnes</h1> -->
      <p>Surveillez toutes les campagnes de la plateforme</p>
    </div>

    <div class="card">
      <!-- Filtres et recherche -->
      <div class="filters-section">
        <el-row :gutter="16">
          <el-col :span="6">
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
              v-model="advertiserFilter"
              placeholder="Filtrer par annonceur"
              clearable
              @change="handleFilter"
            >
              <el-option label="Tous les annonceurs" value="" />
              <el-option 
                v-for="advertiser in uniqueAdvertisers" 
                :key="advertiser" 
                :label="advertiser" 
                :value="advertiser"
              />
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
              <el-option label="Active" value="active" />
              <el-option label="Brouillon" value="draft" />
              <el-option label="Terminée" value="completed" />
              <el-option label="Pausée" value="paused" />
            </el-select>
          </el-col>
          
          <el-col :span="4">
            <el-select
              v-model="sortBy"
              placeholder="Trier par"
              @change="handleSort"
            >
              <el-option label="Date de création" value="createdAt" />
              <el-option label="Budget" value="budget" />
              <el-option label="Vues" value="views" />
              <el-option label="Clics" value="clicks" />
              <el-option label="Annonceur" value="advertiser" />
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

      <el-table :data="campaigns" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="Titre" />
        <el-table-column prop="advertiser" label="Annonceur" />
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
        <el-table-column prop="createdAt" label="Date de création">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewCampaign(scope.row)">
              Voir
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
import { ref, computed, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { campaignService } from '@/services/api'

const campaigns = ref([])
const loading = ref(false)
const totalCount = ref(0)

// Filtres et recherche
const searchQuery = ref('')
const advertiserFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Campagnes filtrées
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Filtre par recherche (titre)
  if (searchQuery.value) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filtre par annonceur
  if (advertiserFilter.value) {
    filtered = filtered.filter(campaign => campaign.advertiser === advertiserFilter.value)
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
      case 'advertiser':
        return a.advertiser.localeCompare(b.advertiser)
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

// Liste unique des annonceurs
const uniqueAdvertisers = computed(() => {
  const advertisers = new Set()
  campaigns.value.forEach(campaign => {
    advertisers.add(campaign.advertiser)
  })
  return Array.from(advertisers).sort()
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
  loadCampaigns()
}

const handleFilter = () => {
  currentPage.value = 1
  loadCampaigns()
}

const handleSort = () => {
  currentPage.value = 1
  loadCampaigns()
}

const resetFilters = () => {
  searchQuery.value = ''
  advertiserFilter.value = ''
  statusFilter.value = ''
  sortBy.value = 'createdAt'
  currentPage.value = 1
  loadCampaigns()
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadCampaigns()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadCampaigns()
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const viewCampaign = (campaign) => {
  ElMessage.info('Fonctionnalité en cours de développement')
}

const toggleCampaign = (campaign) => {
  ElMessage.success(`Campagne ${campaign.status === 'active' ? 'pausée' : 'activée'}`)
}

// Charger les campagnes depuis l'API
const loadCampaigns = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value
    }
    const response = await campaignService.getAllCampaigns(params)
    campaigns.value = response.data
    totalCount.value = response.totalCount
  } catch (error) {
    console.error('Erreur lors du chargement des campagnes:', error)
    ElMessage.error('Erreur lors du chargement des campagnes')
  } finally {
    loading.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadCampaigns()
})
</script>

<style lang="scss" scoped>
.campaigns-page {
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