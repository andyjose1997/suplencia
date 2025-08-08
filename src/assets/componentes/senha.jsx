import { useState } from "react";
import "./senha.css";


export default function Senha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const instrutor = localStorage.getItem("instrutor");

  const trocarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return alert("Preencha todos os campos.");
    }

    if (novaSenha !== confirmarSenha) {
      return alert("A nova senha e a confirmação não coincidem.");
    }

    try {
      const res = await fetch("https://backend-suplencia.onrender.com/trocar-senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrutor,
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
        }),
      });

      if (res.ok) {
        alert("Senha atualizada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        const erro = await res.json();
        alert("Erro: " + erro.detail);
      }
    } catch (error) {
      console.error("Erro ao trocar senha:", error);
      alert("Erro ao trocar a senha.");
    }
  };

  return (
    <div className="senha-container" style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>🔐 Trocar Senha</h2>
      <input
        type="password"
        placeholder="Senha atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Confirmar nova senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      /><br /><br />
      <button onClick={trocarSenha}>Salvar Nova Senha</button>
    </div>
  );
}
