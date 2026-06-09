<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const manutencoes = ref([]);
const veiculos = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  dataManutencao: '',
  descricao: '',
  custo: '',
  status: 'EM_ANDAMENTO',
  veiculo: ''
});

async function fetchManutencoes() {
  try {
    const response = await api.get('/manutencoes/');
    manutencoes.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de manutencoes.';
  }
}

async function fetchVeiculos() {
  try {
    const response = await api.get('/veiculos/');
    veiculos.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de veiculos.';
  }
}

function nomeVeiculo(id) {
  const v = veiculos.value.find(v => v.id === id);
  return v ? v.modelo : id;
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/manutencoes/', formData.value);
    successMessage.value = 'Manutencao cadastrada com sucesso.';
    formData.value = { dataManutencao: '', descricao: '', custo: '', status: 'EM_ANDAMENTO', veiculo: '' };
    fetchManutencoes();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar a manutencao.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/manutencoes/${id}/`);
    fetchManutencoes();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir a manutencao.';
  }
}

onMounted(() => {
  fetchManutencoes();
  fetchVeiculos();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Manutencoes</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Manutencao</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Data da Manutencao</label>
            <input v-model="formData.dataManutencao" type="date" required />
          </div>
          <div class="form-group">
            <label>Descricao</label>
            <input v-model="formData.descricao" type="text" required />
          </div>
          <div class="form-group">
            <label>Custo</label>
            <input v-model="formData.custo" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status" required>
              <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
              <option value="CONCLUIDA">CONCLUIDA</option>
            </select>
          </div>
          <div class="form-group">
            <label>Veiculo</label>
            <select v-model="formData.veiculo" required>
              <option value="" disabled>Selecione</option>
              <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.modelo }} (#{{ v.id }})</option>
            </select>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Manutencoes</h3>
        <p v-if="manutencoes.length === 0" class="no-data">Nenhuma manutencao cadastrada.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Descricao</th>
              <th>Custo</th>
              <th>Status</th>
              <th>Veiculo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in manutencoes" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.dataManutencao }}</td>
              <td>{{ item.descricao }}</td>
              <td>{{ item.custo }}</td>
              <td>{{ item.status }}</td>
              <td>{{ nomeVeiculo(item.veiculo) }}</td>
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
