<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <img src="/assets/logobg1.png" width="150" alt="Logo" class="logo" />
        </div>
        <div class="nav-buttons">
          <el-button type="primary" class="login-button" @click="goToLogin">Se connecter</el-button>
          <el-button class="register-button" size="large" @click="goToRegister">Créer un compte</el-button>
<!--           <el-button type="text" @click="goToAdminLogin" class="admin-link">Admin</el-button>
 -->        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-slider">
        <!-- Slide 1: Annonceurs -->
        <div class="hero-slide" :class="{ active: currentSlide === 0 }">
          <div class="hero-container1">
            <div class="hero-content">
              <h1>Boostez vos campagnes publicitaires</h1>
              <p>Connectez-vous avec des ambassadeurs qualifiés et multipliez l'impact de vos campagnes marketing grâce à notre plateforme innovante.</p>
              <div class="hero-buttons">
                <el-button type="primary" size="large" @click="goToRegister">
                  Créer ma campagne
                </el-button>
                <el-button size="large" @click="scrollToFeatures">
                  Découvrir nos services
                </el-button>
              </div>
            </div>
            <!-- <div class="hero-image">
              <img src="/assets/phone_landing-removebg-preview.png" 
              alt="Hero Image" class="hero-image-img">
            
            </div> -->
          </div>
        </div>

        <!-- Slide 2: Ambassadeurs -->
        <div class="hero-slide" :class="{ active: currentSlide === 1 }">
          <div class="hero-container">
            <div class="hero-content">
              <h1>Gagnez en partageant du contenu</h1>
              <p>Rejoignez notre communauté d'ambassadeurs et monétisez votre influence en promouvant des marques qui vous correspondent.</p>
              <div class="hero-buttons">
                <el-button type="primary" size="large" @click="goToDownloadSection">
                  Devenir ambassadeur
                </el-button>
                <el-button size="large" @click="scrollToFeatures">
                  Voir les opportunités
                </el-button>
              </div>
            </div>
           <!--  <div class="hero-image">
              <img src="/assets/phone_landing1-removebg-preview.png" 
              alt="Hero Image" class="hero-image-img">
            </div> -->
          </div>
        </div>

        <!-- Navigation dots -->
        <!-- <div class="slider-dots">
          <div 
            class="dot" 
            :class="{ active: currentSlide === 0 }"
            @click="goToSlide(0)"
          ></div>
          <div 
            class="dot" 
            :class="{ active: currentSlide === 1 }"
            @click="goToSlide(1)"
          ></div>
        </div> -->

        <!-- Navigation arrows -->
      <!--   <div class="slider-arrows">
          <div class="arrow arrow-left" @click="previousSlide">
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <div class="arrow arrow-right" @click="nextSlide">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div> -->
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
          <div class="feature-card">
            <div class="feature-icon">
              <el-icon><List /></el-icon>
            </div>
            <h3>Contenu diversifié</h3>
            <p>Partager du texte, des images(Flyers) et des courtes vidéos de 30s.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq" ref="faq">
      <div class="container">
        <h2>Questions Fréquemment Posées</h2>
        <div class="faq-container">
          <div class="faq-item" v-for="(item, index) in faqItems" :key="index">
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ item.question }}</h3>
              <el-icon class="faq-icon" :class="{ 'rotated': item.isOpen }">
                <ArrowDown />
              </el-icon>
            </div>
            <div class="faq-answer" :class="{ 'open': item.isOpen }">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials" ref="testimonials">
      <div class="container">
        <h2>Ce que disent nos utilisateurs</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-content">
              <div class="testimonial-stars">
                <el-icon v-for="star in 5" :key="star" class="star-icon">
                  <Star color="var(--yellow)" />
                </el-icon>
              </div>
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
              <div class="testimonial-author">
                <div class="author-avatar">
                  <img :src="testimonial.avatar" :alt="testimonial.name" />
                </div>
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <span>{{ testimonial.role }}</span>
                  <span class="company">{{ testimonial.company }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Section -->
    <section class="download" ref="download">
      <div class="container">
        <h2>Téléchargez l'application mobile</h2>
        <p>Accédez à EchoPub depuis votre smartphone et gérez vos campagnes en déplacement.</p>
        <div class="download-buttons">
          <!-- <div class="download-card">
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
          </div> -->
          <div class="download-card">
            <div class="download-icon">
              <img src="/assets/icons/android.png" width="50" height="50" alt="Google Play" class="download-icon-img">
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
          <el-button type="primary" class="cta-button" size="large" @click="goToRegister">
            Créer un compte gratuit
          </el-button>
          <el-button class="cta-button cta-button-primary" size="large" @click="goToLogin">
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
              <li><a style="cursor: pointer;" @click="scrollToFeatures">Fonctionnalités</a></li>
              <li><a style="cursor: pointer;" @click="scrollToFaq">FAQ</a></li>
              <li><a style="cursor: pointer;" @click="scrollToTestimonials">Témoignages</a></li>
              <li><a href="#" @click="goToRegister">Créer un compte</a></li>
              <li><a href="#" @click="goToLogin">Se connecter</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
             <!--  <li><a href="#">Centre d'aide</a></li> -->
              <li><a href="#">Contact: +237 694071931</a></li>
              <li><a style="cursor: pointer;" @click="scrollToFaq">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><a href="#">Conditions d'utilisation</a></li>
              <li><router-link to="/privacy-policy">Politique de confidentialité</router-link></li>
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
import { TrendCharts, User, Money, Location, Apple, Android, ArrowRight, ArrowLeft, ArrowDown, Star, List } from '@element-plus/icons-vue'

export default {
  name: 'LandingPage',
  components: {
    TrendCharts,
    User,
    Money,
    Location,
    Apple,
    Android,
    ArrowRight,
    ArrowLeft,
    ArrowDown,
    Star
  },
  data() {
    return {
      currentSlide: 0,
      autoPlayInterval: null,
      faqItems: [
        {
          question: 'Qu\'est-ce que EchoPub ?',
          answer: 'EchoPub est une plateforme innovante de marketing d\'influence qui permet aux annonceurs de créer et de gérer leurs campagnes publicitaires, tout en bénéficiant de l\'expertise et de l\'influence de leurs ambassadeurs. Nous offrons une solution complète pour la promotion et la diffusion de vos messages.',
          isOpen: true
        },
        {
          question: 'Comment puis-je devenir ambassadeur ?',
          answer: 'Pour devenir ambassadeur, vous devez vous inscrire sur notre application mobile uniquement avec votre numéro whatsapp. Une fois validé, vous pourrez commencer à partager du contenu, à gérer vos campagnes et à générer des revenus.',
          isOpen: true
        },
        {
          question: 'Quels sont les avantages d\'utiliser EchoPub ?',
          answer: 'L\'utilisation d\'EchoPub offre de nombreux avantages, notamment la possibilité de cibler des audiences précises, de suivre les performances de vos campagnes en temps réel, et de bénéficier d\'un système de paiement sécurisé et instantané.',
          isOpen: true
        },
        {
          question: 'La plateforme est-elle sécurisée ?',
          answer: 'Oui, EchoPub est conçue avec des normes de sécurité strictes. Nous utilisons des protocoles de cryptage de bout en bout et des méthodes de sécurisation des données pour assurer la confidentialité et l\'intégrité de vos informations.',
          isOpen: true
        },
        {
          question: 'Comment puis-je me désinscrire ?',
          answer: 'Vous pouvez vous désinscrire à tout moment en contactant notre équipe de support. Nous nous efforçons de vous offrir une expérience fluide et personnalisée.',
          isOpen: true
        }
      ],
      testimonials: [
        {
          text: 'J’ai lancé une promo sur mes produits et, en deux jours, plus de 3 000 personnes l’avaient vue sur WhatsApp. Résultat : mes ventes ont doublé cette semaine.',
          name: 'Ondoua Martin',
          role: 'Marketing Manager',
          company: 'Tech Solutions Inc.',
          avatar: '/assets/testimonials/avatar1.jpg'
        },
        {
          text: 'Quand les gens voient un événement partagé par leurs proches, ils s’y intéressent beaucoup plus. Grâce aux ambassadeurs locaux, mes soirées affichent complet sans avoir collé une seule affiche.',
          name: 'Mr Abakar',
          role: 'Promoteur de spectacles',
          company: 'Abakar Events',
          avatar: '/assets/testimonials/avatar1.jpg'
        },
        {
          text: 'La force de cette plateforme, c’est que vos messages ne viennent pas d’une marque inconnue, mais des statuts des proches de votre audience. C’est du bouche-à-oreille digital, avec un impact direct et mesurable.',
          name: 'Mr Njikam',
          role: 'Promoteur de produits',
          company: 'Ets La lissière',
          avatar: '/assets/testimonials/avatar1.jpg'
        }
      ]
    }
  },
  mounted() {
    this.startAutoPlay()
  },
  beforeUnmount() {
    this.stopAutoPlay()
  },
  methods: {
    // Slider navigation
    goToSlide(slideIndex) {
      this.currentSlide = slideIndex
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % 2
    },
    previousSlide() {
      this.currentSlide = this.currentSlide === 0 ? 1 : 0
    },
    
    // Auto-play functionality
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, 8000) // Change slide every 5 seconds
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    },
    
    // Navigation methods
    goToLogin() {
      this.$router.push('/login/advertiser')
    },
    goToRegister() {
      window.href = '#do'
      this.$router.push('/register')
    },
    goToDownloadSection() {
      this.$refs.download.scrollIntoView({ behavior: 'smooth' })
    },
    scrollToFeatures() {
      this.$refs.features.scrollIntoView({ behavior: 'smooth' })
    },
    scrollToFaq() {
      this.$refs.faq.scrollIntoView({ behavior: 'smooth' })
    },
    scrollToTestimonials() {
      this.$refs.testimonials.scrollIntoView({ behavior: 'smooth' })
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
    },
    toggleFaq(index) {
      this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
    }
  }
}
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%);
}
.login-button {
  background-color: var(--primary-blue);
  color: white;
  border: none;
  padding: 10px 20px;
  height: 40px;
  border-radius: 15px;
}
.register-button {
  background-color: white;
  color: black;
  border: none;
  padding: 10px 20px;
  height: 40px;
  border-radius: 15px;
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
  padding: 0px 0 80px;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 100vh;

  .hero-slider {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    pointer-events: none;
    padding: 80px 0 80px ;

    &.active {
      opacity: 1;
      pointer-events: all;
    }
  }

  .hero-container {
    height: 100vh;
    background-image: url('../../public/assets/banner/banner.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    min-height: 0px;
    position: relative;
    z-index: 1;

    .hero-content {
      h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.2;
        animation: slideInLeft 0.8s ease-out;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        line-height: 1.6;
        animation: slideInLeft 0.8s ease-out 0.2s both;
      }

      .hero-buttons {
        padding-bottom: 80px;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        animation: slideInLeft 0.8s ease-out 0.4s both;
      }
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
      animation: slideInRight 0.8s ease-out 0.3s both;
        .hero-image-img {
          width: 50%;
          height: 50%;
          object-fit: cover;
        }
      
    }
  }
  .hero-container1 {
    height: 100vh;
    background-image: url('../../public/assets/banner/banner1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    min-height: 0px;
    position: relative;
    z-index: 1;

    .hero-content {
      h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.2;
        animation: slideInLeft 0.8s ease-out;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        line-height: 1.6;
        animation: slideInLeft 0.8s ease-out 0.2s both;
      }

      .hero-buttons {
        padding-bottom: 80px;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        animation: slideInLeft 0.8s ease-out 0.4s both;
      }
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
      animation: slideInRight 0.8s ease-out 0.3s both;
        .hero-image-img {
          width: 50%;
          height: 50%;
          object-fit: cover;
        }
      
    }
  }
  // Slider Navigation
  .slider-dots {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.7);
        transform: scale(1.1);
      }

      &.active {
        background: white;
        border-color: var(--primary-blue);
        transform: scale(1.2);
      }
    }
  }

  .slider-arrows {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    z-index: 10;
    pointer-events: none;
    max-width: 1200px;
    margin: 0 auto;

    .arrow {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      pointer-events: all;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
        border-color: white;
      }

      .el-icon {
        color: white;
        font-size: 20px;
      }

      &.arrow-left {
        left: 2rem;
      }

      &.arrow-right {
        right: 2rem;
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
      color: transparentize($color: #000000, $amount: 0.4);
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

// FAQ Section
.faq {
  padding: 80px 0;
  background: var(--light-grey);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      color: transparentize($color: #000000, $amount: 0.4);
      margin-bottom: 3rem;
    }

    .faq-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .faq-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: max-height 0.5s ease-in-out;
        cursor: pointer;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          cursor: pointer;
          background: var(--light-blue);
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: background-color 0.3s ease;

          &:hover {
            background: var(--primary-blue);
          }

          h3 {
            margin: 0;
            font-size: 1.25rem;
          }

          .faq-icon {
            transition: transform 0.3s ease;
            font-size: 1.5rem;
          }

          &.rotated .faq-icon {
            transform: rotate(180deg);
          }
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          padding: 0 2rem 1.5rem;
          color: var(--dark-grey);
          line-height: 1.6;
          font-size: 1rem;
          transition: max-height 0.5s ease-in-out;

          &.open {
            max-height: 500px; /* Adjust as needed */
          }
        }
      }
    }
  }
}

