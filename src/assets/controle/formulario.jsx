import { useEffect, useState } from "react";
import './formulario.css';

const API_URL = "https://backend-suplencia.onrender.com";

export default function Formulario({ dados, setDados, onSalvar, onCancelar }) {
  const [mostrarCamposSupervisor, setMostrarCamposSupervisor] = useState(false);

  useEffect(() => {
    const instrutorLogado = localStorage.getItem("instrutor");
    if (!instrutorLogado) return;

    // Buscar do backend o instrutor logado para ver se ele tem supervisor
    fetch(`${API_URL}/instrutores`)
      .then(res => res.json())
      .then(lista => {
        const instrutorEncontrado = lista.find(
          (i) => i.instrutor.trim().toLowerCase() === instrutorLogado.trim().toLowerCase()
        );
        if (instrutorEncontrado && instrutorEncontrado.supervisor?.trim() !== "") {
          setMostrarCamposSupervisor(true);
        }
      })
      .catch(err => console.error("Erro ao verificar supervisor:", err));
  }, []);

  const handleSalvar = async () => {
    const dadosParaEnviar = {
      instrutor: dados.instrutor,
      link_zoom: dados.link_zoom,
      funcao: dados.funcao,
      supervisor: dados.supervisor?.trim() || "supervisor"
    };

    try {
      const res = await fetch(`${API_URL}/instrutores/${dados.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      onSalvar();
    } catch (error) {
      console.error("Erro ao salvar instrutor:", error);
    }
  };

  return (
    <div className="modal-edicao">
      <h3>✏️ Editar Instrutor</h3>

      <label>Nome:</label>
      <input
        type="text"
        value={dados.instrutor || ""}
        onChange={(e) => setDados({ ...dados, instrutor: e.target.value })}
      />

      <label>Link do Zoom:</label>
      <input
        type="text"
        value={dados.link_zoom || ""}
        onChange={(e) => setDados({ ...dados, link_zoom: e.target.value })}
      />

      {mostrarCamposSupervisor && (
        <>
          <label>Função:</label>
          <select
            value={dados.funcao || "instrutor"}
            onChange={(e) => setDados({ ...dados, funcao: e.target.value })}
          >
            <option value="instrutor">Instrutor</option>
            <option value="admin">Admin</option>
          </select>

         <label>Supervisor:</label>
<select
  value={dados.supervisor || ""}
  onChange={(e) => setDados({ ...dados, supervisor: e.target.value })}
>
  <option value="--"> </option>
  <option value="supervisor">supervisor</option>
</select>

        </>
      )}

      <div className="botoes-edicao">
        <button onClick={handleSalvar}>💾 Salvar</button>
        <button onClick={onCancelar}>❌ Cancelar</button>
      </div>
    </div>
  );
}
