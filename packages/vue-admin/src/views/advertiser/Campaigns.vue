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
              <el-option label="Soumise" value="submitted" />
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

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- Table -->
      <el-table 
        v-else
        :data="paginatedCampaigns" 
        style="width: 100%"
        v-loading="loading"
      >
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
         <el-table-column prop="media" label="Média" width="150">
           <template #default="scope">
             <div v-if="scope.row.media_url" class="media-thumbnail">
                               <!-- Thumbnail pour les images -->
                <div v-if="!isVideo(scope.row.media_url)" @click="openMediaPreview(scope.row.media_url, scope.row.title)" class="image-thumbnail">
                  <img 
                    :src="scope.row.media_url" 
                    :alt="scope.row.title"
                    @click="openMediaPreview(scope.row.media_url, scope.row.title)"
                    class="thumbnail-image"
                    style="cursor: pointer;"
                  />
                  <div class="thumbnail-overlay">
                    <el-icon><ZoomIn /></el-icon>
                  </div>
                </div>
               
                               <!-- Thumbnail pour les vidéos -->
                <div v-else class="video-thumbnail">
                  <div 
                    class="video-placeholder"
                    @click="openMediaPreview(scope.row.media_url, scope.row.title)"
                    style="cursor: pointer;"
                  >
                    <el-icon class="video-icon"><VideoPlay /></el-icon>
                    <span class="video-text">Vidéo</span>
                  </div>
                </div>
             </div>
              <span v-else class="no-media">Aucun média</span>
              <!-- Test button pour déboguer -->
             
           </template>
         </el-table-column>
         <el-table-column prop="progress" label="Progression">
           <template #default="scope">
             <el-progress :percentage="calculateProgress(scope.row)" />
           </template>
         </el-table-column>
                 <el-table-column label="Actions" width="200">
           <template #default="scope">
             <div class="action-buttons">
               <!-- Bouton Modifier -->
               <el-tooltip 
                 content="Modifier la campagne" 
                 placement="top" 
                 v-if="scope.row.status === 'draft'"
               >
                 <el-button 
                   size="small" 
                   type="primary"
                   :icon="Edit"
                   circle
                   @click="openEditModal(scope.row)"
                   :disabled="scope.row.status !== 'draft'"
                 />
               </el-tooltip>
               
               <!-- Bouton Activer/Pauser -->
               <el-tooltip 
                 :content="scope.row.status === 'active' ? 'Pauser la campagne' : 'Activer la campagne'" 
                 placement="top"
                 v-if="scope.row.status === 'active' || scope.row.status === 'paused'"
               >
                 <el-button 
                   size="small" 
                   :type="scope.row.status === 'active' ? 'warning' : 'success'"
                   :icon="scope.row.status === 'active' ? Pause : VideoPlay"
                   circle
                   @click="toggleCampaign(scope.row)"
                   :loading="scope.row.toggleLoading"
                 />
               </el-tooltip>
               
                               <!-- Bouton Détails -->
                <el-tooltip 
                  content="Voir les détails de la campagne" 
                  placement="top"
                >
                  <el-button 
                    size="small" 
                    type="info"
                    :icon="View"
                    circle
                    @click="openDetailsModal(scope.row)"
                    :loading="scope.row.detailsLoading"
                  />
                </el-tooltip>
                
                <!-- Bouton Supprimer -->
                <el-tooltip 
                  content="Supprimer la campagne" 
                  placement="top" 
                  v-if="scope.row.status === 'draft'"
                >
                  <el-button 
                    size="small" 
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="deleteCampaign(scope.row)"
                    :loading="scope.row.deleteLoading"
                    :disabled="scope.row.status !== 'draft'"
                  />
                </el-tooltip>

                <!-- Bouton Soumettre pour validation -->
                <el-tooltip 
                  content="Soumettre la campagne pour validation" 
                  placement="top" 
                  v-if="scope.row.status === 'draft'"
                >
                  <el-button 
                    size="small" 
                    type="warning"
                    :icon="Money"
                    circle
                    @click="openSubmitValidationModal(scope.row)"
                    :disabled="scope.row.status !== 'draft'"
                  />
                </el-tooltip>
             </div>
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

    <!-- Modal d'édition -->
    <el-dialog
      v-model="editModalVisible"
      title="Modifier la campagne"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="120px"
        class="campaign-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Titre" prop="title">
              <el-input v-model="editForm.title" placeholder="Titre de la campagne" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Budget" prop="budget">
              <el-input-number 
                v-model="editForm.budget" 
                :min="10000"
                :step="1000"
                style="width: 100%"
                placeholder="Budget en FCFA"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Estimation vues" prop="estimatedViews">
              <el-input-number 
                v-model="editForm.estimatedViews" 
                :disabled="true"
                style="width: 100%"
                placeholder="Calculé automatiquement"
              />
              <div class="form-tip">
                Basé sur un CPV de {{ advertiserCPV }} FCFA (Budget ÷ CPV = {{ editForm.budget }} ÷ {{ advertiserCPV }} = {{ Math.floor(editForm.budget / advertiserCPV) }} vues)
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Description" prop="description">
          <el-input 
            v-model="editForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="Description de la campagne"
          />
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Type de localisation" prop="locationType">
              <el-select v-model="editForm.locationType" style="width: 100%">
                <el-option label="Ville" value="city" />
                <el-option label="Région" value="region" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Lien cible" prop="targetLink">
              <el-input 
                v-model="editForm.targetLink" 
                placeholder="URL de destination"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Localisations cibles" prop="targetLocations">
          <el-select 
            v-model="editForm.targetLocations" 
            multiple 
            style="width: 100%"
            :placeholder="editForm.locationType === 'region' ? 'Sélectionnez les régions' : 'Sélectionnez les villes'"
            filterable
          >
            <!-- Options pour les régions -->
            <template v-if="editForm.locationType === 'region'">
              <el-option 
                v-for="region in uniqueRegions" 
                :key="region" 
                :label="region" 
                :value="region"
              />
            </template>
            
            <!-- Options pour les villes (groupées par région) -->
            <template v-else>
              <el-option-group 
                v-for="region in regions" 
                :key="region.name" 
                :label="region.name"
              >
                <el-option 
                  v-for="city in region.cities" 
                  :key="city.name" 
                  :label="city.name" 
                  :value="city.name"
                />
              </el-option-group>
            </template>
          </el-select>
        </el-form-item>

                 <el-form-item label="Média">
           <el-upload
             class="media-upload"
             action="#"
             :auto-upload="false"
             :on-change="handleEditMediaChange"
             :limit="1"
             :file-list="editFileList"
           >
             <el-button type="primary">
               <el-icon><Upload /></el-icon>
               Sélectionner une image/vidéo
             </el-button>
             <template #tip>
               <div class="el-upload__tip">
                 Formats acceptés: JPG, PNG, MP4. Taille max: 10MB
               </div>
             </template>
           </el-upload>
           
           <!-- Prévisualisation du média -->
           <div v-if="editMediaPreview || editForm.media_url" class="media-preview-section">
             <h4>Aperçu du média</h4>
             <div class="media-preview-container">
               <!-- Prévisualisation pour les images -->
               <div v-if="!isVideo(editMediaPreview || editForm.media_url)" class="image-preview">
                 <img 
                   :src="editMediaPreview || editForm.media_url" 
                   :alt="editForm.title || 'Aperçu du média'"
                   class="preview-image"
                 />
                 <div class="preview-overlay">
                   <el-button 
                     type="text" 
                     @click="removeEditMedia"
                     class="remove-button"
                   >
                     <el-icon><Delete /></el-icon>
                     Supprimer
                   </el-button>
                 </div>
               </div>
               
               <!-- Prévisualisation pour les vidéos -->
               <div v-else class="video-preview">
                 <video 
                   :src="editMediaPreview || editForm.media_url" 
                   controls 
                   class="preview-video"
                 >
                   Votre navigateur ne supporte pas la lecture de vidéos.
                 </video>
                 <div class="preview-overlay">
                   <el-button 
                     type="text" 
                     @click="removeEditMedia"
                     class="remove-button"
                   >
                     <el-icon><Delete /></el-icon>
                     Supprimer
                   </el-button>
                 </div>
               </div>
             </div>
           </div>
         </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editModalVisible = false">Annuler</el-button>
          <el-button type="primary" @click="saveEditCampaign" :loading="editLoading">
            Enregistrer
          </el-button>
        </span>
             </template>
     </el-dialog>

           <!-- Modal d'aperçu du média -->
      <el-dialog
        v-model="mediaPreviewVisible"
        :title="`Aperçu du média - ${mediaPreviewTitle}`"
        width="600px"
        :close-on-click-modal="true"
        class="media-preview-dialog"
      >
        <div class="media-preview-content">
          <div v-if="isVideo(mediaPreviewUrl)" class="video-container">
            <video 
              :src="mediaPreviewUrl" 
              controls 
              style="width: 100%; max-height: 400px;"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
          <div v-else class="image-container">
            <img 
              :src="mediaPreviewUrl" 
              :alt="mediaPreviewTitle"
              style="width: 100%; max-height: 400px; object-fit: contain;"
            />
          </div>
        </div>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="mediaPreviewVisible = false">Fermer</el-button>
            <el-button 
              type="primary" 
              @click="downloadMedia"
              :loading="downloadLoading"
            >
              Télécharger
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Modal des détails de la campagne -->
      <el-dialog
        v-model="detailsModalVisible"
        :title="`Détails de la campagne - ${selectedCampaign?.title || ''}`"
        width="900px"
        :close-on-click-modal="true"
        class="campaign-details-dialog"
      >
        <div v-if="campaignDetails" class="campaign-details">
          <!-- Informations de la campagne -->
          <div class="campaign-info">
            <h3>Informations de la campagne</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="info-item">
                  <strong>Titre:</strong> {{ campaignDetails.campaign.title }}
                </div>
                <div class="info-item">
                  <strong>Description:</strong> {{ campaignDetails.campaign.description }}
                </div>
                <div class="info-item">
                  <strong>Budget:</strong> {{ formatMoney(campaignDetails.campaign.budget) }}
                </div>
                <div class="info-item">
                  <strong>Statut:</strong> 
                  <el-tag :type="getStatusType(campaignDetails.campaign.status)">
                    {{ getStatusLabel(campaignDetails.campaign.status) }}
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="info-item">
                  <strong>Vues totales:</strong> {{ campaignDetails.campaign.total_views || 0 }}
                </div>
                <div class="info-item">
                  <strong>Clics totaux:</strong> {{ campaignDetails.campaign.total_clicks || 0 }}
                </div>
                <div class="info-item">
                  <strong>Vues attendues:</strong> {{ campaignDetails.campaign.expected_views || 0 }}
                </div>
                <div class="info-item">
                  <strong>Progression:</strong> 
                  <el-progress 
                    :percentage="calculateProgress(campaignDetails.campaign)" 
                    :stroke-width="8"
                  />
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Liste des publications -->
          <div class="publications-section">
            <h3>Publications des ambassadeurs ({{ campaignDetails.publications.length }})</h3>
            
            <div v-if="campaignDetails.publications.length === 0" class="no-publications">
              <el-empty description="Aucune publication pour cette campagne" />
            </div>
            
            <div v-else class="publications-list">
              <el-card 
                v-for="publication in campaignDetails.publications" 
                :key="publication._id"
                class="publication-card"
                shadow="hover"
              >
                <div class="publication-header">
                  <div class="ambassador-info">
                    <h4>{{ publication.ambassador_name }}</h4>
                    <p class="ambassador-contact">
                      {{ publication.ambassador_phone }} | {{ publication.ambassador_email }}
                    </p>
                  </div>
                  <div class="publication-stats">
                    <el-tag :type="getPublicationStatusType(publication.status)">
                      {{ getPublicationStatusLabel(publication.status) }}
                    </el-tag>
                    <div class="stats">
                      <span class="stat-item">
                        <el-icon><View /></el-icon>
                        {{ publication.views }} vues
                      </span>
                      <span class="stat-item">
                        <el-icon><Pointer /></el-icon>
                        {{ publication.clicks }} clics
                      </span>
                    </div>
                  </div>
                </div>

                <div class="publication-proofs">
                  <h5>Preuves de publication</h5>
                  <div class="proofs-container">
                    <!-- Preuve 1 -->
                    <div v-if="publication.proof1" class="proof-item">
                      <h6>Preuve 1</h6>
                      <div class="proof-image" @click="openProofPreview(publication.proof1, 'Preuve 1')">
                        <img :src="publication.proof1" alt="Preuve 1" />
                        <div class="proof-overlay">
                          <el-icon><ZoomIn /></el-icon>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Preuve 2 -->
                    <div v-if="publication.proof2" class="proof-item">
                      <h6>Preuve 2</h6>
                      <div class="proof-image" @click="openProofPreview(publication.proof2, 'Preuve 2')">
                        <img :src="publication.proof2" alt="Preuve 2" />
                        <div class="proof-overlay">
                          <el-icon><ZoomIn /></el-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="publication-footer">
                  <small>Publié le {{ formatDate(publication.createdAt) }}</small>
                  <a v-if="publication.publication_url" :href="publication.publication_url" target="_blank" class="publication-link">
                    <el-button size="small" type="primary" plain>
                      <el-icon><Link /></el-icon>
                      Voir la publication
                    </el-button>
                  </a>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="detailsModalVisible = false">Fermer</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Modal d'aperçu des preuves -->
      <el-dialog
        v-model="proofPreviewVisible"
        :title="`Aperçu - ${proofPreviewTitle}`"
        width="600px"
        :close-on-click-modal="true"
        class="proof-preview-dialog"
      >
        <div class="proof-preview-content">
          <img 
            :src="proofPreviewUrl" 
            :alt="proofPreviewTitle"
            style="width: 100%; max-height: 500px; object-fit: contain;"
          />
        </div>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="proofPreviewVisible = false">Fermer</el-button>
            <el-button 
              type="primary" 
              @click="downloadProof"
              :loading="proofDownloadLoading"
            >
              Télécharger
            </el-button>
          </span>
        </template>
      </el-dialog>

             <!-- Modal de soumission pour validation -->
       <el-dialog
         v-model="submitValidationModalVisible"
         title="Soumettre la campagne pour validation"
         width="600px"
         :close-on-click-modal="false"
       >
         <!-- Récapitulatif de la campagne -->
         <div v-if="selectedCampaignForValidation" class="campaign-summary">
           <el-card class="summary-card" shadow="never">
             <template #header>
               <div class="summary-header">
                 <el-icon><View /></el-icon>
                 <span>Récapitulatif de la campagne</span>
               </div>
             </template>
             <div class="summary-content">
               <h4>{{ selectedCampaignForValidation.title }}</h4>
               <p v-if="selectedCampaignForValidation.description" class="description">
                 {{ selectedCampaignForValidation.description }}
               </p>
               <div class="summary-stats">
                 <div class="stat-item">
                   <el-icon><Money /></el-icon>
                   <span>Budget: {{ selectedCampaignForValidation.budget?.toLocaleString() }} FCFA</span>
                 </div>
                 <div class="stat-item">
                   <el-icon><View /></el-icon>
                   <span>Vues min estimées: {{ selectedCampaignForValidation.expected_views?.toLocaleString() }}</span>
                 </div>
                 <!-- <div class="stat-item">
                   <el-icon><Pointer /></el-icon>
                   <span>CPV: {{ advertiserCPV }} FCFA</span>
                 </div> -->
               </div>
               <div v-if="selectedCampaignForValidation.target_location?.length" class="target-location">
                 <el-icon><Link /></el-icon>
                 <span>
                   {{ selectedCampaignForValidation.location_type === 'city' ? 'Villes' : 'Régions' }}: 
                   {{ selectedCampaignForValidation.target_location.map(loc => loc.value).join(', ') }}
                 </span>
               </div>
             </div>
           </el-card>
         </div>

         <!-- Formulaire de paiement -->
          
          
         <el-form
           ref="submitValidationFormRef"
           :model="validationForm"
           :rules="validationRules"
           label-width="100px"
           class="payment-form"
         >
         <h3>Paiement</h3>
           <el-form-item label="Méthode" prop="method">
             <el-select v-model="validationForm.method" style="width: 100%">
               <el-option
                 v-for="item in paymentMethods"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               >
                 <span style="display: flex; align-items: center; gap: 8px;">
                   <el-icon><Money /></el-icon>
                   {{ item.label }}
                 </span>
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="Téléphone" prop="phone">
             <el-input 
               v-model="validationForm.phone" 
               placeholder="Ex: 677777777"
               maxlength="9"
             />
             <div class="form-tip">
               Format requis: 6XXXXXXXXX (9 chiffres après +237)
             </div>
           </el-form-item>
         </el-form>
         
         <template #footer>
           <span class="dialog-footer">
             <el-button @click="submitValidationModalVisible = false">Annuler</el-button>
             <el-button 
               type="primary" 
               @click="submitCampaignForValidation" 
               :loading="submitValidationLoading"
               :disabled="!selectedCampaignForValidation"
             >
               Soumettre pour validation
             </el-button>
           </span>
         </template>
       </el-dialog>
   </div>
 </template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { 
  Plus, 
  Search, 
  Upload, 
  Picture, 
  ZoomIn, 
  VideoPlay, 
  Edit, 
  Delete, 
  Pause, 
  View, 
  Pointer, 
  Link,
  Money
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { campaignService, settingsService, transactionService } from '@/services/api'
import citiesData from '@/assets/cities_cm.json'
import { useAuthStore } from '@/stores/auth'

// État réactif
const campaigns = ref([])
const loading = ref(false)
const totalCount = ref(0)

// Modal d'édition
const editModalVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref(null)
const editFileList = ref([])
const advertiserCPV = ref(14) // CPV par défaut

// Modal d'aperçu du média
const mediaPreviewVisible = ref(false)
const mediaPreviewUrl = ref('')
const mediaPreviewTitle = ref('')
const downloadLoading = ref(false)

// Prévisualisation du média dans le formulaire d'édition
const editMediaPreview = ref('')

// Modal des détails de la campagne
const detailsModalVisible = ref(false)
const selectedCampaign = ref(null)
const campaignDetails = ref(null)
const detailsLoading = ref(false)

// Modal d'aperçu des preuves
const proofPreviewVisible = ref(false)
const proofPreviewUrl = ref('')
const proofPreviewTitle = ref('')
const proofDownloadLoading = ref(false)

// Reactive variables for submit validation modal
const submitValidationModalVisible = ref(false)
const submitValidationLoading = ref(false)
const submitValidationFormRef = ref(null)
const selectedCampaignForValidation = ref(null)

// Form data for validation submission
const validationForm = reactive({
  method: 'cm.mtn',
  phone: ''
})

// Validation rules for the form
const validationRules = reactive({
  method: [
    { required: true, message: 'Veuillez sélectionner un mode de paiement', trigger: 'change' }
  ],
  phone: [
    { required: true, message: 'Veuillez saisir votre numéro de téléphone', trigger: 'blur' },
    { 
      pattern: /^6[0-9]{8}$/, 
      message: 'Format: 6XXXXXXXX', 
      trigger: 'blur' 
    }
  ]
})

// Payment methods
const paymentMethods = [
  { value: 'cm.mtn', label: 'MTN Mobile Money', icon: 'MTN' },
  { value: 'cm.orange', label: 'Orange Money', icon: 'Orange' }
]

const editForm = ref({
  _id: '',
  title: '',
  description: '',
  budget: 50000,
  locationType: 'city',
  targetLocations: [],
  targetLink: '',
  media: null,
  estimatedViews: 0
})

// Règles de validation pour l'édition
const editRules = {
  title: [
    { required: true, message: 'Le titre est requis', trigger: 'blur' },
    { min: 3, max: 100, message: 'Le titre doit contenir entre 3 et 100 caractères', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'La description est requise', trigger: 'blur' },
    { min: 10, max: 500, message: 'La description doit contenir entre 10 et 500 caractères', trigger: 'blur' }
  ],
  budget: [
    { required: true, message: 'Le budget est requis', trigger: 'blur' },
    { type: 'number', min: 10000, message: 'Le budget minimum est de 10 000 FCFA', trigger: 'blur' }
  ],
  targetLink: [
    { required: true, message: 'Le lien cible est requis', trigger: 'blur' },
    { type: 'url', message: 'Veuillez entrer une URL valide commençant par http:// ou https://', trigger: 'blur' }
  ],
  targetLocations: [
    { required: true, message: 'Sélectionnez au moins une localisation', trigger: 'change' },
    { type: 'array', min: 1, message: 'Sélectionnez au moins une localisation', trigger: 'change' }
  ]
}

// Organiser les villes par région
const regions = computed(() => {
  const regionMap = {}
  
  citiesData.forEach(city => {
    if (!regionMap[city.region]) {
      regionMap[city.region] = {
        name: city.region,
        cities: []
      }
    }
    regionMap[city.region].cities.push({
      name: city.name,
      lat: city.lat,
      lng: city.lng
    })
  })
  
  return Object.values(regionMap).sort((a, b) => a.name.localeCompare(b.name))
})

const uniqueRegions = computed(() => {
  const unique = new Set();
  regions.value.forEach(region => {
    unique.add(region.name);
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
});

// Charger les paramètres de la plateforme pour récupérer le CPV
const loadPlatformSettings = async () => {
  try {
    const response = await settingsService.getSettings()
    const settings = response.data
    advertiserCPV.value = settings.payment?.cpv || 14
    console.log('📊 CPV annonceur chargé:', advertiserCPV.value)
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
    // Utiliser la valeur par défaut en cas d'erreur
    advertiserCPV.value = 14
  }
}

// Watcher pour vider les localisations quand on change le type
watch(() => editForm.value.locationType, () => {
  editForm.value.targetLocations = []
})

// Watcher pour calculer l'estimation des vues basée sur le budget et le CPV
watch(() => editForm.value.budget, (newBudget) => {
  // Calcul : Budget / CPV annonceur = Nombre de vues estimées
  editForm.value.estimatedViews = Math.floor(newBudget / advertiserCPV.value)
}, { immediate: true })

// Watcher pour recalculer quand le CPV change
watch(() => advertiserCPV.value, () => {
  editForm.value.estimatedViews = Math.floor(editForm.value.budget / advertiserCPV.value)
})

// Filtres et recherche
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Charger les campagnes depuis l'API
const loadCampaigns = async () => {
  try {
    loading.value = true
    
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value,
      sortBy: sortBy.value
    }

    console.log('🔍 Chargement de mes campagnes avec params:', params)
    
    const response = await campaignService.getMyCampaigns(params)
    console.log('📋 Réponse API mes campagnes:', response)
    
    campaigns.value = response.data || []
    totalCount.value = response.totalCount || 0
    
    console.log('✅ Mes campagnes chargées:', campaigns.value.length)
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement de mes campagnes:', error)
    ElMessage.error('Erreur lors du chargement de mes campagnes')
  } finally {
    loading.value = false
  }
}

// Campagnes filtrées (côté client pour les filtres supplémentaires)
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Filtre par recherche (si pas déjà fait côté serveur)
  if (searchQuery.value) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filtre par statut (si pas déjà fait côté serveur)
  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }

  return filtered
})

