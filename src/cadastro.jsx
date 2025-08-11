import { useState } from "react";
import './cadastro.css';

export default function Cadastro({ aoVoltar, dadosInstrutor = null }) {
  const [instrutor, setInstrutor] = useState(dadosInstrutor?.instrutor || "");
  const [linkZoom, setLinkZoom] = useState(dadosInstrutor?.link_zoom || "");
  const [idiomas, setIdiomas] = useState(() => {
    const selecionados = [];
    if (dadosInstrutor) {
      ["espanhol", "ingles", "frances", "japones", "italiano"].forEach((idioma) => {
        if (dadosInstrutor[idioma]) selecionados.push(idioma);
      });
    }
    return selecionados;
  });

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const idiomasDisponiveis = ["espanhol", "ingles", "frances", "japones", "italiano"];

  function toggleIdioma(idioma) {
    setIdiomas((prev) =>
      prev.includes(idioma)
        ? prev.filter((i) => i !== idioma)
        : [...prev, idioma]
    );
  }

  async function cadastrar(e) {
    e.preventDefault();

    if (!dadosInstrutor && senha !== confirmarSenha) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    if (idiomas.length === 0) {
      setMensagem("❌ Selecione pelo menos um idioma além de português.");
      return;
    }

   const corpo = {
  instrutor,
  funcao: "instrutor",
  link_zoom: linkZoom,
  portugues: true,
  espanhol: idiomas.includes("espanhol"),
  ingles: idiomas.includes("ingles"),
  frances: idiomas.includes("frances"),
  japones: idiomas.includes("japones"),
  italiano: idiomas.includes("italiano"),
};

// Só adiciona a senha se tiver valor
if (senha && senha.trim() !== "") {
  corpo.senha = senha;
}


    const url = dadosInstrutor
      ? `https://backend-suplencia.onrender.com/editar_instrutor/${dadosInstrutor.id}`
      : "https://backend-suplencia.onrender.com/cadastro";

    const metodo = dadosInstrutor ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ " + (dadosInstrutor ? "Atualizado com sucesso!" : "Cadastro realizado com sucesso!"));
        aoVoltar();
      } else {
        setMensagem("❌ " + (dados.detail || "Erro ao processar."));
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="cadastro-container">
      <form onSubmit={cadastrar} className="cadastro-form">
        <h2 className="cadastro-titulo">
          {dadosInstrutor ? "Editar dados do instrutor" : "Cadastro para as práticas"}
        </h2>
<label style={{color:"white"}}>Nome de Instruro(a)</label>

        <input
          type="text"
          placeholder="Nome do Instrutor, Ex. I. De oliveira"
          value={instrutor}
          onChange={(e) => setInstrutor(e.target.value)}
          required
          className="cadastro-input"
          style={{ width: "250px" }}
        />
<label style={{color:"white"}}>Link do zoom</label>
        <input
          type="text"
          value={linkZoom}
          onChange={(e) => setLinkZoom(e.target.value)}
          required
          className="cadastro-input"
          style={{ width: "250px" }}
        />

        <div className="cadastro-idiomas-box">
          <label className="cadastro-idiomas-label">
            Idiomas que pratica (Português já incluso):
          </label>
          <div className="cadastro-idiomas-grid">
            {idiomasDisponiveis.map((idioma) => (
              <label key={idioma} className="cadastro-idioma-opcao">
                <input
                  type="checkbox"
                  checked={idiomas.includes(idioma)}
                  onChange={() => toggleIdioma(idioma)}
                />
                {idioma.charAt(0).toUpperCase() + idioma.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {!dadosInstrutor && (
          <>
            <label style={{color:"white"}}>Senha</label>

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="cadastro-input"
              style={{ width: "250px" }}
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              className="cadastro-input"
              style={{ width: "250px" }}
            />
          </>
        )}

        <button type="submit" className="cadastro-btn primario" style={{ width: "250px" }}>
          {dadosInstrutor ? "Salvar alterações" : "Cadastrar"}
        </button>
        <button type="button" onClick={aoVoltar} className="cadastro-btn secundario" style={{ width: "250px" }}>
          Voltar
        </button>

        {mensagem && <p className="cadastro-mensagem">{mensagem}</p>}
      </form>
    </div>
  );
}
