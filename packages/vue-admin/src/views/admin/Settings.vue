<template>
  <div class="settings-page">
    <div class="page-header">
     <!--  <h1>Paramètres de la plateforme</h1> -->
      <p>Gérez les paramètres de votre plateforme</p>
    </div>

    <div v-loading="loading" class="settings-grid">
      <!-- Paramètres généraux -->
      <div class="card">
        <h3>Paramètres généraux</h3>
        <el-form 
          :model="generalSettings" 
          :rules="generalRules"
          ref="generalFormRef"
          label-width="150px"
        >
          <el-form-item label="Nom de la plateforme" prop="platformName">
            <el-input v-model="generalSettings.platformName" />
          </el-form-item>
          
          <el-form-item label="Email de contact" prop="contactEmail">
            <el-input v-model="generalSettings.contactEmail" type="email" />
          </el-form-item>
          
          <el-form-item label="Téléphone de contact" prop="contactPhone">
            <el-input v-model="generalSettings.contactPhone" />
          </el-form-item>
          
          <el-form-item label="Devise" prop="currency">
            <el-select v-model="generalSettings.currency" style="width: 100%">
              <el-option label="FCFA" value="FCFA" />
              <el-option label="EUR" value="EUR" />
              <el-option label="USD" value="USD" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="Fuseau horaire" prop="timezone">
            <el-select v-model="generalSettings.timezone" style="width: 100%">
              <el-option label="Afrique/Douala (UTC+1)" value="Africa/Douala" />
              <el-option label="UTC" value="UTC" />
              <el-option label="Europe/Paris (UTC+1/+2)" value="Europe/Paris" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="saveGeneralSettings" 
              :loading="savingGeneral"
            >
              Sauvegarder
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Paramètres de paiement -->
      <div class="card">
        <h3>Paramètres de paiement</h3>
        <el-form 
          :model="paymentSettings" 
          :rules="paymentRules"
          ref="paymentFormRef"
          label-width="150px"
        >
          <el-form-item label="CPV annonceur (FCFA)" prop="cpv">
            <el-input-number 
              v-model="paymentSettings.cpv" 
              :min="2" 
              :max="100" 
              :step="1"
              style="width: 100%"
            />
            <div class="form-tip">Coût par vue pour l'annonceur</div>
          </el-form-item>
          
          <el-form-item label="CPV ambassadeur (FCFA)" prop="cpv_ambassador">
            <el-input-number 
              v-model="paymentSettings.cpv_ambassador" 
              :min="1" 
              :max="50" 
              :step="1"
              style="width: 100%"
            />
            <div class="form-tip">Coût par vue pour l'ambassadeur</div>
          </el-form-item>
          
          <el-form-item label="Commission plateforme">
            <el-input 
              :value="`${paymentSettings.cpv - paymentSettings.cpv_ambassador} FCFA`" 
              disabled 
              style="width: 100%"
            />
            <div class="form-tip">Calculée automatiquement (CPV annonceur - CPV ambassadeur)</div>
          </el-form-item>
          
          <el-form-item label="Montant minimum campagne" prop="minCampaignAmount">
            <el-input-number 
              v-model="paymentSettings.minCampaignAmount" 
              :min="100" 
              :step="100"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="Montant maximum campagne" prop="maxCampaignAmount">
            <el-input-number 
              v-model="paymentSettings.maxCampaignAmount" 
              :min="1000000" 
              :step="1000000"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="MTN Money activé">
            <el-switch v-model="paymentSettings.mtnMoneyEnabled" />
          </el-form-item>
          
          <el-form-item label="Orange Money activé">
            <el-switch v-model="paymentSettings.orangeMoneyEnabled" />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="savePaymentSettings" 
              :loading="savingPayment"
            >
              Sauvegarder
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Paramètres de sécurité -->
      <div class="card">
        <h3>Paramètres de sécurité</h3>
        <el-form 
          :model="securitySettings" 
          :rules="securityRules"
          ref="securityFormRef"
          label-width="150px"
        >
          <el-form-item label="Tentatives max de connexion" prop="maxLoginAttempts">
            <el-input-number 
              v-model="securitySettings.maxLoginAttempts" 
              :min="3" 
              :max="10"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="Timeout de session (min)" prop="sessionTimeout">
            <el-input-number 
              v-model="securitySettings.sessionTimeout" 
              :min="15" 
              :max="480"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="Vérification email obligatoire">
            <el-switch v-model="securitySettings.requireEmailVerification" />
          </el-form-item>
          
          <el-form-item label="Vérification téléphone obligatoire">
            <el-switch v-model="securitySettings.requirePhoneVerification" />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="saveSecuritySettings" 
              :loading="savingSecurity"
            >
              Sauvegarder
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Paramètres de notification -->
      <div class="card">
        <h3>Paramètres de notification</h3>
        <el-form :model="notificationSettings" label-width="150px">
          <el-form-item label="Notifications par email">
            <el-switch v-model="notificationSettings.emailNotifications" />
          </el-form-item>
          
          <el-form-item label="Notifications par SMS">
            <el-switch v-model="notificationSettings.smsNotifications" />
          </el-form-item>
          
          <el-form-item label="Notifications push">
            <el-switch v-model="notificationSettings.pushNotifications" />
          </el-form-item>
          
          <el-form-item label="Notifications admin">
            <el-switch v-model="notificationSettings.adminNotifications" />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="saveNotificationSettings" 
              :loading="savingNotification"
            >
              Sauvegarder
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Paramètres de maintenance -->
      <div class="card">
        <h3>Mode maintenance</h3>
        <el-form :model="maintenanceSettings" label-width="150px">
          <el-form-item label="Activer le mode maintenance">
            <el-switch v-model="maintenanceSettings.isMaintenanceMode" />
          </el-form-item>
          
          <el-form-item label="Message de maintenance">
            <el-input 
              v-model="maintenanceSettings.maintenanceMessage" 
              type="textarea" 
              :rows="3"
              placeholder="Message affiché aux utilisateurs en mode maintenance"
            />
          </el-form-item>
          
          <el-form-item label="IPs autorisées">
            <el-input 
              v-model="maintenanceSettings.allowedIPs" 
              type="textarea" 
              :rows="2"
              placeholder="Une IP par ligne (ex: 192.168.1.1)"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="saveMaintenanceSettings" 
              :loading="savingMaintenance"
            >
              Sauvegarder
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- Bouton de réinitialisation -->
    <div class="reset-section">
      <el-button 
        type="danger" 
        @click="resetAllSettings" 
        :loading="resetting"
        icon="Refresh"
      >
        Réinitialiser tous les paramètres
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { settingsService } from '@/services/api'

