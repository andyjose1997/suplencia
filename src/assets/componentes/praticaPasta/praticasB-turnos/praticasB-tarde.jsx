import { useState, useEffect } from "react";
import "./praticasB-tarde.css";
import FormularioPraticas from "../formulario/formularioPraticas";

const horarios = [
  "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30",
  "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30"
];

export default function PraticasBtarde() {
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
          const praticas = data.filter(p => p.tipo === "B");
          const novosPreenchidos = {};

          const atualizadas = horarios.map(hora => {
            const p = praticas.find(p => p.id === `B-${hora}`);
            if (p?.instrutor_B) {
              novosPreenchidos[`B-${hora}`] = p.instrutor_B;
            }
            return {
              instrutor: p?.instrutor_B || "",
              link: p?.link_B || "",
              sala: p?.sala_B || "",
              idioma: p?.idioma_B || "",
              sub: p?.subs_B || ""
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
    const id = `B-${hora}`;
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
    const horario = horarios[index];
    const id = `B-${horario}`;

    const dadosParaSalvar = {
      id,
      turno: "tarde",
      tipo: "B",
      instrutor_B: dados.instrutor,
      link_B: dados.link,
      sala_B: dados.sala,
      horario_B: horario,
      idioma_B: dados.idioma,
      subs_B: parseInt(dados.sub) || 0
    };

    // Atualiza tabela localmente
    const novasLinhas = [...linhas];
    novasLinhas[index] = {
      instrutor: dados.instrutor,
      link: dados.link,
      sala: dados.sala,
      idioma: dados.idioma,
      sub: dados.sub
    };
    setLinhas(novasLinhas);
    setFormularioAberto(null);

    // Envia para backend
    fetch("https://backend-suplencia.onrender.com/praticas/atualizar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosParaSalvar)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar");
        return res.json();
      })
      .then(() => {
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
      .catch(err => console.error("❌ Erro ao salvar:", err));
  };

  return (
    <div className="tabela-container-b">
      <h3>Práticas B - Tarde</h3>
      <table className="tabela-praticas-b">
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
            const id = `B-${hora}`;
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
                    className="btn-horario-b"
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