// Campagnes paginées
const paginatedCampaigns = computed(() => {
  return filteredCampaigns.value
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
    paused: 'warning',
    submitted: 'warning'
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

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

// Calculer la progression basée sur les vues réelles vs attendues
const calculateProgress = (campaign) => {
  if (!campaign.expected_views || campaign.expected_views === 0) {
    return 0
  }
  console.log(campaign);
  const views =campaign.total_views || campaign.views|| 0
  const progress = Math.min((views / campaign.expected_views) * 100, 100)
  return Math.round(progress)
}

// Ouvrir le modal d'édition
const openEditModal = async (campaign) => {
  // Vérifier que la campagne est en brouillon
  if (campaign.status !== 'draft') {
    ElMessage.warning('Seules les campagnes en brouillon peuvent être modifiées')
    return
  }
  
  // Charger les paramètres de la plateforme
  await loadPlatformSettings()
  
  // Convertir les données de la campagne pour le formulaire
  editForm.value = {
    _id: campaign._id,
    title: campaign.title,
    description: campaign.description,
    budget: campaign.budget,
    locationType: campaign.location_type || 'city',
    targetLocations: campaign.target_location ? campaign.target_location.map(loc => loc.value) : [],
    targetLink: campaign.target_link,
    media: null,
    estimatedViews: campaign.expected_views || 0
  }
  
  // Réinitialiser la liste des fichiers et la prévisualisation
  editFileList.value = []
  editMediaPreview.value = ''
  
  editModalVisible.value = true
}

// Sauvegarder les modifications
const saveEditCampaign = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    editLoading.value = true
    
    console.log('💾 Sauvegarde des modifications:', editForm.value)
    
    // Préparer les données pour l'API selon le format attendu par le backend
    const campaignData = {
      title: editForm.value.title,
      description: editForm.value.description,
      budget: editForm.value.budget,
      target_link: editForm.value.targetLink,
      location_type: editForm.value.locationType,
      target_location: editForm.value.targetLocations.map(location => ({ value: location })),
      expected_views: editForm.value.estimatedViews
    }
    
    console.log('📋 Données à envoyer:', campaignData)
    
    let response
    
    // Si un fichier média est sélectionné, utiliser FormData
    if (editForm.value.media) {
      console.log('📁 Upload avec fichier média...')
      
      const formData = new FormData()
      
      // Ajouter le fichier média
      formData.append('media', editForm.value.media)
      
      // Ajouter les données JSON
      formData.append('data', JSON.stringify(campaignData))
      
      // Appel API avec FormData
      response = await campaignService.updateCampaignWithMedia(editForm.value._id, formData)
    } else {
      console.log('📋 Modification sans fichier média...')
      
      // Appel API standard sans fichier
      response = await campaignService.updateCampaign(editForm.value._id, campaignData)
    }
    
    console.log('✅ Réponse API modification:', response)
    
    // Mettre à jour la campagne dans la liste locale
    const campaignIndex = campaigns.value.findIndex(c => c._id === editForm.value._id)
    if (campaignIndex !== -1) {
      campaigns.value[campaignIndex] = {
        ...campaigns.value[campaignIndex],
        title: editForm.value.title,
        description: editForm.value.description,
        budget: editForm.value.budget,
        target_link: editForm.value.targetLink,
        location_type: editForm.value.locationType,
        target_location: editForm.value.targetLocations.map(location => ({ value: location })),
        expected_views: editForm.value.estimatedViews
      }
    }
    
    ElMessage.success('Campagne modifiée avec succès')
    editModalVisible.value = false
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('Erreur lors de la modification de la campagne')
    }
  } finally {
    editLoading.value = false
  }
}

