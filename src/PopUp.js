// src/components/AvisoPopup.js
import React from 'react';
import './components/PopUp.css'; // Vamos criar este arquivo CSS com os estilos do pop-up


function AvisoPopup({ mensagem, titulo, onConfirm, tipo}) {
  if (!mensagem) {
    return null; // Não renderiza nada se não houver mensagem
  }

  let iconeCor = '#7fff24'; // Verde para sucesso/aviso padrão
  let tituloPadrao = 'Aviso!';
  let nomeIcone = 'warning';

  if (tipo === 'sucesso') {
    iconeCor = '#7fff24'; // Verde
    tituloPadrao = 'Sucesso!';
    nomeIcone = 'check_circle'; // Ícone de sucesso do Material Symbols
  } else if (tipo === 'erro') {
    iconeCor = '#ff3333'; // Vermelho
    tituloPadrao = 'Erro!';
    nomeIcone = 'error'; // Ícone de erro do Material Symbols
  } else if (tipo === 'aviso' || !tipo) { // Se tipo for 'aviso' ou indefinido
    iconeCor = '#FFBF00'; // Amarelo/Laranja para aviso
    tituloPadrao = 'Aviso!';
    nomeIcone = 'warning';
  }


  return (
    <article className="aviso-popup-overlay">
      <div className="content-wrapper">
        <div className="content card">
          <div className="rating-star">
            <span
              className="material-symbols-outlined"
              style={{
                color: iconeCor,
                fontSize: '28px', // Ajuste o tamanho conforme necessário
                // verticalAlign: 'middle' // Pode ajudar no alinhamento em alguns casos
              }}
            >
              {nomeIcone}
            </span>
          </div>
          <span className="title">{titulo || tituloPadrao}</span>
          <p className="text">{mensagem}</p>
          <button className="botao-aviso css-animator" onClick={onConfirm}>
            Ok
          </button>
        </div>
      </div>
    </article>
  );
}

export default AvisoPopup;