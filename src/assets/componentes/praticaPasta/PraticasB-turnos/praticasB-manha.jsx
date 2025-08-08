import { useState, useEffect } from "react";
import "./praticasB-manha.css";
import FormularioPraticasB from "../formulario/FormularioPraticasB";

const horarios = [
  "09:45", "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45", "12:00"
];

export default function PraticasBmanha() {
  const [formularioAberto, setFormularioAberto] = useState(null);
  const [linhas, setLinhas] = useState(horarios.map(() => ({
    instrutor_B: "",
    link_B: "",
    sala_B: "",
    idioma_B: "",
    subs_B: ""
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
      fetch("https://backend-suplencia.onrender.com/praticas?turno=manha")
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
              instrutor_B: p?.instrutor_B || "",
              link_B: p?.link_B || "",
              sala_B: p?.sala_B || "",
              idioma_B: p?.idioma_B || "",
              subs_B: p?.subs_B || ""
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

    const novaLinha = {
      instrutor_B: dados.instrutor_B,
      link_B: dados.link_B,
      sala_B: dados.sala_B,
      idioma_B: dados.idioma_B,
      subs_B: parseInt(dados.subs_B) || 0
    };

    const novasLinhas = [...linhas];
    novasLinhas[index] = novaLinha;
    setLinhas(novasLinhas);
    setFormularioAberto(null);

    const dadosParaSalvar = {
      id,
      turno: "manha",
      tipo: "B",
      ...novaLinha,
      horario_B: horario
    };

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
          [id]: dados.instrutor_B
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
      <h3>Práticas B - Manhã</h3>
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
                <td>{linhas[index].instrutor_B}</td>
                <td>
                  {linhas[index].link_B ? (
                    <a href={linhas[index].link_B} target="_blank" rel="noopener noreferrer">link</a>
                  ) : ""}
                </td>
                <td>{linhas[index].sala_B}</td>
                <td>
                  <button
                    className="btn-horario-b"
                    onClick={() => abrirFormulario(index)}
                    disabled={bloqueado}
                  >
                    {hora}
                  </button>
                </td>
                <td>{linhas[index].idioma_B}</td>
                <td>{linhas[index].subs_B}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {formularioAberto !== null && (
        <FormularioPraticasB
          horario={horarios[formularioAberto]}
          fechar={() => setFormularioAberto(null)}
          salvar={(dados) => salvarLinha(formularioAberto, dados)}
        />
      )}
    </div>
  );
}
