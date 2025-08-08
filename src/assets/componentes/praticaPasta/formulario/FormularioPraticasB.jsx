import { useState, useEffect } from "react";
import "./formularioPratica.css"; 

export default function FormularioPraticasB({ horario, fechar, salvar }) {
  const [instrutor, setInstrutor] = useState("");
  const [link, setLink] = useState("");
  const [sala, setSala] = useState("");
  const [subs, setSubs] = useState("");
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("");
  const [tempoRestante, setTempoRestante] = useState(15);

  const idiomas = ["Portugues", "Ingles", "Espanhol", "Japones", "Frances"];

  // 🔄 Carrega nome e link do instrutor logado
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

  // ⏳ Temporizador para fechar automaticamente
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

  // ✅ Envia os dados para o componente pai
  const enviarFormulario = () => {
    if (!sala || !idiomaSelecionado) {
      alert("Preencha a sala e selecione um idioma.");
      return;
    }

    const dados = {
      id: `B-${horario}`,
      tipo: "B",
      turno: "manha", // ou tarde, noite, dependendo do uso
      horario_B: horario,
      instrutor_B: instrutor,
      link_B: link,
      sala_B: sala,
      idioma_B: idiomaSelecionado,
      subs_B: parseInt(subs) || 0, // ✅ Corrigido o nome
    };

    console.log("📤 Enviando dados do formulário B:", dados);
    if (salvar) salvar(dados);
  };

  const limparFormulario = () => {
    const dados = {
      id: `B-${horario}`,
      tipo: "B",
      turno: "manha",
      horario_B: horario,
      instrutor_B: "",
      link_B: "",
      sala_B: "",
      idioma_B: "",
      subs_B: 0
    };

    if (salvar) salvar(dados);
    fechar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo dark-mode">
        <button className="btn-fechar" onClick={fechar}>✖</button>
        <h2>Preencher prática B das {horario}</h2>

        <p className="temporizador" style={{ color: tempoRestante <= 10 ? "red" : "white" }}>
          ⏳ Tempo restante: {tempoRestante}s
        </p>

        <label>Instrutor(a):</label>
        <p className="campo-texto">{instrutor || "—"}</p>

        <label>Link</label>
        <p className="campo-texto">{link || "—"}</p>

        <label>Sala</label>
        <input
  type="text"
  list="lista-salas"
  placeholder="Número ou nome da sala"
  value={sala}
  onChange={(e) => setSala(e.target.value)}
/>

<datalist id="lista-salas">
  <option value="Verde" />
  <option value="Academia" />
  <option value="Vidro" />
  <option value="Auditório" />
  <option value="Estacionamento" />
  <option value="Online" />
  <option value="101" />
  <option value="102" />
  <option value="103" />
  <option value="104" />
  <option value="105" />
  <option value="106" />
  <option value="107" />
  <option value="108" />
  <option value="109" />
  <option value="110" />
  <option value="111" />
  <option value="112" />
  <option value="113" />
  <option value="114" />
  <option value="115" />
  <option value="116" />
  <option value="117" />
  <option value="118" />
  <option value="119" />
  <option value="120" />
  <option value="121" />
  <option value="122" />
  <option value="123" />
  <option value="124" />
  <option value="125" />
  <option value="126" />
  <option value="127" />
  <option value="128" />
  <option value="129" />
  <option value="130" />
  <option value="131" />
  <option value="132" />
  <option value="202" />
  <option value="203" />
  <option value="204" />
  <option value="205" />
  <option value="206" />
  <option value="207" />
  <option value="208" />
  <option value="209" />
  <option value="210" />
  <option value="211" />
  <option value="212" />
  <option value="213" />
  <option value="214" />
  <option value="215" />
  <option value="216" />
  <option value="217" />
  <option value="218" />
  <option value="219" />
  <option value="220" />
  <option value="221" />
  <option value="222" />
  <option value="223" />
  <option value="224" />
  <option value="225" />
  <option value="226" />
  <option value="227" />
  <option value="228" />
  <option value="229" />
  <option value="230" />
  <option value="231" />
  <option value="232" />
</datalist>


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

        <label>SUBS</label>
        <input
          type="number"
          placeholder="quantos?"
          value={subs}
          onChange={(e) => setSubs(e.target.value)}
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
