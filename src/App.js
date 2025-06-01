import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login.js';
import CadastroUsuario from './CadastroUsuario.js';
import AlterarDados from './AlterarDados.js'
import Adm from './Adm.js'
import CadastroFuncionario from './CadastroFuncionario.js'

import './App.css'; 

function App() {
  return (
    <Router> {/* Envolve toda a aplicação com o Router */}
      <div>
        {}

        <Routes> {/* Define a área onde as rotas serão trocadas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/alterarDados" element={<AlterarDados />} />
          <Route path="/adm" element={<Adm />} />
          <Route path="/cadastroFuncionario" element={<CadastroFuncionario />} />

          {/* Rota Padrão: Redireciona para /login se nenhuma outra rota corresponder */}
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
