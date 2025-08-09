import { useEffect, useState } from "react";
import './visualizarBanco.css';
import Formulario from "./formulario";
import Repositorios from "./repositorios";
export default function VisualizarBanco() {
  const [tabelas, setTabelas] = useState([]);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [linhaEditando, setLinhaEditando] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState({});
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroInstrutor, setFiltroInstrutor] = useState("");
const [anuncios, setAnuncios] = useState([]);
const [anuncioEditando, setAnuncioEditando] = useState(null);
const [textoEditado, setTextoEditado] = useState("");
const [suplenteAtual, setSuplenteAtual] = useState(null);
const [isSupervisor, setIsSupervisor] = useState(false);


useEffect(() => {
  carregarSuplente();
}, []);

async function carregarSuplente() {
  try {
    const res = await fetch("https://backend-suplencia.onrender.com/suplente_atual");
    if (res.ok) {
      const data = await res.json();
      setSuplenteAtual(data);
    } else {
      setSuplenteAtual(null);
    }
  } catch (err) {
    console.error("Erro ao buscar suplente:", err);
    setSuplenteAtual(null);
  }
}

useEffect(() => {
  carregarAnuncios();
}, []);

async function carregarAnuncios() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://backend-suplencia.onrender.com/anuncios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const lista = await res.json();
    setAnuncios(lista);
  } catch (err) {
    console.error("Erro ao carregar anúncios:", err);
  }
}

  const itensPorPagina = 20;


  useEffect(() => {
  verificarSupervisor();
}, []);

