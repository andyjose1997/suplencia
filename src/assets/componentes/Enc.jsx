// enc.jsx
import { useEffect, useState } from "react";
import "./enc.css"; // opcional para estilização

export default function EncarregadoImpressao({ funcao, atualizarLista }) {
  const [instrutores, setInstrutores] = useState([]);
  const [selecionado, setSelecionado] = useState("");
  const [encarregado, setEncarregado] = useState("");

  // 🔄 Carrega todos os instrutores
  useEffect(() => {
    fetch("https://backend-suplencia.onrender.com/instrutores")
      .then(res => res.json())
      .then(data => {
        setInstrutores(data);
        const atual = data.find(i => i.coluna_impressao === 1);
        if (atual) setEncarregado(atual.instrutor);
      })
      .catch(err => console.error("Erro ao carregar instrutores:", err));
  }, []);

  const definirEncarregado = async () => {
    if (!selecionado) return alert("Selecione um instrutor");

    try {
      const res = await fetch(`https://backend-suplencia.onrender.com/definir-encarregado-impressao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instrutor: selecionado })
      });

      if (res.ok) {
        setEncarregado(selecionado);
        setSelecionado("");
        atualizarLista?.();
      } else {
        const erro = await res.json();
        alert("Erro ao definir encarregado: " + erro.detail);
      }
    } catch (err) {
      console.error("Erro ao definir encarregado:", err);
    }
  };

  return (
    <div className="encarregado-container">
   <div className="encarregado-topo">
  <h3>Encarregado de Impressões:</h3>
<p
  style={{
    fontSize: funcao !== "admin" ? "2em" : "1em",
        color: funcao !== "admin" ? "blue" : "black"

  }}
>
  {encarregado || "Nenhum definido"}
</p>
</div>

<br /><br />
      {funcao === "admin" && (
        <div className="encarregado-controle">
          <input
            list="lista-instrutores"
            value={selecionado}
            onChange={(e) => setSelecionado(e.target.value)}
            placeholder="Escolher novo encarregado..."
          />
          <datalist id="lista-instrutores">
            {instrutores.map((i, idx) => (
              <option key={idx} value={i.instrutor} />
            ))}
          </datalist>
          <button onClick={definirEncarregado}>Definir como encarregado</button>
        </div>
      )}
    </div>
  );
}
