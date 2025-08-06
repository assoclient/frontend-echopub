<template>
  <div class="transactions-page">
    <div class="page-header">
      <h1>Transactions</h1>
      <p>Historique des transactions de la plateforme</p>
    </div>

    <div class="card">
      <el-table :data="transactions" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user" label="Utilisateur" />
        <el-table-column prop="type" label="Type">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Montant">
          <template #default="scope">
            {{ formatMoney(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Statut">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Date">
          <template #default="scope">
            {{ formatDate(scope.row.date) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const transactions = ref([
  {
    id: 1,
    user: 'John Doe',
    type: 'deposit',
    amount: 50000,
    status: 'completed',
    date: new Date()
  },
  {
    id: 2,
    user: 'Jane Smith',
    type: 'withdrawal',
    amount: 25000,
    status: 'pending',
    date: new Date(Date.now() - 86400000)
  }
])

const getTypeColor = (type) => {
  return type === 'deposit' ? 'success' : 'warning'
}

const getTypeLabel = (type) => {
  return type === 'deposit' ? 'Dépôt' : 'Retrait'
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'Terminé',
    pending: 'En attente',
    failed: 'Échoué'
  }
  return labels[status] || status
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}
</script> 