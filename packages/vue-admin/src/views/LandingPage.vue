<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <img src="/assets/logo.png" width="150" alt="Logo" class="logo" />
        </div>
        <div class="nav-buttons">
          <el-button type="primary" @click="goToLogin">Se connecter</el-button>
          <el-button @click="goToRegister">Créer un compte</el-button>
          <el-button type="text" @click="goToAdminLogin" class="admin-link">Admin</el-button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1>Transformez votre audience en ambassadeurs</h1>
          <p>Plateforme innovante de marketing d'influence qui connecte annonceurs et ambassadeurs pour des campagnes publicitaires performantes.</p>
          <div class="hero-buttons">
            <el-button type="primary" size="large" @click="goToRegister">
              Commencer maintenant
            </el-button>
            <el-button size="large" @click="scrollToFeatures">
              En savoir plus
            </el-button>
          </div>
        </div>
        <div class="hero-image">
          <div class="app-mockup">
            <div class="phone-mockup">
              <div class="screen">
                <div class="app-content">
                  <div class="app-header"></div>
                  <div class="app-body">
                    <div class="campaign-card"></div>
                    <div class="campaign-card"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" ref="features">
      <div class="container">
        <h2>Pourquoi choisir EchoPub ?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h3>Campagnes Performantes</h3>
            <p>Créez des campagnes publicitaires ciblées avec des métriques précises et des résultats mesurables.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <el-icon><User /></el-icon>
            </div>
            <h3>Ambassadeurs Qualifiés</h3>
            <p>Accédez à un réseau d'ambassadeurs vérifiés avec des audiences engagées et locales.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <el-icon><Money /></el-icon>
            </div>
            <h3>Paiements Sécurisés</h3>
            <p>Transactions sécurisées via Mobile Money avec suivi en temps réel des paiements.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <el-icon><Location /></el-icon>
            </div>
            <h3>Géolocalisation</h3>
            <p>Ciblez des zones géographiques spécifiques pour maximiser l'impact de vos campagnes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Section -->
    <section class="download">
      <div class="container">
        <h2>Téléchargez l'application mobile</h2>
        <p>Accédez à EchoPub depuis votre smartphone et gérez vos campagnes en déplacement.</p>
        <div class="download-buttons">
          <div class="download-card">
            <div class="download-icon">
              <el-icon><Apple /></el-icon>
            </div>
            <div class="download-content">
              <h4>Télécharger sur iOS</h4>
              <p>Disponible sur l'App Store</p>
            </div>
            <el-button type="primary" @click="downloadIOS">
              Télécharger
            </el-button>
          </div>
          <div class="download-card">
            <div class="download-icon">
              <el-icon><Android /></el-icon>
            </div>
            <div class="download-content">
              <h4>Télécharger sur Android</h4>
              <p>Disponible sur Google Play</p>
            </div>
            <el-button type="primary" @click="downloadAndroid">
              Télécharger
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>Prêt à commencer ?</h2>
        <p>Rejoignez des milliers d'annonceurs et d'ambassadeurs qui font confiance à EchoPub.</p>
        <div class="cta-buttons">
          <el-button type="primary" size="large" @click="goToRegister">
            Créer un compte gratuit
          </el-button>
          <el-button size="large" @click="goToLogin">
            Se connecter
          </el-button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>EchoPub</h3>
            <p>Plateforme de marketing d'influence innovante</p>
          </div>
          <div class="footer-section">
            <h4>Produit</h4>
            <ul>
              <li><a href="#" @click="scrollToFeatures">Fonctionnalités</a></li>
              <li><a href="#" @click="goToRegister">Créer un compte</a></li>
              <li><a href="#" @click="goToLogin">Se connecter</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Centre d'aide</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><a href="#">Conditions d'utilisation</a></li>
              <li><a href="#">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 EchoPub. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { TrendCharts, User, Money, Location, Apple, Android } from '@element-plus/icons-vue'

export default {
  name: 'LandingPage',
  components: {
    TrendCharts,
    User,
    Money,
    Location,
    Apple,
    Android
  },
  methods: {
    goToLogin() {
      this.$router.push('/login/advertiser')
    },
    goToRegister() {
      this.$router.push('/register')
    },
    scrollToFeatures() {
      this.$refs.features.scrollIntoView({ behavior: 'smooth' })
    },
    downloadIOS() {
      // Simuler le téléchargement iOS
      window.open('#', '_blank')
    },
    downloadAndroid() {
      // Simuler le téléchargement Android
      window.open('#', '_blank')
    },
    goToAdminLogin() {
      this.$router.push('/login/admin')
    }
  }
}
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%);
}

// Navigation
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nav-logo h2 {
      color: var(--primary-blue);
      margin: 0;
      font-weight: 700;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;

      .admin-link {
        color: var(--dark-grey);
        font-size: 0.9rem;
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}

// Hero Section
.hero {
  padding: 120px 0 80px;
  color: white;

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;

    .hero-content {
      h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;

      .app-mockup {
        position: relative;
        
        .phone-mockup {
          width: 280px;
          height: 560px;
          background: #000;
          border-radius: 30px;
          padding: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

          .screen {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 22px;
            overflow: hidden;

            .app-content {
              height: 100%;
              background: var(--light-grey);

              .app-header {
                height: 60px;
                background: var(--primary-blue);
              }

              .app-body {
                padding: 1rem;

                .campaign-card {
                  height: 80px;
                  background: white;
                  border-radius: 8px;
                  margin-bottom: 1rem;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
              }
            }
          }
        }
      }
    }
  }
}

// Features Section
.features {
  padding: 80px 0;
  background: white;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      color: var(--primary-blue);
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;

      .feature-card {
        text-align: center;
        padding: 2rem;
        border-radius: 12px;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: var(--light-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
        }

        h3 {
          color: var(--primary-blue);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        p {
          color: var(--dark-grey);
          line-height: 1.6;
        }
      }
    }
  }
}

// Download Section
.download {
  padding: 80px 0;
  background: var(--light-grey);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      color: var(--primary-blue);
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.25rem;
      color: var(--dark-grey);
      margin-bottom: 3rem;
    }

    .download-buttons {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;

      .download-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        min-width: 300px;

        .download-icon {
          width: 60px;
          height: 60px;
          background: var(--primary-blue);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .download-content {
          flex: 1;
          text-align: left;

          h4 {
            color: var(--primary-blue);
            margin-bottom: 0.5rem;
          }

          p {
            color: var(--dark-grey);
            margin: 0;
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}

// CTA Section
.cta {
  padding: 80px 0;
  background: var(--primary-blue);
  color: white;
  text-align: center;

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
  }
}

// Footer
.footer {
  background: var(--dark-grey);
  color: white;
  padding: 60px 0 20px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;

      .footer-section {
        h3, h4 {
          color: var(--light-blue);
          margin-bottom: 1rem;
        }

        p {
          opacity: 0.8;
          line-height: 1.6;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            margin-bottom: 0.5rem;

            a {
              color: white;
              text-decoration: none;
              opacity: 0.8;
              transition: opacity 0.3s ease;

              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 0.8;
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .hero {
    .hero-container {
      grid-template-columns: 1fr;
      text-align: center;

      .hero-content h1 {
        font-size: 2.5rem;
      }
    }
  }

  .features .features-grid {
    grid-template-columns: 1fr;
  }

  .download .download-buttons {
    flex-direction: column;
    align-items: center;

    .download-card {
      min-width: auto;
      width: 100%;
      max-width: 400px;
    }
  }

  .navbar .nav-container {
    padding: 1rem;
  }
}
</style> 