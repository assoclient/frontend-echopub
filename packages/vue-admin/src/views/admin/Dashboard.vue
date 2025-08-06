<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <!-- <h1>Tableau de bord</h1> -->
      <p>Vue d'ensemble de la plateforme</p>
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.users?.total || 0 }}</h3>
          <p>Utilisateurs totaux</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon campaigns">
          <el-icon><Promotion /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.campaigns?.active || 0 }}</h3>
          <p>Campagnes actives</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon ambassadors">
          <el-icon><Avatar /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ stats.users?.ambassadors || 0 }}</h3>
          <p>Ambassadeurs</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatMoney(stats.revenue?.total || 0) }}</h3>
          <p>Revenus totaux</p>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Campagnes par statut</h3>
        <div class="chart-container">
          <canvas ref="campaignStatusChart"></canvas>
        </div>
      </div>

      <div class="chart-card">
        <h3>Revenus mensuels</h3>
        <div class="chart-container">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Activité récente -->
    <div class="recent-activity">
      <div class="activity-header">
        <h3>Activité récente</h3>
        <el-button 
          v-if="stats.activities?.length > 0" 
          size="small" 
          @click="markAllAsRead"
          :loading="markingAllAsRead"
        >
          Marquer tout comme lu
        </el-button>
      </div>
      <div class="activity-list">
        <div 
          v-for="activity in stats.activities" 
          :key="activity._id"
          class="activity-item"
          :class="{ 'unread': !activity.isRead }"
          @click="markAsRead(activity._id)"
        >
          <div class="activity-icon">
            <el-icon><component :is="getActivityIcon(activity.type)" /></el-icon>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.title }}</p>
            <span class="activity-time">{{ formatTime(activity.createdAt) }}</span>
          </div>
        </div>
        <div v-if="!stats.activities?.length" class="no-activities">
          <el-empty description="Aucune activité récente" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { User, Promotion, Avatar, Money, Plus, Check, Warning, Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Chart from 'chart.js/auto'
import { dashboardService } from '@/services/api'

const stats = reactive({
  users: {},
  campaigns: {},
  revenue: {},
  activities: []
})

const loading = ref(false)
const markingAllAsRead = ref(false)

// Icônes pour les différents types d'activités
const getActivityIcon = (type) => {
  const icons = {
    campaign_created: 'Plus',
    campaign_approved: 'Check',
    campaign_rejected: 'Warning',
    payment_received: 'Money',
    user_registered: 'User',
    ambassador_joined: 'Avatar',
    campaign_completed: 'Check',
    campaign_paused: 'Warning'
  }
  return icons[type] || 'Bell'
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatTime = (time) => {
  const now = new Date()
  const activityTime = new Date(time)
  const diff = now - activityTime
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `Il y a ${minutes} min`
  } else if (hours < 24) {
    return `Il y a ${hours}h`
  } else if (days < 7) {
    return `Il y a ${days}j`
  } else {
    return activityTime.toLocaleDateString('fr-FR')
  }
}

const loadDashboardStats = async () => {
  try {
    loading.value = true
    const response = await dashboardService.getDashboardStats()
    
    // Mettre à jour les statistiques
    Object.assign(stats, response.data)
    
    // Mettre à jour les graphiques après le chargement des données
    setTimeout(() => {
      updateCharts()
    }, 100)
    
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    ElMessage.error('Erreur lors du chargement des statistiques')
  } finally {
    loading.value = false
  }
}

const markAsRead = async (activityId) => {
  try {
    await dashboardService.markActivityAsRead(activityId)
    // Mettre à jour l'état local
    const activity = stats.activities.find(a => a._id === activityId)
    if (activity) {
      activity.isRead = true
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error)
    ElMessage.error('Erreur lors de la mise à jour de l\'activité')
  }
}

const markAllAsRead = async () => {
  try {
    markingAllAsRead.value = true
    await dashboardService.markAllActivitiesAsRead()
    
    // Mettre à jour l'état local
    stats.activities.forEach(activity => {
      activity.isRead = true
    })
    
    ElMessage.success('Toutes les activités ont été marquées comme lues')
  } catch (error) {
    console.error('Erreur lors de la mise à jour des activités:', error)
    ElMessage.error('Erreur lors de la mise à jour des activités')
  } finally {
    markingAllAsRead.value = false
  }
}

const updateCharts = () => {
  // Graphique des statuts de campagnes
  const campaignCtx = document.getElementById('campaignStatusChart')
  if (campaignCtx && stats.campaigns?.byStatus) {
    new Chart(campaignCtx, {
      type: 'doughnut',
      data: {
        labels: ['Actives', 'En attente', 'Terminées', 'Pausées'],
        datasets: [{
          data: [
            stats.campaigns.active || 0,
            stats.campaigns.pending || 0,
            stats.campaigns.completed || 0,
            stats.campaigns.paused || 0
          ],
          backgroundColor: [
            '#4D869C',
            '#FFA726',
            '#43A047',
            '#E0E0E0'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }

  // Graphique des revenus
  const revenueCtx = document.getElementById('revenueChart')
  if (revenueCtx && stats.revenue?.monthlyData) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
    const revenueData = stats.revenue.monthlyData.map(item => item.total || 0)
    
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenus (FCFA)',
          data: revenueData,
          borderColor: '#4D869C',
          backgroundColor: 'rgba(77, 134, 156, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}

onMounted(() => {
  loadDashboardStats()
})
</script>

<style lang="scss" scoped>
.admin-dashboard {
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

      &.users {
        background: linear-gradient(135deg, #4D869C, #7AB2B2);
      }

      &.campaigns {
        background: linear-gradient(135deg, #FFA726, #FFB74D);
      }

      &.ambassadors {
        background: linear-gradient(135deg, #43A047, #66BB6A);
      }

      &.revenue {
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

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .chart-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-grey);
    }

    .chart-container {
      height: 300px;
      position: relative;
    }
  }

  .recent-activity {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--dark-grey);
      }
    }

    .activity-list {
      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--light-grey);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &.unread {
          background-color: var(--soft-yellow);
          border-left: 4px solid var(--primary-yellow);
        }

        &:hover {
          background-color: var(--light-grey);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--soft-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-blue);
        }

        .activity-content {
          flex: 1;

          .activity-text {
            margin: 0 0 4px 0;
            color: var(--dark-grey);
            font-size: 14px;
          }

          .activity-time {
            color: var(--dark-grey);
            opacity: 0.6;
            font-size: 12px;
          }
        }
      }
    }

    .no-activities {
      padding: 20px;
      text-align: center;
      color: var(--dark-grey);
      opacity: 0.7;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .admin-dashboard {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 