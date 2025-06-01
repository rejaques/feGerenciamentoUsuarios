// src/components/CadastroUsuario.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './components/CadastroUsuario.css'

function AlterarDados() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [login, setLogin] = useState('');
  const [enderecoId, setEnderecoId] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 


  useEffect(() => {
    const fetchUsuarioData = async () => {
      setIsLoading(true);
      setError(null);

      const idUsuario = localStorage.getItem('idUsuario');

      try {
        const response = await fetch(`http://207.211.191.34:8080/gerenciamento-usuarios/api/buscar/buscaDados?idUsuario=${idUsuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.headers.get("content-type")?.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar dados: ${response.status}`);
          }
          throw new Error(`Erro ao buscar dados do usuário: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.dadosCadastrais) {
            setNome(data.dadosCadastrais.nome || '');
            setEmail(data.dadosCadastrais.email || '');
            setLogin(data.dadosCadastrais.login || '');
        } else {
            console.warn("Dados cadastrais não encontrados na resposta da API.");
            setNome('');
            setEmail('');
            setLogin('');
        }

        if (data && data.dadosEndereco) {
            setEnderecoId(data.dadosEndereco.id || '');
            setRua(data.dadosEndereco.rua || '');
            setNumero(data.dadosEndereco.numero || '');
            setComplemento(data.dadosEndereco.complemento || '');
            setBairro(data.dadosEndereco.bairro || '');
            setCidade(data.dadosEndereco.cidade || '');
            setEstado(data.dadosEndereco.estado || '');
            setCep(data.dadosEndereco.cep || '');
        } else {
            console.warn("Dados de endereço não encontrados na resposta da API.");
            setRua('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setEstado('');
            setCep('');
        }
      } catch (err) {
        console.error("Falha ao buscar dados do usuário:", err);
        setError(err.message || "Não foi possível carregar os dados do usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarioData();
  }, [navigate]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 

    const idUsuario = localStorage.getItem('idUsuario');

    const dadosAtualizados = {
      idUsuario, 
      nome,
      login,
      senha: senha || undefined,
      email,
      endereco: {
        enderecoId,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      }
    };

    if (!senha) {
        delete dadosAtualizados.senha;
    }


    console.log("Dados a serem atualizados:", JSON.stringify(dadosAtualizados, null, 2));

    try {
      const response = await fetch('http://207.211.191.34:8080/gerenciamento-usuarios/api/alterar/dadosCompletos', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (response.ok) {
        const responseBodyText = await response.text(); 
        alert(responseBodyText || 'Dados atualizados com sucesso!');
      } else {
        let errorMessage = `Erro: ${response.status} ${response.statusText}`;
        if (response.headers.get("content-type")?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || (errorData.errors ? errorData.errors.map(e => e.defaultMessage).join(', ') : errorMessage);
        } else {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Falha ao atualizar dados:", err);
      setError(err.message || "Não foi possível salvar as alterações.");
      alert(`Erro ao salvar: ${err.message || "Tente novamente."}`);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando dados do usuário...</div>;
  }

  // Função para buscar CEP 
  const handleCepBlur = async (event) => {
    const cepValue = event.target.value.replace(/\D/g, ''); 
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
        alert("Não foi possível buscar o CEP. Verifique e tente novamente.");
      }
    }
  };

  return (
    <div className="cadastro-form-container"> {}
      <form onSubmit={handleSubmit}>
        <h2>Alterar Dados do Usuário</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}


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
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="login">Login:</label>
              <input type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} required />
            </div>
            <div className="form-group half-width">
              <label htmlFor="senha">Nova Senha:
              <span className="tooltip-container">
                <span className="tooltip-icon" tabIndex="0">?</span>
                <span className="tooltip-text">Deixe em branco para não alterar.</span>
              </span>
              </label>
              <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Nova senha" />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">Endereço</legend>
          <div className="form-group">
            <label htmlFor="cep">CEP:</label>
            <input type="text" id="cep" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur} placeholder="00000-000" required />
          </div>
          <div className="form-group">
            <label htmlFor="rua">Rua / Logradouro:</label>
            <input type="text" id="rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
          </div>
          <div className="form-row">
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
          <div className="form-row">
            <div className="form-group two-thirds-width">
              <label htmlFor="cidade">Cidade:</label>
              <input type="text" id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
            </div>
            <div className="form-group third-width">
              <label htmlFor="estado">Estado (UF):</label>
              <input type="text" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} required />
            </div>
          </div>
        </fieldset>

        <button type="submit" className="submit-button">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default AlterarDados;