// Supprimer une campagne
const deleteCampaign = async (campaign) => {
  try {
    await ElMessageBox.confirm(
      `Êtes-vous sûr de vouloir supprimer la campagne "${campaign.title}" ?`,
      'Confirmation de suppression',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }
    )
    
    // Ajouter un état de loading pour cette campagne spécifique
    campaign.deleteLoading = true
    
    console.log('🗑️ Suppression de la campagne:', campaign._id)
    
    await campaignService.deleteCampaign(campaign._id)
    
    // Retirer la campagne de la liste locale
    const campaignIndex = campaigns.value.findIndex(c => c._id === campaign._id)
    if (campaignIndex !== -1) {
      campaigns.value.splice(campaignIndex, 1)
    }
    
    ElMessage.success('Campagne supprimée avec succès')
    
  } catch (error) {
    if (error === 'cancel') return // Utilisateur a annulé
    
    console.error('❌ Erreur lors de la suppression:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('Erreur lors de la suppression de la campagne')
    }
  } finally {
    campaign.deleteLoading = false
  }
}

const toggleCampaign = async (campaign) => {
  try {
    // Ajouter un état de loading pour cette campagne spécifique
    campaign.toggleLoading = true
    
    const newStatus = campaign.status === 'active' ? 'paused' : 'active'
    
    console.log('🔄 Changement de statut:', {
      campaignId: campaign._id,
      oldStatus: campaign.status,
      newStatus: newStatus
    })
    
    // Appel API pour changer le statut
    await campaignService.changeCampaignStatus(campaign._id, newStatus)
    
    // Mettre à jour le statut localement
    campaign.status = newStatus
    
    ElMessage.success(`Campagne ${newStatus === 'active' ? 'activée' : 'pausée'} avec succès`)
    
  } catch (error) {
    console.error('❌ Erreur lors du changement de statut:', error)
    ElMessage.error('Erreur lors du changement de statut')
  } finally {
    campaign.toggleLoading = false
  }
}

