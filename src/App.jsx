import Praticas from "./assets/componentes/praticas";
import Impressoes from "./assets/componentes/impressoes";
import Login from "./login";
import "./App.css";
import VisualizarBanco from "./assets/controle/VisualizarBanco";
import TurnoGlobal from "./assets/turnoGlobal";
import { useState, useEffect } from "react";
import BuscarEscritura from "./assets/componentes/buscar";
import Senha from "./assets/componentes/senha";



export default function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem("token"));
  const [abaAtiva, setAbaAtiva] = useState("praticas");
const [turnoGlobal, setTurnoGlobal] = useState(null); // ✅ CORRETO
const [suplenteAtual, setSuplenteAtual] = useState("");

  const funcao = localStorage.getItem("funcao");
  const nomeInstrutor = localStorage.getItem("instrutor");
  const [liderAtual, setLiderAtual] = useState("");


  useEffect(() => {
  const buscarSuplente = async () => {
    try {
      const res = await fetch("https://backend-suplencia.onrender.com/suplente_atual");
      if (res.ok) {
        const data = await res.json();
        if (data?.instrutor) {
          setSuplenteAtual(data.instrutor);
        } else {
          setSuplenteAtual(""); // nenhum suplente
        }
      }
    } catch (err) {
      console.error("Erro ao buscar suplente atual:", err);
    }
  };

  buscarSuplente();
  const intervalo = setInterval(buscarSuplente, 5000); // atualiza a cada 5s
  return () => clearInterval(intervalo);
}, []);

useEffect(() => {
  const buscarLider = () => {
    fetch("https://backend-suplencia.onrender.com/lider")
      .then((res) => res.json())
      .then((data) => {
        if (data.nome) {
          setLiderAtual(data.nome);
        } else {
          setLiderAtual(""); // se não houver líder
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar líder:", err);
        setLiderAtual(""); // em caso de erro
      });
  };

  buscarLider(); // busca inicial
  const intervalo = setInterval(buscarLider, 5000); // a cada 15 segundos

  return () => clearInterval(intervalo); // limpa se desmontar
}, []);
const [anuncios, setAnuncios] = useState([]);
const [indiceAnuncio, setIndiceAnuncio] = useState(0);

useEffect(() => {
  async function carregarAnuncios() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://backend-suplencia.onrender.com/anuncios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lista = await res.json();
      setAnuncios(lista);
    } catch (err) {
      console.error("Erro ao buscar anúncios:", err);
    }
  }

  carregarAnuncios();
}, []);

useEffect(() => {
  if (anuncios.length === 0) return;

  const intervalo = setInterval(() => {
    setIndiceAnuncio((prev) => (prev + 1) % anuncios.length);
  }, 5000); // 5 segundos

  return () => clearInterval(intervalo);
}, [anuncios]);

function capitalizarTodasAsPalavras(texto) {
  return texto.replace(/\w\S*/g, (palavra) =>
    palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
  );
}