const loading = ref(false)
const savingGeneral = ref(false)
const savingPayment = ref(false)
const savingSecurity = ref(false)
const savingNotification = ref(false)
const savingMaintenance = ref(false)
const resetting = ref(false)

// Références des formulaires
const generalFormRef = ref()
const paymentFormRef = ref()
const securityFormRef = ref()

// Paramètres généraux
const generalSettings = reactive({
  platformName: '',
  contactEmail: '',
  contactPhone: '',
  currency: 'FCFA',
  timezone: 'Africa/Douala'
})

// Paramètres de paiement
const paymentSettings = reactive({
  cpv: 14,
  cpv_ambassador: 10,
  minCampaignAmount: 10000,
  maxCampaignAmount: 1000000,
  mtnMoneyEnabled: true,
  orangeMoneyEnabled: true
})

// Paramètres de sécurité
const securitySettings = reactive({
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  requireEmailVerification: false,
  requirePhoneVerification: false
})

// Paramètres de notification
const notificationSettings = reactive({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  adminNotifications: true
})

// Paramètres de maintenance
const maintenanceSettings = reactive({
  isMaintenanceMode: false,
  maintenanceMessage: 'La plateforme est en maintenance. Veuillez réessayer plus tard.',
  allowedIPs: ''
})

// Règles de validation
const generalRules = {
  platformName: [
    { required: true, message: 'Le nom de la plateforme est requis', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: 'L\'email de contact est requis', trigger: 'blur' },
    { type: 'email', message: 'Format d\'email invalide', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: 'Le téléphone de contact est requis', trigger: 'blur' }
  ],
  currency: [
    { required: true, message: 'La devise est requise', trigger: 'change' }
  ],
  timezone: [
    { required: true, message: 'Le fuseau horaire est requis', trigger: 'change' }
  ]
}

const paymentRules = {
  cpv: [
    { required: true, message: 'Le CPV annonceur est requis', trigger: 'blur' },
    { type: 'number', min: 2, max: 100, message: 'Le CPV annonceur doit être entre 10 et 100 FCFA', trigger: 'blur' }
  ],
  cpv_ambassador: [
    { required: true, message: 'Le CPV ambassadeur est requis', trigger: 'blur' },
    { type: 'number', min: 1, max: 50, message: 'Le CPV ambassadeur doit être entre 5 et 50 FCFA', trigger: 'blur' }
  ],
  minCampaignAmount: [
    { required: true, message: 'Le montant minimum est requis', trigger: 'blur' },
    { type: 'number', min: 100, message: 'Le montant minimum doit être d\'au moins 1000 FCFA', trigger: 'blur' }
  ],
  maxCampaignAmount: [
    { required: true, message: 'Le montant maximum est requis', trigger: 'blur' },
    { type: 'number', min: 1000000, message: 'Le montant maximum doit être d\'au moins 10000 FCFA', trigger: 'blur' }
  ]
}

