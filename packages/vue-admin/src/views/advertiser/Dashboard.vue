<template>
  <div class="advertiser-dashboard">
    <div class="page-header">
   <!--    <h1>Tableau de bord</h1>
      <p>Vue d'ensemble de vos campagnes</p> -->
    </div>

    <!-- Statistiques -->
    <div class="stats-grid" v-loading="loading">
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
        <div class="stat-icon ambassadors">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalAmbassadors }}</h3>
          <p>Ambassadeurs impliqués</p>
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

    <!-- Top 5 Annonces Virales -->
    <div class="viral-ads">
      <div class="section-header">
        <h3>Top 5 Annonces les Plus Virales</h3>
        <el-button 
          type="text"
          @click="$router.push('/advertiser/campaigns')"
        >
          Voir toutes
        </el-button>
      </div>
      
      <div class="viral-ads-grid" v-loading="loading">
        <div 
          v-for="(ad, index) in topViralAds" 
          :key="ad._id"
          class="viral-ad-card"
        >
          <div class="ad-rank">
            <span class="rank-number">{{ index + 1 }}</span>
          </div>
          
          <div class="ad-content">
            <div class="ad-header">
              <h4>{{ ad.title }}</h4>
              <el-tag :type="getStatusType(ad.status)" size="small">
                {{ getStatusLabel(ad.status) }}
              </el-tag>
            </div>
            
            <div class="ad-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ formatNumber(ad.totalViews) }} vues</span>
              </div>
              <div class="stat-item">
                <el-icon><Pointer /></el-icon>
                <span>{{ formatNumber(ad.totalClicks) }} clics</span>
              </div>
              <div class="stat-item">
                <el-icon><User /></el-icon>
                <span>{{ ad.ambassadorCount }} ambassadeurs</span>
              </div>
            </div>
            
            <div class="ad-performance">
              <div class="performance-bar">
                <div class="bar-label">Taux d'engagement</div>
                <div class="bar-container">
                  <div 
                    class="bar-fill" 
                    :style="{ width: ad.engagementRate + '%', backgroundColor: getEngagementColor(ad.engagementRate) }"
                  ></div>
                </div>
                <span class="bar-value">{{ ad.engagementRate }}%</span>
              </div>
            </div>
          </div>
        </div>
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
      
      <div class="campaigns-grid" v-loading="loading">
        <div 
          v-for="campaign in recentCampaigns" 
          :key="campaign._id"
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
import { ref, reactive, onMounted } from 'vue'
import { 
  Promotion, 
  Check, 
  View, 
  Money, 
  Plus, 
  User,
  Pointer
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { dashboardService } from '@/services/api'

const loading = ref(false)
const stats = reactive({
  totalCampaigns: 0,
  activeCampaigns: 0,
  totalAmbassadors: 0,
  totalViews: 0,
  totalSpent: 0
})

const topViralAds = ref([])
const recentCampaigns = ref([])

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

const getProgressColor = (progress) => {
  if (progress >= 80) return '#43A047'
  if (progress >= 50) return '#FFA726'
  return '#4D869C'
}

const getEngagementColor = (rate) => {
  if (rate >= 90) return '#43A047'
  if (rate >= 80) return '#66BB6A'
  if (rate >= 70) return '#FFA726'
  if (rate >= 60) return '#FF7043'
  return '#E57373'
}

const loadDashboardData = async () => {
  try {
    loading.value = true
    const response = await dashboardService.getAdvertiserDashboardStats()
    
    if (response.success) {
      const data = response.data
      
      // Mettre à jour les statistiques
      Object.assign(stats, data.stats)
      
      // Mettre à jour les campagnes virales
      topViralAds.value = data.topViralAds || []
      
      // Mettre à jour les campagnes récentes
      recentCampaigns.value = data.recentCampaigns || []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données du dashboard:', error)
    ElMessage.error('Erreur lors du chargement des données du dashboard')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
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

      &.ambassadors {
        background: linear-gradient(135deg, #9C27B0, #BA68C8);
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

  .viral-ads {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
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

    .viral-ads-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .viral-ad-card {
      border: 1px solid var(--light-grey);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      gap: 16px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .ad-rank {
        .rank-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }
      }

      .ad-content {
        flex: 1;

        .ad-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;

          h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--dark-grey);
            flex: 1;
            margin-right: 12px;
          }
        }

        .ad-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: var(--dark-grey);

            .el-icon {
              font-size: 16px;
              color: var(--primary-blue);
            }
          }
        }

        .ad-performance {
          .performance-bar {
            display: flex;
            align-items: center;
            gap: 12px;

            .bar-label {
              font-size: 12px;
              color: var(--dark-grey);
              opacity: 0.7;
              min-width: 80px;
            }

            .bar-container {
              flex: 1;
              height: 8px;
              background: var(--light-grey);
              border-radius: 4px;
              overflow: hidden;

              .bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
              }
            }

            .bar-value {
              font-size: 12px;
              font-weight: 600;
              color: var(--dark-grey);
              min-width: 30px;
            }
          }
        }
      }
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

    .viral-ads .viral-ads-grid {
      grid-template-columns: 1fr;
    }

    .recent-campaigns .campaigns-grid {
      grid-template-columns: 1fr;
    }

    .viral-ad-card {
      flex-direction: column;
      gap: 12px;

      .ad-rank {
        align-self: center;
      }
    }
  }
}
</style> 