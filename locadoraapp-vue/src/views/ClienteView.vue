<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const clientes = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  nome: '',
  cpf: '',
  dataNascimento: '',
  ativo: true
});

async function fetchClientes() {
  try {
    const response = await api.get('/clientes/');
    clientes.value = response.data;
  } catch (error) {
    errorMessage.value = 'Nao foi possivel carregar a lista de clientes.';
  }
}

async function handleCreate() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/clientes/', formData.value);
    successMessage.value = 'Cliente cadastrado com sucesso.';
    formData.value = { nome: '', cpf: '', dataNascimento: '', ativo: true };
    fetchClientes();
  } catch (error) {
    errorMessage.value = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'Ocorreu um erro ao cadastrar o cliente.';
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/clientes/${id}/`);
    fetchClientes();
  } catch (error) {
    errorMessage.value = 'Nao foi possivel excluir o cliente.';
  }
}

onMounted(() => {
  fetchClientes();
});
</script>

<template>
  <div class="container">
    <h2>Gerenciar Clientes</h2>

    <div class="content-layout">
      <div class="form-section">
        <h3>Cadastrar Cliente</h3>
        <form @submit.prevent="handleCreate" class="simple-form">
          <div class="form-group">
            <label>Nome</label>
            <input v-model="formData.nome" type="text" required />
          </div>
          <div class="form-group">
            <label>CPF</label>
            <input v-model="formData.cpf" type="text" required />
          </div>
          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="formData.dataNascimento" type="date" required />
          </div>
          <div class="form-group-check">
            <label><input v-model="formData.ativo" type="checkbox" /> Ativo</label>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <button type="submit" class="btn">Salvar</button>
        </form>
      </div>

      <div class="list-section">
        <h3>Lista de Clientes</h3>
        <p v-if="clientes.length === 0" class="no-data">Nenhum cliente cadastrado.</p>
        <table v-else class="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Nascimento</th>
              <th>Ativo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in clientes" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td>{{ item.cpf }}</td>
              <td>{{ item.dataNascimento }}</td>
              <td>{{ item.ativo ? 'Sim' : 'Nao' }}</td>
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
