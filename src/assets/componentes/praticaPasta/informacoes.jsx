import { useEffect, useState } from "react";
import "./informacoes.css";
import Cadastro from "../../../cadastro";
const idiomas = [
  { chave: "ingles", nome: "Inglês", sim: "Yes" },
  { chave: "espanhol", nome: "Espanhol", sim: "Si" },
  { chave: "portugues", nome: "Português", sim: "Sim" },
  { chave: "japones", nome: "Japonês", sim: "はい" },
  { chave: "frances", nome: "Francês", sim: "Oui" },
  { chave: "italiano", nome: "Italiano", sim: "Sì" }
];

export default function Informacoes() {
  const [dados, setDados] = useState([]);
  const [editarInstrutor, setEditarInstrutor] = useState(null);

  const carregarDados = () => {
    fetch("https://backend-suplencia.onrender.com/instrutores")
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error("❌ Erro ao buscar instrutores:", err));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const editarLinha = (index) => {
  const selecionado = dados[index];
  console.log("🆔 Editando instrutor:", selecionado);
  setEditarInstrutor(selecionado);
};


  const aoVoltar = () => {
    setEditarInstrutor(null);
    carregarDados();
  };

  if (editarInstrutor) {
    return (
      <Cadastro
        dadosIniciais={editarInstrutor}
        edicao={true}
        aoVoltar={aoVoltar}
      />
    );
  }

  return (
    <div className="info-container">
      <h2 className="info-titulo">📋 Tabela de Informações</h2>
      <table className="info-tabela">
        <thead>
          <tr>
            <th>Instrutor(a)</th>
            <th>Link Zoom</th>
            {idiomas.map((idioma, i) => (
              <th key={i}>{idioma.nome}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              <td>{item.instrutor}</td>
              <td>
                {item.link_zoom ? (
                  <a
                    className="info-link"
                    href={item.link_zoom}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                ) : ""}
              </td>
              {idiomas.map((idioma, i) => (
                <td key={i}>{item[idioma.chave] ? idioma.sim : ""}</td>
              ))}
              <td>
                <button
                  className="info-btn info-editar"
                  onClick={() => editarLinha(index)}
                >
                  ✏️ Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
