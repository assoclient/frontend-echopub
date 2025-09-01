<template>
  <div class="create-campaign-page">
    <div class="page-header">
      <!-- <h1>Nouvelle Campagne</h1>
      <p>Créez une nouvelle campagne publicitaire</p> -->
    </div>

    <div class="card">
      <el-form 
        ref="campaignForm"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="campaign-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Titre" prop="title">
              <el-input v-model="form.title" placeholder="Titre de la campagne" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Budget" prop="budget">
              <el-input-number 
                v-model="form.budget" 
                :min="advertiserMinCampaignAmount"
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
                v-model="form.estimatedViews" 
                :disabled="true"
                style="width: 100%"
                placeholder="Calculé automatiquement"
              />
              <!-- <div class="form-tip">
                Basé sur un CPV de {{ advertiserCPV }} FCFA (Budget ÷ CPV = {{ form.budget }} ÷ {{ advertiserCPV }} = {{ Math.floor(form.budget / advertiserCPV) }} vues)
              </div> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Description" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="4"
            placeholder="Description de la campagne"
          />
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Type de localisation" prop="locationType">
              <el-select v-model="form.locationType" style="width: 100%">
                <el-option label="Ville" value="city" />
                <el-option label="Région" value="region" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Lien cible" prop="targetLink">
              <el-input 
                v-model="form.targetLink" 
                placeholder="URL de destination"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Localisations cibles" prop="targetLocations">
          <el-select 
            v-model="form.targetLocations" 
            multiple 
            style="width: 100%"
            :placeholder="form.locationType === 'region' ? 'Sélectionnez les régions' : 'Sélectionnez les villes'"
            filterable
          >
            <!-- Options pour les régions -->
            <template v-if="form.locationType === 'region'">
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
            :on-change="handleMediaChange"
            :limit="1"
            :file-list="fileList"
            :disabled="validatingVideo"
          >
            <el-button type="primary" :loading="validatingVideo">
              <el-icon><Upload /></el-icon>
              {{ validatingVideo ? 'Validation de la vidéo...' : 'Sélectionner une image/vidéo' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                Formats acceptés: JPG, PNG, MP4. Taille max: 10MB. Vidéos: max 30 secondes
              </div>
            </template>
          </el-upload>
          
          <!-- Indicateur de validation vidéo -->
          <div v-if="validatingVideo" class="video-validation-indicator">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span>Validation de la durée de la vidéo...</span>
          </div>
          
          <!-- Prévisualisation du média -->
          <div v-if="mediaPreview" class="media-preview-section">
            <h4>Aperçu du média{{ isVideo(form.media)?'(Video)':'(Image)' }}</h4>
            <div class="media-preview-container">
              <!-- Prévisualisation pour les images -->
              <div v-if="!isVideo(form.media)" class="image-preview">
                <img 
                  :src="mediaPreview" 
                  :alt="form.title || 'Aperçu du média'"
                  class="preview-image"
                />
                <div class="preview-overlay">
                  <el-button 
                    type="text" 
                    @click="removeMedia"
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
                  :src="mediaPreview" 
                  controls 
                  class="preview-video"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div class="preview-overlay">
                  <el-button 
                    type="text" 
                    @click="removeMedia"
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

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Date de début" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="Sélectionnez la date de début"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Date de fin" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="Sélectionnez la date de fin"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submitCampaign" :loading="loading">
            Créer la campagne
          </el-button>
          <el-button @click="$router.push('/advertiser/campaigns')">
            Annuler
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Delete, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { campaignService, settingsService } from '@/services/api'
import citiesData from '@/assets/cities_cm.json'

const router = useRouter()
const campaignForm = ref(null)
const loading = ref(false)
const fileList = ref([])
const advertiserCPV = ref(14) // CPV par défaut
const advertiserMinCampaignAmount = ref(10000)
const mediaPreview = ref('') // URL de prévisualisation du média
const validatingVideo = ref(false) // Indicateur de validation vidéo

const form = reactive({
  title: '',
  description: '',
  budget: 50000,
  locationType: 'city',
  targetLocations: [],
  targetLink: '',
  media: null,
  estimatedViews: 0,
  startDate: '',
  endDate: ''
})

// Charger les paramètres de la plateforme pour récupérer le CPV
const loadPlatformSettings = async () => {
  try {
    const response = await settingsService.getSettings()
    const settings = response.data
    advertiserCPV.value = settings.payment?.cpv || 14
    advertiserMinCampaignAmount.value = settings.payment?.minCampaignAmount || 10000
    console.log('📊 CPV annonceur chargé:', advertiserCPV.value)
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
    // Utiliser la valeur par défaut en cas d'erreur
    advertiserCPV.value = 14
    advertiserMinCampaignAmount.value = 10000
  }
}

// Watcher pour vider les localisations quand on change le type
watch(() => form.locationType, () => {
  form.targetLocations = []
})

// Watcher pour calculer l'estimation des vues basée sur le budget et le CPV
watch(() => form.budget, (newBudget) => {
  // Calcul : Budget / CPV annonceur = Nombre de vues estimées
  form.estimatedViews = Math.floor(newBudget / advertiserCPV.value)
}, { immediate: true })

// Watcher pour recalculer quand le CPV change
watch(() => advertiserCPV.value, () => {
  form.estimatedViews = Math.floor(form.budget / advertiserCPV.value)
})

const rules = {
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
    { type: 'number', min: advertiserMinCampaignAmount, message: 'Le budget minimum est de 10 000 FCFA', trigger: 'blur' }
  ],
  targetLocations: [
    { required: true, message: 'Sélectionnez au moins une localisation', trigger: 'change' },
    { type: 'array', min: 1, message: 'Sélectionnez au moins une localisation', trigger: 'change' }
  ],
  targetLink: [
    { required: true, message: 'Le lien cible est requis', trigger: 'blur' },
    { type: 'url', message: 'Veuillez entrer une URL valide commençant par http:// ou https://', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: 'La date de début est requise', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: 'La date de fin est requise', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('La date de fin est requise'));
        } else if (form.startDate && value < form.startDate) {
          callback(new Error('La date de fin ne peut pas être antérieure à la date de début'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
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

const handleMediaChange = (file) => {
  console.log('📁 Fichier sélectionné:', file)
  
  // Validation du fichier
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'].includes(file.raw.type)
  const isValidSize = file.raw.size / 1024 / 1024 < 80 // 80MB max
  
  if (!isValidType) {
    ElMessage.error('Format de fichier non supporté. Utilisez JPG, PNG ou MP4.')
    return false
  }
  
  if (!isValidSize) {
    ElMessage.error('Fichier trop volumineux. Taille maximum: 10MB.')
    return false
  }
  
  // Si c'est une vidéo, vérifier la durée
  if (file.raw.type === 'video/mp4') {
    validateVideoDuration(file.raw)
    return false
  }
  
  // Pour les images, procéder normalement
  form.media = file.raw
  fileList.value = [file]
  
  // Créer l'URL de prévisualisation
  mediaPreview.value = URL.createObjectURL(file.raw)
  
  return false // Empêcher l'upload automatique
}

// Valider la durée de la vidéo
const validateVideoDuration = (videoFile) => {
  validatingVideo.value = true
  
  const video = document.createElement('video')
  video.preload = 'metadata'
  
  video.onloadedmetadata = () => {
    // Libérer l'URL pour éviter les fuites mémoire
    URL.revokeObjectURL(video.src)
    
    const duration = video.duration
    console.log('⏱️ Durée de la vidéo:', duration, 'secondes')
    
    if (duration > 30) {
      ElMessage.error('La vidéo dépasse 30 secondes. Durée maximum autorisée: 30 secondes.')
      validatingVideo.value = false
      return
    }
    
    // Vidéo valide, l'ajouter au formulaire
    form.media = videoFile
    fileList.value = [{ raw: videoFile, name: videoFile.name }]
    
    // Créer l'URL de prévisualisation
    mediaPreview.value = URL.createObjectURL(videoFile)
    
    ElMessage.success('Vidéo validée avec succès !')
    validatingVideo.value = false
  }
  
  video.onerror = () => {
    ElMessage.error('Erreur lors de la lecture de la vidéo. Veuillez réessayer.')
    URL.revokeObjectURL(video.src)
    validatingVideo.value = false
  }
  
  // Créer une URL temporaire pour la vidéo
  const videoURL = URL.createObjectURL(videoFile)
  video.src = videoURL
}

// Supprimer le média sélectionné
const removeMedia = () => {
  form.media = null
  fileList.value = []
  mediaPreview.value = ''
  
  // Libérer l'URL de prévisualisation
  if (mediaPreview.value) {
    URL.revokeObjectURL(mediaPreview.value)
  }
}

// Vérifier si c'est une vidéo
const isVideo = (file) => {
  console.log('🔍 Vérification du type de média:', file);
  
  if (!file) return false
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
  return videoExtensions.some(ext => file.name?.toLowerCase().includes(ext))
}

const submitCampaign = async () => {
  if (!campaignForm.value) return
  
  try {
    // Validation du formulaire
    await campaignForm.value.validate()
    
    // Validation supplémentaire pour les vidéos
    if (form.media && (form.media.type === 'video/mp4'|| form.media.type === 'video/webm'|| form.media.type === 'video/avi'|| form.media.type === 'video/mov')) {
      // Vérifier que la vidéo a été validée (pas de validation en double)
      if (!mediaPreview.value) {
        ElMessage.error('Veuillez attendre la validation de la vidéo avant de soumettre.')
        return
      }
    }
    
    loading.value = true
    
    console.log('🚀 Création de campagne avec données:', form)
    
    // Préparer les données pour l'API selon le format attendu par le backend
    const campaignData = {
      title: form.title,
      description: form.description,
      budget: form.budget,
      target_link: form.targetLink,
      location_type: form.locationType,
      target_location: form.targetLocations.map(location => ({ value: location })),
      expected_views: form.estimatedViews,
      status: 'draft', // Par défaut en brouillon
      // Champs optionnels selon le modèle backend
      start_date: form.startDate || new Date().toISOString(), // Date actuelle si non spécifiée
      end_date: form.endDate// +30 jours
    }
    
    console.log('📋 Données à envoyer:', campaignData)
    
    let response
    
    // Si un fichier média est sélectionné, utiliser FormData
    if (form.media) {
      console.log('📁 Upload avec fichier média...')
      
      const formData = new FormData()
      
      // Ajouter le fichier média
      formData.append('media', form.media)
      
      // Ajouter les données JSON
      formData.append('data', JSON.stringify(campaignData))
      
      // Appel API avec FormData
      response = await campaignService.createCampaignWithMedia(formData)
    } else {
      console.log('📋 Création sans fichier média...')
      
      // Appel API standard sans fichier
      response = await campaignService.createCampaign(campaignData)
    }
    
    console.log('✅ Réponse API création:', response)
    
    ElMessage.success('Campagne créée avec succès !')
    
    // Redirection vers la liste des campagnes
    router.push('/advertiser/campaigns')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la campagne:', error)
    
    // Gestion des erreurs spécifiques
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else if (error.response?.status === 400) {
      ElMessage.error('Données invalides. Vérifiez les informations saisies.')
    } else if (error.response?.status === 401) {
      ElMessage.error('Session expirée. Veuillez vous reconnecter.')
      router.push('/login/advertiser')
    } else if (error.response?.status === 403) {
      ElMessage.error('Vous n\'avez pas les permissions pour créer une campagne.')
    } else {
      ElMessage.error('Erreur lors de la création de la campagne. Veuillez réessayer.')
    }
  } finally {
    loading.value = false
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

// Ajouter la validation d'URL aux règles
rules.targetLink.push({ validator: validateUrl, trigger: 'blur' })

// Charger les paramètres au montage du composant
onMounted(async () => {
  await loadPlatformSettings()
})
</script>

<style lang="scss" scoped>
.create-campaign-page {
  .campaign-form {
    max-width: 800px;
  }

  .media-upload {
    .el-upload__tip {
      color: var(--dark-grey);
      opacity: 0.7;
    }
  }

  .video-validation-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 12px;
    background: var(--light-grey);
    border-radius: 8px;
    color: var(--primary-blue);
    font-size: 14px;
    
    .loading-icon {
      animation: rotate 1s linear infinite;
      font-size: 16px;
    }
    
    span {
      font-weight: 500;
    }
  }

  .form-tip {
    font-size: 12px;
    color: var(--dark-grey);
    opacity: 0.7;
    margin-top: 4px;
    font-style: italic;
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
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .create-campaign-page {
    padding: 8px;
    .card {
      padding: 8px;
    }
    .campaign-form {
      max-width: 100%;
      .el-row {
        flex-direction: column !important;
        .el-col {
          width: 100% !important;
          max-width: 100% !important;
        }
      }
      .el-form-item {
        label {
          font-size: 14px;
        }
      }
      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
    .media-preview-section {
      .media-preview-container {
        .image-preview,
        .video-preview {
          max-width: 100%;
          max-height: 180px;
          .preview-image,
          .preview-video {
            height: 140px;
            max-height: 140px;
          }
        }
      }
      h4 {
        font-size: 13px;
      }
    }
    .form-tip {
      font-size: 11px;
    }
  }
}
</style>