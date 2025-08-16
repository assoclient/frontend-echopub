<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <img src="/assets/logobg1.png" width="150" alt="Logo" class="logo" />

          <h2>Créer un compte annonceur</h2>
          <p>Rejoignez EchoPub en tant qu'annonceur et commencez vos campagnes</p>
        </div>

        <el-form
          ref="registerForm"
          :model="form"
          :rules="rules" 
          class="register-form"
          @submit.prevent="handleRegister" 
        >
          <el-form-item prop="name">
            <el-input 
              v-model="form.name"
              placeholder="Nom complet"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="Adresse email"
              size="large"
              prefix-icon="Message"
              type="email"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="Numéro de téléphone"
              size="large"
              prefix-icon="Phone"
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

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              placeholder="Confirmer le mot de passe"
              size="large"
              prefix-icon="Lock"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="form.terms">
              J'accepte les <a href="#" class="terms-link">conditions d'utilisation</a>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleRegister"
            >
              Créer mon compte annonceur
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <p>
            Déjà un compte ?
            <a href="#" @click="goToLogin" class="login-link">Se connecter</a>
          </p>
        </div>
      </div>

      <div class="register-info">
        <h3>Pourquoi devenir annonceur ?</h3>
        <div class="benefits">
          <div class="benefit-item">
            <el-icon><Check /></el-icon>
            <span>Créez des campagnes publicitaires ciblées</span>
          </div>
          <div class="benefit-item">
            <el-icon><Check /></el-icon>
            <span>Accédez à un réseau d'ambassadeurs qualifiés</span>
          </div>
          <div class="benefit-item">
            <el-icon><Check /></el-icon>
            <span>Suivez vos performances en temps réel</span>
          </div>
          <div class="benefit-item">
            <el-icon><Check /></el-icon>
            <span>Paiements sécurisés via Mobile Money</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User, Message, Phone, Lock, Check } from '@element-plus/icons-vue'

export default {
  name: 'Register',
  components: {
    User,
    Message,
    Phone,
    Lock,
    Check
  },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('Les mots de passe ne correspondent pas'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false
      },
      rules: {
        name: [
          { required: true, message: 'Le nom est requis', trigger: 'blur' },
          { min: 2, message: 'Le nom doit contenir au moins 2 caractères', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'L\'email est requis', trigger: 'blur' },
          { type: 'email', message: 'Veuillez entrer un email valide', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Le numéro de téléphone est requis', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Le mot de passe est requis', trigger: 'blur' },
          { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Veuillez confirmer le mot de passe', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleRegister() {
      try {
        const valid = await this.$refs.registerForm.validate()
        if (!valid) return

        if (!this.form.terms) {
          this.$message.error('Veuillez accepter les conditions d\'utilisation')
          return
        }

        this.loading = true

        // Simuler l'inscription
        await new Promise(resolve => setTimeout(resolve, 2000))

        this.$message.success('Compte annonceur créé avec succès !')
        this.$router.push('/login/advertiser')
      } catch (error) {
        this.$message.error('Erreur lors de la création du compte')
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/login/advertiser')
    }
  }
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  .register-header {
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

  .register-form {
    .el-form-item {
      margin-bottom: 1.5rem;
    }

    .terms-link {
      color: var(--primary-blue);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .register-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-grey);

    p {
      color: var(--dark-grey);
    }

    .login-link {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.register-info {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 600;
  }

  .benefits {
    .benefit-item {
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
  .register-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .register-card {
    padding: 2rem;
  }

  .register-info {
    text-align: center;
  }
}
</style> 