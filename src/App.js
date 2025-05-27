import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login.js';
import CadastroUsuario from './CadastroUsuario.js';
import AlterarDados from './AlterarDados.js'
import Adm from './Adm.js'
import CadastroFuncionario from './CadastroFuncionario.js'

import './App.css'; // Se você tiver um App.css para estilos globais

function App() {
  return (
    <Router> {/* Envolve toda a aplicação com o Router */}
      <div>
        {/* Você pode ter um Navbar fixo aqui se desejar no futuro }
        { <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/cadastro">Cadastro</Link></li>
          </ul>
        </nav> */}

        <Routes> {/* Define a área onde as rotas serão trocadas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/alterarDados" element={<AlterarDados />} />
          <Route path="/adm" element={<Adm />} />
          <Route path="/cadastroFuncionario" element={<CadastroFuncionario />} />

          {/* Rota Padrão: Redireciona para /login se nenhuma outra rota corresponder */}
          {/* Pode ser também <Route path="/" element={<Login />} /> se quiser que / seja o login */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* Exemplo de uma rota para uma página após o login (você precisará criar o componente Home) */}
          {/* <Route path="/home" element={<Home />} /> */}

          {/* Adicione outras rotas aqui conforme necessário */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
