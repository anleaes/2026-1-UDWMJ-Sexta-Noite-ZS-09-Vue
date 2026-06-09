<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const pagamentos = ref([]);
const reservas = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  dataPagamento: '',
  valor: '',
  metodoPagamento: '',
  status: 'PENDENTE',
  reserva: ''
});

async function fetchPagamentos() {
  try {
    const response = await api.get('/pagamentos/');
    pagamentos.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de pagamentos.';
  }
}

async function fetchReservas() {
  reservas.value = (await api.get('/reservas/')).data;
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/pagamentos/', formData.value);
    successMessage.value = 'Pagamento cadastrado com sucesso.';
    formData.value = { dataPagamento: '', valor: '', metodoPagamento: '', status: 'PENDENTE', reserva: '' };
    fetchPagamentos();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar o pagamento.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/pagamentos/${id}/`);
    fetchPagamentos();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir o pagamento.';
  }
}

onMounted(() => {
  fetchPagamentos();
  fetchReservas();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Pagamentos</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Pagamento</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Data do Pagamento</label>
            <input v-model="formData.dataPagamento" type="date" />
          </div>
          <div class="form-group">
            <label>Valor</label>
            <input v-model="formData.valor" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Metodo de Pagamento</label>
            <input v-model="formData.metodoPagamento" type="text" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status" required>
              <option value="PENDENTE">PENDENTE</option>
              <option value="PAGO">PAGO</option>
              <option value="ESTORNADO">ESTORNADO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Reserva</label>
            <select v-model="formData.reserva" required>
              <option value="" disabled>Selecione</option>
              <option v-for="r in reservas" :key="r.id" :value="r.id">Reserva #{{ r.id }} ({{ r.status }})</option>
            </select>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Pagamentos</h3>
        <p v-if="pagamentos.length === 0" class="no-data">Nenhum pagamento cadastrado.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Metodo</th>
              <th>Status</th>
              <th>Reserva</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagamentos" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.dataPagamento }}</td>
              <td>{{ item.valor }}</td>
              <td>{{ item.metodoPagamento }}</td>
              <td>{{ item.status }}</td>
              <td>#{{ item.reserva }}</td>
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