// Gestion du changement de média pour l'édition
const handleEditMediaChange = (file) => {
  console.log('📁 Fichier sélectionné pour édition:', file)
  
  // Validation du fichier
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'].includes(file.raw.type)
  const isValidSize = file.raw.size / 1024 / 1024 < 10 // 10MB max
  
  if (!isValidType) {
    ElMessage.error('Format de fichier non supporté. Utilisez JPG, PNG ou MP4.')
    return false
  }
  
  if (!isValidSize) {
    ElMessage.error('Fichier trop volumineux. Taille maximum: 10MB.')
    return false
  }
  
  editForm.value.media = file.raw
  editFileList.value = [file]
  
  // Créer l'URL de prévisualisation
  editMediaPreview.value = URL.createObjectURL(file.raw)
  
  return false // Empêcher l'upload automatique
}

// Supprimer le média sélectionné dans l'édition
const removeEditMedia = () => {
  editForm.value.media = null
  editFileList.value = []
  editMediaPreview.value = ''
  
  // Libérer l'URL de prévisualisation
  if (editMediaPreview.value) {
    URL.revokeObjectURL(editMediaPreview.value)
  }
}

// Validation personnalisée pour l'URL
const validateUrl = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Le lien cible est requis'))
  } else if (!/^https?:\/\/.+/.test(value)) {
    callback(new Error('Veuillez entrer une URL valide commençant par http:// ou https://'))
  } else {
    callback()
  }
}

