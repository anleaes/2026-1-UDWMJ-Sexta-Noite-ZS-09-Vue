<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const seguros = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  franquia: '',
  valorDiaria: '',
  descricao: ''
});

async function fetchSeguros() {
  try {
    const response = await api.get('/seguros/');
    seguros.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de seguros.';
  }
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/seguros/', formData.value);
    successMessage.value = 'Seguro cadastrado com sucesso.';
    formData.value = { franquia: '', valorDiaria: '', descricao: '' };
    fetchSeguros();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar o seguro.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/seguros/${id}/`);
    fetchSeguros();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir o seguro.';
  }
}

onMounted(() => {
  fetchSeguros();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Seguros</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Seguro</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Franquia</label>
            <input v-model="formData.franquia" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Valor da Diaria</label>
            <input v-model="formData.valorDiaria" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Descricao</label>
            <input v-model="formData.descricao" type="text" />
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Seguros</h3>
        <p v-if="seguros.length === 0" class="no-data">Nenhum seguro cadastrado.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Franquia</th>
              <th>Valor da Diaria</th>
              <th>Descricao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in seguros" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.franquia }}</td>
              <td>{{ item.valorDiaria }}</td>
              <td>{{ item.descricao }}</td>
              <td><button class="btn-del" @click="handleDelete(item.id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { padding: 20px; font-family: Arial, sans-serif; }
.content-layout { display: flex; gap: 40px; margin-top: 20px; flex-wrap: wrap; }
.form-section { flex: 1; min-width: 300px; border: 1px solid #ccc; padding: 20px; border-radius: 6px; background-color: #f9f9f9; }
.list-section { flex: 2; min-width: 400px; }
.simple-form { display: flex; flex-direction: column; }
.form-group { margin-bottom: 12px; display: flex; flex-direction: column; }
.form-group label { margin-bottom: 4px; font-weight: bold; }
.form-group input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.btn { padding: 10px; background-color: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn:hover { background-color: #1f2d3a; }
.btn-del { background-color: #c0392b; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; }
.error { color: red; font-size: 14px; }
.success { color: green; font-size: 14px; }
.simple-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.simple-table th, .simple-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
.simple-table th { background-color: #f2f2f2; }
.no-data { color: #666; font-style: italic; }
</style>
