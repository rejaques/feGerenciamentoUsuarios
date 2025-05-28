// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import './components/Login.css'; // Vamos criar este arquivo CSS
import AvisoPopup from './PopUp';

function Login() {
  const [emailOuLogin, setEmailOuLogin] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook para navegação programática

  // Estado para controlar o pop-up
  const [popupConfig, setPopupConfig] = useState({
    visivel: false,
    mensagem: '',
    titulo: '',
    tipo: 'aviso', // 'aviso', 'sucesso', 'erro'
    onConfirmCallback: null,
  });

  const mostrarPopup = (mensagem, titulo, tipo = 'aviso', onConfirmCallback = null) => {
    setPopupConfig({
      visivel: true,
      mensagem,
      titulo,
      tipo,
      onConfirmCallback,
    });
  };

  const fecharPopup = () => {
    if (popupConfig.onConfirmCallback) {
      popupConfig.onConfirmCallback();
    }
    setPopupConfig({ visivel: false, mensagem: '', titulo: '', tipo: 'aviso', onConfirmCallback: null });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    

  const payload = {
      email: emailOuLogin, 
      senha: senha,
    };
    try {
      const response = await fetch('http://207.211.191.34:8080/gerenciamento-usuarios/api/auth/login', { // Ajuste a URL da sua API de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) { 
        const data = JSON.parse(responseText);
        //alert('Login realizado com sucesso!'); 

        // Salvar no localStorage
        localStorage.setItem('tipoUsuario', data.tipoUsuario);
        localStorage.setItem('idUsuario', data.idUsuario.toString()); // Salva como string

        // Limpar campos do formulário
        setEmailOuLogin('');
        setSenha('');

        mostrarPopup('Login realizado com sucesso!', 'Sucesso!', 'sucesso', () => {
          setTimeout(() => {
            if(data.tipoUsuario === "Cliente") {
              navigate('/alterarDados'); 
            } else {
              navigate('/adm')
            }
          }, 500);} );
        } else { 
        console.error(`Erro no login - Status: ${response.status}, Resposta: ${responseText}`);
        let errorMessage = responseText; 
        try {
          const errorData = JSON.parse(responseText);
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
        }
        mostrarPopup(`Erro no login: ${errorMessage}`, 'Falha no Login', 'erro');
      }
    } catch (networkError) { 
      console.error('Erro na requisição de login (networkError):', networkError);
      alert('Não foi possível conectar ao servidor para login. Verifique sua conexão ou o console para mais detalhes.');
    }

  };

  return (
    <div>
      {/* Renderiza o Pop-up se estiver visível */}
      {popupConfig.visivel && (
        <AvisoPopup
          mensagem={popupConfig.mensagem}
          titulo={popupConfig.titulo}
          tipo={popupConfig.tipo}
          onConfirm={fecharPopup}
        />
      )}
    <div>
        <div className="login-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="emailOuLogin">Email:</label>
                    <input
                        type="text" // Pode ser "email" se for sempre email
                        id="emailOuLogin"
                        value={emailOuLogin}
                        onChange={(e) => setEmailOuLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <p>
                        <Link to="/loginAdm">Esqueci minha senha</Link>
                    </p>
                </div>
                <button type="submit" className="submit-button">Entrar</button>
                <div className="link-cadastro">
                    <p>
                        Não tem uma conta?{' '}
                        <Link to="/cadastro">Cadastre-se aqui</Link>
                    </p>
                </div>
            </form>
        </div>
    </div>
    </div>
    );
}

export default Login;