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
                v-model="form.estimatedViews" 
                :disabled="true"
                style="width: 100%"
                placeholder="Calculé automatiquement"
              />
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
        </el-form-item>

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
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import citiesData from '@/assets/cities_cm.json'

const router = useRouter()
const campaignForm = ref(null)
const loading = ref(false)

const form = reactive({
  title: '',
  description: '',
  budget: 50000,
  locationType: 'city',
  targetLocations: [],
  targetLink: '',
  media: null,
  estimatedViews: 0
})

// Watcher pour vider les localisations quand on change le type
watch(() => form.locationType, () => {
  form.targetLocations = []
})

// Watcher pour calculer l'estimation des vues basée sur le budget
watch(() => form.budget, (newBudget) => {
  // Calcul simple : 1 FCFA = 1 vue (à ajuster selon votre logique métier)
  form.estimatedViews = Math.floor(newBudget / 1)
}, { immediate: true })

const rules = {
  title: [
    { required: true, message: 'Le titre est requis', trigger: 'blur' }
  ],
  budget: [
    { required: true, message: 'Le budget est requis', trigger: 'blur' }
  ],
  targetLocations: [
    { required: true, message: 'Sélectionnez au moins une localisation', trigger: 'change' }
  ],
  targetLink: [
    { required: true, message: 'Le lien cible est requis', trigger: 'blur' }
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
  form.media = file.raw
}

const submitCampaign = async () => {
  if (!campaignForm.value) return
  
  try {
    await campaignForm.value.validate()
    loading.value = true
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('Campagne créée avec succès')
    router.push('/advertiser/campaigns')
  } catch (error) {
    console.error('Error creating campaign:', error)
    ElMessage.error('Erreur lors de la création de la campagne')
  } finally {
    loading.value = false
  }
}
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
}
</style> 