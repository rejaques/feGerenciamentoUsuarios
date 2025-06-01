// src/components/CadastroUsuario.js
import React, { useState } from 'react';
import './components/CadastroUsuario.css'
import { Link, useNavigate } from 'react-router-dom';
import AvisoPopup from './PopUp';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [login, setLogin] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const navigate = useNavigate();

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

    const dadosCadastro = {
      nome,
      email,
      senha,
      login,
      endereco: {
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      }
    };
    try {
      const response = await fetch('http://207.211.191.34:8080/gerenciamento-usuarios/api/cadastro/funcionario', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCadastro), 
      });


      if (response.status === 201 || response.ok){ // Status 200-299
        const responseBodyText = await response.text(); // O backend retorna uma string simples
        console.log('Resposta do backend (texto):', responseBodyText);
        mostrarPopup(responseBodyText, 'Sucesso!', 'sucesso'); // Usa o texto da resposta
        // Limpar formulário, etc.
        setNome(''); setEmail(''); setSenha(''); setLogin('');
        setRua(''); setNumero(''); setComplemento(''); setBairro('');
        setCidade(''); setEstado(''); setCep('');
        
        setTimeout(() => {
          navigate('/adm'); // Redireciona para a rota de login
        }, 1500);

      } else { // Status de erro (4xx, 5xx)
        let errorMessage = `Erro: ${response.status} ${response.statusText}`;
        if (response.headers.get("content-type")?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || 
               (errorData.erros ? errorData.erros.join(', ') : 
               (errorData.errors ? errorData.errors.map(e => e.defaultMessage || e).join(', ') : errorMessage));
        } else {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erro na requisição (fetch falhou):', error);
      mostrarPopup(error.message, 'Erro ao salvar!', 'erro')
    }
  };

  // Função para buscar CEP (exemplo, você precisará implementar a lógica com uma API como ViaCEP)
  const handleCepBlur = async (event) => {
    const cepValue = event.target.value.replace(/\D/g, ''); // Remove não dígitos
    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        if (!response.ok) throw new Error('CEP não encontrado');
        const data = await response.json();
        if (data.erro) {
            alert('CEP não encontrado ou inválido.');
            return;
        }
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        mostrarPopup(error, 'CEP não encontrado', 'aviso');
      }
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
    <div className="cadastro-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Cadastro de funcionario</h2>

        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">Dados Pessoais</legend>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-row"> {/* Linha para agrupar login e senha */}
            <div className="form-group half-width">
              <label htmlFor="login">Login:</label>
              <input type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} required />
            </div>
            <div className="form-group half-width">
              <label htmlFor="senha">Senha:</label>
              <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">Endereço</legend>
          <div className="form-group">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur} 
              placeholder="00000-000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rua">Rua / Logradouro:</label>
            <input type="text" id="rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
          </div>
          <div className="form-row"> {/* Linha para agrupar numero e complemento */}
            <div className="form-group third-width">
              <label htmlFor="numero">Número:</label>
              <input type="text" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} required />
            </div>
            <div className="form-group two-thirds-width">
              <label htmlFor="complemento">Complemento:</label>
              <input type="text" id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="bairro">Bairro:</label>
            <input type="text" id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
          </div>
          <div className="form-row"> {/* Linha para agrupar cidade e estado */}
            <div className="form-group two-thirds-width">
              <label htmlFor="cidade">Cidade:</label>
              <input type="text" id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
            </div>
            <div className="form-group third-width">
              <label htmlFor="estado">Estado (UF):</label>
              <input type="text" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength="2" required />
            </div>
          </div>
        </fieldset>

        <button type="submit" className="submit-button">Cadastrar</button>
      </form>
    </div>
    </div>
  );
}

export default CadastroUsuario;