const securityRules = {
  maxLoginAttempts: [
    { required: true, message: 'Le nombre de tentatives est requis', trigger: 'blur' },
    { type: 'number', min: 3, max: 10, message: 'Le nombre de tentatives doit être entre 3 et 10', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, message: 'Le timeout de session est requis', trigger: 'blur' },
    { type: 'number', min: 15, max: 480, message: 'Le timeout doit être entre 15 et 480 minutes', trigger: 'blur' }
  ]
}

// Charger les paramètres
const loadSettings = async () => {
  try {
    loading.value = true
    const response = await settingsService.getSettings()
    const settings = response.data

    // Mettre à jour les paramètres généraux
    Object.assign(generalSettings, settings.general || {})

    // Mettre à jour les paramètres de paiement
    Object.assign(paymentSettings, settings.payment || {})

    // Mettre à jour les paramètres de sécurité
    Object.assign(securitySettings, settings.security || {})

    // Mettre à jour les paramètres de notification
    Object.assign(notificationSettings, settings.notification || {})

    // Mettre à jour les paramètres de maintenance
    Object.assign(maintenanceSettings, settings.maintenance || {})
    if (settings.maintenance?.allowedIPs) {
      maintenanceSettings.allowedIPs = Array.isArray(settings.maintenance.allowedIPs) 
        ? settings.maintenance.allowedIPs.join('\n') 
        : ''
    }

  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
    ElMessage.error('Erreur lors du chargement des paramètres')
  } finally {
    loading.value = false
  }
}

// Sauvegarder les paramètres généraux
const saveGeneralSettings = async () => {
  try {
    const valid = await generalFormRef.value.validate()
    if (!valid) return

    savingGeneral.value = true
    await settingsService.updateGeneralSettings(generalSettings)
    ElMessage.success('Paramètres généraux sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres généraux:', error)
    ElMessage.error('Erreur lors de la sauvegarde des paramètres généraux')
  } finally {
    savingGeneral.value = false
  }
}

// Sauvegarder les paramètres de paiement
const savePaymentSettings = async () => {
  try {
    const valid = await paymentFormRef.value.validate()
    if (!valid) return

    savingPayment.value = true
    await settingsService.updatePaymentSettings(paymentSettings)
    ElMessage.success('Paramètres de paiement sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres de paiement:', error)
    ElMessage.error('Erreur lors de la sauvegarde des paramètres de paiement')
  } finally {
    savingPayment.value = false
  }
}

// Sauvegarder les paramètres de sécurité
const saveSecuritySettings = async () => {
  try {
    const valid = await securityFormRef.value.validate()
    if (!valid) return

    savingSecurity.value = true
    await settingsService.updateSecuritySettings(securitySettings)
    ElMessage.success('Paramètres de sécurité sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres de sécurité:', error)
    ElMessage.error('Erreur lors de la sauvegarde des paramètres de sécurité')
  } finally {
    savingSecurity.value = false
  }
}

// Sauvegarder les paramètres de notification
const saveNotificationSettings = async () => {
  try {
    savingNotification.value = true
    await settingsService.updateNotificationSettings(notificationSettings)
    ElMessage.success('Paramètres de notification sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres de notification:', error)
    ElMessage.error('Erreur lors de la sauvegarde des paramètres de notification')
  } finally {
    savingNotification.value = false
  }
}

// Sauvegarder les paramètres de maintenance
const saveMaintenanceSettings = async () => {
  try {
    savingMaintenance.value = true
    
    // Convertir les IPs en tableau
    const allowedIPs = maintenanceSettings.allowedIPs
      .split('\n')
      .map(ip => ip.trim())
      .filter(ip => ip.length > 0)

    const maintenanceData = {
      ...maintenanceSettings,
      allowedIPs
    }

    await settingsService.updateMaintenanceSettings(maintenanceData)
    ElMessage.success('Paramètres de maintenance sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres de maintenance:', error)
    ElMessage.error('Erreur lors de la sauvegarde des paramètres de maintenance')
  } finally {
    savingMaintenance.value = false
  }
}

// Réinitialiser tous les paramètres
const resetAllSettings = async () => {
  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ? Cette action ne peut pas être annulée.',
      'Confirmation',
      {
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    )

    resetting.value = true
    await settingsService.resetSettings()
    await loadSettings() // Recharger les paramètres
    ElMessage.success('Tous les paramètres ont été réinitialisés aux valeurs par défaut')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Erreur lors de la réinitialisation des paramètres:', error)
      ElMessage.error('Erreur lors de la réinitialisation des paramètres')
    }
  } finally {
    resetting.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style lang="scss" scoped>
.settings-page {
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-grey);
    }
  }

  .reset-section {
    display: flex;
    justify-content: center;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-tip {
    font-size: 12px;
    color: var(--dark-grey);
    opacity: 0.7;
    margin-top: 4px;
    font-style: italic;
  }
}

// Responsive
@media (max-width: 768px) {
  .settings-page {
    .settings-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 