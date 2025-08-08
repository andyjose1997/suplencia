import { useState, useEffect } from "react";
import "./praticasA-tarde.css";
import FormularioPraticas from "../formulario/formularioPraticas";

const horarios = [
  "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30",
  "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30"
];

export default function PraticasAtarde() {
  const [formularioAberto, setFormularioAberto] = useState(null);
  const [linhas, setLinhas] = useState(horarios.map(() => ({
    instrutor: "",
    link: "",
    sala: "",
    idioma: "",
    sub: ""
  })));
  const [bloqueiosTemporarios, setBloqueiosTemporarios] = useState({});
  const [preenchidoPor, setPreenchidoPor] = useState({});
  const [usuarioAtual, setUsuarioAtual] = useState("");
  const [permissoes, setPermissoes] = useState({ funcao: "", colina: 0 });

  useEffect(() => {
    const instrutor = localStorage.getItem("instrutor")?.trim() || "";
    const funcao = localStorage.getItem("funcao") || "";
    const colina = parseInt(localStorage.getItem("colina") || "0");

    setUsuarioAtual(instrutor);
    setPermissoes({ funcao, colina });
  }, []);

  useEffect(() => {
    const carregar = () => {
      fetch("https://backend-suplencia.onrender.com/praticas?turno=tarde")
        .then(res => res.json())
        .then(data => {
          const praticas = data.filter(p => p.tipo === "A");
          const novosPreenchidos = {};

          const atualizadas = horarios.map(hora => {
            const p = praticas.find(p => p.id === `A-${hora}`);
            if (p?.instrutor_A) {
              novosPreenchidos[`A-${hora}`] = p.instrutor_A;
            }
            return {
              instrutor: p?.instrutor_A || "",
              link: p?.link_A || "",
              sala: p?.sala_A || "",
              idioma: p?.idioma_A || "",
              sub: p?.subs_A || ""
            };
          });

          setLinhas(atualizadas);
          setPreenchidoPor(novosPreenchidos);
        })
        .catch(err => console.error("Erro ao carregar dados:", err));
    };

    carregar();
    const intervalo = setInterval(carregar, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const abrirFormulario = (index) => {
    const hora = horarios[index];
    const id = `A-${hora}`;
    const preenchido = preenchidoPor[id];

    const podeAbrir =
      !bloqueiosTemporarios[id] &&
      (
        !preenchido ||
        preenchido === usuarioAtual ||
        permissoes.funcao === "admin" ||
        permissoes.colina === 1
      );

    if (!podeAbrir) return;

    setFormularioAberto(index);

    setBloqueiosTemporarios((prev) => ({
      ...prev,
      [id]: true
    }));

    setTimeout(() => {
      setBloqueiosTemporarios((prev) => {
        const novo = { ...prev };
        delete novo[id];
        return novo;
      });
    }, 40000);
  };

  const salvarLinha = (index, dados) => {
    const novasLinhas = [...linhas];
    novasLinhas[index] = dados;
    setLinhas(novasLinhas);
    setFormularioAberto(null);

    const horario = horarios[index];
    const id = `A-${horario}`;

    const dadosParaSalvar = {
      id,
      turno: "tarde",
      tipo: "A",
      instrutor_A: dados.instrutor,
      link_A: dados.link,
      sala_A: dados.sala,
      horario_A: horario,
      idioma_A: dados.idioma,
      subs_A: parseInt(dados.sub) || 0
    };

    console.log("📤 Enviando para o backend:", dadosParaSalvar);

    fetch("https://backend-suplencia.onrender.com/praticas/atualizar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosParaSalvar)
    })
      .then(async (res) => {
        const resposta = await res.json();
        console.log("🟢 RESPOSTA DO BACKEND:", resposta);

        setPreenchidoPor((prev) => ({
          ...prev,
          [id]: dados.instrutor
        }));

        setBloqueiosTemporarios((prev) => {
          const novo = { ...prev };
          delete novo[id];
          return novo;
        });
      })
      .catch(err => console.error("❌ ERRO AO SALVAR:", err));
  };

  return (
    <div className="tabela-container">
      <h3>Práticas A - Tarde</h3>
      <table className="tabela-praticas">
        <thead>
          <tr>
            <th>Instrutor(a)</th>
            <th>Link</th>
            <th>Sala</th>
            <th>Horário</th>
            <th>Idioma</th>
            <th>SUBS</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((hora, index) => {
            const id = `A-${hora}`;
            const preenchido = preenchidoPor[id];

            const bloqueado =
              bloqueiosTemporarios[id] &&
              preenchido !== usuarioAtual &&
              permissoes.funcao !== "admin" &&
              permissoes.colina !== 1;

            return (
              <tr key={index}>
                <td>{linhas[index].instrutor}</td>
                <td>
                  {linhas[index].link ? (
                    <a href={linhas[index].link} target="_blank" rel="noopener noreferrer">link</a>
                  ) : ""}
                </td>
                <td>{linhas[index].sala}</td>
                <td>
                  <button
                    className="btn-horario"
                    onClick={() => abrirFormulario(index)}
                    disabled={bloqueado}
                  >
                    {hora}
                  </button>
                </td>
                <td>{linhas[index].idioma}</td>
                <td>{linhas[index].sub}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {formularioAberto !== null && (
        <FormularioPraticas
          horario={horarios[formularioAberto]}
          fechar={() => setFormularioAberto(null)}
          salvar={(dados) => salvarLinha(formularioAberto, dados)}
          instrutorPadrao={linhas[formularioAberto].instrutor}
          linkPadrao={linhas[formularioAberto].link}
        />
      )}
    </div>
  );
}
