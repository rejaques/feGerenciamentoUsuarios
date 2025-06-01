// src/components/Adm.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './components/Adm.css'; 

function Adm() {
  const navigate = useNavigate();

  // Função para navegar para a tela de alterar dados
  const handleNavigateToAlterarDados = () => {
    navigate('/alterarDados');
  };

  const handleNavigateToFutureScreen = () => {
    navigate('/cadastroFuncionario');
  };

  return (
    <div className="admin-panel-container">
      <h2>Painel Administrativo</h2>
      <div className="admin-buttons-group">
        <button
          onClick={handleNavigateToAlterarDados}
          className="admin-button" 
        >
          Alterar Meus Dados
        </button>
        <button
          onClick={handleNavigateToFutureScreen}
          className="admin-button" 
        >
          Cadastrar novo funcionario 
        </button>
      </div>
    </div>
  );
}

export default Adm;