const trocarTurno = (novoTurno) => {
  fetch("https://backend-suplencia.onrender.com/turno", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ novo_turno: novoTurno }), // ✅ importante!
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao salvar turno no backend.");
      console.log("✅ Turno atualizado no backend.");
    })
    .catch((err) => console.error("Erro ao mudar turno:", err));
};



  const encerrarSessao = () => {
    localStorage.clear();
    setLogado(false);
  };

  const enviarFoto = (arquivo) => {
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("nome", nomeInstrutor);

    fetch("https://backend-suplencia.onrender.com/upload-foto", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        alert("Foto enviada com sucesso!");
        setFotoAtualizada(Date.now());
      } else {
        alert("Erro ao enviar a foto.");
      }
    });
  };

  const apagarFoto = () => {
    fetch(`https://backend-suplencia.onrender.com/apagar-foto/${nomeInstrutor}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        alert("Foto apagada.");
        setFotoAtualizada(Date.now());
      } else {
        alert("Erro ao apagar a foto.");
      }
    });
  };

  if (!logado) {
    return <Login aoLogar={() => setLogado(true)} />;
  }

  return (
    <div className="container">
      <div id="acima">
        {anuncios.length > 0 && (
  <div
    style={{
      backgroundColor: "#03167eb9",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "10px",
      textAlign: "center",
      fontSize: "18px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "bold",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
      marginBottom: "10px",
    }}
  >
    📢 {capitalizarTodasAsPalavras(anuncios[indiceAnuncio].conteudo)}
  </div>
)}
        <div className="perfil-usuario">
          <br /><br /><br />
         {/*anuncios*/}

<p>Instrutor(a):</p>
          <p style={{ fontSize: "30px", fontFamily: "serif" }}>
            {nomeInstrutor}
          </p><br /><br />
          <p>Suplente Atual:</p>
<p
  style={{
    fontSize: "30px",
    fontFamily: "serif",
    backgroundColor: "#001f3f", // azul escuro
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    display: "inline-block",
    textAlign: "center",
  }}
>
  {suplenteAtual || "Nenhum suplente definido"}
</p>


        </div>
      </div>

      <br /><br /><br /><br /><br /><br />
      <div className="botoes-navegacao">
        <button
          className={abaAtiva === "praticas" ? "ativo" : ""}
          onClick={() => setAbaAtiva("praticas")}
        >
          🧪 Práticas
        </button>
        <button
          className={abaAtiva === "impressoes" ? "ativo" : ""}
          onClick={() => setAbaAtiva("impressoes")}
        >
          🖨️ Impressões
        </button>
        
  <button
    className={abaAtiva === "escritura" ? "ativo" : ""}
    onClick={() => setAbaAtiva("escritura")}
  >
    📖 Buscar Escritura
  </button>
{funcao === "admin" && (
          <button
            className={abaAtiva === "painel" ? "ativo" : ""}
            onClick={() => setAbaAtiva("painel")}
          >
            🛠️ Painel de Controle
          </button>
          
        )}


        {/*trocar senha*/}
        <button
  className={abaAtiva === "senha" ? "ativo" : ""}
  onClick={() => setAbaAtiva("senha")}
>
  🔒 Trocar Senha
</button>

      </div>
{funcao !== "admin" && liderAtual && (
  <div
    style={{
      display: liderAtual ? "block" : "none",
      backgroundColor: "#054285ff",
      color: "#fff",
      textAlign: "center",
      padding: "20px",
      margin: "20px auto",
      borderRadius: "16px",
      fontSize: "18px",
      fontFamily: "Segoe UI, sans-serif",
      width: "fit-content",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    }}
  >
   

    <div>
      Encarregado das Práticas: <br /> <strong>{liderAtual}</strong>
    </div>
  </div>
)}


      <div className="conteudo">
        {/* ⬇️ componente invisível que escuta o turno do banco */}
        <TurnoGlobal aoMudarTurno={setTurnoGlobal} />
{abaAtiva === "praticas" && turnoGlobal && (
  <Praticas turno={turnoGlobal} trocarTurno={trocarTurno} />
)}
{abaAtiva === "praticas" && !turnoGlobal && (
  <p style={{ textAlign: "center", marginTop: "2rem" }}>
    ⏳ Carregando tabela de práticas...
  </p>
)}


        {abaAtiva === "impressoes" && <Impressoes />}
        {abaAtiva === "painel" && funcao === "admin" && <VisualizarBanco />}
        {abaAtiva === "escritura" && <BuscarEscritura />}
{abaAtiva === "senha" && <Senha />}

      </div>

      <div style={{ marginTop: "2rem" }}>
        <button className="btn-sair" onClick={encerrarSessao}>
          🚪 Encerrar Sessão
        </button>
      </div>
      
<a href="https://api.whatsapp.com/send/?phone=5511918547818&text=&type=phone_number&app_absent=0" target="_blank" id="andy">
  Made by Andy De Oliveira
</a>

    </div>
  );
}