// Testimonials Section
.testimonials {
  padding: 80px 0;
  background: white;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      color: transparentize($color: #000000, $amount: 0.4);
      margin-bottom: 3rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;

      .testimonial-card {
        background: var(--light-grey);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          background: white;
        }

        .testimonial-stars {
          display: flex;
          gap: 5px;
          color: transparentize($color: orange, $amount: 0);
        }

        .testimonial-text {
          font-style: italic;
          color: var(--dark-grey);
          line-height: 1.8;
          font-size: 1.1rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;

          .author-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid var(--primary-blue);

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .author-info {
            h4 {
              color: var(--primary-blue);
              margin-bottom: 0.5rem;
            }

            span {
              display: block;
              font-size: 0.9rem;
              color: var(--dark-grey);
            }

            .company {
              font-size: 0.8rem;
              color: var(--light-blue);
            }
          }
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
         // background: var(--primary-blue);
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
    .cta-button {
      
      color: white;
      border: none;
      padding: 10px 20px;
      height: 40px;
      border-radius: 15px;
    }
    .cta-button-primary {
      
      color: black !important;
      
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

  .faq {
    .faq-container {
      .faq-item {
        .faq-question {
          padding: 1rem 1.5rem;
          
          h3 {
            font-size: 1.1rem;
          }
        }
        
        .faq-answer {
          padding: 0 1.5rem 1rem;
        }
      }
    }
  }

  .testimonials {
    .testimonials-grid {
      grid-template-columns: 1fr;
      
      .testimonial-card {
        padding: 1.5rem;
        
        .testimonial-author {
          flex-direction: column;
          text-align: center;
          
          .author-avatar {
            width: 50px;
            height: 50px;
          }
        }
      }
    }
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

// Animations for slider
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Enhanced app content styles
.app-content {
  .app-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }

  .app-body {
    padding: 1rem;

    .campaign-card {
      height: 80px;
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .card-header {
        font-weight: 600;
        color: var(--primary-blue);
        font-size: 14px;
        margin-bottom: 8px;
      }

      .card-stats {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--dark-grey);

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}
</style> 