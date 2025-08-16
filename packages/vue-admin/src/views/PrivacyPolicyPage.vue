<template>
  <div class="privacy-policy">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
        <a href="/"> <img src="/assets/logobg1.png" width="150" alt="Logo" class="logo" /></a> 
        </div>
        <div class="nav-buttons">
          <el-button type="primary" class="login-button" @click="goToLogin">Se connecter</el-button>
          <el-button class="register-button" size="large" @click="goToRegister">Créer un compte</el-button>
<!--           <el-button type="text" @click="goToAdminLogin" class="admin-link">Admin</el-button>
 -->        </div>
      </div>
    </nav>
    <div class="container">
      <h1>Politique de confidentialité</h1>
      <p>
        Cette politique de confidentialité décrit comment EchoPub collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre plateforme.
      </p>
      <h2>1. Collecte des informations</h2>
      <p>
        Nous collectons les informations que vous fournissez lors de l'inscription, de la création de campagnes ou de l'utilisation de nos services (nom, email, numéro WhatsApp, informations de paiement, etc.).
      </p>
      <h2>2. Utilisation des informations</h2>
      <p>
        Vos données sont utilisées pour :
        <ul>
          <li>Gérer votre compte et vos campagnes</li>
          <li>Assurer la sécurité et la conformité de la plateforme</li>
          <li>Personnaliser votre expérience utilisateur</li>
          <li>Effectuer des paiements et des transactions</li>
          <li>Analyser les performances et améliorer nos services</li>
        </ul>
      </p>
      <h2>3. Partage des informations</h2>
      <p>
        EchoPub ne partage pas vos données personnelles avec des tiers, sauf si cela est nécessaire pour fournir le service (ex : paiement Mobile Money) ou si la loi l'exige.
      </p>
      <h2>4. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
      </p>
      <h2>5. Vos droits</h2>
      <p>
        Vous pouvez accéder, modifier ou supprimer vos informations personnelles à tout moment via votre compte ou en contactant notre support.
      </p>
      <h2>6. Modifications</h2>
      <p>
        EchoPub se réserve le droit de modifier cette politique. Toute modification sera publiée sur cette page.
      </p>
      <h2>7. Contact</h2>
      <p>
        Pour toute question concernant la confidentialité, contactez-nous à <a href="mailto:support@echopub.com">support@echopub.com</a>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyPage',
}
</script>

<style scoped>

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
.privacy-policy {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 60px 0;
}
.container {
  max-width: 1200px;
  margin: 50px auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 40px 32px;
}
h1 {
  color: var(--primary-blue);
  margin-bottom: 2rem;
  font-size: 2.5rem;
}
h2 {
  color: var(--primary-blue);
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}
p, ul {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.7;
}
ul {
  margin-left: 1.5rem;
}
a {
  color: var(--primary-blue);
  text-decoration: underline;
}
</style>
