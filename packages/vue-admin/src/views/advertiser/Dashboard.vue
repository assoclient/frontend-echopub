<template>
  <div class="advertiser-dashboard">
    <div class="page-header">
   <!--    <h1>Tableau de bord</h1>
      <p>Vue d'ensemble de vos campagnes</p> -->
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon campaigns">
          <el-icon><Promotion /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalCampaigns }}</h3>
          <p>Campagnes totales</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon active">
          <el-icon><Check /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.activeCampaigns }}</h3>
          <p>Campagnes actives</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon views">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalViews) }}</h3>
          <p>Vues totales</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon spent">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatMoney(stats.totalSpent) }}</h3>
          <p>Budget dépensé</p>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="quick-actions">
      <h3>Actions rapides</h3>
      <div class="actions-grid">
        <el-button 
          type="primary" 
          size="large"
          @click="$router.push('/advertiser/campaigns/create')"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          Nouvelle campagne
        </el-button>
        
        <el-button 
          type="info" 
          size="large"
          @click="$router.push('/advertiser/profile')"
          class="action-btn"
        >
          <el-icon><User /></el-icon>
          Mon profil
        </el-button>
      </div>
    </div>

    <!-- Campagnes récentes -->
    <div class="recent-campaigns">
      <div class="section-header">
        <h3>Campagnes récentes</h3>
        <el-button 
          type="text"
          @click="$router.push('/advertiser/campaigns')"
        >
          Voir toutes
        </el-button>
      </div>
      
      <div class="campaigns-grid">
        <div 
          v-for="campaign in recentCampaigns" 
          :key="campaign.id"
          class="campaign-card"
        >
          <div class="campaign-header">
            <h4>{{ campaign.title }}</h4>
            <el-tag :type="getStatusType(campaign.status)">
              {{ getStatusLabel(campaign.status) }}
            </el-tag>
          </div>
          
          <div class="campaign-stats">
            <div class="stat">
              <span class="label">Vues</span>
              <span class="value">{{ formatNumber(campaign.views) }}</span>
            </div>
            <div class="stat">
              <span class="label">Clics</span>
              <span class="value">{{ formatNumber(campaign.clicks) }}</span>
            </div>
            <div class="stat">
              <span class="label">Budget</span>
              <span class="value">{{ formatMoney(campaign.budget) }}</span>
            </div>
          </div>
          
          <div class="campaign-progress">
            <div class="progress-info">
              <span>Progression</span>
              <span>{{ campaign.progress }}%</span>
            </div>
            <el-progress 
              :percentage="campaign.progress" 
              :color="getProgressColor(campaign.progress)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  Promotion, 
  Check, 
  View, 
  Money, 
  Plus, 
  User 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const stats = reactive({
  totalCampaigns: 12,
  activeCampaigns: 5,
  totalViews: 45600,
  totalSpent: 850000
})

const recentCampaigns = ref([
  {
    id: 1,
    title: 'Promo Été 2024',
    status: 'active',
    views: 12500,
    clicks: 450,
    budget: 150000,
    progress: 75
  },
  {
    id: 2,
    title: 'Nouveau Produit',
    status: 'draft',
    views: 0,
    clicks: 0,
    budget: 80000,
    progress: 0
  },
  {
    id: 3,
    title: 'Black Friday',
    status: 'completed',
    views: 32000,
    clicks: 1200,
    budget: 200000,
    progress: 100
  }
])

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    draft: 'info',
    completed: 'primary',
    paused: 'warning'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Active',
    draft: 'Brouillon',
    completed: 'Terminée',
    paused: 'Pausée'
  }
  return labels[status] || status
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#43A047'
  if (progress >= 50) return '#FFA726'
  return '#4D869C'
}
</script>

<style lang="scss" scoped>
.advertiser-dashboard {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;

      &.campaigns {
        background: linear-gradient(135deg, #4D869C, #7AB2B2);
      }

      &.active {
        background: linear-gradient(135deg, #43A047, #66BB6A);
      }

      &.views {
        background: linear-gradient(135deg, #FFA726, #FFB74D);
      }

      &.spent {
        background: linear-gradient(135deg, #E91E63, #F06292);
      }
    }

    .stat-content {
      h3 {
        font-size: 28px;
        font-weight: bold;
        color: var(--dark-grey);
        margin: 0 0 4px 0;
      }

      p {
        color: var(--dark-grey);
        opacity: 0.7;
        margin: 0;
        font-size: 14px;
      }
    }
  }

  .quick-actions {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-grey);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-btn {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
  }

  .recent-campaigns {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--dark-grey);
      }
    }

    .campaigns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .campaign-card {
      border: 1px solid var(--light-grey);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .campaign-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--dark-grey);
        }
      }

      .campaign-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;

        .stat {
          text-align: center;

          .label {
            display: block;
            font-size: 12px;
            color: var(--dark-grey);
            opacity: 0.7;
            margin-bottom: 4px;
          }

          .value {
            display: block;
            font-size: 16px;
            font-weight: 600;
            color: var(--dark-grey);
          }
        }
      }

      .campaign-progress {
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
          color: var(--dark-grey);
        }
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .advertiser-dashboard {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions .actions-grid {
      grid-template-columns: 1fr;
    }

    .recent-campaigns .campaigns-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 