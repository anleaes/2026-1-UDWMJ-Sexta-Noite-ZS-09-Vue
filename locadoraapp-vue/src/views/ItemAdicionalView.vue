<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const itensAdicionais = ref([]);
const reservas = ref([]);
const adicionais = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  reserva: '',
  adicional: '',
  quantidade: ''
});

async function fetchItensAdicionais() {
  try {
    const response = await api.get('/itens-adicionais/');
    itensAdicionais.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de itens adicionais.';
  }
}

async function fetchReservas() {
  try {
    const response = await api.get('/reservas/');
    reservas.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de reservas.';
  }
}

async function fetchAdicionais() {
  try {
    const response = await api.get('/adicionais/');
    adicionais.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de adicionais.';
  }
}

function nomeAdicional(id) {
  const a = adicionais.value.find(a => a.id === id);
  return a ? a.descricao : id;
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/itens-adicionais/', formData.value);
    successMessage.value = 'Item adicional cadastrado com sucesso.';
    formData.value = { reserva: '', adicional: '', quantidade: '' };
    fetchItensAdicionais();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar o item adicional.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/itens-adicionais/${id}/`);
    fetchItensAdicionais();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir o item adicional.';
  }
}

onMounted(() => {
  fetchItensAdicionais();
  fetchReservas();
  fetchAdicionais();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Itens Adicionais</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Item Adicional</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Reserva</label>
            <select v-model="formData.reserva" required>
              <option value="" disabled>Selecione</option>
              <option v-for="r in reservas" :key="r.id" :value="r.id">Reserva #{{ r.id }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Adicional</label>
            <select v-model="formData.adicional" required>
              <option value="" disabled>Selecione</option>
              <option v-for="a in adicionais" :key="a.id" :value="a.id">{{ a.descricao }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantidade</label>
            <input v-model="formData.quantidade" type="number" required min="1" />
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Itens Adicionais</h3>
        <p v-if="itensAdicionais.length === 0" class="no-data">Nenhum item adicional cadastrado.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reserva</th>
              <th>Adicional</th>
              <th>Quantidade</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itensAdicionais" :key="item.id">
              <td>{{ item.id }}</td>
              <td>Reserva #{{ item.reserva }}</td>
              <td>{{ nomeAdicional(item.adicional) }}</td>
              <td>{{ item.quantidade }}</td>
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
.form-group input, .form-group select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
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