async function verificarSupervisor() {
  try {
    const instrutor = localStorage.getItem("instrutor");
    if (!instrutor) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`https://backend-suplencia.onrender.com/instrutores`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar instrutores");

    const lista = await res.json();
    const usuario = lista.find(
      (i) => String(i.instrutor).toLowerCase() === instrutor.toLowerCase()
    );

    if (usuario) {
  const sup = String(usuario.supervisor || "").toLowerCase().trim();
  if (["1", "sim", "true", "supervisor"].includes(sup)) {
    setIsSupervisor(true);
  }
}


  } catch (err) {
    console.error("Erro ao verificar supervisor:", err);
  }
}

  useEffect(() => {
    async function buscarTabelas() {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch("https://backend-suplencia.onrender.com/nomes_tabelas", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!resposta.ok) throw new Error("Erro ao buscar as tabelas");

        const tabelas = await resposta.json();
        setTabelas(tabelas);

        if (tabelas.length > 0) {
          setTabelaSelecionada(tabelas[0]);
          buscarDadosDaTabela(tabelas[0]);
        }
      } catch (erro) {
        console.error("❌ Erro ao buscar nomes das tabelas:", erro);
        setErro("Erro ao carregar as tabelas. Verifique o backend.");
      }
    }

    buscarTabelas();
  }, []);

  async function assumirSuplencia() {
  const instrutor = localStorage.getItem("instrutor");
  if (!instrutor) return alert("Você precisa estar logado.");

  try {
    const res = await fetch("https://backend-suplencia.onrender.com/suplente_atual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: instrutor }),
    });

    if (!res.ok) {
      const erro = await res.json();
      return alert("❌ " + erro.detail);
    }

    alert("✅ Suplência assumida!");
    carregarSuplente();
  } catch (err) {
    console.error("Erro ao assumir suplência:", err);
    alert("Erro ao assumir suplência.");
  }
}
async function removerSuplente() {
  const confirmacao = confirm("Deseja remover a suplência atual?");
  if (!confirmacao) return;

  try {
    const res = await fetch("https://backend-suplencia.onrender.com/suplente_atual", {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao remover suplente");

    alert("🗑️ Suplência removida");
    carregarSuplente();
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao remover suplência.");
  }
}

  async function buscarDadosDaTabela(nome) {
    setCarregando(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`https://backend-suplencia.onrender.com/visualizar_tabela/${encodeURIComponent(nome)}`, {
  headers: { Authorization: `Bearer ${token}` }
});


      if (!resposta.ok) throw new Error("Erro ao buscar dados da tabela");

      const dados = await resposta.json();
      setDadosTabela(dados);
    } catch (erro) {
      console.error("❌ Erro ao buscar dados da tabela:", erro);
      setErro("Erro ao carregar os dados da tabela.");
    }
    setCarregando(false);
  }

  function editarLinha(linha) {
    setLinhaEditando(linha);
    setFormularioEdicao({ ...linha });
  }

  async function salvarEdicao() {
    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`https://backend-suplencia.onrender.com/editar_instrutor/${linhaEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formularioEdicao)
      });

      if (!resposta.ok) throw new Error("Erro ao editar");

      alert("Registro atualizado com sucesso!");
      setLinhaEditando(null);
      buscarDadosDaTabela(tabelaSelecionada);
    } catch (erro) {
      console.error("❌ Erro ao editar:", erro);
      alert("Erro ao editar registro.");
    }
  }

  async function apagarLinha(linha) {
    const confirmacao = confirm(`Tem certeza que deseja apagar o ID ${linha.id}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`https://backend-suplencia.onrender.com/apagar_instrutor/${linha.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resposta.ok) throw new Error("Erro ao apagar");

      alert("Registro apagado com sucesso!");
      buscarDadosDaTabela(tabelaSelecionada);
    } catch (erro) {
      console.error("❌ Erro ao apagar:", erro);
      alert("Erro ao apagar registro.");
    }
  }

  // 🔍 Filtro + Paginação
  const dadosFiltrados = dadosTabela.filter((linha) =>
    linha.instrutor?.toLowerCase().includes(filtroInstrutor.toLowerCase())
  );
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const dadosPaginados = dadosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div className="visualizador-container">
<br /><br />
{/*suplente*/}
<div className="suplente-box">
  <h3>🧍 Suplente Atual</h3>

  <button className="btn-suplente" onClick={assumirSuplencia}>
    Assumir a suplência atual
  </button>

  {suplenteAtual?.instrutor && (
    <div className="info-suplente">
      <p>
        📌 <strong>{suplenteAtual.instrutor}</strong> está como suplente atual
      </p>

      {suplenteAtual.instrutor === localStorage.getItem("instrutor") && (
        <button className="btn-apagar" onClick={removerSuplente}>
          ❌ Remover suplência
        </button>
      )}
    </div>
  )}
</div>


{/* 📢 Anúncios */}
<div className="anuncios-container">
  <h3>📢 Enviar Anúncio</h3>
 <form
  onSubmit={async (e) => {
    e.preventDefault();
    const conteudo = textoEditado.trim();
    if (!conteudo) return;

    const token = localStorage.getItem("token");

    try {
      if (anuncioEditando !== null) {
        // Atualizar
        const res = await fetch(`https://backend-suplencia.onrender.com/anuncios/${anuncioEditando}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conteudo }),
        });
        if (!res.ok) throw new Error("Erro ao editar anúncio");
        alert("Anúncio atualizado com sucesso!");
      } else {
        // Criar novo
        const res = await fetch("https://backend-suplencia.onrender.com/anuncios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conteudo }),
        });
        if (!res.ok) throw new Error("Erro ao enviar anúncio");
        alert("Anúncio enviado com sucesso!");
      }

      setTextoEditado("");
      setAnuncioEditando(null);
      carregarAnuncios();
    } catch (err) {
      alert("❌ Erro ao salvar anúncio");
      console.error(err);
    }
  }}
>
  <input
    type="text"
    name="anuncio"
    placeholder="Digite ou edite um anúncio..."
    value={textoEditado}
    onChange={(e) => setTextoEditado(e.target.value)}
    className="input-anuncio"
  />
  <button type="submit" className="btn-enviar-anuncio">
    {anuncioEditando !== null ? "Salvar" : "Enviar"}
  </button>
  {anuncioEditando !== null && (
    <button
      type="button"
      className="btn-cancelar-edicao"
      onClick={() => {
        setAnuncioEditando(null);
        setTextoEditado("");
      }}
    >
      Cancelar
    </button>
  )}
