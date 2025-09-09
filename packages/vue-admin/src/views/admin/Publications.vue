<template>
  <div class="publications-page">
    <div class="page-header">
      <p>Gestion des publications des ambassadeurs</p>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Rechercher par nom d'ambassadeur ou titre de campagne..."
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
            v-model="statusFilter"
            placeholder="Statut"
            clearable
            @change="handleFilter"
            style="width: 150px"
          >
            <el-option label="Publié" value="published" />
            <el-option label="Soumis" value="submitted" />
            <el-option label="Validé" value="validated" />
            <el-option label="Rejeté" value="rejected" />
          </el-select>

          <el-button @click="resetFilters" type="info" :icon="Refresh">
            Réinitialiser
          </el-button>
        </div>
      </div>
    </div>

    <!-- Table des publications -->
    <div class="card">
      <el-table :data="publications" style="width: 100%" v-loading="loading">
        <el-table-column prop="ambassador" label="Ambassadeur" width="200">
          <template #default="scope">
            <div v-if="scope.row.ambassador">
              <div class="user-info">
                <span class="user-name">{{ scope.row.ambassador.name }}</span>
                <span class="user-email">{{ scope.row.ambassador.email }}</span>
              </div>
            </div>
            <span v-else class="text-muted">Ambassadeur supprimé</span>
          </template>
        </el-table-column>

        <el-table-column prop="campaign" label="Campagne" width="250">
          <template #default="scope">
            <div v-if="scope.row.campaign">
              <div class="campaign-info">
                <span class="campaign-title">{{ scope.row.campaign.title }}</span>
                <span class="campaign-budget">{{ formatMoney(scope.row.campaign.budget) }}</span>
              </div>
            </div>
            <span v-else class="text-muted">Campagne supprimée</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Statut" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="views_count" label="Vues" width="100">
          <template #default="scope">
            {{ formatNumber(scope.row.views_count || 0) }}
          </template>
        </el-table-column>

        <el-table-column prop="clicks_count" label="Clics" width="100">
          <template #default="scope">
            {{ formatNumber(scope.row.clicks_count || 0) }}
          </template>
        </el-table-column>

        <el-table-column prop="amount_earned" label="Gains" width="120">
          <template #default="scope">
            {{ formatMoney(scope.row.amount_earned || 0) }}
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="Date de publication" width="150">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Nombre d'Heures depuis la publication" width="200">
          <template #default="scope">
            {{ formatHoursSincePublication(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="openDetailsModal(scope.row)"
              title="Voir les détails"
            />
            <el-button
              v-if="scope.row.status === 'submitted' || scope.row.status === 'published'"
              type="danger"
              size="small"
              :icon="Delete"
              @click="openDeleteModal(scope.row)"
              title="Supprimer la publication"
            />
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

    <!-- Modal des détails -->
    <el-dialog
      v-model="detailsModalVisible"
      title="Détails de la publication"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedPublication" class="publication-details">
        <!-- Informations générales -->
        <div class="info-section">
          <h4>Informations générales</h4>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="info-item">
                <span class="label">Ambassadeur:</span>
                <span class="value">{{ selectedPublication.ambassador?.name }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">Campagne:</span>
                <span class="value">{{ selectedPublication.campaign?.title }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">Statut:</span>
                <el-tag :type="getStatusType(selectedPublication.status)">
                  {{ getStatusLabel(selectedPublication.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">Date de publication:</span>
                <span class="value">{{ formatDate(selectedPublication.createdAt) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">Vues:</span>
                <span class="value">{{ formatNumber(selectedPublication.views_count || 0) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">Clics:</span>
                <span class="value">{{ formatNumber(selectedPublication.clicks_count || 0) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">Gains:</span>
                <span class="value">{{ formatMoney(selectedPublication.amount_earned || 0) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Preuves -->
        <div class="proofs-section">
          <h4>Preuves de publication</h4>
          
          <div class="proofs-grid">
            <!-- Preuve 1 -->
            <div class="proof-item">
              <h5>Preuve 1 (Capture initiale)</h5>
              <div v-if="selectedPublication.screenshot_url" class="proof-image">
                <img 
                  :src="selectedPublication.screenshot_url" 
                  alt="Preuve 1"
                  @click="openImagePreview(selectedPublication.screenshot_url)"
                  class="clickable-image"
                />
                <div class="proof-actions">
                  <el-button size="small" @click="openImagePreview(selectedPublication.screenshot_url)">
                    <el-icon><View /></el-icon>
                    Voir
                  </el-button>
                  <el-button size="small" @click="downloadImage(selectedPublication.screenshot_url)">
                    <el-icon><Download /></el-icon>
                    Télécharger
                  </el-button>
                </div>
              </div>
              <div v-else class="no-proof">
                <el-icon><Picture /></el-icon>
                <span>Aucune preuve fournie</span>
              </div>
            </div>

            <!-- Preuve 2 -->
            <div class="proof-item">
              <h5>Preuve 2 (Capture 18h après)</h5>
              <div v-if="selectedPublication.screenshot_url2" class="proof-image">
                <img 
                  :src="selectedPublication.screenshot_url2" 
                  alt="Preuve 2"
                  @click="openImagePreview(selectedPublication.screenshot_url2)"
                  class="clickable-image"
                />
                <div class="proof-actions">
                  <el-button size="small" @click="openImagePreview(selectedPublication.screenshot_url2)">
                    <el-icon><View /></el-icon>
                    Voir
                  </el-button>
                  <el-button size="small" @click="downloadImage(selectedPublication.screenshot_url2)">
                    <el-icon><Download /></el-icon>
                    Télécharger
                  </el-button>
                </div>
              </div>
              <div v-else class="no-proof">
                <el-icon><Picture /></el-icon>
                <span>Aucune preuve fournie</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <el-button 
            type="success" 
            @click="openValidationModal"
            :disabled="!canValidate"
          >
            <el-icon><Check /></el-icon>
            Valider la publication
          </el-button>
          
          <el-button @click="detailsModalVisible = false">
            Fermer
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
    v-model="deleteModalVisible"
    title="Suppression de la publication"
    width="300px"
     :close-on-click-modal="false"
     >
      <div class="delete-modal-content">
        <h5>Voulez vous vraiment supprimer cette publication ?</h5>
        <el-button @click="deleteModalVisible = false">Annuler</el-button>
        <el-button  type="danger" @click="confirmDelete">Supprimer</el-button>
      </div>
    </el-dialog>
    <!-- Modal de validation -->
    <el-dialog
      v-model="validationModalVisible"
      title="Validation de la publication"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="validation-form">
        <div class="publication-summary">
          <h4>Publication à valider</h4>
          <div class="summary-item">
            <span class="label">Ambassadeur:</span>
            <span class="value">{{ selectedPublication?.ambassador?.name }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Campagne:</span>
            <span class="value">{{ selectedPublication?.campaign?.title }}</span>
          </div>
        </div>

        <el-form :model="validationForm" :rules="validationRules" ref="validationFormRef" label-width="150px">
          <el-form-item label="Nombre de vues" prop="views_count">
            <el-input-number
              v-model="validationForm.views_count"
              :min="0"
              :max="999999999"
              :step="1"
              placeholder="Entrez le nombre de vues"
              style="width: 100%"
            />
            <div class="form-tip">
              Entrez le nombre de vues observé sur la capture d'écran
            </div>
          </el-form-item>

          <el-form-item label="Commentaire" prop="comment">
            <el-input
              v-model="validationForm.comment"
              type="textarea"
              :rows="3"
              placeholder="Commentaire optionnel sur la validation..."
            />
          </el-form-item>
        </el-form>

        <div class="earnings-preview" v-if="validationForm.views_count > 0">
          <div class="earnings-item">
            <span class="label">Gains calculés:</span>
            <span class="value">{{ formatMoney(calculatedEarnings) }}</span>
          </div>
          <div class="earnings-note">
            Le montant sera calculé automatiquement par le système
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="validationModalVisible = false">Annuler</el-button>
          <el-button 
            type="primary" 
            @click="confirmValidation"
            :loading="validating"
          >
            <el-icon><Check /></el-icon>
            Valider la publication
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal de prévisualisation d'image -->
    <el-dialog
      v-model="imagePreviewVisible"
      title="Prévisualisation de l'image"
      width="90%"
      :close-on-click-modal="true"
    >
      <div class="image-preview">
        <img :src="previewImageUrl" alt="Prévisualisation" style="max-width: 100%; height: auto;" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  Search, 
  Refresh, 
  View, 
  Download, 
  Check, 
  Picture,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ambassadorCampaignService } from '@/services/api'

const loading = ref(false)
const validating = ref(false)
const publications = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Filtres
const searchQuery = ref('')
const statusFilter = ref('')

// Modal
const detailsModalVisible = ref(false)
const selectedPublication = ref(null)
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')
const deleteModalVisible = ref(false)
const selectedPublicationToDelete = ref(null)
// Modal de validation
const validationModalVisible = ref(false)
const validationFormRef = ref(null)
const validationForm = reactive({
  views_count: 0,
  comment: ''
})

// Règles de validation du formulaire
const validationRules = {
  views_count: [
    { required: true, message: 'Le nombre de vues est requis', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Le nombre de vues doit être positif', trigger: 'blur' }
  ]
}

const getStatusType = (status) => {
  const types = {
    published: 'primary',
    submitted: 'warning',
    validated: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'Publié',
    submitted: 'Soumis',
    validated: 'Validé',
    rejected: 'Rejeté'
  }
  return labels[status] || status
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
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
const formatHoursSincePublication = (date) => {
  const now = new Date()
  const publicationDate = new Date(date)
  const diff = now - publicationDate
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return hours + 'h'
}
const canValidate = computed(() => {
  if (!selectedPublication.value) return false
  if (selectedPublication.value.status === 'validated') return false
  return selectedPublication.value.screenshot_url && selectedPublication.value.screenshot_url2
})

// Calcul approximatif des gains (sera calculé précisément par le backend)
const calculatedEarnings = computed(() => {
  if (!validationForm.views_count || !selectedPublication.value?.campaign) return 0
  // Estimation basée sur le CPV ambassadeur (valeur par défaut: 10 FCFA)
  const estimatedCpv = selectedPublication.value?.campaign?.cpv_ambassador // Cette valeur sera récupérée du backend
  return validationForm.views_count * estimatedCpv
})

const loadPublications = async () => {
  try {
    loading.value = true
    
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value
    }
    
    const response = await ambassadorCampaignService.getAllAmbassadorCampaigns(params)
    
    publications.value = response.data || []
    totalCount.value = response.totalCount || 0
    
  } catch (error) {
    console.error('Erreur lors du chargement des publications:', error)
    ElMessage.error('Erreur lors du chargement des publications')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadPublications()
}

const handleFilter = () => {
  currentPage.value = 1
  loadPublications()
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  loadPublications()
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadPublications()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadPublications()
}

const openDetailsModal = (publication) => {
  selectedPublication.value = publication
  detailsModalVisible.value = true
}

const openDeleteModal = (publication) => {
  selectedPublicationToDelete.value = publication
  deleteModalVisible.value = true
}

const openImagePreview = (imageUrl) => {
  previewImageUrl.value = imageUrl
  imagePreviewVisible.value = true
}

const downloadImage = (imageUrl) => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `preuve_${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const openValidationModal = () => {
  if (!canValidate.value) {
    ElMessage.warning('Impossible de valider cette publication')
    return
  }
  
  // Réinitialiser le formulaire
  validationForm.views_count = selectedPublication.value.views_count || 0
  validationForm.comment = ''
  
  validationModalVisible.value = true
}
const confirmDelete = async () => {
  try {
    await ambassadorCampaignService.deleteAmbassadorCampaign(selectedPublicationToDelete.value._id)
    deleteModalVisible.value = false
    ElMessage.success('Publication supprimée avec succès')
    loadPublications()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    ElMessage.error('Erreur lors de la suppression de la publication')
    if (error?.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('Erreur lors de la suppression de la publication')
    }
  }
  }

const confirmValidation = async () => {
  try {
    // Valider le formulaire
    if (!validationFormRef.value) return
    
    await validationFormRef.value.validate()
    
    validating.value = true
    
    const validationData = {
      views_count: validationForm.views_count,
      comment: validationForm.comment
    }
    
    const response = await ambassadorCampaignService.validatePublication(
      selectedPublication.value._id, 
      validationData
    )
    
    if (response.success) {
      ElMessage.success('Publication validée avec succès')
      
      // Mettre à jour la publication locale
      selectedPublication.value.status = 'validated'
      selectedPublication.value.views_count = validationForm.views_count
      selectedPublication.value.amount_earned = response.data?.amount_earned || calculatedEarnings.value
      
      // Fermer les modals et recharger
      validationModalVisible.value = false
      detailsModalVisible.value = false
      loadPublications()
    }
    
  } catch (error) {
    if (error?.message) {
      ElMessage.error(error.message)
    } else {
      console.error('Erreur lors de la validation:', error)
      ElMessage.error('Erreur lors de la validation de la publication')
    }
  } finally {
    validating.value = false
  }
}

onMounted(() => {
  loadPublications()
})
</script>

<style lang="scss" scoped>
.publications-page {
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

  .user-info, .campaign-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .user-name, .campaign-title {
      font-weight: 500;
      color: var(--dark-grey);
    }

    .user-email, .campaign-budget {
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

.publication-details {
  .info-section {
    margin-bottom: 24px;

    h4 {
      margin-bottom: 16px;
      color: var(--dark-grey);
      font-weight: 600;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--light-grey);

      .label {
        font-weight: 500;
        color: var(--dark-grey);
      }

      .value {
        color: var(--dark-grey);
      }
    }
  }

  .proofs-section {
    margin-bottom: 24px;

    h4 {
      margin-bottom: 16px;
      color: var(--dark-grey);
      font-weight: 600;
    }

    .proofs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      .proof-item {
        h5 {
          margin-bottom: 12px;
          color: var(--dark-grey);
          font-weight: 500;
        }

        .proof-image {
          img {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--light-grey);
            cursor: pointer;
            transition: transform 0.2s;

            &:hover {
              transform: scale(1.02);
            }
          }

          .proof-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
          }
        }

        .no-proof {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          border: 2px dashed var(--light-grey);
          border-radius: 8px;
          color: var(--dark-grey);
          opacity: 0.6;

          .el-icon {
            font-size: 48px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .actions-section {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid var(--light-grey);
  }
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.validation-form {
  .publication-summary {
    background: var(--light-grey);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;

    h4 {
      margin-bottom: 12px;
      color: var(--dark-grey);
      font-weight: 600;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;

      .label {
        font-weight: 500;
        color: var(--dark-grey);
      }

      .value {
        color: var(--dark-grey);
      }
    }
  }

  .form-tip {
    font-size: 12px;
    color: var(--dark-grey);
    opacity: 0.7;
    margin-top: 4px;
  }

  .earnings-preview {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;

    .earnings-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .label {
        font-weight: 500;
        color: #0369a1;
      }

      .value {
        font-weight: 600;
        color: #0369a1;
        font-size: 16px;
      }
    }

    .earnings-note {
      font-size: 12px;
      color: #0369a1;
      opacity: 0.8;
      font-style: italic;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .publications-page {
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

  .publication-details {
    .proofs-section {
      .proofs-grid {
        grid-template-columns: 1fr;
      }
    }

    .actions-section {
      flex-direction: column;
    }
  }
}
</style>
