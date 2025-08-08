import { useState, useEffect } from "react";
import "./formularioPratica.css";

export default function FormularioPraticas({ horario, fechar, salvar }) {
  const [instrutor, setInstrutor] = useState(""); 
  const [link, setLink] = useState("");
  const [sala, setSala] = useState("");
  const [sub, setSub] = useState("");
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("");
  const [tempoRestante, setTempoRestante] = useState(15);

  const idiomas = ["Portugues", "Ingles", "Espanhol", "Japones", "Frances"];

  useEffect(() => {
    const instrutorLogado = localStorage.getItem("instrutor")?.trim();
    console.log("📦 Nome do instrutor logado:", instrutorLogado);

    if (!instrutorLogado) {
      console.warn("⚠️ Nenhum nome de instrutor logado encontrado.");
      return;
    }

    const carregarInstrutor = async () => {
      try {
        const res = await fetch(`https://backend-suplencia.onrender.com/instrutor/${encodeURIComponent(instrutorLogado)}`);
        if (!res.ok) throw new Error("Instrutor não encontrado");
        const dados = await res.json();
        setInstrutor(dados.instrutor || "");
        setLink(dados.link_zoom || "");
      } catch (err) {
        console.error("❌ Erro ao buscar instrutor:", err);
      }
    };

    carregarInstrutor();
  }, []);

  useEffect(() => {
    if (tempoRestante <= 0) {
      const timeout = setTimeout(() => fechar(), 0);
      return () => clearTimeout(timeout);
    }

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tempoRestante, fechar]);

  const enviarFormulario = () => {
    if (!sala || !idiomaSelecionado) {
      alert("Preencha a sala e selecione um idioma.");
      return;
    }

    const dados = {
      horario,
      instrutor,
      link,
      sala,
      idioma: idiomaSelecionado,
      sub: parseInt(sub) || 0
    };

    console.log("📤 Enviando dados do formulário:", dados);
    if (salvar) salvar(dados);
  };

  const limparFormulario = () => {
    const dados = {
      horario,
      instrutor: "",
      link: "",
      sala: "",
      idioma: "",
      sub: ""
    };

    if (salvar) salvar(dados);
    fechar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo dark-mode">
        <button className="btn-fechar" onClick={fechar}>✖</button>
        <h2>Preencher prática das {horario}</h2>
        <p className="temporizador" style={{ color: tempoRestante <= 10 ? "red" : "white" }}>
          ⏳ Tempo restante: {tempoRestante}s
        </p>

        <label>Instrutor(a)</label>
        <p className="campo-texto">{instrutor || "—"}</p>

        <label>Link</label>
        <p className="campo-texto">{link || "—"}</p>

        <label>Sala</label>
        <input
          type="text"
          placeholder="Número ou nome da sala"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
        />

        <label>Idioma</label>
        <section className="idiomas">
          {idiomas.map((idioma, i) => (
            <button
              key={i}
              className={idiomaSelecionado === idioma ? "idioma-btn ativo" : "idioma-btn"}
              onClick={() => setIdiomaSelecionado(idioma)}
            >
              {idioma}
            </button>
          ))}
        </section>

        <h4 className="idioma-escolhido">
          {idiomaSelecionado ? `Selecionado: ${idiomaSelecionado}` : "Nenhum idioma selecionado"}
        </h4>

        <label>SUB</label>
        <input
          type="number"
          placeholder="quantos?"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
        />

        <div className="botoes-formulario">
          <button className="btn-salvar" onClick={enviarFormulario}>💾 Salvar</button>
          <br /><br />
          <button className="btn-limpar" onClick={limparFormulario}>🧹 Limpar</button>
        </div>
      </div>
    </div>
  );
}


