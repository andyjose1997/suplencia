import { useState } from "react";
import Cadastro from "./cadastro";
import './login.css';

export default function Login({ aoLogar }) {
  const [instrutor, setInstrutor] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();

    try {
      const resposta = await fetch("https://backend-suplencia.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instrutor, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem("token", dados.access_token);

        const payload = JSON.parse(atob(dados.access_token.split(".")[1]));
        localStorage.setItem("instrutor", dados.instrutor_nome || "");
        localStorage.setItem("funcao", payload.funcao || "");

        aoLogar();
      } else {
        setMensagem("❌ " + (dados.detail || "Falha no login"));
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão com o servidor.");
    }
  }

  if (mostrarCadastro) {
    return (
      <div className="login-container">
        <Cadastro aoVoltar={() => setMostrarCadastro(false)} />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-box">
        <h1>Práticas da subs</h1>
        <h2>Login</h2>
        <form onSubmit={fazerLogin}>
          <input
            type="text"
            placeholder="Nome do Instrutor"
            value={instrutor}
            onChange={(e) => setInstrutor(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Entrar</button>
        </form>

        <button
          className="login-criar-conta-btn"
          onClick={() => setMostrarCadastro(true)}
        >
          Criar nova conta
        </button>

        {mensagem && <p className="login-mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}
