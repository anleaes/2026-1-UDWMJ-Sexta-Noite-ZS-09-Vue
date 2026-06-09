<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const carteiras = ref([]);
const clientes = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  numeroRegistro: '',
  categoria: '',
  dataValidade: '',
  cliente: ''
});

async function fetchCarteiras() {
  try {
    const response = await api.get('/carteiras-motorista/');
    carteiras.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de carteiras.';
  }
}

async function fetchClientes() {
  const response = await api.get('/clientes/');
  clientes.value = response.data;
}

function nomeCliente(id) {
  const c = clientes.value.find(c => c.id === id);
  return c ? c.nome : id;
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/carteiras-motorista/', formData.value);
    successMessage.value = 'Carteira cadastrada com sucesso.';
    formData.value = { numeroRegistro: '', categoria: '', dataValidade: '', cliente: '' };
    fetchCarteiras();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar a carteira.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/carteiras-motorista/${id}/`);
    fetchCarteiras();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir a carteira.';
  }
}

onMounted(() => {
  fetchCarteiras();
  fetchClientes();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Carteiras</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Carteira</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Numero de Registro</label>
            <input v-model="formData.numeroRegistro" type="text" required />
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <input v-model="formData.categoria" type="text" required />
          </div>
          <div class="form-group">
            <label>Data de Validade</label>
            <input v-model="formData.dataValidade" type="date" required />
          </div>
          <div class="form-group">
            <label>Cliente</label>
            <select v-model="formData.cliente" required>
              <option value="" disabled>Selecione</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }} (#{{ c.id }})</option>
            </select>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Carteiras</h3>
        <p v-if="carteiras.length === 0" class="no-data">Nenhuma carteira cadastrada.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numero</th>
              <th>Categoria</th>
              <th>Validade</th>
              <th>Cliente</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in carteiras" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.numeroRegistro }}</td>
              <td>{{ item.categoria }}</td>
              <td>{{ item.dataValidade }}</td>
              <td>{{ nomeCliente(item.cliente) }}</td>
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
