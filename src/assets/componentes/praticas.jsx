import { useState, useEffect } from "react";
import PraticasBturno from "./praticaPasta/praticasB";
import PraticasAturno from "./praticaPasta/praticasA";
import Subs from "./praticaPasta/subs";
import "./praticas.css";
import Cadastro from "../../cadastro";
import ModalIdioma from "./ModalIdioma";

export default function Praticas() {
  const [aba, setAba] = useState("praticas");
  const [instrutores, setInstrutores] = useState([]);
  const [liderAtual, setLiderAtual] = useState(null);
  const [nomeDigitado, setNomeDigitado] = useState("");
  const [mostrarSelecaoLider, setMostrarSelecaoLider] = useState(false);
  const [idiomaSelecionado, setIdiomaSelecionado] = useState(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [instrutorLogado, setInstrutorLogado] = useState(null);
  const [turnoAtual, setTurnoAtual] = useState("manha");

  const funcaoUsuario = localStorage.getItem("funcao");

  // 🔄 Buscar lista de instrutores
  useEffect(() => {
    fetch("https://backend-suplencia.onrender.com/instrutores")
      .then(res => res.json())
      .then(data => {
        setInstrutores(data);
        const lider = data.find(i => i.colina === 1);
        setLiderAtual(lider || null);
      });
  }, []);

  // 🔄 Buscar turno atual
  useEffect(() => {
    fetch("https://backend-suplencia.onrender.com/turno-atual")
      .then(res => res.json())
      .then(data => {
        setTurnoAtual(data.turno || "manha");
        console.log("🕒 Turno atual:", data.turno);
      })
      .catch(err => {
        console.error("❌ Erro ao buscar turno atual:", err);
      });
  }, []);

  const definirLider = (instrutorId) => {
    fetch(`https://backend-suplencia.onrender.com/definir-lider/${instrutorId}`, {
      method: "POST",
    }).then(() => {
      setMostrarSelecaoLider(false);
      setNomeDigitado("");
      fetch("https://backend-suplencia.onrender.com/instrutores")
        .then(res => res.json())
        .then(data => {
          setInstrutores(data);
          const novoLider = data.find(i => i.colina === 1);
          setLiderAtual(novoLider || null);
        });
    });
  };

  const removerLider = () => {
    if (!liderAtual) return;
    fetch(`https://backend-suplencia.onrender.com/remover-lider/${liderAtual.id}`, {
      method: "POST",
    }).then(() => {
      setLiderAtual(null);
      setMostrarSelecaoLider(false);
      setNomeDigitado("");
    });
  };

  const trocarTurnoGlobal = (novoTurno) => {
    fetch("https://backend-suplencia.onrender.com/turno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ novo_turno: novoTurno }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar turno.");
        setTurnoAtual(novoTurno); // ✅ atualiza local também
        console.log(`✅ Turno alterado para: ${novoTurno}`);
      })
      .catch(err => console.error("Erro ao trocar turno:", err));
  };

  const apagarPraticasDoTurnoAtual = async () => {
    try {
      const res = await fetch(`https://backend-suplencia.onrender.com/turno-atual`);
      const data = await res.json();
      const turnoAtual = data.turno;

      await fetch(`https://backend-suplencia.onrender.com/praticas/apagar-turno/${turnoAtual}`, {
        method: "DELETE",
      });

      console.log(`🗑️ Práticas do turno '${turnoAtual}' apagadas com sucesso.`);
    } catch (err) {
      console.error("❌ Erro ao apagar práticas do turno atual:", err);
    }
  };

  return (
    <div className="container-praticas">
      <div className="botoes-selecao">
        <button
          className={aba === "praticas" ? "btn-navegacao ativo" : "btn-navegacao"}
          onClick={() => setAba("praticas")}
        >
          🧪 Práticas
        </button>
        <button
          className={aba === "subs" ? "btn-navegacao ativo" : "btn-navegacao"}
          onClick={() => setAba("subs")}
        >
          👥 Subs
        </button>
        <button
          className={aba === "informacoes" ? "btn-navegacao ativo" : "btn-navegacao"}
          onClick={() => {
            const nomeLogado = localStorage.getItem("instrutor");
            const instrutor = instrutores.find(i => i.instrutor?.toLowerCase().trim() === nomeLogado?.toLowerCase().trim());

            if (instrutor) {
              setInstrutorLogado(instrutor);
              setMostrarCadastro(true);
              setAba("informacoes");
            } else {
              alert("Instrutor logado não encontrado.");
            }
          }}
        >
          📚 Informações
        </button>
      </div>

      {/* Área do Líder */}
      {aba === "praticas" && funcaoUsuario === "admin" && (
        <div className="area-lider">
          {liderAtual ? (
            <p>
              Encarregado das práticas: {liderAtual.instrutor}
              <button onClick={() => setMostrarSelecaoLider(true)}>Editar</button>
              <button style={{ display: "none" }} onClick={removerLider}>Apagar</button>
            </p>
          ) : (
            <p>
              Nenhum líder de práticas definido ainda.
              <button onClick={() => setMostrarSelecaoLider(true)}>➕ Definir Líder</button>
            </p>
          )}

          {mostrarSelecaoLider && (
            <div className="selecao-lider">
              <input
                list="lista-instrutores"
                placeholder="Digite ou selecione um nome..."
                value={nomeDigitado}
                onChange={(e) => setNomeDigitado(e.target.value)}
              />
              <datalist id="lista-instrutores">
                {instrutores.map((i) => (
                  <option key={i.id} value={i.instrutor} />
                ))}
              </datalist>
              <button
                onClick={() => {
                  const selecionado = instrutores.find(i => i.instrutor === nomeDigitado);
                  if (selecionado) {
                    definirLider(selecionado.id);
                  } else {
                    alert("Nome não encontrado na lista.");
                  }
                }}
              >
                Selecionar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botões de turno */}
      {aba === "praticas" && funcaoUsuario === "admin" && (
        <div className="botoes-turnos">
          <button onClick={() => { removerLider(); trocarTurnoGlobal("manha"); }}>Manhã</button>
          <button onClick={() => { removerLider(); trocarTurnoGlobal("tarde"); }}>Tarde</button>
          <button onClick={() => { removerLider(); trocarTurnoGlobal("noite"); }}>Noite</button>
          <button className="botao-apagar" onClick={apagarPraticasDoTurnoAtual}>🗑️ Apagar práticas do turno atual</button>
        </div>
      )}

      {aba === "praticas" && (
        <>
          <h3 style={{
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            width: "fit-content",
            margin: "20px auto"
          }}>
            Subs disponíveis por idioma
          </h3>

          <div className="botoes-idiomas">
            {["espanhol", "portugues", "ingles", "japones", "frances", "italiano"].map((idioma) => (
              <button
                key={idioma}
                className="botao-idioma"
                onClick={() => setIdiomaSelecionado(idioma)}
              >
                {idioma.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Conteúdo */}
      <div className="area-conteudo">
        {aba === "praticas" && (
          <>
            <PraticasAturno turno={turnoAtual} />
            <PraticasBturno turno={turnoAtual} />
          </>
        )}

        {aba === "subs" && <Subs />}

        {aba === "informacoes" && mostrarCadastro && instrutorLogado && (
          <Cadastro
            dadosInstrutor={instrutorLogado}
            aoVoltar={() => {
              setMostrarCadastro(false);
              setInstrutorLogado(null);
              setAba("praticas");
            }}
          />
        )}
      </div>

      {/* Modal de idioma */}
      {idiomaSelecionado && (
        <ModalIdioma
          idioma={idiomaSelecionado}
          aoFechar={() => setIdiomaSelecionado(null)}
        />
      )}
    </div>
  );
}