// Ajouter la validation d'URL aux règles d'édition
editRules.targetLink.push({ validator: validateUrl, trigger: 'blur' })

// Vérifier si c'est une vidéo
const isVideo = (url) => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
  return videoExtensions.some(ext => url.toLowerCase().includes(ext))
}

// Ouvrir l'aperçu du média
const openMediaPreview = (mediaUrl, campaignTitle) => {
  console.log('🎬 Ouverture de l\'aperçu média:', { mediaUrl, campaignTitle })
  mediaPreviewUrl.value = mediaUrl
  mediaPreviewTitle.value = campaignTitle
  mediaPreviewVisible.value = true
  console.log('✅ Modal ouverte:', mediaPreviewVisible.value)
}

// Télécharger le média
const downloadMedia = async () => {
  try {
    downloadLoading.value = true
    
    const response = await fetch(mediaPreviewUrl.value)
    const blob = await response.blob()
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Extraire le nom du fichier de l'URL
    const fileName = mediaPreviewUrl.value.split('/').pop() || 'media'
    a.download = fileName
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('Téléchargement démarré')
    
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    ElMessage.error('Erreur lors du téléchargement')
  } finally {
    downloadLoading.value = false
  }
}

// Ouvrir le modal des détails de la campagne
const openDetailsModal = async (campaign) => {
  try {
    selectedCampaign.value = campaign
    detailsLoading.value = true
    detailsModalVisible.value = true
    
    console.log('🔍 Chargement des détails de la campagne:', campaign._id)
    
    const response = await campaignService.getMyCampaignDetails(campaign._id)
    console.log('📋 Détails de la campagne:', response)
    
    campaignDetails.value = response
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des détails:', error)
    ElMessage.error('Erreur lors du chargement des détails de la campagne')
    detailsModalVisible.value = false
  } finally {
    detailsLoading.value = false
  }
}