</form>


 <ul className="lista-anuncios">
  {anuncios.map((a, i) => (
    <li key={i}>
      📢 {a.conteudo}
      <div className="botoes-anuncio">
        <button
          className="btn-editar"
          onClick={() => {
            setAnuncioEditando(a.id);
            setTextoEditado(a.conteudo);
          }}
        >
          ✏️ Editar
        </button>
        <button
          className="btn-apagar"
          onClick={async () => {
            if (!confirm("Deseja apagar este anúncio?")) return;
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`https://backend-suplencia.onrender.com/anuncios/${a.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) throw new Error("Erro ao apagar anúncio");
              alert("Anúncio apagado com sucesso!");
              carregarAnuncios();
            } catch (err) {
              alert("❌ Erro ao apagar");
              console.error(err);
            }
          }}
        >
          🗑️ Apagar
        </button>
      </div>
    </li>
  ))}
</ul>

</div>

      <h2 >🔎 Visualizar Banco de Dados</h2>
      {erro && <p className="erro-msg">{erro}</p>}

<div style={{ display: "none" }} className="seletor-tabela">
        <label>Selecione uma tabela:</label>
        <select
          value={tabelaSelecionada}
          onChange={(e) => {
            const nome = e.target.value;
            setTabelaSelecionada(nome);
            buscarDadosDaTabela(nome);
            setPaginaAtual(1);
          }}
        >
          <option value="">-- Escolha --</option>
          {tabelas.map((nome, idx) => (
            <option key={idx} value={nome}>
              {nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-container">
        <input
          className="input-filtro"
          type="text"
          placeholder="🔍 Filtrar por instrutor..."
          value={filtroInstrutor}
          onChange={(e) => {
            setFiltroInstrutor(e.target.value);
            setPaginaAtual(1);
          }}
        />
      </div>

      {carregando && <p className="carregando-msg">🔄 Carregando dados...</p>}

      {dadosPaginados.length > 0 && (
        <table className="tabela-dados">
          <thead>
            <tr>
              {Object.keys(dadosPaginados[0])
                .filter(
  (coluna) =>
    coluna !== "id" &&
    !["espanhol","portugues","ingles","frances","japones","italiano","colina","foto","turno","turno_global","coluna_impressao","ate","sub"].includes(coluna)
)
.map((coluna, idx) => (
  <th key={idx}>{coluna}</th>
))
}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
  {dadosPaginados.map((linha, i) => (
    <tr key={i}>
      {Object.entries(linha)
        .filter(
          ([coluna]) =>
            coluna !== "id" &&
            ![
              "espanhol", "portugues", "ingles", "frances", "japones", "italiano",
              "colina", "foto", "turno", "turno_global", "coluna_impressao", "ate", "sub"
            ].includes(coluna)
        )
        .map(([coluna, valor], j) => {
          // Se for a coluna senha e não sou supervisor e a linha é de supervisor → mostrar "oculta"
          if (
            coluna === "senha" &&
            !isSupervisor &&
            String(linha.supervisor || "").toLowerCase().trim() === "supervisor"
          ) {
            return <td key={j}>oculta</td>;
          }

          // Se for a coluna senha → aplicar efeito de ocultar/revelar
          if (coluna === "senha") {
            return (
              <td key={j} className="senha-ofuscada">
                {String(valor)}
              </td>
            );
          }

          // Outras colunas → mostrar valor normal
          return <td key={j}>{String(valor)}</td>;
        })}
      <td>
        <button onClick={() => editarLinha(linha)} className="btn-editar">Editar</button>
        <button onClick={() => apagarLinha(linha)} className="btn-apagar">Apagar</button>
      </td>
    </tr>
  ))}
</tbody>


        </table>
      )}

      {!carregando && dadosFiltrados.length === 0 && tabelaSelecionada && (
        <p className="aviso-vazio">⚠️ Nenhum dado encontrado para a tabela selecionada.</p>
      )}

      {dadosFiltrados.length > 0 && (
        <div className="paginacao">
          <button onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
            ⬅️ Anterior
          </button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
            Próxima ➡️
          </button>
        </div>
      )}

      {linhaEditando && (
        <Formulario
          dados={formularioEdicao}
          setDados={setFormularioEdicao}
          onSalvar={salvarEdicao}
          onCancelar={() => setLinhaEditando(null)}
        />


      )}
{isSupervisor && <Repositorios />}

    </div>
  );
}
