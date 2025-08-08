import { useState, useEffect } from "react";
import "./praticasA-manha.css";
import FormularioPraticas from "../formulario/formularioPraticas";

const horarios = [
  "09:45", "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45", "12:00", "12:15"
];

export default function PraticasAmanha() {
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
  const [carregando, setCarregando] = useState(true); // ✅ novo estado

  // Pega o usuário logado e permissões
  useEffect(() => {
    const instrutor = localStorage.getItem("instrutor")?.trim() || "";
    const funcao = localStorage.getItem("funcao") || "";
    const colina = parseInt(localStorage.getItem("colina") || "0");
    setUsuarioAtual(instrutor);
    setPermissoes({ funcao, colina });
  }, []);

  // Carrega dados do backend
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await fetch("https://backend-suplencia.onrender.com/praticas?turno=manha");
        if (!res.ok) {
          const textoErro = await res.text();
          console.error("❌ Erro HTTP:", res.status, textoErro);
          return;
        }

        const data = await res.json();
        const praticasFiltradas = data.filter(p => p.tipo?.toUpperCase() === "A");

        const novosPreenchidos = {};
        const novasLinhas = horarios.map((hora) => {
          const p = praticasFiltradas.find(p => p.id === `A-${hora}`);
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

        setLinhas(novasLinhas);
        setPreenchidoPor(novosPreenchidos);
      } catch (err) {
        console.error("❌ Erro ao carregar práticas:", err);
      } finally {
        setCarregando(false); // ✅ finaliza carregamento
      }
    };

    carregarDados();
    const intervalo = setInterval(carregarDados, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const abrirFormulario = (index) => {
    const hora = horarios[index];
    const id = `A-${hora}`;
    const preenchido = preenchidoPor[id];

    const podeAbrir =
      !bloqueiosTemporarios[id] &&
      (!preenchido ||
        preenchido === usuarioAtual ||
        permissoes.funcao === "admin" ||
        permissoes.colina === 1);

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
    const id = `A-${horario}`;

    const linhaAtualizada = {
      instrutor: dados.instrutor || "",
      link: dados.link || "",
      sala: dados.sala || "",
      idioma: dados.idioma || "",
      sub: dados.sub || ""
    };

    const novasLinhas = [...linhas];
    novasLinhas[index] = linhaAtualizada;
    setLinhas(novasLinhas);
    setFormularioAberto(null);

    const dadosParaSalvar = {
      id,
      turno: "manha",
      tipo: "A",
      instrutor_A: linhaAtualizada.instrutor,
      link_A: linhaAtualizada.link,
      sala_A: linhaAtualizada.sala,
      horario_A: horario,
      idioma_A: linhaAtualizada.idioma,
      subs_A: parseInt(linhaAtualizada.sub) || 0
    };

    fetch("https://backend-suplencia.onrender.com/praticas/atualizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaSalvar)
    })
      .then(async (res) => {
        if (!res.ok) {
          const erroTexto = await res.text();
          console.error("❌ Erro ao salvar:", erroTexto);
          throw new Error("Erro ao salvar");
        }
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
      .catch(err => {
        console.error("❌ Erro final no catch:", err);
      });
  };

  return (
    <div className="tabela-container">
      <h3>Práticas A - Manhã</h3>

      {carregando ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Carregando tabela de práticas...</p>
      ) : (
        <>
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
                  !(permissoes.funcao === "admin" || permissoes.colina === 1);

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
            />
          )}
        </>
      )}
    </div>
  );
}
