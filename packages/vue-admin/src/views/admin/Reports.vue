<template>
  <div class="reports-page">
    <div class="page-header">
      <p>Rapports et statistiques de la plateforme</p>
    </div>

    <!-- Filtres de période -->
    <div class="filters-section">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-select v-model="periodFilter" @change="updateReports">
            <el-option label="7 derniers jours" value="7" />
            <el-option label="30 derniers jours" value="30" />
            <el-option label="3 derniers mois" value="90" />
            <el-option label="6 derniers mois" value="180" />
            <el-option label="1 an" value="365" />
          </el-select>
        </el-col>
        
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="à"
            start-placeholder="Date début"
            end-placeholder="Date fin"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            @change="updateReports"
          />
        </el-col>
        
        <el-col :span="4">
          <el-button type="primary" @click="exportReport" :loading="exporting">
            <el-icon><Download /></el-icon>
            Exporter
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- Statistiques générales -->
    <div class="stats-grid" v-loading="loading">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalUsers) }}</h3>
          <p>Utilisateurs totaux</p>
          <span class="stat-change positive">+{{ stats.newUsers }} ce mois</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Promotion /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalCampaigns) }}</h3>
          <p>Campagnes créées</p>
          <span class="stat-change positive">+{{ stats.activeCampaigns }} actives</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatMoney(stats.totalRevenue) }}</h3>
          <p>Revenus totaux</p>
          <span class="stat-change positive">+{{ formatMoney(stats.monthlyRevenue) }} ce mois</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalViews) }}</h3>
          <p>Vues totales</p>
          <span class="stat-change positive">+{{ formatNumber(stats.monthlyViews) }} ce mois</span>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="charts-grid">
      <!-- Graphique des revenus -->
      <div class="card">
        <h3>Évolution des revenus</h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon><TrendCharts /></el-icon>
            <p>Graphique des revenus</p>
            <small>Intégration avec une librairie de graphiques (Chart.js, ECharts, etc.)</small>
          </div>
        </div>
      </div>

      <!-- Graphique des campagnes -->
      <div class="card">
        <h3>Campagnes par statut</h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon><PieChart /></el-icon>
            <p>Répartition des campagnes</p>
            <small>Graphique en secteurs</small>
          </div>
        </div>
      </div>

      <!-- Graphique des utilisateurs -->
      <div class="card">
        <h3>Nouveaux utilisateurs</h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon><User /></el-icon>
            <p>Évolution des inscriptions</p>
            <small>Graphique linéaire</small>
          </div>
        </div>
      </div>

      <!-- Graphique des performances -->
      <div class="card">
        <h3>Performance des campagnes</h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <el-icon><DataAnalysis /></el-icon>
            <p>CTR et conversions</p>
            <small>Graphique en barres</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableaux détaillés -->
    <div class="tables-grid">
      <!-- Top annonceurs -->
      <div class="card">
        <h3>Top 10 des annonceurs</h3>
        <el-table :data="topAdvertisers" style="width: 100%" v-loading="loading">
          <el-table-column prop="rank" label="Rang" width="60" />
          <el-table-column prop="name" label="Annonceur" />
          <el-table-column prop="campaigns" label="Campagnes" />
          <el-table-column prop="spent" label="Dépensé">
            <template #default="scope">
              {{ formatMoney(scope.row.spent) }}
            </template>
          </el-table-column>
          <el-table-column prop="views" label="Vues" />
        </el-table>
      </div>

      <!-- Top ambassadeurs -->
      <div class="card">
        <h3>Top 10 des ambassadeurs</h3>
        <el-table :data="topAmbassadors" style="width: 100%" v-loading="loading">
          <el-table-column prop="rank" label="Rang" width="60" />
          <el-table-column prop="name" label="Ambassadeur" />
          <el-table-column prop="publications" label="Publications" />
          <el-table-column prop="earnings" label="Gains">
            <template #default="scope">
              {{ formatMoney(scope.row.earnings) }}
            </template>
          </el-table-column>
          <el-table-column prop="clicks" label="Clics" />
        </el-table>
      </div>
    </div>

    <!-- Rapports détaillés -->
    <div class="detailed-reports">
      <div class="card">
        <h3>Rapport détaillé</h3>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Utilisateurs" name="users">
            <div class="report-content">
              <h4>Statistiques utilisateurs</h4>
              <el-row :gutter="16">
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Nouveaux utilisateurs</span>
                    <span class="value">{{ formatNumber(stats.newUsers) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Utilisateurs actifs</span>
                    <span class="value">{{ formatNumber(stats.activeUsers) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Taux de rétention</span>
                    <span class="value">{{ stats.retentionRate }}%</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Campagnes" name="campaigns">
            <div class="report-content">
              <h4>Statistiques campagnes</h4>
              <el-row :gutter="16">
                <el-col :span="6">
                  <div class="metric">
                    <span class="label">Campagnes créées</span>
                    <span class="value">{{ formatNumber(stats.totalCampaigns) }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="metric">
                    <span class="label">Campagnes actives</span>
                    <span class="value">{{ formatNumber(stats.activeCampaigns) }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="metric">
                    <span class="label">Taux de conversion</span>
                    <span class="value">{{ stats.conversionRate }}%</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="metric">
                    <span class="label">CTR moyen</span>
                    <span class="value">{{ stats.averageCTR }}%</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Financier" name="financial">
            <div class="report-content">
              <h4>Statistiques financières</h4>
              <el-row :gutter="16">
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Revenus totaux</span>
                    <span class="value">{{ formatMoney(stats.totalRevenue) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Commission plateforme</span>
                    <span class="value">{{ formatMoney(stats.platformCommission) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="metric">
                    <span class="label">Paiements ambassadeurs</span>
                    <span class="value">{{ formatMoney(stats.ambassadorPayments) }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  User, 
  Promotion, 
  Money, 
  View, 
  Download, 
  TrendCharts, 
  PieChart, 
  DataAnalysis 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { dashboardService } from '@/services/api'

const loading = ref(false)
const exporting = ref(false)
const periodFilter = ref('30')
const dateRange = ref([])
const activeTab = ref('users')

// Statistiques
const stats = reactive({
  totalUsers: 0,
  newUsers: 0,
  totalCampaigns: 0,
  activeCampaigns: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  totalViews: 0,
  monthlyViews: 0,
  activeUsers: 0,
  retentionRate: 0,
  conversionRate: 0,
  averageCTR: 0,
  platformCommission: 0,
  ambassadorPayments: 0
})

// Top annonceurs
const topAdvertisers = ref([])

// Top ambassadeurs
const topAmbassadors = ref([])

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const loadReports = async () => {
  try {
    loading.value = true
    
    const params = {
      period: periodFilter.value
    }
    
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    
    const response = await dashboardService.getDetailedReports(params)
    
    if (response.success) {
      const data = response.data
      
      // Mettre à jour les statistiques
      Object.assign(stats, data.stats)
      
      // Mettre à jour les top performers
      topAdvertisers.value = data.topAdvertisers || []
      topAmbassadors.value = data.topAmbassadors || []
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des rapports:', error)
    ElMessage.error('Erreur lors du chargement des rapports')
  } finally {
    loading.value = false
  }
}

const updateReports = () => {
  loadReports()
}

const exportReport = async () => {
  try {
    exporting.value = true
    
    // Simuler l'export (ici on pourrait appeler un endpoint d'export)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('Rapport exporté avec succès')
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    ElMessage.error('Erreur lors de l\'export du rapport')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  loadReports()
})
</script>

<style lang="scss" scoped>
.reports-page {
  .filters-section {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--light-grey);
    border-radius: 8px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary-blue), #4a90e2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }

      .stat-content {
        flex: 1;

        h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: var(--dark-grey);
        }

        p {
          margin: 0 0 8px 0;
          color: var(--dark-grey);
          opacity: 0.7;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;

          &.positive {
            color: #52c41a;
          }

          &.negative {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      .chart-placeholder {
        text-align: center;
        color: var(--dark-grey);
        opacity: 0.6;

        .el-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        p {
          margin: 8px 0;
          font-weight: 600;
        }

        small {
          opacity: 0.7;
        }
      }
    }
  }

  .tables-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .detailed-reports {
    .report-content {
      padding: 20px 0;

      h4 {
        margin-bottom: 20px;
        color: var(--dark-grey);
        font-weight: 600;
      }

      .metric {
        background: var(--light-grey);
        padding: 16px;
        border-radius: 8px;
        text-align: center;

        .label {
          display: block;
          font-size: 14px;
          color: var(--dark-grey);
          opacity: 0.7;
          margin-bottom: 8px;
        }

        .value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-blue);
        }
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .reports-page {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .charts-grid {
      grid-template-columns: 1fr;
    }

    .tables-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 