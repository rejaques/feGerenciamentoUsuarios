// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import './components/Login.css'; // Vamos criar este arquivo CSS

function Login() {
  const [emailOuLogin, setEmailOuLogin] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook para navegação programática

  const handleSubmit = async (event) => {
    event.preventDefault();
    

  const payload = {
      email: emailOuLogin, 
      senha: senha,
    };
    try {
      const response = await fetch('http://207.211.191.34:8080/api/auth/login', { // Ajuste a URL da sua API de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Resposta do backend (texto puro):', responseText);

      if (response.ok) { 
        const data = JSON.parse(responseText);
        alert('Login realizado com sucesso!'); 

        // Salvar no localStorage
        localStorage.setItem('tipoUsuario', data.tipoUsuario);
        localStorage.setItem('idUsuario', data.idUsuario.toString()); // Salva como string

        // Limpar campos do formulário
        setEmailOuLogin('');
        setSenha('');

        setTimeout(() => {
          if(data.tipoUsuario === "Cliente")
            navigate('/alterarDados'); 
          else
            navigate('/adm')
        }, 1000); 

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
        alert(`Erro no login: ${errorMessage}`);
      }
    } catch (networkError) { 
      console.error('Erro na requisição de login (networkError):', networkError);
      alert('Não foi possível conectar ao servidor para login. Verifique sua conexão ou o console para mais detalhes.');
    }

  };

  return (
    <div>
        <div className="login-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="emailOuLogin">Email ou Login:</label>
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
    );
}

export default Login;