// Ouvrir l'aperçu d'une preuve
const openProofPreview = (proofUrl, proofTitle) => {
  proofPreviewUrl.value = proofUrl
  proofPreviewTitle.value = proofTitle
  proofPreviewVisible.value = true
}

// Télécharger une preuve
const downloadProof = async () => {
  try {
    proofDownloadLoading.value = true
    
    const response = await fetch(proofPreviewUrl.value)
    const blob = await response.blob()
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Extraire le nom du fichier de l'URL
    const fileName = proofPreviewUrl.value.split('/').pop() || 'proof'
    a.download = fileName
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('Téléchargement démarré')
    
  } catch (error) {
    console.error('Erreur lors du téléchargement de la preuve:', error)
    ElMessage.error('Erreur lors du téléchargement')
  } finally {
    proofDownloadLoading.value = false
  }
}

// Open submit validation modal
const openSubmitValidationModal = (campaign) => {
  if (campaign.status !== 'draft') {
    ElMessage.warning('Seules les campagnes au statut "brouillon" peuvent être soumises pour validation')
    return
  }
  
  selectedCampaignForValidation.value = campaign
  validationForm.method = 'cm.mtn'
  validationForm.phone = ''
  submitValidationModalVisible.value = true
}

// Submit campaign for validation
const submitCampaignForValidation = async () => {
  if (!submitValidationFormRef.value) return
  
  try {
    await submitValidationFormRef.value.validate()
    submitValidationLoading.value = true
    
    const authStore = useAuthStore()
   
    // Try to get user ID from multiple sources
    let userId = null
    
    // First try: from auth store
    if (authStore.user?._id) {
      userId = authStore.user._id
      console.log('✅ User ID from auth store:', userId)
    }
    // Second try: from localStorage user object
    else if (localStorage.getItem('user')) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        userId = userData.id
        console.log('✅ User ID from localStorage user:', userId)
      } catch (e) {
        console.error('❌ Error parsing user from localStorage:', e)
      }
    }
    // Third try: from localStorage userId (legacy)
    else if (localStorage.getItem('userId')) {
      userId = localStorage.getItem('userId')
      console.log('✅ User ID from localStorage userId:', userId)
    }
    
    if (!userId) {
      throw new Error('Impossible de récupérer l\'ID utilisateur. Veuillez vous reconnecter.')
    }
    
    const transactionData = {
      user: userId,
      type: 'deposit',
      method: validationForm.method,
      campaign: selectedCampaignForValidation.value._id,
      paymentData: {
        phone: validationForm.phone.trim()
      }
    }
    
    console.log('📤 Transaction data to send:', transactionData)
    
    const response = await transactionService.createTransaction(transactionData)
    
    ElMessage.success('Campagne soumise pour validation avec succès!')
    submitValidationModalVisible.value = false
    
    // Reload campaigns to update status
    await loadCampaigns()
    
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    ElMessage.error(error.response?.data?.message || error.message || 'Erreur lors de la soumission de la campagne')
  } finally {
    submitValidationLoading.value = false
  }
}

