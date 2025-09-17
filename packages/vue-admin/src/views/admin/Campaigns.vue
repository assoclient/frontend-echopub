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
        <el-table-column label="Média" width="80">
          <template #default="scope">
            <div v-if="scope.row.media_url" class="media-thumbnail" @click="viewMedia(scope.row)">
              <img 
                :src="scope.row.media_url" 
                :alt="scope.row.title"
                class="thumbnail-image"
              />
              <div class="media-overlay">
                <el-icon><View /></el-icon>
              </div>
            </div>
            <span v-else class="no-media">Aucun média</span>
          </template>
        </el-table-column>
        <el-table-column label="Transaction" width="120">
          <template #default="scope">
            <div v-if="scope.row.transaction" class="transaction-status">
              <el-tag :type="getTransactionStatusType(scope.row.transaction.status)">
                {{ getTransactionStatusLabel(scope.row.transaction.status) }}
              </el-tag>
              <div class="transaction-amount">
                {{ formatMoney(scope.row.transaction.amount) }}
              </div>
            </div>
            <span v-else class="no-transaction">Aucune transaction</span>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="Vues" />
        <el-table-column prop="clicks" label="Clics" />
        <el-table-column prop="ambassadorCount" label="Ambassadeurs" />
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
              :loading="scope.row.updating"
              :disabled="scope.row.status === 'submitted' && !canActivateCampaign(scope.row)"
            >
              {{ 
                scope.row.status === 'active' ? 'Pauser' : 
                scope.row.status === 'paused' ? 'Activer' :
                scope.row.status === 'submitted' ? 'Activer' : 'Modifier'
              }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="deleteCampaign(scope.row)"
              :icon="Delete"
              v-if="scope.row.status === 'draft'"
            >
              <el-tooltip content="Supprimer la campagne" placement="top">
                
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

    <!-- Modal de détails de la campagne -->
    <el-dialog
      v-model="campaignDetailsVisible"
      title="Détails de la campagne"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedCampaign" class="campaign-details">
        <div class="detail-section">
          <h4>Informations générales</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">Titre:</span>
                <span class="value">{{ selectedCampaign.title }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Annonceur:</span>
                <span class="value">{{ selectedCampaign.advertiser }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Statut:</span>
                <el-tag :type="getStatusType(selectedCampaign.status)">
                  {{ getStatusLabel(selectedCampaign.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">Budget:</span>
                <span class="value">{{ formatMoney(selectedCampaign.budget) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Vues attendues:</span>
                <span class="value">{{ selectedCampaign.expected_views || 'Non défini' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date de création:</span>
                <span class="value">{{ formatDate(selectedCampaign.createdAt) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="detail-section">
          <h4>Statistiques</h4>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ selectedCampaign.views || 0 }}</div>
                <div class="stat-label">Vues totales</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ selectedCampaign.clicks || 0 }}</div>
                <div class="stat-label">Clics totaux</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ selectedCampaign.ambassadorCount || 0 }}</div>
                <div class="stat-label">Ambassadeurs</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="detail-section" v-if="selectedCampaign.description">
          <h4>Description</h4>
          <p>{{ selectedCampaign.description }}</p>
        </div>

        <div class="detail-section" v-if="selectedCampaign.target_link">
          <h4>Lien cible</h4>
          <a :href="selectedCampaign.target_link" target="_blank" class="target-link">
            {{ selectedCampaign.target_link }}
          </a>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="campaignDetailsVisible = false">Fermer</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal de confirmation pour le changement de statut -->
    <el-dialog
      v-model="statusChangeVisible"
      title="Confirmation de changement de statut"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="status-change-confirmation">
        <p>
          Êtes-vous sûr de vouloir 
          <strong>{{ statusChangeAction === 'pause' ? 'pauser' : 'activer' }}</strong> 
          la campagne <strong>"{{ selectedCampaign?.title }}"</strong> ?
        </p>
        <p v-if="statusChangeAction === 'pause'" class="warning-text">
          ⚠️ La campagne sera mise en pause et ne générera plus de vues.
        </p>
        <p v-else class="info-text">
          ✅ La campagne sera activée et pourra générer des vues.
        </p>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusChangeVisible = false">Annuler</el-button>
          <el-button 
            type="warning" 
            @click="confirmStatusChange"
            :loading="updatingStatus"
          >
            Confirmer
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal pour voir le média -->
    <el-dialog
      v-model="mediaViewVisible"
      title="Média de la campagne"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedCampaign" class="media-view">
        <div class="media-info">
          <h4>{{ selectedCampaign.title }}</h4>
          <p><strong>Type:</strong> {{ getMediaType(selectedCampaign.media_url) }}</p>
        </div>
        
        <div class="media-content">
          <img 
            v-if="isImage(selectedCampaign.media_url)" 
            :src="selectedCampaign.media_url" 
            :alt="selectedCampaign.title"
            class="media-image"
          />
          <video 
            v-else-if="isVideo(selectedCampaign.media_url)" 
            :src="selectedCampaign.media_url" 
            controls
            class="media-video"
          />
          <div v-else class="media-unknown">
            <el-icon><Document /></el-icon>
            <p>Type de média non supporté</p>
            <a :href="selectedCampaign.media_url" target="_blank" class="media-link">
              Voir le fichier
            </a>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="mediaViewVisible = false">Fermer</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Refresh, View, Document, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// Modals
const campaignDetailsVisible = ref(false)
const statusChangeVisible = ref(false)
const mediaViewVisible = ref(false)
const selectedCampaign = ref(null)
const statusChangeAction = ref('')
const updatingStatus = ref(false)

// Liste unique des annonceurs (sera mise à jour depuis le backend)
const uniqueAdvertisers = ref([])

// Campagnes paginées (directement depuis le backend)
const paginatedCampaigns = computed(() => campaigns.value)

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
    paused: 'Pausée',
    submitted: 'Soumise'
  }
  return labels[status] || status
}

const getTransactionStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    failed: 'Échouée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getTransactionStatusType = (status) => {
  const types = {
    pending: 'warning',
    confirmed: 'success',
    failed: 'danger',
    cancelled: 'info'
  }
  return types[status] || 'info'
}

const deleteCampaign = (campaign) => {
  ElMessageBox.confirm('Êtes-vous sûr de vouloir supprimer la campagne "'+campaign.title+'" ?', 'Confirmation de suppression', {
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    type: 'warning',
  }).then(async () => {
    await campaignService.deleteCampaign(campaign._id)
    ElMessage.success('Campagne supprimée avec succès')
  }).catch(() => {
    ElMessage.error('Annulation de la suppression')
  })
  loadCampaigns()
}

const canActivateCampaign = (campaign) => {
  return campaign.status === 'submitted' && 
         campaign.transaction && 
         campaign.transaction.status === 'confirmed'
}

const isImage = (url) => {
  if (!url) return false
  const ext = url.split('.').pop().toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

const isVideo = (url) => {
  if (!url) return false
  const ext = url.split('.').pop().toLowerCase()
  return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)
}

const getMediaType = (url) => {
  if (!url) return 'Aucun'
  if (isImage(url)) return 'Image'
  if (isVideo(url)) return 'Vidéo'
  return 'Fichier'
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Voir les détails d'une campagne
const viewCampaign = (campaign) => {
  selectedCampaign.value = campaign
  campaignDetailsVisible.value = true
}

// Voir le média de la campagne
const viewMedia = (campaign) => {
  selectedCampaign.value = campaign
  mediaViewVisible.value = true
}

// Changer le statut d'une campagne
const toggleCampaign = (campaign) => {
  if (campaign.status === 'active') {
    statusChangeAction.value = 'pause'
  } else if (campaign.status === 'paused') {
    statusChangeAction.value = 'activate'
  } else if (campaign.status === 'submitted') {
    if (canActivateCampaign(campaign)) {
      statusChangeAction.value = 'activate'
    } else {
      ElMessage.warning('Une campagne ne peut être activée que si elle est soumise ET que sa transaction est confirmée')
      return
    }
  } else {
    ElMessage.warning('Seules les campagnes actives peuvent être pausées, les campagnes pausées peuvent être activées, et les campagnes soumises avec transaction confirmée peuvent être activées')
    return
  }
  
  selectedCampaign.value = campaign
  statusChangeVisible.value = true
}

// Confirmer le changement de statut
const confirmStatusChange = async () => {
  if (!selectedCampaign.value) return
  
  const campaign = selectedCampaign.value
  const newStatus = statusChangeAction.value === 'pause' ? 'paused' : 'active'
  
  try {
    updatingStatus.value = true
    
    // Mettre à jour le statut localement d'abord
    campaign.status = newStatus
    campaign.updating = true
    
    // Appeler l'API pour mettre à jour le statut
    await campaignService.changeCampaignStatus(campaign._id, newStatus)
    
    ElMessage.success(`Campagne ${statusChangeAction.value === 'pause' ? 'pausée' : 'activée'} avec succès`)
    
    // Fermer le modal
    statusChangeVisible.value = false
    selectedCampaign.value = null
    
    // Recharger les campagnes pour avoir les données à jour
    await loadCampaigns()
    
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
    ElMessage.error('Erreur lors du changement de statut')
    
    // Remettre l'ancien statut en cas d'erreur
    campaign.status = statusChangeAction.value === 'pause' ? 'active' : 'paused'
  } finally {
    updatingStatus.value = false
    if (campaign) {
      campaign.updating = false
    }
  }
}

// Charger les campagnes depuis l'API
const loadCampaigns = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      advertiser: advertiserFilter.value,
      status: statusFilter.value,
      sortBy: sortBy.value
    }
    
    console.log('🔍 loadCampaigns - Params envoyés au backend:', params)
    
    const response = await campaignService.getAllCampaigns(params)
    campaigns.value = response.data
    totalCount.value = response.totalCount
    
    // Mettre à jour la liste des annonceurs uniques
    updateUniqueAdvertisers()
    
    console.log('✅ loadCampaigns - Réponse reçue:', {
      totalCount: response.totalCount,
      campaignsCount: response.data.length
    })
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des campagnes:', error)
    ElMessage.error('Erreur lors du chargement des campagnes')
  } finally {
    loading.value = false
  }
}

// Mettre à jour la liste des annonceurs uniques
const updateUniqueAdvertisers = () => {
  const advertisers = new Set()
  campaigns.value.forEach(campaign => {
    if (campaign.advertiser) {
      advertisers.add(campaign.advertiser)
    }
  })
  uniqueAdvertisers.value = Array.from(advertisers).sort()
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

.campaign-details {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 600;
      border-bottom: 2px solid var(--el-border-color-light);
      padding-bottom: 8px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 0;
      
      .label {
        font-weight: 600;
        color: var(--el-text-color-regular);
        min-width: 120px;
      }
      
      .value {
        color: var(--el-text-color-primary);
        text-align: right;
      }
    }
    
    .stat-card {
      text-align: center;
      padding: 16px;
      background-color: var(--el-fill-color-light);
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);
      
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--el-color-primary);
        margin-bottom: 8px;
      }
      
      .stat-label {
        color: var(--el-text-color-regular);
        font-size: 14px;
      }
    }
    
    .target-link {
      color: var(--el-color-primary);
      text-decoration: none;
      word-break: break-all;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.status-change-confirmation {
  text-align: center;
  
  p {
    margin: 12px 0;
    line-height: 1.5;
  }
  
  .warning-text {
    color: var(--el-color-warning);
    font-weight: 500;
  }
  
  .info-text {
    color: var(--el-color-success);
    font-weight: 500;
  }
}

.dialog-footer {
  text-align: right;
}

// Styles pour les colonnes média et transaction
.media-thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--el-color-primary);
    transform: scale(1.05);
    
    .media-overlay {
      opacity: 1;
    }
  }
  
  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .media-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .el-icon {
      color: white;
      font-size: 20px;
    }
  }
}

.no-media {
  color: var(--el-text-color-placeholder);
  font-style: italic;
  font-size: 12px;
}

.transaction-status {
  text-align: center;
  
  .transaction-amount {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-regular);
    font-weight: 500;
  }
}

.no-transaction {
  color: var(--el-text-color-placeholder);
  font-style: italic;
  font-size: 12px;
}

// Styles pour le modal média
.media-view {
  .media-info {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    
    h4 {
      margin: 0 0 8px 0;
      color: var(--el-text-color-primary);
    }
    
    p {
      margin: 0;
      color: var(--el-text-color-regular);
    }
  }
  
  .media-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    
    .media-image {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .media-video {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .media-unknown {
      text-align: center;
      color: var(--el-text-color-placeholder);
      
      .el-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      p {
        margin: 8px 0 16px 0;
        font-size: 16px;
      }
      
      .media-link {
        color: var(--el-color-primary);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style> 