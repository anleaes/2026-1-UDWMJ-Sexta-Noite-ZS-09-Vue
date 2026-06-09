<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="logo">Locadora de Veiculos</div>
    <nav class="nav-links">
      <RouterLink to="/" class="nav-item">Inicio</RouterLink>
      <RouterLink to="/agencias" class="nav-item">Agencias</RouterLink>
      <RouterLink to="/categorias" class="nav-item">Categorias</RouterLink>
      <RouterLink to="/veiculos" class="nav-item">Veiculos</RouterLink>
      <RouterLink to="/clientes" class="nav-item">Clientes</RouterLink>
      <RouterLink to="/funcionarios" class="nav-item">Funcionarios</RouterLink>
      <RouterLink to="/carteiras" class="nav-item">Carteiras</RouterLink>
      <RouterLink to="/reservas" class="nav-item">Reservas</RouterLink>
      <RouterLink to="/pagamentos" class="nav-item">Pagamentos</RouterLink>
      <RouterLink to="/multas" class="nav-item">Multas</RouterLink>
      <RouterLink to="/adicionais" class="nav-item">Adicionais</RouterLink>
      <RouterLink to="/seguros" class="nav-item">Seguros</RouterLink>
      <RouterLink to="/manutencoes" class="nav-item">Manutencoes</RouterLink>
      <RouterLink to="/itens-adicionais" class="nav-item">Itens Adicionais</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
body { margin: 0; font-family: Arial, sans-serif; }
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  flex-wrap: wrap;
}
.logo { font-weight: bold; font-size: 18px; }
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}
.nav-item {
  color: white;
  text-decoration: none;
  font-size: 15px;
}
.nav-item:hover {
  text-decoration: underline;
}
</style>
