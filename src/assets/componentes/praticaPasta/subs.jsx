import { useEffect, useState } from "react";
import "./subs.css";

const horariosDisponiveis = [
  "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30",
  "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45",
  "20:00", "20:15", "20:30", "20:45", "21:00"
];

const idiomasTabela = ["espanhol", "portugues", "ingles", "japones", "frances", "italiano"];

export default function Subs() {
  const [input, setInput] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [tabela, setTabela] = useState([]);
  const [todosInstrutores, setTodosInstrutores] = useState([]);
  const [podeAdicionar, setPodeAdicionar] = useState(false);

  // 🔄 Carregamento inicial
  useEffect(() => {
    carregarSubs();

    fetch("https://backend-suplencia.onrender.com/instrutores")
      .then(res => res.json())
      .then(dados => {
        setTodosInstrutores(dados);

        const nomeLogado = localStorage.getItem("instrutor")?.trim().toLowerCase();
        const instrutorLogado = dados.find(
          (p) => p.instrutor?.toLowerCase().trim() === nomeLogado
        );

        if (
          instrutorLogado &&
          (instrutorLogado.funcao?.toLowerCase() === "admin" || Number(instrutorLogado.colina) === 1)
        ) {
          setPodeAdicionar(true);
        }
      });
  }, []);

  const carregarSubs = () => {
    fetch("https://backend-suplencia.onrender.com/subs")
      .then(res => res.json())
      .then(subs => {
        if (Array.isArray(subs)) {
          setTabela(subs);
        }
      });
  };

  const handleChange = (e) => {
    const texto = e.target.value;
    setInput(texto);
    setSugestoes(
      todosInstrutores.filter((p) =>
        p.instrutor.toLowerCase().includes(texto.toLowerCase())
      )
    );
  };

  const adicionarSub = async (pessoa) => {
    if (tabela.find((p) => p.id === pessoa.id)) return;

    await fetch(`https://backend-suplencia.onrender.com/marcar_sub/${pessoa.id}`, {
      method: "POST",
    });

    carregarSubs();
    setInput("");
    setSugestoes([]);
  };

  const remover = async (id) => {
    await fetch(`https://backend-suplencia.onrender.com/desmarcar_sub/${id}`, {
      method: "POST",
    });

    carregarSubs();
  };

  const atualizarAte = async (id, novoAte) => {
    await fetch("https://backend-suplencia.onrender.com/atualizar_ate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ate: novoAte }),
    });

    setTabela((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ate: novoAte } : p))
    );
  };

  return (
    <div className="subs-container">
      <h2>👥 Adicionar SUB</h2>

      {podeAdicionar && (
        <>
          <input
            type="text"
            placeholder="Digite um nome..."
            value={input}
            onChange={handleChange}
          />

          {sugestoes.length > 0 && (
            <ul className="sugestoes-lista">
              {sugestoes.map((p) => (
                <li key={p.id} onClick={() => adicionarSub(p)}>
                  {p.instrutor} (
                  {idiomasTabela
                    .filter((idioma) => p[idioma])
                    .map((idioma) => idioma[0].toUpperCase() + idioma.slice(1))
                    .join(", ")}
                  )
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <table className="tabela-subs">
        <thead>
          <tr>
            <th>ATÉ</th>
            <th>Instrutor(a)</th>
            {idiomasTabela.map((idioma) => (
              <th key={idioma}>{idioma[0].toUpperCase() + idioma.slice(1)}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tabela.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>
                <select
                  value={pessoa.ate || "--"}
                  onChange={(e) => atualizarAte(pessoa.id, e.target.value)}
                >
                  <option value="--">--</option>
                  {horariosDisponiveis.map((hora) => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </td>
              <td>{pessoa.instrutor}</td>
              {idiomasTabela.map((idioma) => (
                <td key={idioma}>
                  {pessoa[idioma] ? "✅" : "❌"}
                </td>
              ))}
              <td>
                <button onClick={() => remover(pessoa.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
