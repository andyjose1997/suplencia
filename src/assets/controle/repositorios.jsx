import { useEffect, useMemo, useState } from "react";
import "./repositorios.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-suplencia.onrender.com";
export default function Repositorios() {
  const [instrutores, setInstrutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [adminSelecionado, setAdminSelecionado] = useState("");

  useEffect(() => {
    carregarInstrutores();
  }, []);

  const carregarInstrutores = async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch(`${API_URL}/instrutores`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInstrutores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os instrutores.");
    } finally {
      setCarregando(false);
    }
  };

  // Apenas admins para o datalist
  const admins = useMemo(
    () =>
      instrutores
        .filter((i) => String(i?.funcao || "").trim().toLowerCase() === "admin")
        .map((i) => i.instrutor)
        .filter(Boolean),
    [instrutores]
  );

  // Apenas supervisores para a tabela
  const supervisores = useMemo(
    () =>
      instrutores
        .filter(
          (i) => String(i?.supervisor || "").trim().toLowerCase() === "supervisor"
        )
        .map((i) => i.instrutor)
        .filter(Boolean),
    [instrutores]
  );

  const copiar = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert("Copiado!");
    } catch {
      alert("Falha ao copiar.");
    }
  };

  const definirSupervisor = async () => {
    if (!adminSelecionado) {
      alert("Selecione um admin primeiro!");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/instrutores/${encodeURIComponent(adminSelecionado)}/supervisor`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ supervisor: "supervisor" }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert(`${adminSelecionado} agora é supervisor!`);

      // Recarrega lista do backend para atualizar tabela
      await carregarInstrutores();
      setAdminSelecionado(""); // limpa campo
    } catch (err) {
      console.error(err);
      alert("Falha ao atualizar supervisor.");
    }
  };

  return (
    <div className="rep-wrap">
      <h1 className="rep-titulo">Repositórios</h1>
      <p>Área sensivel</p>

     
      {/* Repositórios */}
      <section className="rep-card">
        <h2 className="rep-subtitulo">Repositórios</h2>
        <div className="rep-links">
          <div className="rep-link-item">
            <div>
              <strong>Frontend:</strong>{" "}
              <a
                href="https://github.com/andyjose1997/suplencia.git"
                target="_blank"
                rel="noreferrer"
              >
                github.com/andyjose1997/suplencia.git
              </a>
            </div>
            <button
              className="rep-btn"
              onClick={() =>
                copiar("https://github.com/andyjose1997/suplencia.git")
              }
            >
              Copiar
            </button>
          </div>

          <div className="rep-link-item">
            <div>
              <strong>Backend:</strong>{" "}
              <a
                href="https://github.com/andyjose1997/backend-suplencia.git"
                target="_blank"
                rel="noreferrer"
              >
                github.com/andyjose1997/backend-suplencia.git
              </a>
            </div>
            <button
              className="rep-btn"
              onClick={() =>
                copiar("https://github.com/andyjose1997/backend-suplencia.git")
              }
            >
              Copiar
            </button>
          </div>
        </div>
      </section>

      {/* Banco de Dados */}
      <section className="rep-card">
        <h2 className="rep-subtitulo">
          Banco de Dados (atenção: dados sensíveis)
        </h2>
        <div className="rep-dbgrid">
          <div className="rep-dbitem">
            <span className="rep-k">Host</span>
            <span className="rep-v">sql5.freesqldatabase.com</span>
            <button
              className="rep-mini"
              onClick={() => copiar("sql5.freesqldatabase.com")}
            >
              Copiar
            </button>
          </div>
          <div className="rep-dbitem">
            <span className="rep-k">Database</span>
            <span className="rep-v">sql5794088</span>
            <button
              className="rep-mini"
              onClick={() => copiar("sql5794088")}
            >
              Copiar
            </button>
          </div>
          <div className="rep-dbitem">
            <span className="rep-k">User</span>
            <span className="rep-v">sql5794088</span>
            <button
              className="rep-mini"
              onClick={() => copiar("sql5794088")}
            >
              Copiar
            </button>
          </div>
          <div className="rep-dbitem">
            <span className="rep-k">Password</span>
            <span className="rep-v rep-pass">FRGkqV3adJ</span>
            <button
              className="rep-mini"
              onClick={() => copiar("FRGkqV3adJ")}
            >
              Copiar
            </button>
          </div>
          <div className="rep-dbitem">
            <span className="rep-k">Port</span>
            <span className="rep-v">3306</span>
            <button className="rep-mini" onClick={() => copiar("3306")}>
              Copiar
            </button>
          </div>
        </div>
       
      </section>
    </div>
  );
}
