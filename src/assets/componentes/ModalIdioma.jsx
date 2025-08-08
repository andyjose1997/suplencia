import { useEffect, useState } from "react";
import "./modalIdioma.css";

export default function ModalIdioma({ idioma, aoFechar }) {
  const [instrutores, setInstrutores] = useState([]);

  useEffect(() => {
    const carregarInstrutores = async () => {
      try {
        const res = await fetch("https://backend-suplencia.onrender.com/subs");
        const todos = await res.json();
        const filtrados = todos.filter(instrutor => Number(instrutor[idioma]) === 1);
        setInstrutores(filtrados);
      } catch (erro) {
        console.error("Erro ao carregar instrutores:", erro);
        setInstrutores([]);
      }
    };

    carregarInstrutores();
  }, [idioma]);

  return (
    <div className="idioma-modal-container">
      <div className="idioma-modal-overlay">
        <div className="idioma-modal-box">
          <h2 className="idioma-modal-titulo">Falantes de {idioma.toUpperCase()}</h2>

          {instrutores.length === 0 ? (
            <p className="idioma-modal-vazio">Nenhum instrutor encontrado.</p>
          ) : (
            <ul className="idioma-modal-lista">
              {instrutores.map(instrutor => (
                <li className="idioma-modal-item" key={instrutor.id}>
                  <strong>{instrutor.instrutor}</strong> — até {instrutor.ate || "--"}
                </li>
              ))}
            </ul>
          )}

          <button className="idioma-modal-fechar" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