// Fonctions utilitaires pour les publications
const getPublicationStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    completed: 'primary'
  }
  return types[status] || 'info'
}

const getPublicationStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Rejetée',
    completed: 'Terminée'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Charger les campagnes au montage du composant
onMounted(async () => {
  await loadPlatformSettings()
  loadCampaigns()
})
   
// Surveiller les changements de filtres pour recharger
watch([searchQuery, statusFilter, sortBy], () => {
  if (currentPage.value === 1) {
    loadCampaigns()
  }
})
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

  .loading-container {
    padding: 20px;
  }

  .pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .campaign-form {
    max-width: 800px;
  }

  .media-upload {
    .el-upload__tip {
      color: var(--dark-grey);
      opacity: 0.7;
    }
  }

  .form-tip {
    font-size: 12px;
    color: var(--dark-grey);
    opacity: 0.7;
    margin-top: 4px;
    font-style: italic;
  }

  .media-thumbnail {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .image-thumbnail {
      position: relative;
      width: 60px;
      height: 40px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        
        .thumbnail-overlay {
          opacity: 1;
        }
      }
      
      .thumbnail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      
      .thumbnail-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .el-icon {
          color: white;
          font-size: 16px;
        }
      }
    }
    
    .video-thumbnail {
      .video-placeholder {
        width: 60px;
        height: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .video-icon {
          color: white;
          font-size: 16px;
          margin-bottom: 2px;
        }
        
        .video-text {
          color: white;
          font-size: 10px;
          font-weight: 500;
        }
      }
    }
  }

  .no-media {
    color: var(--dark-grey);
    opacity: 0.5;
    font-size: 12px;
    font-style: italic;
  }

  .media-preview-dialog {
    .media-preview-content {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      
      .video-container,
      .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    
    .el-button {
      margin: 0;
      
      &.is-loading {
        pointer-events: none;
      }
    }
  }

  .media-preview-section {
    margin-top: 16px;
    
    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--dark-grey);
    }
    
    .media-preview-container {
      border: 1px solid var(--light-grey);
      border-radius: 8px;
      overflow: hidden;
      background: var(--light-grey);
      
      .image-preview,
      .video-preview {
        position: relative;
        max-width: 300px;
        max-height: 200px;
        
        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        
        .preview-video {
          width: 100%;
          max-height: 200px;
          display: block;
        }
        
        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          
          &:hover {
            opacity: 1;
          }
          
          .remove-button {
            color: white;
            font-size: 14px;
            
            .el-icon {
              margin-right: 4px;
            }
          }
        }
        
                 &:hover .preview-overlay {
           opacity: 1;
         }
       }
     }
   }

   // Styles pour le modal des détails de la campagne
   .campaign-details-dialog {
     .campaign-details {
       .campaign-info {
         margin-bottom: 30px;
         padding: 20px;
         background: var(--light-grey);
         border-radius: 8px;
         
         h3 {
           margin: 0 0 20px 0;
           font-size: 18px;
           font-weight: 600;
           color: var(--dark-grey);
         }
         
         .info-item {
           margin-bottom: 12px;
           font-size: 14px;
           
           strong {
             color: var(--dark-grey);
             margin-right: 8px;
           }
         }
       }
       
       .publications-section {
         h3 {
           margin: 0 0 20px 0;
           font-size: 18px;
           font-weight: 600;
           color: var(--dark-grey);
         }
         
         .no-publications {
           text-align: center;
           padding: 40px 20px;
         }
         
         .publications-list {
           .publication-card {
             margin-bottom: 20px;
             
             .publication-header {
               display: flex;
               justify-content: space-between;
               align-items: flex-start;
               margin-bottom: 16px;
               
               .ambassador-info {
                 h4 {
                   margin: 0 0 4px 0;
                   font-size: 16px;
                   font-weight: 600;
                   color: var(--dark-grey);
                 }
                 
                 .ambassador-contact {
                   margin: 0;
                   font-size: 12px;
                   color: var(--dark-grey);
                   opacity: 0.7;
                 }
               }
               
               .publication-stats {
                 text-align: right;
                 
                 .stats {
                   margin-top: 8px;
                   
                   .stat-item {
                     display: inline-flex;
                     align-items: center;
                     margin-left: 12px;
                     font-size: 12px;
                     color: var(--dark-grey);
                     
                     .el-icon {
                       margin-right: 4px;
                     }
                   }
                 }
               }
             }
             
             .publication-proofs {
               margin-bottom: 16px;
               
               h5 {
                 margin: 0 0 12px 0;
                 font-size: 14px;
                 font-weight: 600;
                 color: var(--dark-grey);
               }
               
               .proofs-container {
                 display: flex;
                 gap: 16px;
                 
                 .proof-item {
                   flex: 1;
                   
                   h6 {
                     margin: 0 0 8px 0;
                     font-size: 12px;
                     font-weight: 600;
                     color: var(--dark-grey);
                   }
                   
                   .proof-image {
                     position: relative;
                     width: 100%;
                     height: 120px;
                     border-radius: 6px;
                     overflow: hidden;
                     cursor: pointer;
                     transition: all 0.3s ease;
                     
                     &:hover {
                       transform: scale(1.02);
                       
                       .proof-overlay {
                         opacity: 1;
                       }
                     }
                     
                     img {
                       width: 100%;
                       height: 100%;
                       object-fit: cover;
                       display: block;
                     }
                     
                     .proof-overlay {
                       position: absolute;
                       top: 0;
                       left: 0;
                       right: 0;
                       bottom: 0;
                       background: rgba(0, 0, 0, 0.6);
                       display: flex;
                       justify-content: center;
                       align-items: center;
                       opacity: 0;
                       transition: opacity 0.3s ease;
                       
                       .el-icon {
                         color: white;
                         font-size: 20px;
                       }
                     }
                   }
                 }
               }
             }
             
             .publication-footer {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding-top: 12px;
               border-top: 1px solid var(--light-grey);
               
               small {
                 color: var(--dark-grey);
                 opacity: 0.7;
               }
               
               .publication-link {
                 text-decoration: none;
               }
             }
           }
         }
       }
     }
   }
   
   .proof-preview-dialog {
     .proof-preview-content {
       display: flex;
       justify-content: center;
       align-items: center;
       min-height: 200px;
     }
   }

       // Styles pour le modal de soumission pour validation
    .campaign-summary {
      margin-bottom: 20px;
      
      .summary-card {
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        
        .summary-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #409eff;
        }
        
        .summary-content {
          h4 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 16px;
          }
          
          .description {
            color: #606266;
            margin: 0 0 12px 0;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .summary-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #606266;
              
              .el-icon {
                color: #409eff;
              }
            }
          }
          
          .target-location {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #606266;
            padding: 8px;
            background-color: #f5f7fa;
            border-radius: 4px;
            
            .el-icon {
              color: #67c23a;
            }
          }
        }
      }
    }
    
    .payment-form {
      .form-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
        line-height: 1.4;
      }
    }
 }
</style> 