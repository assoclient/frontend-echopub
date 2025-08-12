<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Connexion Annonceur</h2>
          <p>Accédez à votre espace de gestion des campagnes</p>
        </div>

        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="identifier">
            <el-input
              v-model="form.identifier"
              placeholder="Email ou téléphone"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="Mot de passe"
              size="large"
              prefix-icon="Lock"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
            >
              Se connecter
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <p>
            Nouveau sur EchoPub ?
            <a href="#" @click="goToRegister" class="register-link">Créer un compte annonceur</a>
          </p>
        </div>
      </div>

      <div class="login-info">
        <h3>Espace Annonceur</h3>
        <div class="features">
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>Créez des campagnes publicitaires</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>Suivez vos performances</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>Gérez votre budget</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>Accédez aux rapports détaillés</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User, Lock, Check } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdvertiserLogin',
  components: {
    User,
    Lock,
    Check
  },
  data() {
    return {
      loading: false,
      form: {
        identifier: '',
        password: ''
      },
      rules: {
        identifier: [
          { required: true, message: 'Email ou téléphone requis', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Mot de passe requis', trigger: 'blur' },
          { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (!valid) return

        this.loading = true
        console.log('🔐 Tentative de connexion annonceur...')

        // Utiliser le store Pinia pour la connexion
        const authStore = useAuthStore()
        const result = await authStore.login({
          email: this.form.identifier, // Le backend accepte email ou whatsapp_number
          password: this.form.password
        })

        console.log('📋 Résultat de la connexion:', result)

        if (!result.success) {
          console.error('❌ Échec de la connexion:', result.message)
          this.$message.error(result.message || 'Erreur lors de la connexion')
          return
        }

        console.log('✅ Connexion réussie, vérification du rôle...')
        console.log('👤 Rôle utilisateur:', authStore.userRole)

        // Vérifier que l'utilisateur est bien un annonceur
        if (authStore.userRole !== 'advertiser') {
          console.error('❌ Mauvais rôle:', authStore.userRole)
          this.$message.error('Ce compte n\'est pas un compte annonceur')
          authStore.logout() // Déconnecter l'utilisateur
          return
        }

        // Stocker le type d'utilisateur pour différencier des admins
        localStorage.setItem('userType', 'user')
        // Stocker l'ID utilisateur séparément pour un accès facile
        localStorage.setItem('userId', authStore.user.id)
        console.log('💾 Type utilisateur stocké:', 'user')
        console.log('💾 User ID stocké:', authStore.user.id)

        this.$message.success('Connexion réussie !')
        
        console.log('🔄 Redirection vers /advertiser/dashboard...')
        // Utiliser await pour s'assurer que la navigation se termine
        await this.$router.push('/advertiser/dashboard')
        console.log('✅ Redirection terminée')
        
      } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error)
        console.error('📋 Détails de l\'erreur:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        // Gérer les erreurs spécifiques
        if (error.response?.data?.message) {
          this.$message.error(error.response.data.message)
        } else if (error.response?.status === 400) {
          this.$message.error('Email/téléphone ou mot de passe incorrect')
        } else if (error.response?.status === 404) {
          this.$message.error('Utilisateur introuvable')
        } else {
          this.$message.error('Erreur lors de la connexion. Veuillez réessayer.')
        }
      } finally {
        this.loading = false
      }
    },
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  .login-header {
    text-align: center;
    margin-bottom: 2rem;

    h2 {
      color: var(--primary-blue);
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--dark-grey);
      opacity: 0.8;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 1.5rem;
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-grey);

    p {
      color: var(--dark-grey);
    }

    .register-link {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.login-info {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 600;
  }

  .features {
    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      font-size: 1.1rem;

      .el-icon {
        color: var(--soft-green);
        font-size: 1.5rem;
      }
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .login-card {
    padding: 2rem;
  }

  .login-info {
    text-align: center;
  }
}
</style> 