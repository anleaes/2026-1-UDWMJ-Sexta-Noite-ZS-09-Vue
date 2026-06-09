<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const veiculos = ref([]);
const agencias = ref([]);
const categorias = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  placa: '',
  modelo: '',
  ano: '',
  valorDiaria: '',
  ipvaPago: false,
  disponivel: true,
  agencia: '',
  categoria: ''
});

async function fetchVeiculos() {
  try {
    const response = await api.get('/veiculos/');
    veiculos.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de veiculos.';
  }
}

async function fetchListas() {
  const agResp = await api.get('/agencias/');
  agencias.value = agResp.data;
  const catResp = await api.get('/categorias-veiculo/');
  categorias.value = catResp.data;
}

function nomeAgencia(id) {
  const a = agencias.value.find(a => a.id === id);
  return a ? a.nome : id;
}

function nomeCategoria(id) {
  const c = categorias.value.find(c => c.id === id);
  return c ? c.nome : id;
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/veiculos/', formData.value);
    successMessage.value = 'Veiculo cadastrado com sucesso.';
    formData.value = { placa: '', modelo: '', ano: '', valorDiaria: '', ipvaPago: false, disponivel: true, agencia: '', categoria: '' };
    fetchVeiculos();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar o veiculo.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/veiculos/${id}/`);
    fetchVeiculos();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir o veiculo.';
  }
}

onMounted(() => {
  fetchVeiculos();
  fetchListas();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Veiculos</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Veiculo</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Placa</label>
            <input v-model="formData.placa" type="text" required />
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <input v-model="formData.modelo" type="text" required />
          </div>
          <div class="form-group">
            <label>Ano</label>
            <input v-model="formData.ano" type="number" required />
          </div>
          <div class="form-group">
            <label>Valor da Diaria</label>
            <input v-model="formData.valorDiaria" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Agencia</label>
            <select v-model="formData.agencia" required>
              <option value="" disabled>Selecione</option>
              <option v-for="a in agencias" :key="a.id" :value="a.id">{{ a.nome }} (#{{ a.id }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="formData.categoria" required>
              <option value="" disabled>Selecione</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }} (#{{ c.id }})</option>
            </select>
          </div>
          <div class="form-group-check">
            <label><input v-model="formData.ipvaPago" type="checkbox" /> IPVA pago</label>
          </div>
          <div class="form-group-check">
            <label><input v-model="formData.disponivel" type="checkbox" /> Disponivel</label>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Veiculos</h3>
        <p v-if="veiculos.length === 0" class="no-data">Nenhum veiculo cadastrado.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Diaria</th>
              <th>Agencia</th>
              <th>Categoria</th>
              <th>Disponivel</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in veiculos" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.placa }}</td>
              <td>{{ item.modelo }}</td>
              <td>{{ item.ano }}</td>
              <td>{{ item.valorDiaria }}</td>
              <td>{{ nomeAgencia(item.agencia) }}</td>
              <td>{{ nomeCategoria(item.categoria) }}</td>
              <td>{{ item.disponivel ? 'Sim' : 'Nao' }}</td>
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
.form-group-check { margin-bottom: 12px; }
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
